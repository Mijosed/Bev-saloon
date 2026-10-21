// Crée une session Stripe Checkout pour l'acompte d'un rendez-vous.
// Déploiement : supabase functions deploy create-checkout
import Stripe from 'npm:stripe@18'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
})

const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

// Le montant de l'acompte est décidé ICI, jamais par le navigateur :
// sinon n'importe qui pourrait réserver en payant 1 centime.
const DEPOSITS: Record<string, number> = {
  'manucure-simple': 10,
  'manucure-nailart': 10,
  'depose': 10,
  'depose-exterieure': 10,
  'micro-courts': 80,
  'micro-mi-longs': 80,
  'micro-longs': 80,
  'micro-tres-longs': 80,
  'resserrage-200-300': 20,
  'resserrage-300-500': 20,
  'resserrage-500-600': 20,
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { booking_id, service_id, service, email } = await req.json()

    const deposit = DEPOSITS[service_id]
    if (!booking_id || !deposit) {
      return new Response(JSON.stringify({ error: 'Prestation inconnue.' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Acompte — ${service}` },
          unit_amount: deposit * 100,
        },
        quantity: 1,
      }],
      customer_email: email,
      metadata: { booking_id },
      payment_intent_data: { metadata: { booking_id } },
      success_url: `${siteUrl}/reservation?paid=1`,
      cancel_url: `${siteUrl}/reservation?canceled=1`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Création du paiement impossible.' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
