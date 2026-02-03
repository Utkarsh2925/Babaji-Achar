const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, receipt } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100, // INR to paise
            currency: "INR",
            receipt: receipt,
            payment_capture: 1,
        });

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
