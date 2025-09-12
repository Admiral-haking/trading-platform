import { Follower } from "../../../models/followes";

export const listFollowers: Handler = async (_req, res, next) => {
  try {
    const docs = await Follower.find().sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    next(err);
  }
};

