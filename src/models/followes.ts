import { Schema, model, Document, Types } from "mongoose";

export interface IFollower extends Document<Types.ObjectId> {
    baseUrl: string;
    name: string;
    expire: number;
}

const FollowerSchema = new Schema<IFollower>(
    {
        baseUrl: { type: String, required: true },
        name: { type: String, required: true },
        expire: { type: Number, required: true },
    },
    {
        timestamps: true, // optional: adds createdAt/updatedAt
    }
);

export const Follower = model<IFollower>("Follower", FollowerSchema);
