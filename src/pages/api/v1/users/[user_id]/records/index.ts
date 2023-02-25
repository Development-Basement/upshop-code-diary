import { type NextApiHandler } from "next";
import { z } from "zod";
import { appRouter } from "../../../../../../server/api/root";
import { type DiaryRecord } from "../../../../../../server/api/routers/records";
import { createTRPCContext } from "../../../../../../server/api/trpc";
import { dayts } from "../../../../../../utils/day";

/**
 * ISO 8601 duration
 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
 * @see https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times
 */
type Duration = string;

export type ApiRecord = {
  id: string;
  date: string;
  "time-spent": Duration;
  "programming-language": string;
  rating: number;
  description: string;
};

type PostInput = Omit<ApiRecord, "id">; // or z.infer<typeof PostInputValidator>

type HandlerOutput = Array<ApiRecord> | ApiRecord | undefined;

// very basic type validation
const PostInputValidator = z.object({
  date: z.string().min(1),
  "time-spent": z.string().min(1),
  "programming-language": z.string().min(1).max(30),
  rating: z.number().min(0).max(5),
  description: z.string().min(1),
});

export const timezoneOffset = new Date().getTimezoneOffset();

export function diaryRecordToApiRecord(record: DiaryRecord) {
  return {
    id: record.id,
    date: dayts(record.date)
      .add(timezoneOffset, "minutes")
      .format("YYYY-MM-DD"),
    "time-spent": record.timeSpent,
    "programming-language": record.programmingLanguage,
    rating: record.rating,
    description: record.description,
  };
}

function postInputToDiaryRecord(record: PostInput) {
  const dura = dayts.duration(record["time-spent"]);
  if (Number.isNaN(dura.asMilliseconds()) || dura.asMilliseconds() <= 0) {
    throw new Error("Invalid time-spent");
  }
  let day = dayts(record.date, "YYYY-MM-DD", true);
  if (!day.isValid()) {
    throw new Error("Invalid date");
  }
  // javascript offsets Dates by the timezone offset,
  // so we need to "add" it back in, otherwise it will get saved wrong
  day = day.subtract(timezoneOffset, "minutes");
  return {
    date: day.toDate(),
    timeSpent: dura.toISOString(), // technically not necessary?
    programmingLanguage: record["programming-language"],
    rating: record.rating,
    description: record.description,
  };
}

const handler: NextApiHandler<HandlerOutput> = async (req, res) => {
  // params: { user_id: string }
  //* Get:
  // return: [ { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string } ]
  // status: 200 (OK)
  // status: 404 (User user_id Not Found)
  //* Post:
  // body: { date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // return: { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // status: 201 (Created)
  // status: 404 (Not Found)
  const { user_id } = req.query;
  const method = req.method;
  if (method !== "GET" && method !== "POST") {
    res.status(405).setHeader("Allow", "GET, POST").send(undefined);
    return;
  }
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  try {
    // validate user
    if (
      typeof user_id !== "string" ||
      !(await caller.users.doesUserIdExist({ id: user_id }))
    ) {
      throw new Error("Invalid user_id");
    }
    if (method === "GET") {
      const records = await caller.records.listRecordsFromUser({
        userId: user_id,
      });
      res
        .status(200)
        .json(records.map((record) => diaryRecordToApiRecord(record)));
      return;
    }
    // POST
    const validated = PostInputValidator.parse(req.body);
    const input = postInputToDiaryRecord(validated);
    const record = await caller.records.unsafe.createRecord({
      userId: user_id,
      record: input,
    });
    res.status(201).json(diaryRecordToApiRecord(record));
    return;
  } catch (cause) {
    res.statusMessage =
      method === "GET"
        ? `User ${user_id?.toString() ?? "user_id"} Not Found`
        : "Not Found";
    res.status(404).send(undefined);
    return;
  }
};

export default handler;
