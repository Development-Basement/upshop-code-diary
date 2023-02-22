import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const RecordParser = z.object({
  id: z.string().min(1),
  date: z.date(),
  timeSpent: z.string().min(1), // ISO 8601 duration
  programmingLanguage: z.string().min(1).max(30),
  rating: z.number().min(0).max(5),
  description: z.string().min(1),
});

export const usersRouter = createTRPCRouter({
  listRecords: protectedProcedure
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
  listRecordsFromUser: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .output(z.array(RecordParser))
    .query(async ({ ctx, input }) => {
      const records = await ctx.prisma.record.findMany({
        where: {
          userId: input.userId,
        },
        select: {
          id: true,
          date: true,
          timeSpent: true,
          programmingLanguage: true,
          rating: true,
          description: true,
        },
      });
      return records;
      // TODO: exclude userId and possibly other (see API spec?)
    }),
});
