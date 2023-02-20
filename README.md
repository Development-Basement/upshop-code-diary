# UpShop code-diary

This is a project from the competition round of the [Tour de App](https://tourdeapp.cz/) 2022 competition.
The goal is to create an app for UpShop (the "client") to monitor it's employees' personal growth.
We are "modifying" (read: "recreating from the ground up") our app from the nomination round.

## Team members

- [@AlbertPatik](https://github.com/AlbertPatik) - Albert Pátík
- [@R1248](https://github.com/R1248) - Richard Materna
- [@xhrnca00](https://github.com/xhrnca00) - Adam Hrnčárek

## How does it work?

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app@7.5.3`.
In the root of it, there is [Next.js](https://nextjs.org).
We use [tRPC](https://trpc.io) instead of traditional Next.js API routes.
For our database, we use [Planet Scale](https://planetscale.com/) together with the [Prisma](https://prisma.io) ORM.
We also use [NextAuth.js](https://next-auth.js.org) as our "owned" authentication solution.
The core of our styling is [Tailwind CSS](https://tailwindcss.com), together with other libraries like [Headless UI](https://https://headlessui.com/) and [DaisyUI](https://daisyui.com/) that one just for basic components like buttons.
The whole application is type-safe thanks to [TypeScript](https://www.typescriptlang.org/) and [Zod](https://zod.dev/).

## Resources

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

If you are not familiar with the different technologies used in this project, please refer to the respective docs:

- [Next.js](https://nextjs.org/docs/getting-started)
- [NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [Tailwind CSS](https://tailwindcss.com/docs/customizing-colors)
- [tRPC](https://trpc.io/docs)

<span style="border-radius: 0.25rem; background-color: rgb(217 119 6); color: black">
TODO</span>: better writeup

If you still are in the wind, please join the [T3 stack Discord](https://t3.gg/discord) and ask for help.

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
