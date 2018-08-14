const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: Number(req.body.amount),
      currency: 'usd',
      description: '$' + req.body.amount + ' for ' + req.body.amount + ' credits',
      source: req.body.token.id,
    });
    req.user.credits += Number(req.body.amount / 100);
    const user = await req.user.save();
    res.send(user);
  });
};
