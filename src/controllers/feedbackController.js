import * as feedbackRepository from '../repositories/feedbackRepository.js';

// Add feedback
export const addFeedback = async (req, res) => {
    const context = { req, res };
    try {
        const data = await feedbackRepository.addFeedback(context);
        return data;
    } catch (err) {
        console.log(err)
        return "";
    }
};

// Get all feedbacks
export const getAllFeedbacks = async (req, res) => {
    const context = { req, res };
    try {
        const data = await feedbackRepository.getAllFeedbacks(context);
        return data;
    } catch (err) {
        console.log(err)
        return "";
    }
};

// Add comment to feedback
export const addComment = async (req, res) => {
    const context = { req, res };
    try {
        const data = await feedbackRepository.addComment(context);
        return data;
    } catch (err) {
        console.log(err)
        return "";
    }
};
