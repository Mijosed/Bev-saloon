// Email de confirmation envoyé à la cliente une fois l'acompte réglé.
// Mise en page en tableaux + styles en ligne : c'est la seule façon fiable
// d'être lisible dans Gmail, Outlook et Apple Mail.

export type BookingMail = {
  name: string
  type: 'coiffure' | 'ongles'
  service: string
  date: string
  time: string
  price: number
  deposit: number
}

const THEMES = {
  coiffure: {
    bg: '#0d0502',
    card: '#1a0f08',
    accent: '#f0d817',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.65)',
    border: 'rgba(255,255,255,0.12)',
    onAccent: '#0d0502',
    stripes: ['#e20d0d', '#f0d817', '#3eb308'],
  },
  ongles: {
    bg: '#fdf6f0',
    card: '#ffffff',
    accent: '#ec4899',
    text: '#9d174d',
    muted: '#b4617f',
    border: '#fce7f3',
    onAccent: '#ffffff',
    stripes: ['#ec4899', '#f9a8d4', '#fbcfe8'],
  },
} as const

function formatDateFR(date: string): string {
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number)
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const dt = new Date(y, m - 1, d)
  const label = `${jours[dt.getDay()]} ${d} ${mois[m - 1]} ${y}`
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Échappe le contenu saisi par la cliente avant de l'insérer dans l'email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(theme: typeof THEMES.coiffure, label: string, value: string, strong = false) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${theme.border};color:${theme.muted};font-size:14px;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${theme.border};color:${theme.text};font-size:14px;font-weight:${strong ? '700' : '600'};text-align:right;">${value}</td>
    </tr>`
}

export function buildConfirmationEmail(booking: BookingMail): { subject: string; html: string } {
  const theme = THEMES[booking.type]
  const universe = booking.type === 'coiffure' ? 'Coiffure' : 'Ongles'
  const remaining = Number(booking.price) - Number(booking.deposit)
  const name = escapeHtml(booking.name)
  const service = escapeHtml(booking.service)

  const stripes = theme.stripes
    .map((c) => `<td width="40" height="4" style="background:${c};font-size:0;line-height:0;">&nbsp;</td>`)
    .join('<td width="6" style="font-size:0;line-height:0;">&nbsp;</td>')

  const subject = `Votre rendez-vous ${universe.toLowerCase()} est confirmé — ${formatDateFR(booking.date)}`

  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:0;background:${theme.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${theme.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <tr><td align="center" style="padding-bottom:24px;">
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;color:${theme.text};letter-spacing:0.5px;">
            BEV<span style="color:${theme.accent};"> Aesthetic</span>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;"><tr>${stripes}</tr></table>
        </td></tr>

        <tr><td style="background:${theme.card};border:1px solid ${theme.border};border-radius:16px;padding:28px;">

          <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${theme.accent};padding-bottom:8px;">
            ${universe}
          </div>
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:800;color:${theme.text};padding-bottom:14px;">
            Rendez-vous confirmé
          </div>
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${theme.muted};padding-bottom:22px;">
            Bonjour ${name},<br />
            votre acompte a bien été reçu et votre créneau est réservé. À très vite !
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;">
            ${row(theme, 'Prestation', service)}
            ${row(theme, 'Date', formatDateFR(booking.date))}
            ${row(theme, 'Heure', booking.time.slice(0, 5))}
            ${row(theme, 'Acompte réglé', `${booking.deposit}€`)}
            ${row(theme, 'Reste à régler sur place', `${remaining}€`, true)}
          </table>

          <div style="margin-top:24px;padding:16px;border-radius:12px;background:${theme.accent}1a;border:1px solid ${theme.border};font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.7;color:${theme.muted};">
            <strong style="color:${theme.text};">À retenir</strong><br />
            • Merci d'arriver à l'heure.<br />
            • Les accompagnateurs ne sont pas autorisés.<br />
            • À votre arrivée, envoyez-moi un message : je viens vous ouvrir. Merci de ne pas sonner.<br />
            • L'acompte n'est pas remboursable en cas d'annulation.
          </div>

        </td></tr>

        <tr><td align="center" style="padding-top:22px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${theme.muted};">
          Une question ?
          <a href="https://www.instagram.com/bev.aesthetic_" style="color:${theme.accent};font-weight:600;">@bev.aesthetic_</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html }
}

/** Alerte opérationnelle envoyée à Bev à chaque rendez-vous payé. */
export function buildAdminNotification(
  booking: BookingMail & { phone: string; email: string; notes?: string; durationH?: number },
): { subject: string; html: string } {
  const theme = THEMES[booking.type]
  const universe = booking.type === 'coiffure' ? 'Coiffure' : 'Ongles'
  const start = booking.time.slice(0, 5)

  let creneau = start
  if (booking.durationH) {
    const [h = 0, m = 0] = start.split(':').map(Number)
    const end = h * 60 + m + booking.durationH * 60
    creneau = `${start} – ${String(Math.floor(end / 60) % 24).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`
  }

  const name = escapeHtml(booking.name)
  const service = escapeHtml(booking.service)
  const phone = escapeHtml(booking.phone)
  const email = escapeHtml(booking.email)
  const notes = booking.notes ? escapeHtml(booking.notes) : ''

  const subject = `Nouveau RDV ${universe.toLowerCase()} — ${formatDateFR(booking.date)} à ${start}`

  const line = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:14px;width:40%;">${label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;font-weight:600;">${value}</td>
    </tr>`

  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:24px 16px;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">

        <tr><td style="background:${theme.accent};height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <tr><td style="padding:24px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;padding-bottom:6px;">
            ${universe} · acompte réglé
          </div>
          <div style="font-size:20px;font-weight:800;color:#111;padding-bottom:18px;">
            Nouveau rendez-vous
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${line('Cliente', name)}
            ${line('Téléphone', `<a href="tel:${phone}" style="color:#111;">${phone}</a>`)}
            ${line('Email', `<a href="mailto:${email}" style="color:#111;">${email}</a>`)}
            ${line('Prestation', service)}
            ${line('Date', formatDateFR(booking.date))}
            ${line('Créneau', creneau)}
            ${line('Acompte reçu', `${booking.deposit}€`)}
            ${line('Reste à encaisser', `${Number(booking.price) - Number(booking.deposit)}€`)}
          </table>

          ${notes ? `<div style="margin-top:16px;padding:12px;background:#fafafa;border-radius:8px;font-size:13px;color:#555;"><strong>Note :</strong> ${notes}</div>` : ''}
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html }
}
