import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  followerCreateValidation,
  followerUpdateValidation,
  followerIdValidation,
} from "./common/zod";
import { createFollower } from "./handlers/create";
import { listFollowers } from "./handlers/list";
import { getFollower } from "./handlers/get";
import { updateFollower } from "./handlers/update";
import { deleteFollower } from "./handlers/remove";

export const FollowersRouter = Router();

// List all followers
FollowersRouter.get("/followers", authMiddleware, listFollowers);

// Get a follower by id
FollowersRouter.get(
  "/followers/:id",
  authMiddleware,
  followerIdValidation,
  getFollower
);

// Create a follower
FollowersRouter.post(
  "/followers",
  authMiddleware,
  followerCreateValidation,
  createFollower
);

// Update a follower
FollowersRouter.put(
  "/followers/:id",
  authMiddleware,
  followerIdValidation,
  followerUpdateValidation,
  updateFollower
);

// Delete a follower
FollowersRouter.delete(
  "/followers/:id",
  authMiddleware,
  followerIdValidation,
  deleteFollower
);
