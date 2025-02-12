import { UserCreateComplaintUseCase } from "~/use-cases/user-create-complaint";
import { UserPaginateComplaintsUseCase } from "~/use-cases/user-paginate-complaints";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const complaintRouter = createTRPCRouter({
  create: publicProcedure
    .input(UserCreateComplaintUseCase.inputSchema)
    .mutation(async ({ ctx, input }) => {
      return await new UserCreateComplaintUseCase(ctx.db).execute(input);
    }),

  paginate: protectedProcedure
    .input(UserPaginateComplaintsUseCase.inputSchema.omit({ userId: true }))
    .query(async ({ ctx, input }) => {
      return await new UserPaginateComplaintsUseCase(ctx.db).execute({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});
