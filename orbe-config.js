/* =====================================================================
   orbe · CONFIGURACIÓN ÚNICA
   Este es el ÚNICO archivo que hay que editar para conectar todo.
   La landing (index.html), el radar (radar.html), las páginas legales
   y el panel (admin.html) leen todo desde aquí.
   ===================================================================== */
window.ORBE_CONFIG = {

  // --- 1. Polar (pagos) ------------------------------------------------
  polar: {
    // Polar > Settings > General > "Organization ID" (es público, no es secreto)
    organizationId: "",
    // Polar > Products > Checkout Links > copiar enlace (https://buy.polar.sh/polar_cl_...)
    checkoutBrief:  "",   // orbe brief · $39
    checkoutSprint: ""    // orbe sprint · $149
  },

  // --- 2. Firebase (login + base de datos) -----------------------------
  // Firebase console > Configuración del proyecto > Tus apps > SDK > "Config"
  // Estos valores son públicos por diseño; la seguridad está en las reglas.
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },

  // --- 3. Otros enlaces -----------------------------------------------
  calBriefing: "",                     // https://cal.com/TU-USUARIO/orbe-briefing-30
  substack:    "",                     // https://TU-PUBLICACION.substack.com
  social: { linkedin: "", x: "", instagram: "", tiktok: "", youtube: "" },
  contactEmail: "manyosa@limly.io",     // correo que se muestra en el footer y en legales

  // --- 4. Administración ----------------------------------------------
  // Correo(s) que pueden entrar a admin.html. Debe coincidir con firestore.rules.
  adminEmails: [""],

  // --- 5. Datos legales -----------------------------------------------
  legal: {
    company: "orbe LLC",
    address: "",                        // dirección registrada de la LLC
    state: "",                          // estado de registro de la LLC (ej. Wyoming)
    updated: "2026-11-13"
  },

  // --- 6. Respaldo mientras no haya Firebase ---------------------------
  // Si Firebase aún no está configurado, el radar acepta códigos fijos.
  // Se guardan cifrados para que no se lean aquí: ORBE-FOUNDER y ORBE-LATAM.
  fallbackCodeHashes: ["a88f196b", "7ec5f37f"]
};
