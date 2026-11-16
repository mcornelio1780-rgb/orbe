/* orbe · cuentas, base de datos y sincronía con Polar
   Usa Firebase Authentication (correo + contraseña con verificación, y Google)
   y Cloud Firestore. Si Firebase no está configurado en orbe-config.js,
   todo sigue funcionando sin login (modo respaldo). */
(function () {
  const CFG = window.ORBE_CONFIG || {};
  const FB_VER = "10.12.2";
  const enabled = !!(CFG.firebase && CFG.firebase.apiKey && CFG.firebase.projectId);

  const T = {
    es: { login: "Iniciar sesión", signup: "Crear cuenta", logout: "Cerrar sesión", account: "Mi cuenta", radar: "Abrir el radar", email: "Correo", password: "Contraseña", name: "Nombre", google: "Continuar con Google", or: "o", forgot: "¿Olvidaste tu contraseña?", reset: "Te enviamos un correo para cambiar tu contraseña.", verifySent: "Listo. Te enviamos un correo para activar tu cuenta. Ábrelo y vuelve aquí.", verifyNeeded: "Activa tu cuenta desde el correo que te enviamos.", resend: "Reenviar correo", resent: "Correo reenviado.", haveAccount: "¿Ya tienes cuenta? Inicia sesión", noAccount: "¿No tienes cuenta? Regístrate", close: "Cerrar", pro: "Acceso completo", free: "Plan gratuito", terms: "Al crear tu cuenta aceptas los <a href='legal.html#terminos'>Términos</a> y la <a href='legal.html#privacidad'>Política de privacidad</a>.", welcome: "Hola", working: "Un momento…",
      err: { "auth/invalid-credential": "Correo o contraseña incorrectos.", "auth/wrong-password": "Correo o contraseña incorrectos.", "auth/user-not-found": "No existe una cuenta con ese correo.", "auth/email-already-in-use": "Ese correo ya tiene cuenta. Inicia sesión.", "auth/weak-password": "La contraseña necesita al menos 8 caracteres.", "auth/invalid-email": "Revisa el formato del correo.", "auth/popup-closed-by-user": "Se cerró la ventana de Google antes de terminar.", "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.", "auth/unauthorized-domain": "Este dominio aún no está autorizado en Firebase.", "auth/network-request-failed": "Sin conexión. Revisa tu internet.", default: "No se pudo completar. Inténtalo de nuevo." } },
    en: { login: "Log in", signup: "Sign up", logout: "Log out", account: "My account", radar: "Open the radar", email: "Email", password: "Password", name: "Name", google: "Continue with Google", or: "or", forgot: "Forgot your password?", reset: "We sent you an email to reset your password.", verifySent: "Done. We sent you an email to activate your account. Open it and come back here.", verifyNeeded: "Activate your account from the email we sent you.", resend: "Resend email", resent: "Email sent again.", haveAccount: "Already have an account? Log in", noAccount: "No account? Sign up", close: "Close", pro: "Full access", free: "Free plan", terms: "By creating an account you accept the <a href='legal.html#terminos'>Terms</a> and the <a href='legal.html#privacidad'>Privacy Policy</a>.", welcome: "Hi", working: "One moment…",
      err: { "auth/invalid-credential": "Wrong email or password.", "auth/wrong-password": "Wrong email or password.", "auth/user-not-found": "No account with that email.", "auth/email-already-in-use": "That email already has an account. Log in.", "auth/weak-password": "Password needs at least 8 characters.", "auth/invalid-email": "Check the email format.", "auth/popup-closed-by-user": "The Google window closed before finishing.", "auth/too-many-requests": "Too many attempts. Wait a few minutes.", "auth/unauthorized-domain": "This domain isn't authorized in Firebase yet.", "auth/network-request-failed": "No connection. Check your internet.", default: "Couldn't complete that. Try again." } },
    pt: { login: "Entrar", signup: "Criar conta", logout: "Sair", account: "Minha conta", radar: "Abrir o radar", email: "E-mail", password: "Senha", name: "Nome", google: "Continuar com Google", or: "ou", forgot: "Esqueceu a senha?", reset: "Enviamos um e-mail para trocar sua senha.", verifySent: "Pronto. Enviamos um e-mail para ativar sua conta. Abra e volte aqui.", verifyNeeded: "Ative sua conta pelo e-mail que enviamos.", resend: "Reenviar e-mail", resent: "E-mail reenviado.", haveAccount: "Já tem conta? Entre", noAccount: "Não tem conta? Cadastre-se", close: "Fechar", pro: "Acesso completo", free: "Plano gratuito", terms: "Ao criar sua conta você aceita os <a href='legal.html#terminos'>Termos</a> e a <a href='legal.html#privacidad'>Política de privacidade</a>.", welcome: "Olá", working: "Um momento…",
      err: { "auth/invalid-credential": "E-mail ou senha incorretos.", "auth/wrong-password": "E-mail ou senha incorretos.", "auth/user-not-found": "Não existe conta com esse e-mail.", "auth/email-already-in-use": "Esse e-mail já tem conta. Entre.", "auth/weak-password": "A senha precisa de pelo menos 8 caracteres.", "auth/invalid-email": "Confira o formato do e-mail.", "auth/popup-closed-by-user": "A janela do Google fechou antes de terminar.", "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.", "auth/unauthorized-domain": "Este domínio ainda não está autorizado no Firebase.", "auth/network-request-failed": "Sem conexão. Verifique sua internet.", default: "Não foi possível concluir. Tente de novo." } },
    fr: { login: "Se connecter", signup: "Créer un compte", logout: "Se déconnecter", account: "Mon compte", radar: "Ouvrir le radar", email: "E-mail", password: "Mot de passe", name: "Nom", google: "Continuer avec Google", or: "ou", forgot: "Mot de passe oublié ?", reset: "Nous vous avons envoyé un e-mail pour réinitialiser votre mot de passe.", verifySent: "C’est fait. Nous vous avons envoyé un e-mail pour activer votre compte. Ouvrez-le puis revenez ici.", verifyNeeded: "Activez votre compte depuis l’e-mail que nous vous avons envoyé.", resend: "Renvoyer l’e-mail", resent: "E-mail renvoyé.", haveAccount: "Déjà un compte ? Connectez-vous", noAccount: "Pas de compte ? Inscrivez-vous", close: "Fermer", pro: "Accès complet", free: "Offre gratuite", terms: "En créant un compte, vous acceptez les <a href='legal.html#terminos'>Conditions</a> et la <a href='legal.html#privacidad'>Politique de confidentialité</a>.", welcome: "Bonjour", working: "Un instant…",
      err: { "auth/invalid-credential": "E-mail ou mot de passe incorrect.", "auth/wrong-password": "E-mail ou mot de passe incorrect.", "auth/user-not-found": "Aucun compte avec cet e-mail.", "auth/email-already-in-use": "Cet e-mail a déjà un compte. Connectez-vous.", "auth/weak-password": "Le mot de passe doit contenir au moins 8 caractères.", "auth/invalid-email": "Vérifiez le format de l’e-mail.", "auth/popup-closed-by-user": "La fenêtre Google s’est fermée avant la fin.", "auth/too-many-requests": "Trop de tentatives. Patientez quelques minutes.", "auth/unauthorized-domain": "Ce domaine n’est pas encore autorisé dans Firebase.", "auth/network-request-failed": "Pas de connexion. Vérifiez internet.", default: "Impossible de terminer. Réessayez." } }
  };
  const lang = () => { const l = (document.documentElement.lang || "es").slice(0, 2); return T[l] ? l : "es"; };
  const t = k => T[lang()][k];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const state = { enabled, user: null, profile: null, purchase: null, pro: false, loaded: !enabled };
  const listeners = [];
  const emit = () => { renderWidget(); listeners.forEach(f => { try { f(state); } catch (e) { console.error(e); } }); };
  let fb = null; // { app, auth, db, m: modules }

  async function load() {
    if (!enabled) return null;
    if (fb) return fb;
    const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
    const [appM, authM, fsM] = await Promise.all([
      import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")
    ]);
    const app = appM.initializeApp(CFG.firebase);
    const auth = authM.getAuth(app);
    const db = fsM.getFirestore(app);
    fb = { app, auth, db, a: authM, f: fsM };
    authM.onAuthStateChanged(auth, async u => {
      state.user = u; state.profile = null; state.purchase = null; state.pro = false;
      if (u) { try { await syncProfile(); } catch (e) { console.warn("profile", e); } }
      state.loaded = true; emit();
    });
    return fb;
  }

  async function syncProfile() {
    const { db, f } = fb, u = state.user;
    const ref = f.doc(db, "users", u.uid);
    const snap = await f.getDoc(ref);
    const base = { email: (u.email || "").toLowerCase(), name: u.displayName || "", lang: lang(), lastLogin: f.serverTimestamp() };
    if (!snap.exists()) await f.setDoc(ref, { ...base, createdAt: f.serverTimestamp() });
    else await f.updateDoc(ref, base);
    state.profile = (await f.getDoc(ref)).data() || {};
    if (u.emailVerified && u.email) {
      try { const p = await f.getDoc(f.doc(db, "purchases", u.email.toLowerCase())); state.purchase = p.exists() ? p.data() : null; } catch (e) { /* sin compras */ }
    }
    state.pro = !!(state.profile && state.profile.pro) || !!(state.purchase && state.purchase.pro);
  }

  /* ---------------- UI: estilos ---------------- */
  const css = `
  .oa-btn{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:8px 14px;font:inherit;font-weight:700;font-size:.86rem;cursor:pointer;border:1.5px solid var(--line,#D9DEEA);background:none;color:var(--fg,#0D1330);white-space:nowrap}
  .oa-btn:hover{border-color:var(--fg,#0D1330)}
  .oa-av{width:30px;height:30px;border-radius:50%;background:#0D1330;color:#F2F4F8;display:grid;place-items:center;font-weight:700;font-size:.8rem;flex:none;overflow:hidden}
  .oa-av img{width:100%;height:100%;object-fit:cover}
  @media(max-width:520px){.oa-btn>span:not(.oa-av){display:none}.oa-btn{padding:6px 10px}}
  .oa-wrap{position:relative}
  .oa-menu{position:absolute;right:0;top:calc(100% + 8px);min-width:240px;background:var(--card,var(--panel,#fff));color:var(--fg,#0D1330);border:1px solid var(--line,#D9DEEA);border-radius:16px;padding:10px;box-shadow:0 20px 50px -20px rgba(7,10,28,.5);z-index:80}
  .oa-menu[hidden]{display:none}
  .oa-menu .who{padding:6px 8px 10px;border-bottom:1px solid var(--line,#D9DEEA);margin-bottom:6px;font-size:.85rem;word-break:break-all}
  .oa-menu .who b{display:block;font-size:.95rem}
  .oa-pill{display:inline-block;margin-top:6px;font-size:.72rem;font-weight:700;border-radius:999px;padding:2px 8px;background:rgba(255,90,31,.15);color:#FF5A1F}
  .oa-pill.free{background:var(--soft,var(--panel2,#EEF1F7));color:var(--muted,#50566E)}
  .oa-menu a,.oa-menu button.item{display:block;width:100%;text-align:left;background:none;border:0;padding:9px 8px;border-radius:10px;font:inherit;font-size:.9rem;color:inherit;text-decoration:none;cursor:pointer}
  .oa-menu a:hover,.oa-menu button.item:hover{background:var(--soft,var(--panel2,#EEF1F7))}
  dialog.oa-dlg{border:0;padding:0;background:transparent;width:min(420px,94vw);color:var(--fg,#0D1330)}
  dialog.oa-dlg::backdrop{background:rgba(7,10,28,.7)}
  .oa-card{background:var(--card,var(--panel,#fff));border:1px solid var(--line,#D9DEEA);border-radius:22px;padding:26px;max-height:90vh;overflow:auto}
  .oa-card h2{font-family:var(--serif,Georgia,serif);font-weight:600;font-size:1.6rem;margin:0 0 4px;letter-spacing:-.01em}
  .oa-card label{display:block;font-size:.8rem;color:var(--muted,#50566E);margin:12px 0 4px}
  .oa-card input{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line,#D9DEEA);background:var(--soft,var(--panel2,#F2F4F8));color:var(--fg,#0D1330);font:inherit}
  .oa-card input:focus{outline:2px solid #FF5A1F;outline-offset:1px}
  .oa-primary{width:100%;margin-top:16px;border:0;border-radius:999px;padding:13px;background:#FF5A1F;color:#0D1330;font:inherit;font-weight:700;cursor:pointer}
  .oa-primary[disabled]{opacity:.6;cursor:wait}
  .oa-google{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;padding:12px;border:1.5px solid var(--line,#D9DEEA);background:#fff;color:#1f1f1f;font:inherit;font-weight:600;cursor:pointer;margin-top:16px}
  .oa-or{display:flex;align-items:center;gap:10px;color:var(--muted,#50566E);font-size:.8rem;margin:16px 0 0}
  .oa-or::before,.oa-or::after{content:"";flex:1;height:1px;background:var(--line,#D9DEEA)}
  .oa-links{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:14px;font-size:.84rem}
  .oa-links button{background:none;border:0;padding:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit}
  .oa-msg{min-height:1.2em;font-size:.86rem;margin-top:12px}
  .oa-msg.err{color:#E5484D}.oa-msg.ok{color:#1F9D63}
  .oa-small{font-size:.76rem;color:var(--muted,#50566E);margin-top:12px}
  .oa-small a{color:inherit}
  .oa-x{float:right;background:none;border:0;font-size:1.2rem;cursor:pointer;color:var(--muted,#50566E)}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------------- UI: widget del header ---------------- */
  function renderWidget() {
    document.querySelectorAll("[data-orbe-account]").forEach(el => {
      if (!enabled) { el.innerHTML = ""; return; }
      const u = state.user;
      if (!u) { el.innerHTML = `<button class="oa-btn" type="button" data-oa="open">${esc(t("login"))}</button>`; return; }
      const initial = (u.displayName || u.email || "?").trim()[0].toUpperCase();
      const av = u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : esc(initial);
      el.innerHTML = `<div class="oa-wrap"><button class="oa-btn" type="button" data-oa="menu" aria-haspopup="true" style="padding:4px 10px 4px 4px"><span class="oa-av">${av}</span><span style="max-width:110px;overflow:hidden;text-overflow:ellipsis">${esc(u.displayName || u.email.split("@")[0])}</span></button>
        <div class="oa-menu" hidden><div class="who"><b>${esc(u.displayName || "")}</b>${esc(u.email || "")}<br><span class="oa-pill ${state.pro ? "" : "free"}">${esc(state.pro ? t("pro") : t("free"))}</span>${u.emailVerified ? "" : `<div style="margin-top:8px;color:#E5484D">${esc(t("verifyNeeded"))}</div><button class="item" data-oa="resend">${esc(t("resend"))}</button>`}</div>
        <a href="radar.html">${esc(t("radar"))}</a><button class="item" type="button" data-oa="logout">${esc(t("logout"))}</button></div></div>`;
    });
  }
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-oa]");
    document.querySelectorAll(".oa-menu").forEach(m => { if (!m.parentElement.contains(e.target)) m.hidden = true; });
    if (!b) return;
    const a = b.dataset.oa;
    if (a === "open") openAuth("login");
    if (a === "menu") { const m = b.parentElement.querySelector(".oa-menu"); m.hidden = !m.hidden; }
    if (a === "logout") { await fb.a.signOut(fb.auth); }
    if (a === "resend") { try { await fb.a.sendEmailVerification(state.user, { url: location.origin + "/radar.html" }); b.textContent = t("resent"); } catch (err) { b.textContent = errMsg(err); } }
  });
  new MutationObserver(renderWidget).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  /* ---------------- UI: ventana de acceso ---------------- */
  let dlg = null, mode = "login";
  function errMsg(e) { const m = T[lang()].err; return m[e && e.code] || m.default; }
  function buildDlg() {
    dlg = document.createElement("dialog"); dlg.className = "oa-dlg"; document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  }
  function draw(msg, cls) {
    const L = T[lang()], signup = mode === "signup";
    dlg.innerHTML = `<div class="oa-card"><button class="oa-x" type="button" aria-label="${esc(L.close)}" data-x>✕</button>
      <h2>${esc(signup ? L.signup : L.login)}</h2>
      <button class="oa-google" type="button" data-g><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>${esc(L.google)}</button>
      <div class="oa-or">${esc(L.or)}</div>
      <form data-f novalidate>
        ${signup ? `<label for="oa-n">${esc(L.name)}</label><input id="oa-n" autocomplete="name" maxlength="80">` : ""}
        <label for="oa-e">${esc(L.email)}</label><input id="oa-e" type="email" autocomplete="email" required>
        <label for="oa-p">${esc(L.password)}</label><input id="oa-p" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="8" required>
        <button class="oa-primary" type="submit">${esc(signup ? L.signup : L.login)}</button>
      </form>
      <div class="oa-msg ${cls || ""}" role="status">${msg || ""}</div>
      <div class="oa-links"><button type="button" data-sw>${esc(signup ? L.haveAccount : L.noAccount)}</button>${signup ? "" : `<button type="button" data-fp>${esc(L.forgot)}</button>`}</div>
      ${signup ? `<p class="oa-small">${L.terms}</p>` : ""}</div>`;
    dlg.querySelector("[data-x]").onclick = () => dlg.close();
    dlg.querySelector("[data-sw]").onclick = () => { mode = signup ? "login" : "signup"; draw(); };
    const fp = dlg.querySelector("[data-fp]");
    if (fp) fp.onclick = async () => { const em = dlg.querySelector("#oa-e").value.trim(); if (!em) { dlg.querySelector("#oa-e").focus(); return; } try { fb.auth.languageCode = lang(); await fb.a.sendPasswordResetEmail(fb.auth, em); say(L.reset, "ok"); } catch (e) { say(errMsg(e), "err"); } };
    dlg.querySelector("[data-g]").onclick = async () => {
      try { fb.auth.languageCode = lang(); await fb.a.signInWithPopup(fb.auth, new fb.a.GoogleAuthProvider()); dlg.close(); }
      catch (e) { if (e.code === "auth/popup-blocked") { await fb.a.signInWithRedirect(fb.auth, new fb.a.GoogleAuthProvider()); } else say(errMsg(e), "err"); }
    };
    dlg.querySelector("[data-f]").onsubmit = async ev => {
      ev.preventDefault();
      const em = dlg.querySelector("#oa-e").value.trim(), pw = dlg.querySelector("#oa-p").value, btn = dlg.querySelector(".oa-primary");
      if (!em || pw.length < 8) { say(T[lang()].err[pw.length < 8 ? "auth/weak-password" : "auth/invalid-email"], "err"); return; }
      btn.disabled = true; btn.textContent = L.working;
      try {
        fb.auth.languageCode = lang();
        if (signup) {
          const cred = await fb.a.createUserWithEmailAndPassword(fb.auth, em, pw);
          const nm = (dlg.querySelector("#oa-n").value || "").trim();
          if (nm) await fb.a.updateProfile(cred.user, { displayName: nm });
          await fb.a.sendEmailVerification(cred.user, { url: location.origin + "/radar.html" });
          mode = "login"; draw(L.verifySent, "ok");
        } else {
          const cred = await fb.a.signInWithEmailAndPassword(fb.auth, em, pw);
          if (!cred.user.emailVerified) draw(L.verifyNeeded + ` <button type="button" class="oa-btn" style="margin-left:6px" data-oa="resend">${esc(L.resend)}</button>`, "err");
          else dlg.close();
        }
      } catch (e) { btn.disabled = false; btn.textContent = signup ? L.signup : L.login; say(errMsg(e), "err"); }
    };
    function say(m, c) { const el = dlg.querySelector(".oa-msg"); el.className = "oa-msg " + (c || ""); el.innerHTML = esc(m); }
  }
  function openAuth(m) {
    if (!enabled) return false;
    if (!fb) { load().then(() => openAuth(m)).catch(() => alert(T[lang()].err["auth/network-request-failed"])); return true; }
    if (!dlg) buildDlg();
    mode = m || "login"; draw(); dlg.showModal();
    setTimeout(() => { const i = dlg.querySelector("#oa-e"); if (i) i.focus(); }, 30);
    return true;
  }

  /* ---------------- API pública ---------------- */
  async function saveContact(data) {
    const clean = {};
    ["type", "name", "email", "company", "country", "message", "lang", "page"].forEach(k => { clean[k] = String(data[k] || "").slice(0, k === "message" ? 4000 : 200); });
    if (!enabled) throw new Error("no-firebase");
    await load();
    const { db, f } = fb;
    await f.addDoc(f.collection(db, "contacts"), { ...clean, uid: state.user ? state.user.uid : null, status: "new", createdAt: f.serverTimestamp() });
    return true;
  }

  async function activateLicense(key) {
    if (!enabled || !state.user) return { ok: false, error: "login" };
    if (!state.user.emailVerified) return { ok: false, error: "verify" };
    const token = await state.user.getIdToken();
    try {
      const r = await fetch("/api/validate-license", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ key: String(key || "").trim() }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { await syncProfile(); emit(); return { ok: true }; }
      return { ok: false, error: j.error || "invalid" };
    } catch (e) { return { ok: false, error: "network" }; }
  }

  async function refreshPurchase() { if (state.user && fb) { await state.user.reload(); state.user = fb.auth.currentUser; await syncProfile(); emit(); } }

  function checkoutUrl(kind) {
    const P = CFG.polar || {};
    let url = kind === "sprint" ? P.checkoutSprint : P.checkoutBrief;
    if (!url) return "";
    try {
      const u = new URL(url);
      if (state.user && state.user.email) u.searchParams.set("customer_email", state.user.email);
      if (state.user && state.user.displayName) u.searchParams.set("customer_name", state.user.displayName);
      return u.toString();
    } catch (e) { return url; }
  }

  window.orbe = {
    get enabled() { return enabled; }, get user() { return state.user; }, get pro() { return state.pro; }, get loaded() { return state.loaded; },
    state, on(cb) { listeners.push(cb); if (state.loaded) cb(state); }, openAuth, saveContact, activateLicense, refreshPurchase, checkoutUrl, t,
    signOut: () => fb && fb.a.signOut(fb.auth),
    firebase: () => load()
  };

  if (enabled) load().catch(e => { console.warn("Firebase no cargó:", e); state.loaded = true; emit(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderWidget); else renderWidget();
})();
