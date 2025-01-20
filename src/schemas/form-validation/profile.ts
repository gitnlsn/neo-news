import { z } from "zod";

export const profileSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  logoId: z.string().uuid().optional(),
  images: z.array(z.string().uuid()).optional(),
});
