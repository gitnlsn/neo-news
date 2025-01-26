import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserDeletePostUseCase } from "~/use-cases/user-delete-post";
import { UserPaginatePostsUseCase } from "~/use-cases/user-paginate-posts";
import { UserShowPostUseCase } from "~/use-cases/user-show-post";
import { UserUpsertPostUseCase } from "~/use-cases/user-upsert-post";

export const postRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(UserUpsertPostUseCase.inputSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      return await new UserUpsertPostUseCase(ctx.db).execute({
        userId: ctx.session.user.id,
        ...input,
      });
    }),

  paginate: protectedProcedure
    .input(UserPaginatePostsUseCase.inputSchema.omit({ userId: true }))
    .query(async ({ ctx, input }) => {
      return await new UserPaginatePostsUseCase(ctx.db).execute({
        userId: ctx.session.user.id,
        ...input,
      });
    }),

  show: protectedProcedure
    .input(UserShowPostUseCase.inputSchema.omit({ userId: true }))
    .query(async ({ ctx, input }) => {
      return await new UserShowPostUseCase(ctx.db).execute({
        userId: ctx.session.user.id,
        ...input,
      });
    }),

  delete: protectedProcedure
    .input(UserDeletePostUseCase.inputSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      return await new UserDeletePostUseCase(ctx.db).execute({
        userId: ctx.session.user.id,
        ...input,
      });
    }),
});
