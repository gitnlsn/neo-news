import { UserPaginateProfilesUseCase } from "~/use-cases/user-paginate-profiles";
import { UserShowProfileUseCase } from "~/use-cases/user-show-profile";
import { UserUpsertProfileUseCase } from "~/use-cases/user-upsert-profile";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  paginate: protectedProcedure
    .input(UserPaginateProfilesUseCase.inputSchema.omit({ userId: true }))
    .query(async ({ input, ctx }) => {
      return await new UserPaginateProfilesUseCase(ctx.db).execute({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  show: protectedProcedure
    .input(UserShowProfileUseCase.inputSchema.omit({ userId: true }))
    .query(async ({ input, ctx }) => {
      return await new UserShowProfileUseCase(ctx.db).execute({
        userId: ctx.session.user.id,
        profileId: input.profileId,
      });
    }),

  upsert: protectedProcedure
    .input(UserUpsertProfileUseCase.inputSchema.omit({ userId: true }))
    .mutation(async ({ input, ctx }) => {
      return await new UserUpsertProfileUseCase(ctx.db).execute({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});
