// Stripe appelle cette fonction quand un acompte est réglé : le rendez-vous
// passe en « acompte réglé » et la cliente reçoit son email de confirmation.
// Déploiement : supabase functions deploy stripe-webhook --no-verify-jwt
//   (--no-verify-jwt est indispensable : Stripe n'envoie pas de jeton Supabase)
import Stripe from 'npm:stripe@18'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { buildConfirmationEmail, buildAdminNotification } from '../_shared/confirmation-email.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
})
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const resendKey = Deno.env.get('RESEND_API_KEY')
const mailFrom = Deno.env.get('MAIL_FROM') ?? 'BEV Aesthetic <onboarding@resend.dev>'
// Expédier depuis le domaine ne crée pas de boîte de réception :
// sans adresse de réponse, les réponses des clientes se perdraient.
const mailReplyTo = Deno.env.get('MAIL_REPLY_TO')
// Adresse de Bev, prévenue à chaque rendez-vous payé.
const mailAdmin = Deno.env.get('MAIL_ADMIN') ?? mailReplyTo

// Clé service_role : seule façon de modifier un rendez-vous sans être connectée.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

type BookingRow = {
  name: string
  email: string
  phone: string
  type: 'coiffure' | 'ongles'
  service: string
  date: string
  time: string
  duration_h: number
  price: number
  deposit: number
  notes: string
}

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: mailFrom,
      to,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
    }),
  })

  if (!res.ok) throw new Error(`Resend ${res.status} : ${await res.text()}`)
}

/** Confirmation à la cliente. */
async function sendConfirmation(booking: BookingRow) {
  const { subject, html } = buildConfirmationEmail(booking)
  await send(booking.email, subject, html, mailReplyTo)
}

/** Alerte à Bev, avec les coordonnées de la cliente en réponse directe. */
async function sendAdminAlert(booking: BookingRow) {
  if (!mailAdmin) {
    console.warn('MAIL_ADMIN absente : pas de notification envoyée à Bev.')
    return
  }
  const { subject, html } = buildAdminNotification({ ...booking, durationH: Number(booking.duration_h) })
  await send(mailAdmin, subject, html, booking.email)
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Signature manquante', { status: 400 })

  const body = await req.text()

  let event: Stripe.Event
  try {
    // constructEventAsync (et non constructEvent) : Deno chiffre en asynchrone.
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    console.error('Signature invalide', err)
    return new Response('Signature invalide', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ paid: true })
        .eq('id', bookingId)
        .select('name, email, phone, type, service, date, time, duration_h, price, deposit, notes')
        .single()

      if (error) {
        console.error('Mise à jour du rendez-vous impossible', error)
        return new Response('Erreur base de données', { status: 500 })
      }

      // Un email qui échoue ne doit pas faire échouer le webhook : sinon Stripe
      // rejoue l'événement et la cliente reçoit plusieurs confirmations.
      // allSettled : si l'un des deux échoue, l'autre part quand même.
      if (!resendKey) {
        console.warn('RESEND_API_KEY absente : aucun email envoyé.')
      } else {
        const booking = data as BookingRow
        const [cliente, admin] = await Promise.allSettled([
          sendConfirmation(booking),
          sendAdminAlert(booking),
        ])
        if (cliente.status === 'rejected') console.error('Confirmation cliente', cliente.reason)
        if (admin.status === 'rejected') console.error('Notification Bev', admin.reason)
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
