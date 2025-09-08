import { Document, model, Schema } from "mongoose";

interface Attempt extends Document {
    username: string;
    createdAt: Date;
    updatedAt: Date;
}


const LimitSchema = new Schema<Attempt>({
    username: { type: String, required: true },
}, { timestamps: true });

export const RateLimit = model<Attempt>('Limit', LimitSchema);

