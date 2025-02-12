import { z } from "zod";
import type { UploadedFile } from "~/types/UploadedFile";

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

export const postSchema = z.object({
  postId: z.string().optional(),
  profileId: z.string({ message: "Escolha do perfil é obrigatório" }).cuid(),

  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  content: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  images: z.array(z.custom<UploadedFile>()).optional(),
  tags: z.array(tagSchema).optional().default([]),
});
