import { UserShowProfileUseCase } from "~/use-cases/user-show-profile";
import { UserUpsertProfileUseCase } from "~/use-cases/user-upsert-profile";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  showProfile: protectedProcedure.query(async ({ input, ctx }) => {
    return await new UserShowProfileUseCase(ctx.db).execute({
      userId: ctx.session.user.id,
    });
  }),

  upsertProfile: protectedProcedure
    .input(UserUpsertProfileUseCase.inputSchema.omit({ userId: true }))
    .mutation(async ({ input, ctx }) => {
      return await new UserUpsertProfileUseCase(ctx.db).execute({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});
