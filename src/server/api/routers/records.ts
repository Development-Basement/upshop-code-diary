import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const DiaryRecordParser = z.object({
  id: z.string().min(1),
  date: z.date(),
  timeSpent: z.string().min(1), // ISO 8601 duration
  programmingLanguage: z.string().min(1).max(30),
  rating: z.number().min(0).max(5),
  description: z.string().min(1),
});

const DiaryRecordWithUserParser = DiaryRecordParser.extend({
  user: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    isAdmin: z.boolean(),
  }),
});

export type DiaryRecord = z.infer<typeof DiaryRecordParser>;
export type DiaryRecordWithUser = z.infer<typeof DiaryRecordWithUserParser>;

const extApiRouter = createTRPCRouter({
  /**
   * **ALWAYS** make sure userId is valid!!!
   */
  createRecord: publicProcedure
    .input(
      z.object({
        record: DiaryRecordParser.omit({ id: true }),
        userId: z.string().min(1),
      }),
    )
    .output(DiaryRecordParser)
    .query(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.create({
        data: {
          ...input.record,
          userId: input.userId,
        },
      });
      return record;
    }),
});

export const recordsRouter = createTRPCRouter({
  listRecords: protectedProcedure
    .input(
      // TODO: use cursor based pagination
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .output(
      z.object({
        records: z.array(DiaryRecordWithUserParser),
        nextOffset: z.number().min(0),
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
    .output(z.array(DiaryRecordParser))
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
          user: true,
        },
      });
      return records;
    }),
  /**
   * needs external validation
   */
  unsafe: extApiRouter,
  createRecord: protectedProcedure
    .input(DiaryRecordParser.omit({ id: true }))
    .query(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return record;
    }),
});
