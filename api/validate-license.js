// POST /api/validate-license  { key }  + header Authorization: Bearer <Firebase ID token>
// Valida la clave de licencia en Polar y activa el acceso completo para esa cuenta.
const { getAdmin } = require("./_admin");

const POLAR = process.env.POLAR_API_BASE || "https://api.polar.sh";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method" });
  try {
    const admin = getAdmin();
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ ok: false, error: "login" });
    const user = await admin.auth().verifyIdToken(token);
    if (!user.email_verified) return res.status(403).json({ ok: false, error: "verify" });

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const key = String(body.key || "").trim();
    if (key.length < 8 || key.length > 200) return res.status(400).json({ ok: false, error: "invalid" });

    const r = await fetch(`${POLAR}/v1/customer-portal/license-keys/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ key, organization_id: process.env.POLAR_ORG_ID })
    });
    const lk = await r.json().catch(() => ({}));
    if (!r.ok || lk.status !== "granted") return res.status(400).json({ ok: false, error: "invalid" });

    await admin.firestore().doc(`users/${user.uid}`).set({
      pro: true,
      plan: "brief",
      licenseDisplay: lk.display_key || null,
      licenseId: lk.id || null,
      polarCustomerId: lk.customer_id || null,
      proSince: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
