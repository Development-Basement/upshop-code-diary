import { type NextApiHandler } from "next";
import { appRouter } from "../../../../../../server/api/root";
import { createTRPCContext } from "../../../../../../server/api/trpc";

/**
 * ISO 8601 duration
 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
 * @see https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times
 */
type Duration = string;

type ApiRecordType = {
  id: string;
  date: string;
  "time-spent": Duration;
  "programming-language": string;
  rating: number;
  description: string;
};

type PostInput = Omit<ApiRecordType, "id">;

type HandlerOutput = Array<ApiRecordType> | ApiRecordType;

const handler: NextApiHandler<HandlerOutput> = async (req, res) => {
  //* Get:
  // params: { user_id: string }
  // return: [ { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string } ]
  // status: 200 (OK)
  // status: 404 (User user_id Not Found)
  //* Post:
  // params: { user_id: string }
  // body: { date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // return: { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // status: 201 (Created)
  // status: 404 (Not Found)

  const method = req.method;

  if (method !== "GET" && method !== "POST") {
    res.status(405).setHeader("Allow", "GET, POST");
    return;
  }

  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const { user_id } = req.query;
  try {
    // get and validate user
    if (
      typeof user_id !== "string" ||
      !(await caller.users.doesUserIdExist({ id: user_id }))
    ) {
      throw new Error("Invalid user_id");
    }

    if (method === "GET") {
      res.status(200);
      return;
    }
    // POST
    res.status(201);
    return;
  } catch (cause) {
    res.status(404);
    res.statusMessage =
      method === "GET"
        ? `User ${user_id?.toString() ?? "user_id"} Not Found`
        : "Not Found";
  }
};

export default handler;
