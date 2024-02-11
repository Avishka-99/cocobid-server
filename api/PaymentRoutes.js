const express = require('express');
const router = express.Router();
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')('sk_test_51OhJSFJB0NyC4HrhGa29Z7RYTnmW5IfZob5w3kXzjtOGxejtL28sdrdPbdx6jYYfV90zkbmTi2Y7zIGE0kfFqAm200zp1vKw5P');
router.use(express.json());
router.post('/intents', async (req, res) => {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: 100000,
			currency: 'lkr',
			automatic_payment_methods: {
				enabled: true,
			},
		});
		console.log(paymentIntent)
		res.json({ paymentIntent: paymentIntent.client_secret });
		//res.json({message: 'success'});
	} catch (e) {
		res.send(e)
	}
});
module.exports = router;
