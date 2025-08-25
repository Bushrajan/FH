 
import mongoose from 'mongoose';
import HijabStyle from '../models/style.js';

// 📦 Get all styles
export const getAllHijabStyles = async (req, res) => {
    try {
        const styles = await HijabStyle.find();
        res.status(200).json(styles);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching styles', error: err.message });
    }
};

// 🔍 Get a single style by ID with populated reviews
export const getStyleById = async (req, res) => {
    const { id } = req.params;

    // ✅ Check for valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid style ID' });
    }

    try {
        const style = await HijabStyle.findById(id).populate('reviews.user', 'name profileImage');

        if (!style) {
            return res.status(404).json({ message: 'Style not found' });
        }

        res.status(200).json(style);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching style', error: err.message });
    }
};

// ✍️ Add a review to a style (auth required)
export const addReview = async (req, res) => {
    const { rating, text } = req.body;
    const userId = req.user?._id;
    const { id } = req.params;

    // ✅ Ensure user is authenticated
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Validate rating (optional, adjust as needed)
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const style = await HijabStyle.findById(id);
        if (!style) return res.status(404).json({ message: 'Style not found' });

        // Check if the user already reviewed this style
        const alreadyReviewed = style.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You already reviewed this style' });
        }

        // Add new review
        style.reviews.push({ user: userId, rating, text });
        await style.save();

        res.status(201).json({ message: 'Review added successfully', style });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add review', error: err.message });
    }
};
