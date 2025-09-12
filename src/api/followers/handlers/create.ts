import { Follower } from "../../../models/followes";

export const createFollower: Handler = async (req, res, next) => {
  try {
    const doc = await Follower.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

