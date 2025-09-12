import { Follower } from "../../../models/followes";

export const deleteFollower: Handler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const doc = await Follower.findByIdAndDelete(id);
    if (!doc) return res.status(404).send();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

