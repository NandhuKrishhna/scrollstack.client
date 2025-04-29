import { z, ZodType } from "zod";
export type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};
export type LoginData = {
    email: string;
    password: string;
};
export type EmailData = {
    email: string;
};
export type PasswordData = {
    password: string;
    confirmPassword: string;
};
export const userRegisterSchema: ZodType<FormData> = z
    .object({
        name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(30, { message: "Name cannot exceed 30 characters" })
            .nonempty({ message: "Name is required" }),

        email: z.string().email({ message: "Enter a valid email address" }).nonempty({ message: "Email is required" }),

        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(30, { message: "Password cannot exceed 25 characters" })
            .nonempty({ message: "Password is required" }),

        confirmPassword: z
            .string()
            .min(6, { message: "Confirm Password must be at least 6 characters long" })
            .max(30, { message: "Confirm Password cannot exceed 25 characters" })
            .nonempty({ message: "Confirm Password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema: ZodType<LoginData> = z.object({
    email: z.string().email({ message: "Enter a valid email address" }).nonempty({ message: "Email is required" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(30, { message: "Password cannot exceed 30 characters" })
        .nonempty({ message: "Password is required" }),
});

export const emailScheme: ZodType<EmailData> = z.object({
    email: z.string().email({ message: "Enter a valid email address" }).nonempty({ message: "Email is required" }),
});

export const setNewPasswordSchema: ZodType<PasswordData> = z
    .object({
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(30, { message: "Password cannot exceed 30 characters" })
            .nonempty({ message: "Password is required" }),
        confirmPassword: z
            .string()
            .min(6, { message: "Confirm Password must be at least 6 characters long" })
            .max(30, { message: "Confirm Password cannot exceed 30 characters" })
            .nonempty({ message: "Confirm Password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
