import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add feedback
export const addFeedback = async (context) => {
  try {
    const { text, rating } = context.req.body;
    const image = context.req.file?.path;
    const userId = context.req.user.id;

    const feedback = await prisma.feedback.create({
      data: {
        text,
        rating: parseInt(rating),
        image,
        userId,
      },
    });

    return context.res.status(201).json(feedback);
  } catch (error) {
    throw error;
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (context) => {
  try {
    const { rating, sort } = context.req.query;
    const filter = rating ? { rating: parseInt(rating) } : {};
    const orderBy =
      sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" };

    const feedbacks = await prisma.feedback.findMany({
      where: filter,
      orderBy,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return context.res.status(200).json(feedbacks);
  } catch (error) {
    throw error;
  }
};

// Add comment to feedback
export const addComment = async (context) => {
  try {
    const { id } = context.req.params;
    const { comment } = context.req.body;

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { comment },
    });

    return context.res.status(200).json(updatedFeedback);
  } catch (error) {
    throw error;
  }
};
