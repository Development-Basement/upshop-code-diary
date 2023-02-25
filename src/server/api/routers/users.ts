import { TRPCError } from "@trpc/server";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { z } from "zod";
import { prisma } from "../../db";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

const nameSchema = z.string().regex(/^[a-zA-Z0-9-_]{3,15}$/); // 3-15 chars, letters, numbers, - and _

// strips auth data from the user
const userSchema = z.object({
  id: z.string().min(1),
  name: nameSchema,
  isAdmin: z.boolean(),
});

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
        name: nameSchema,
        password: z.string().min(6).regex(/^\S*$/), // no whitespace
      }),
    )
    .output(userSchema)
    .mutation(async ({ input, ctx }) => {
      if (await doesUsernameExist(input.name)) {
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
      const passwordHash = pbkdf2Sync(
        input.password,
        salt,
        210000,
        64,
        "sha512",
      );
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          passwordHash,
          salt,
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