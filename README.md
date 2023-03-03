# UpShop code-diary

[![Build and push to TdA](https://github.com/Development-Basement/upshop-code-diary/actions/workflows/release.yml/badge.svg)](https://github.com/Development-Basement/upshop-code-diary/actions/workflows/release.yml)

This is a project from the competition round of the [Tour de App](https://tourdeapp.cz/) 2022 competition.
The goal is to create an app for UpShop (the "client") to monitor it's employees' personal growth.
We are "modifying" (read: "recreating from the ground up") our app from the nomination round.

## Table of contents

- [UpShop code-diary](#upshop-code-diary)
  - [Table of contents](#table-of-contents)
  - [Team members](#team-members)
  - [How does it work?](#how-does-it-work)
  - [Resources](#resources)
    - [Technologies](#technologies)
    - [Tailwind](#tailwind)
    - [DaisyUI](#daisyui)
    - [HeadlessUI](#headlessui)
    - [React Aria](#react-aria)
    - [NextAuth](#nextauth)
    - [tRPC](#trpc)
    - [TypeScript](#typescript)
    - [Zod](#zod)
    - [Prisma](#prisma)
    - [DayJS](#dayjs)
    - [Deployment guides](#deployment-guides)

## Team members

- [@AlbertPatik](https://github.com/AlbertPatik) - Albert Pátík
- [@R1248](https://github.com/R1248) - Richard Materna
- [@xhrnca00](https://github.com/xhrnca00) - Adam Hrnčárek
  - `hrnec` is him on his dad's laptop, in case you're looking through commits

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

### Technologies

If you are not familiar with the different technologies used in this project, please refer to the respective docs:

- [Next.js](https://nextjs.org/docs/getting-started)
- [NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [Tailwind CSS](https://tailwindcss.com/docs/customizing-colors)
- [tRPC](https://trpc.io/docs)

### Tailwind

- Autocomplete go BRR I guess
- CSS Dev Tools can be super useful to find out,
    why certain property does not work as you would expect
- [Tailwind docs](https://tailwindcss.com/docs/flex) have most of what you are looking for
- [Cheat sheet](https://nerdcave.com/tailwind-cheat-sheet/)

### DaisyUI

- It's here just to speed up buttons and forms
- [Their docs](https://daisyui.com/components/rating/) are not the best,
- but they have examples. If it's some complicated CSS magic, don't use it.

### HeadlessUI

- Examples in the [docs](https://headlessui.com/react/dialog) should be sufficient

### React Aria

- We use this for the date picker, nothing else really
- [`useDatePicker` docs](https://react-spectrum.adobe.com/react-aria/useDatePicker.html)
- [Styled Tailwind example](https://codesandbox.io/s/reverent-faraday-5nwk87?file=/src/DatePicker.js)

### NextAuth

- [Client API](https://next-auth.js.org/getting-started/client)
- [Pages](https://next-auth.js.org/configuration/pages)
- [Credentials Provider](https://next-auth.js.org/configuration/providers/credentials)

### tRPC

- [tRPC docs](https://trpc.io/docs/client)
- Most usage is via `@trpc/react-query`, which is just a wrapper over `@tanstack/react-query`
- For most common problems, refer to [React Query docs](https://tanstack.com/query/v4/docs/react/guides/queries) instead

### TypeScript

- Consult [@xhrnca00](https://github.com/xhrnca00) when you don't get something

### Zod

- Unless you are doing some crazy wizardry, this should be pretty straight forward
- [Docs](https://zod.dev/)

### Prisma

- [CRUD operations](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- Use your **autocomplete**!
- When your autocomplete feels sloppy or you are being suggested the wrong fields/types,
    make sure you have the correct type stubs with the command `npx prisma generate`
    and if that doesn't help, **restart the TS language server**
- You might be looking at an SQL problem, rather than Prisma

### DayJS

- Make sure to import `dayts`! It has all extensions we need
- [DayJS docs](https://day.js.org/docs/en/display/display)
- JavaScript dates suck and are displayed in the local timezone.
    As the dates are just days (time = 00:00:00), this is a problem.
    This can be fixed by using `.subtract(new Date().getTimezoneOffset(), "minutes")`.
    I would recommend saving the timezone offset to a variable, as it does not change

### Deployment guides

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Docker](https://create.t3.gg/en/deployment/docker)

If you still are in the wind, please join the [T3 stack Discord](https://t3.gg/discord) and ask for help there.
