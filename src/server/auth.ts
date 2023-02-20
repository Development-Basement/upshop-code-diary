import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { scryptSync } from "node:crypto";
import { env } from "../env.mjs";
import { prisma } from "./db";

// we use interfaces for module augmentation
/* eslint @typescript-eslint/consistent-type-definitions: "off" */

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      name: string;
      id: string;
      // ...other properties
      isAdmin: boolean;
      // role: UserRole;
    }; // & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    isAdmin: boolean;
    // role: UserRole;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    // ...other properties
    isAdmin: boolean;
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: env.NODE_ENV === "development",
  pages: {
    // TODO: add custom pages here
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      // session.user.role = user.role; <-- put other properties on the session here
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "text",
        },
      },
      /**
       * This function gets the user object by username. If it does not exist,
       * it eventually returns `null`. If it does exist, it securely checks
       * if the provided password is correct.
       *
       * The check happens even if the user does not exist to prevent timing
       * attacks, where the attacker could find out if a username exists by
       * measuring the time it takes to get a response.
       *
       * @returns User | null
       */
      async authorize(credentials) {
        if (credentials === undefined) {
          return null;
        }
        // exclude passwordHash and salt for better security
        const { salt, passwordHash, ...user } = (await prisma.user.findUnique({
          where: { name: credentials.username },
        })) ?? {
          salt: Buffer.from("very secure"),
          passwordHash: Buffer.from("timing attack mitigation"),
          id: undefined,
        };
        const providedPasswordHash = scryptSync(
          credentials.password,
          salt,
          128,
        );
        if (
          providedPasswordHash.compare(passwordHash) !== 0 ||
          user.id === undefined
        ) {
          return null;
        }
        return user;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
