import { z } from "zod";

export const createResolveSchema = z.object({
  goal: z.string().min(1, { message: "Goal is required" }),
  theme: z.string().min(1, { message: "Theme is required" }),
  timeframeFrom: z.string().min(1, { message: "Initial Date is required" }),
  timeframeTo: z
    .string()
    .min(1, { message: "Expected Date to reach your goal is required" }),
  describe: z.string().min(1, { message: "Elaborate your Goal is required" }),
  nextSteps: z.array(z.string()).refine((data) => data.length >= 3, {
    message: "At least three steps are required",
  }),
  checkbox: z.array(z.string()).refine((data) => data.length >= 3, {
    message: "True Or False",
  }),
});

export const updateResolveSchema = createResolveSchema.extend({
  id: z.string().min(1),
});

export const deleteResolveSchema = z.object({
  id: z.string().min(1),
});

export type CreateResolveSchema = z.infer<typeof createResolveSchema>;
