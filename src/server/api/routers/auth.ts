import { type User } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

function removeAuthData(user: User) {
  // @reason: we don't want to send the password hash and salt to the client
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, salt, ...sanitizedUser } = user;
  return sanitizedUser;
}

export const authRouter = createTRPCRouter({
  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().regex(/^[a-zA-Z0-9-_]{3,15}$/), // 3-15 chars, letters, numbers, - and _
        password: z.string().min(6).regex(/^\S*$/), // no whitespace
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: check if user with this name or salt already exists
      const salt = randomBytes(16);
      const passwordHash = scryptSync(input.password, salt, 128);
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          passwordHash,
          salt,
        },
      });
      return removeAuthData(user);
    }),
});
