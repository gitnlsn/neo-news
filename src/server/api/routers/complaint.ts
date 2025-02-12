import { UserCreateComplaintUseCase } from "~/use-cases/user-create-complaint";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const complaintRouter = createTRPCRouter({
  create: publicProcedure
    .input(UserCreateComplaintUseCase.inputSchema)
    .mutation(async ({ ctx, input }) => {
      return await new UserCreateComplaintUseCase(ctx.db).execute(input);
    }),
});
