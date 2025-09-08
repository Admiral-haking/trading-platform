import { Schema, model } from 'mongoose';

export interface IUser {
  username: string
  password: string
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, minLength: 8 },
}, { timestamps: true });

export const Users = model<IUser>('User', UserSchema);

