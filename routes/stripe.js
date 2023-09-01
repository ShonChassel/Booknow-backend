import  express  from "express";
import  Stripe  from "stripe";
import dotenv from "dotenv";
// const Stripe = require('stripe')

dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY)

const router = express.Router()

router.post('/create-checkout-session', async (req, res) => {
const line_items = req.body.cartItems.map(item => {
    return{
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.title,
                images: item.photos,
                description: item.desc,
                metadata: {
                    id: item._id,
                  },
            },
            unit_amount: item.price * 100,
        },
        quantity: req.body.days,
    }
})

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/`,
        
    });

    res.send({url: session.url});
});

export default router
