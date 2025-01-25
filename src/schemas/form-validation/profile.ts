import { z } from "zod";
import type { UploadedFile } from "~/types/UploadedFile";

export const profileSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  logo: z.custom<UploadedFile>().optional(),
  images: z.array(z.custom<UploadedFile>()).optional(),
});
