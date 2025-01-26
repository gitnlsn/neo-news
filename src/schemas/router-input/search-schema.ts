import { z } from "zod";

export const paginateSchema = z.object({
  search: z.string().optional(),

  page: z.number().optional(),
  perPage: z.number().optional(),
});
