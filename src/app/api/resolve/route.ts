import {
  createResolveSchema,
  updateResolveSchema,
  deleteResolveSchema,
} from "@/lib/validation/dashboard";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const result = createResolveSchema.safeParse(body);
    if (!result.success) {
      console.error(result.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const {
      goal,
      theme,
      timeframeFrom,
      timeframeTo,
      describe,
      nextSteps,
      checkbox,
    } = result.data;

    const { userId } = auth();
    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const assess = await prisma.resolve.create({
      data: {
        goal,
        theme,
        timeframeFrom,
        timeframeTo,
        describe,
        nextSteps,
        checkbox,
        userId,
      },
    });
    return Response.json({ assess }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
