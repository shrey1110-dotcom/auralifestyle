// node test-auth.js (Node 18+ has global fetch)
const API = 'http://localhost:5000';

async function readSafe(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { nonJson: true, status: res.status, body: text.slice(0, 400) };
  }
}

async function run() {
  const email = 'your.email@example.com'; // <-- change to your email

  // 1) request OTP
  let res = await fetch(`${API}/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name: 'Tester' })
  });
  let data = await readSafe(res);
  console.log('request-otp ->', data);

  console.log('\nCheck your inbox for the code, then edit the variable below.\n');

  // 2) paste the code you received
  const code = '1234'; // <-- replace with real 4-digit code from the email

  // 3) verify OTP (note: backend expects { email, code })
  res = await fetch(`${API}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  data = await readSafe(res);
  console.log('verify-otp ->', data);

  // 4) optional: call /auth/me with the returned token if present
  if (data?.token) {
    res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${data.token}` }
    });
    const me = await readSafe(res);
    console.log('me ->', me);
  }
}

run().catch((e) => console.error(e));
