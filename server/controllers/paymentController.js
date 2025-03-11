import Payment from "../models/payment.js";

// @desc  Store payment details
// @route POST /api/payments
// @access Public
export const processPayment = async (req, res) => {
    try {
        const { userId, reservationId, amount, paymentDate, paymentStatus } = req.body;

        if (!userId || !reservationId || !amount || !paymentDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const payment = new Payment({ userId, reservationId, amount, paymentDate, paymentStatus });
        await payment.save();

        res.status(201).json({ message: "Payment processed successfully", payment });
    } catch (error) {
        res.status(500).json({ message: "Error processing payment", error: error.message });
    }
};