import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    funds: number;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    funds: { type: Number, default: 10000000 },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;