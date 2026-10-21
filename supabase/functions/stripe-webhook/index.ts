// Stripe appelle cette fonction quand un acompte est réglé : le rendez-vous
// passe alors automatiquement en « acompte réglé ».
// Déploiement : supabase functions deploy stripe-webhook --no-verify-jwt
//   (--no-verify-jwt est indispensable : Stripe n'envoie pas de jeton Supabase)
import Stripe from 'npm:stripe@18'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
})
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Clé service_role : seule façon de modifier un rendez-vous sans être connectée.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

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
      const { error } = await supabase
        .from('bookings')
        .update({ paid: true })
        .eq('id', bookingId)

      if (error) {
        console.error('Mise à jour du rendez-vous impossible', error)
        return new Response('Erreur base de données', { status: 500 })
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
