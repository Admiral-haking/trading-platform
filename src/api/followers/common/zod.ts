import { z } from "zod";

const followerBase = {
  baseUrl: z.string().url(),
  name: z.string().min(1),
  expire: z.number().int().positive(),
};

export const followerCreateSchema = z.object(followerBase);
export const followerUpdateSchema = z.object({
  baseUrl: followerBase.baseUrl.optional(),
  name: followerBase.name.optional(),
  expire: followerBase.expire.optional(),
});

export const followerIdSchema = z.object({ id: z.string().length(24) });

export const followerCreateValidation: Handler = async (req, res, next) => {
  try {
    req.body = await followerCreateSchema.parseAsync(req.body);
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

export const followerUpdateValidation: Handler = async (req, res, next) => {
  try {
    req.body = await followerUpdateSchema.parseAsync(req.body);
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

export const followerIdValidation: Handler = async (req, res, next) => {
  try {
    req.params = await followerIdSchema.parseAsync(req.params);
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

