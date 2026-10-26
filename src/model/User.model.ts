import mongoose, { Schema, Document } from "mongoose";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    resetCode?: string;
    resetCodeExpiry?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: USER_ROLES,
            default: "user",
        },

        resetCode: {
            type: String,
            default: null,
        },
        resetCodeExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>("User", userSchema);