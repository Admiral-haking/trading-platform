import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const PushSubscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  userAgent: { type: String },
}, { timestamps: true });

export type PushSubscriptionAttrs = InferSchemaType<typeof PushSubscriptionSchema>;
export type PushSubscriptionDocument = HydratedDocument<PushSubscriptionAttrs>;

export const PushSubscriptions = model<PushSubscriptionAttrs>('PushSubscription', PushSubscriptionSchema);
