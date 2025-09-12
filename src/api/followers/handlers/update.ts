import { Follower } from "../../../models/followes";

export const updateFollower: Handler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const doc = await Follower.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).send();
    res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

