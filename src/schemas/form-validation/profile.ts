import type { File as UploadFile } from "@prisma/client";
import { z } from "zod";

export const profileSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  logo: z.custom<UploadFile>().optional(),
  images: z.array(z.custom<UploadFile>()).optional(),
});
