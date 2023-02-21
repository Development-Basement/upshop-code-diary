import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  listUsers: publicProcedure.query(async ({ ctx }) => {
    // ENHANCE: add pagination, this could crash the server
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        isAdmin: true,
      },
    });
    return users;
  }),
  doesUserIdExist: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.prisma.user.findFirst({
        where: {
          id,
        },
      });
      return user !== null;
    }),
});
