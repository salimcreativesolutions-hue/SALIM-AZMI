// Vercel serverless function: sends the "Démarrer un projet" form straight to Salim's inbox over Gmail SMTP.
// Environment variables (Vercel → Settings → Environment Variables):
//   GMAIL_USER          the Gmail address that sends and receives (e.g. yourname@gmail.com)
//   GMAIL_APP_PASSWORD  a 16-character Google "app password" (not the normal password)
//   MAIL_TO             optional, defaults to GMAIL_USER
const nodemailer = require("nodemailer");

const clean = (v, max = 500) => String(v == null ? "" : v).replace(/[\r\n]+/g, " ").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return res.status(500).json({ ok: false, error: "not-configured" });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (_) { b = {}; } }
  b = b || {};
  if (clean(b.website)) return res.status(200).json({ ok: true }); // honeypot

  const nom = clean(b.nom, 120), entreprise = clean(b.entreprise, 160), services = clean(b.services, 300);
  const email = clean(b.email, 200), telephone = clean(b.telephone, 60);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!nom || !validEmail) return res.status(400).json({ ok: false, error: "invalid" });

  const rows = [["Nom", nom], ["Entreprise", entreprise || "—"], ["Besoin", services || "—"], ["Email", email || "—"], ["Téléphone", telephone || "—"]];
  const text = rows.map(([k, v]) => `${k} : ${v}`).join("\n");
  const html = `<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#666">${k}</td><td style="padding:6px 0"><b>${esc(v)}</b></td></tr>`).join("") + `</table>`;

  try {
    const transporter = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
    await transporter.sendMail({
      from: `"Site Salim Azmi" <${user}>`,
      to: process.env.MAIL_TO || user,
      replyTo: validEmail ? email : undefined,
      subject: `Démarrer un projet — ${nom}`,
      text, html
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("mail error", e && e.message);
    return res.status(502).json({ ok: false, error: "send-failed" });
  }
};
