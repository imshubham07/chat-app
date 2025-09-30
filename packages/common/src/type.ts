import z from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(80, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(20, "Name must be at most 50 characters long"),
});

export const SignInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
});

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(20, "Room name must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9 _-]+$/,
      "Room name can only contain letters, numbers, spaces, underscores, and dashes"
    ),
});
