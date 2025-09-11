import z from "zod";

export const InviteUserSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  role: z.string().min(1, "Please select a role"),
});
