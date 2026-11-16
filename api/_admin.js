// Firebase Admin compartido por las funciones /api (servidor).
// Variable de entorno en Vercel: FIREBASE_SERVICE_ACCOUNT = contenido completo del JSON de la cuenta de servicio.
const admin = require("firebase-admin");

function getAdmin() {
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw new Error("Falta FIREBASE_SERVICE_ACCOUNT en Vercel");
    const sa = JSON.parse(raw);
    if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, "\n");
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  }
  return admin;
}
module.exports = { getAdmin };
