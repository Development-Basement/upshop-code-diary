import { type NextApiHandler } from "next";
import { appRouter } from "../../../../server/api/root";
import { createTRPCContext } from "../../../../server/api/trpc";

const handler: NextApiHandler = async (req, res) => {
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  const { user_id } = req.query;
  if (
    typeof user_id !== "string" ||
    !(await caller.users.doesUserIdExist({ id: user_id }))
  ) {
    throw new Error("Invalid user_id");
  }
  res.status(501).send(undefined);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
