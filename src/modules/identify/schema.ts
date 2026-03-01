import { z } from "zod";

export const identifySchema = z
  .object({
    email: z.string().email().optional().nullable(),
    phoneNumber: z.string().min(1).optional().nullable(),
  })
  .refine(
    (data) => data.email || data.phoneNumber,
    { message: "At least one of email or phoneNumber must be provided" }
  );

export type IdentifyInput = z.infer<typeof identifySchema>;