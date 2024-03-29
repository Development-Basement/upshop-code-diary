import { z } from "zod";

export const trimString = (str: unknown) =>
  typeof str === "string" ? str.trim() : str;

export const DiaryRecordParser = z.object({
  id: z.string().min(1),
  date: z.date(),
  timeSpent: z
    .string()
    .min(1)
    .refine((val) => val !== "P0D"), // ISO 8601 duration, cannot be equal to 0 (P0D)...
  programmingLanguage: z.preprocess(trimString, z.string().min(1).max(30)),
  rating: z.number().min(0).max(5),
  description: z.preprocess(trimString, z.string().min(1)),
});
