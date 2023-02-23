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
  /**
   * **ALWAYS** make sure userId is valid and record belongs to that user!!!
   */
  updateRecord: publicProcedure
    .input(
      z.object({
        record: DiaryRecordParser,
        userId: z.string().min(1),
      }),
    )
    .output(DiaryRecordParser)
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.update({
        where: {
          id: input.record.id,
        },
        data: {
          ...input.record,
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
      return record;
    }),
  /**
   * **ALWAYS** make sure userId is valid and record belongs to that user!!!
   */
  deleteRecord: publicProcedure
    .input(
      z.object({
        recordId: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      // throws if record doesn't exist
      await ctx.prisma.record.delete({
        where: {
          id: input.recordId,
        },
      });
      return true;
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
  doesRecordBelongToUser: publicProcedure
    .input(
      z.object({
        recordId: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .output(z.boolean())
    .query(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.findUnique({
        where: {
          id: input.recordId,
        },
        select: {
          userId: true,
        },
      });
      return record?.userId === input.userId;
    }),
  getSignleRecord: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .output(DiaryRecordParser.nullable())
    .query(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.findUnique({
        where: {
          id: input.id,
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
      return record;
    }),
  /**
   * needs external validation!!!
   */
  unsafe: extApiRouter,
  createRecord: protectedProcedure
    .input(DiaryRecordParser.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return record;
    }),
  updateRecord: protectedProcedure
    .input(DiaryRecordParser.partial())
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
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
      return record;
    }),
  deleteRecord: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.delete({
        where: {
          id: input.id,
        },
      });
      return record;
    }),
});
