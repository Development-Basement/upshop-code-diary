import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  listRecords: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const records = await ctx.prisma.record.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              isAdmin: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
      return { records, nextOffset: input.offset + records.length };
    }),
});
