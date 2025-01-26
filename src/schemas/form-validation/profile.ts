import { z } from "zod";
import type { UploadedFile } from "~/types/UploadedFile";

export const profileSchema = z.object({
  profileId: z.string().optional(),

  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  logo: z.custom<UploadedFile>().optional(),
  images: z.array(z.custom<UploadedFile>()).optional(),
});
