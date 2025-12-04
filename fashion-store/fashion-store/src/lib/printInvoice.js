// src/lib/printInvoice.js
/* Robust invoice printer.
 * - Opens a popup, writes full HTML, waits for images, prints, closes
 * - Works with relative /images because we set <base href=...>
 */

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(Number(n || 0))));

export async function printInvoice({
  order = {},
  items = [],
  customer = {},
  address = {},
  brand = { name: "AuraLifestyle", logo: "/logo192.png" },
  options = {},
}) {
  // Totals (no GST per your latest requirement)
  const subTotal = items.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.qty || 1),
    0
  );

  const wrapFee = options.giftWrap ? 49 : 0;
  const giftCredit = options.giftApplied?.value || 0;
  const total = Math.max(0, subTotal + wrapFee - giftCredit);

  const dateStr =
    order.date ||
    new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  // Build rows
  const rows = items
    .map((it) => {
      const name = it.title || it.name || "Product";
      const line = Number(it.price || 0) * Number(it.qty || 1);
      return `
        <tr>
          <td>${name}${it.size ? ` — <small>${it.size}</small>` : ""}${
        it.color ? ` — <small>${it.color}</small>` : ""
      }</td>
          <td class="num">${formatINR(it.price || 0)}</td>
          <td class="num">${Number(it.qty || 1)}</td>
          <td class="num">${formatINR(line)}</td>
        </tr>`;
    })
    .join("");

  const extras = `
    ${options.giftWrap ? `<tr><td colspan="3">Gift Wrap</td><td class="num">${formatINR(wrapFee)}</td></tr>` : ""}
    ${
      giftCredit
        ? `<tr><td colspan="3">Gift Card (${options.giftApplied.code})</td><td class="num">- ${formatINR(
            giftCredit
          )}</td></tr>`
        : ""
    }
  `;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <base href="${window.location.origin}/">
  <title>Invoice ${order.id ? `#${order.id}` : ""} – ${brand.name}</title>
  <style>
    :root{--ink:#111;--mut:#666;--line:#e5e5e5;}
    *{box-sizing:border-box} body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    color:var(--ink); margin:0; padding:24px; background:#fff;}
    .wrap{max-width:800px; margin:0 auto; border:1px solid var(--line); border-radius:12px; overflow:hidden}
    header{display:flex; align-items:center; gap:14px; padding:16px 18px; border-bottom:1px solid var(--line); background:#fafafa}
    header img{height:36px; width:auto}
    header .brand{font-weight:700; font-size:18px}
    .meta{padding:16px 18px; display:grid; grid-template-columns:1fr 1fr; gap:12px; border-bottom:1px solid var(--line)}
    .mut{color:var(--mut); font-size:13px}
    table{width:100%; border-collapse:collapse}
    th, td{padding:10px 12px; border-bottom:1px solid var(--line); vertical-align:top;}
    th{background:#fafafa; text-align:left}
    .num{text-align:right; white-space:nowrap}
    .totals{padding:16px 18px}
    .totals .row{display:flex; align-items:center; justify-content:space-between; padding:6px 0}
    .total{font-weight:700; font-size:18px}
    footer{padding:16px 18px; font-size:12px; color:var(--mut)}
    @media print{
      body{padding:0}
      .wrap{border:0; border-radius:0}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      ${brand.logo ? `<img src="${brand.logo}" alt="${brand.name} logo"/>` : ""}
      <div class="brand">${brand.name}</div>
    </header>

    <section class="meta">
      <div>
        <div><strong>Invoice</strong> ${order.id ? `#${order.id}` : ""}</div>
        <div class="mut">Date: ${dateStr}</div>
      </div>
      <div>
        <div><strong>Ship To</strong></div>
        <div>${address.fullName || customer.name || "-"}</div>
        <div>${address.address1 || ""}${address.address2 ? ", " + address.address2 : ""}</div>
        <div>${address.city || ""}${address.state ? ", " + address.state : ""} ${address.pincode || ""}</div>
        <div>${address.phone ? "Phone: " + address.phone : ""}</div>
      </div>
    </section>

    <section>
      <table>
        <thead>
          <tr>
            <th>Item</th><th class="num">Price</th><th class="num">Qty</th><th class="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="4" class="mut">No items.</td></tr>`}
          ${extras}
        </tbody>
      </table>
    </section>

    <section class="totals">
      <div class="row"><span>Subtotal</span><span>${formatINR(subTotal)}</span></div>
      ${wrapFee ? `<div class="row"><span>Gift Wrap</span><span>${formatINR(wrapFee)}</span></div>` : ""}
      ${giftCredit ? `<div class="row"><span>Gift Card</span><span>- ${formatINR(giftCredit)}</span></div>` : ""}
      <div class="row total"><span>Total</span><span>${formatINR(total)}</span></div>
    </section>

    <footer>
      Thank you for shopping with ${brand.name}. This is a computer-generated invoice.
    </footer>
  </div>

  <script>
    // Wait for images before printing, then close
    (function(){
      function ready(){
        var imgs = Array.prototype.slice.call(document.images || []);
        Promise.all(imgs.map(function(img){
          return img.complete ? Promise.resolve() :
            new Promise(function(res){ img.onload = img.onerror = res; });
        })).then(function(){
          setTimeout(function(){
            window.focus(); window.print();
            setTimeout(function(){ window.close(); }, 300);
          }, 100);
        });
      }
      if (document.readyState === "complete") ready();
      else window.addEventListener("load", ready);
    })();
  </script>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) {
    alert("Please allow pop-ups to print the invoice.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
