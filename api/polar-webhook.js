// POST /api/polar-webhook  (Polar > Settings > Webhooks · formato Raw · eventos order.paid y order.refunded)
// Verifica la firma (Standard Webhooks) y registra la compra por correo.
// Si el comprador ya tiene cuenta con ese correo, le activa el acceso al instante.
const crypto = require("crypto");
const { getAdmin } = require("./_admin");

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", c => { data += c; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function verify(raw, headers, secret) {
  const id = headers["webhook-id"], ts = headers["webhook-timestamp"], sigs = headers["webhook-signature"] || "";
  if (!id || !ts || !secret) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = crypto.createHmac("sha256", Buffer.from(secret, "utf8")).update(`${id}.${ts}.${raw}`).digest("base64");
  return sigs.split(" ").some(s => {
    const v = s.split(",")[1] || "";
    return v.length === expected.length && crypto.timingSafeEqual(Buffer.from(v), Buffer.from(expected));
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const raw = await readRaw(req);
  if (!verify(raw, req.headers, process.env.POLAR_WEBHOOK_SECRET)) return res.status(403).json({ ok: false });

  try {
    const evt = JSON.parse(raw);
    const d = evt.data || {};
    const email = String((d.customer && d.customer.email) || d.customer_email || "").toLowerCase();
    if (!email) return res.status(202).json({ ok: true, skipped: "no-email" });

    const admin = getAdmin(), db = admin.firestore(), FV = admin.firestore.FieldValue;
    const product = (d.product && d.product.name) || (d.items && d.items[0] && d.items[0].label) || "";

    if (evt.type === "order.paid") {
      await db.doc(`purchases/${email}`).set({
        pro: true,
        products: FV.arrayUnion(product || "unknown"),
        lastOrderId: d.id || null,
        lastAmount: d.total_amount != null ? d.total_amount : (d.amount || null),
        currency: d.currency || "usd",
        updatedAt: FV.serverTimestamp()
      }, { merge: true });
      try {
        const u = await admin.auth().getUserByEmail(email);
        await db.doc(`users/${u.uid}`).set({ pro: true, plan: product || "brief", proSince: FV.serverTimestamp() }, { merge: true });
      } catch (e) { /* aún no tiene cuenta: se activa cuando se registre con ese correo */ }
    }

    if (evt.type === "order.refunded") {
      await db.doc(`purchases/${email}`).set({ pro: false, refundedAt: FV.serverTimestamp() }, { merge: true });
      try {
        const u = await admin.auth().getUserByEmail(email);
        await db.doc(`users/${u.uid}`).set({ pro: false }, { merge: true });
      } catch (e) {}
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false });
  }
};
