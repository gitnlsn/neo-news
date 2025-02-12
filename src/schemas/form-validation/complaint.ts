import { z } from "zod";

export const complaintSchema = z
  .object({
    postId: z.string().optional(),
    profileId: z.string().optional(),
    description: z.string().min(1, "Por favor, descreva sua reclamação"),
  })
  .refine(
    (data) => {
      if (!data.postId && !data.profileId) {
        return false;
      }
      return true;
    },
    {
      message: "Você deve selecionar um post ou um perfil a ser reportado.",
      path: ["postId", "profileId"],
    },
  );
