import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    console.log("req,",req.body)
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed');
  }
  
  const { consultantName, consultantEmail, hourlyRate, hours } = req.body;

    try {
        console.log("hourlyrate",hourlyRate)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // <- You can add more methods here
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Consultation with ${consultantName}`,
              },
              unit_amount: Math.round(hourlyRate * 100),
            },
            quantity: hours,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/dashboard`,
      });
      
    

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
}
