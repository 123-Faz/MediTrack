import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username or Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginAdminFormSchema = z.object({
  username: z.string().min(1, "Admin username is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type LoginAdminFormValues = z.infer<typeof loginAdminFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;