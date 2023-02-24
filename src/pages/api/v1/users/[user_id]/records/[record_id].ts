import { type NextApiHandler } from "next";
import { z } from "zod";
import { appRouter } from "../../../../../../server/api/root";
import { createTRPCContext } from "../../../../../../server/api/trpc";
import { dayts } from "../../../../../../utils/day";
import {
  diaryRecordToApiRecord,
  timezoneOffset,
  type ApiRecord,
} from "./index";

type HandlerOutput = ApiRecord | undefined;

const PutInputValidator = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  "time-spent": z.string().min(1),
  "programming-language": z.string().min(1),
  rating: z.number().min(0).max(5),
  description: z.string().min(1),
});

type PutInput = z.infer<typeof PutInputValidator>;

function putInputToDiaryRecord(record: PutInput) {
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
    id: record.id,
    date: day.toDate(),
    timeSpent: dura.toISOString(), // technically not necessary?
    programmingLanguage: record["programming-language"],
    rating: record.rating,
    description: record.description,
  };
}

const handler: NextApiHandler<HandlerOutput> = async (req, res) => {
  // params: { user_id: string, record_id: string }
  //* GET
  // return: { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // status: 200 (OK)
  // status: 404 (Not Found)
  //* PUT
  // body: { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // return: { id: string, date: string, time-spent: string, programming-language: string, rating: number, description: string }
  // status: 200 (OK)
  // status: 404 (Not Found)
  //* DELETE
  // status: 200 (OK)
  // status: 404 (Not Found)
  const { user_id, record_id } = req.query;
  const method = req.method;
  if (method !== "GET" && method !== "PUT" && method !== "DELETE") {
    res.status(405).setHeader("Allow", "GET, PUT, DELETE").send(undefined);
    return;
  }
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  try {
    // validate user and record
    if (
      typeof user_id !== "string" ||
      typeof record_id !== "string" ||
      !(
        await Promise.all([
          caller.users.doesUserIdExist({ id: user_id }),
          caller.records.doesRecordBelongToUser({
            userId: user_id,
            recordId: record_id,
          }),
        ])
      ).every((a) => a)
    ) {
      throw new Error("Invalid user_id or record_id");
    }
    if (method === "GET") {
      const record = await caller.records.getSingleRecord({ id: record_id });
      // record is never null
      if (record === null) throw new Error("Record not found");
      res.status(200).json(diaryRecordToApiRecord(record));
      return;
    }
    if (method === "DELETE") {
      const success = await caller.records.unsafe.deleteRecord({
        recordId: record_id,
        userId: user_id,
      });
      if (!success) throw new Error("Record not found"); // should be impossible
      res.status(200).send(undefined);
      return;
    }
    // PUT
    const validated = PutInputValidator.parse(req.body);
    const input = putInputToDiaryRecord(validated);
    const record = await caller.records.unsafe.updateRecord({
      id: record_id,
      record: input,
      userId: user_id,
    });
    res.status(200).json(diaryRecordToApiRecord(record));
    return;
  } catch (cause) {
    res.status(404).send(undefined);
    return;
  }
};
export default handler;
