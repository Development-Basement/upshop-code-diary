import { TRPCError } from "@trpc/server";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { z } from "zod";
import { prisma } from "../../db";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

const usernameSchema = z.string().regex(/^[a-zA-Z0-9-_]{3,15}$/); // 3-15 chars, letters, numbers, - and _
const passwordSchema = z.string().min(6).regex(/^\S*$/); // no whitespace

// strips auth data from the user
const userSchema = z.object({
  id: z.string().min(1),
  name: usernameSchema,
  isAdmin: z.boolean(),
  createdAt: z.date(),
});

export const usersRouter = createTRPCRouter({
  listUsers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().min(1).optional(),
      }),
    )
    .output(
      z.object({
        items: z.array(userSchema),
        nextCursor: z.string().min(1).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          isAdmin: true,
          createdAt: true,
        },
        orderBy: {
          name: "asc",
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });
      let nextCursor: string | undefined = undefined;
      if (users.length > input.limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }
      return { items: users, nextCursor };
    }),
  doesUserIdExist: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .output(z.boolean())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.prisma.user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });
      return user !== null;
    }),
  createUser: adminProcedure
    .input(
      z.object({
        username: usernameSchema,
        password: passwordSchema,
      }),
    )
    .output(userSchema)
    .mutation(async ({ input, ctx }) => {
      if (await doesUsernameExist(input.username)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }
      let iterCount = 0;
      let salt: Buffer;
      do {
        if (iterCount > 0) {
          // this means we either hit a jackpot, or our random is not secure
          console.warn(
            "There was a salt collision! Current iteration count: ",
            iterCount,
          );
        }
        if (iterCount > 9) {
          // this (definitely) means our random is not secure
          // -> will stop all future user creations
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Salt generation took too long",
          });
        }
        salt = randomBytes(8);
        iterCount++;
      } while (await doesSaltExist(salt));
      const passwordHash = hashPassword(input.password, salt);
      const user = await ctx.prisma.user.create({
        data: {
          name: input.username,
          passwordHash,
          salt,
        },
      });
      return user;
    }),
  changePassword: adminProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        newPassword: passwordSchema,
      }),
    )
    .output(z.boolean())
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          salt: true,
        },
      });
      if (user === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const passwordHash = hashPassword(input.newPassword, user.salt);
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          passwordHash,
        },
      });
      return true;
    }),
  /** WILL error if the user already has this username */
  changeUsername: adminProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        newUsername: usernameSchema,
      }),
    )
    .output(z.boolean())
    .mutation(async ({ input, ctx }) => {
      if (await doesUsernameExist(input.newUsername)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          name: input.newUsername,
        },
        select: {
          id: true,
        },
      });
      return true;
    }),
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .output(userSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.delete({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          name: true,
          isAdmin: true,
          createdAt: true,
        },
      });
      return user;
    }),
});

async function doesUsernameExist(name: string) {
  const response = await prisma.user.findMany({
    where: {
      name,
    },
    select: {
      id: true,
    },
  });
  return response.length > 0;
}

async function doesSaltExist(salt: Buffer) {
  const response = await prisma.user.findMany({
    where: {
      salt,
    },
    select: {
      id: true,
    },
  });
  return response.length > 0;
}

function hashPassword(password: string, salt: Buffer) {
  return pbkdf2Sync(password, salt, 210000, 64, "sha512");
}
