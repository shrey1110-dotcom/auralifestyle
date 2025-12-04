// src/utils/csvExport.js
export function ordersToCsvRows(orders) {
  // returns header row + array of rows
  const header = [
    "orderNumber","createdAt","status","customerName","customerEmail","customerPhone",
    "address","items","sub","shipping","gst","total","paymentProvider","paymentId","trackingNumber"
  ];
  const rows = orders.map(o => {
    const addr = o.address ? `${o.address.address1 || ""} ${o.address.address2 || ""} ${o.address.city || ""} ${o.address.state || ""} ${o.address.pincode || ""}`.trim() : "";
    const items = (o.items || []).map(it => `${it.title}(${it.sku}) x${it.qty}`).join(" | ");
    return [
      o.orderNumber || "",
      o.createdAt ? new Date(o.createdAt).toISOString() : "",
      o.status || "",
      o.address?.fullName || (o.customerName||""),
      o.address?.email || "",
      o.address?.phone || "",
      addr,
      items,
      o.sub ?? "",
      o.shipping ?? "",
      o.gst ?? "",
      o.total ?? "",
      o.payment?.provider ?? "",
      o.payment?.paymentId ?? "",
      o.shippingInfo?.trackingNumber ?? ""
    ];
  });
  return { header, rows };
}
