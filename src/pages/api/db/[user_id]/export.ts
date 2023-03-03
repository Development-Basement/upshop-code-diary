import { type NextApiHandler } from "next";
import { appRouter } from "../../../../server/api/root";
import { createTRPCContext } from "../../../../server/api/trpc";
import { dayts } from "../../../../utils/day";

function escape(str: string) {
  // eslint-disable-next-line quotes
  return str.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/,/g, "\\,");
}

const handler: NextApiHandler = async (req, res) => {
  const date = dayts();
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  const { user_id } = req.query;
  if (
    typeof user_id !== "string" ||
    !(await caller.users.doesUserIdExist({ id: user_id }))
  ) {
    throw new Error("Invalid user_id");
  }
  const records = await caller.records.unsafe.listRecordsFromUser({
    userId: user_id,
  });
  let lines = "id,date,time-spent,language,rating,description\n";
  for (const record of records) {
    const { id, date, timeSpent, programmingLanguage, rating, description } =
      record;
    lines += `${id},${dayts(date).format("DD-MM-YYYY")},${timeSpent},${escape(
      programmingLanguage,
    )},${rating},"${escape(description)}"\n`;
  }
  const blob = new Blob([lines], { type: "text/csv" });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${user_id}-${date.format("YYYY-MM-DD")}.csv`,
  );
  res.send(Buffer.from(await blob.arrayBuffer()));
};

export default handler;
