import { WebRisk } from "~/resources/web-risk";
import { SystemCheckUriWebRiskUseCase } from "~/use-cases/system-check-uri-web-risk";
import { UserGetNotAllowedUrlsUseCase } from "~/use-cases/user-get-not-allowed-urls";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const webRiskRouter = createTRPCRouter({
  checkUrl: protectedProcedure
    .input(SystemCheckUriWebRiskUseCase.inputSchema)
    .mutation(async ({ ctx, input }) => {
      const webRisk = new WebRisk();
      return await new SystemCheckUriWebRiskUseCase(ctx.db, webRisk).execute(
        input,
      );
    }),

  getNotAllowedUrls: protectedProcedure.query(async ({ ctx }) => {
    return await new UserGetNotAllowedUrlsUseCase(ctx.db).execute({});
  }),
});
