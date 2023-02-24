import { TRPCError } from "@trpc/server";
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

// ENHANCE: it could've been better to extract these into functions so we can use them in both the safe and unsafe routers
// I didn't do it, because passing the whole context and input would be a bit messy
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
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.create({
        data: {
          ...input.record,
          userId: input.userId,
        },
      });
      return record;
    }),
  /**
   * **ALWAYS** make sure userId is valid!!!
   */
  updateRecord: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        record: DiaryRecordParser,
        userId: z.string().min(1),
      }),
    )
    .output(DiaryRecordParser)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          records: {
            update: {
              where: {
                id: input.id,
              },
              data: {
                ...input.record,
              },
            },
          },
        },
        select: {
          records: {
            where: {
              id: input.record.id,
            },
            select: {
              id: true,
              date: true,
              timeSpent: true,
              programmingLanguage: true,
              rating: true,
              description: true,
            },
          },
        },
      });
      const record = response.records[0];
      if (!record) {
        throw new TRPCError({
          message: "Record not found",
          code: "NOT_FOUND",
        });
      }
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
      const response = await ctx.prisma.record.deleteMany({
        where: {
          userId: input.userId,
          id: input.recordId,
        },
      });
      if (response.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (response.count > 1) {
        console.error("deleted more than one record", response);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
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
  createRecord: protectedProcedure
    .input(DiaryRecordParser.omit({ id: true }))
    .output(DiaryRecordWithUserParser)
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.prisma.record.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          date: true,
          timeSpent: true,
          programmingLanguage: true,
          rating: true,
          description: true,
          user: {
            select: {
              id: true,
              name: true,
              isAdmin: true,
            },
          },
        },
      });
      return record;
    }),
  updateRecord: protectedProcedure
    .input(
      z.object({ id: z.string().min(1), record: DiaryRecordParser.partial() }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          records: {
            update: {
              where: {
                id: input.id,
              },
              data: {
                ...input.record,
              },
            },
          },
        },
        select: {
          records: {
            where: {
              id: input.record.id ?? input.id,
            },
            select: {
              id: true,
              date: true,
              timeSpent: true,
              programmingLanguage: true,
              rating: true,
              description: true,
            },
          },
        },
      });
      const record = response.records[0];
      if (!record) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return record;
    }),
  deleteRecord: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.prisma.record.deleteMany({
        where: {
          userId: ctx.session.user.id,
          id: input.id,
        },
      });
      if (response.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (response.count > 1) {
        console.error("deleted more than one record", response);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return true;
    }),
  /**
   * needs external validation!!!
   */
  unsafe: extApiRouter,
});
