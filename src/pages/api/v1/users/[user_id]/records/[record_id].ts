import { type NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  const { user_id, record_id } = req.query;
  const method = req.method;
};
export default handler;
