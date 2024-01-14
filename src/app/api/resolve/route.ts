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

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updateResolveSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const {
      id,
      goal,
      theme,
      timeframeFrom,
      timeframeTo,
      describe,
      nextSteps,
      checkbox,
    } = parseResult.data;

    const assess = await prisma.resolve.findUnique({ where: { id } });

    if (!assess) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== assess.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const updatedTask = await tx.resolve.update({
        where: { id },
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

      return updatedTask;
    });

    return Response.json({ updatedTask }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteResolveSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const assess = await prisma.resolve.findUnique({ where: { id } });

    if (!assess) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== assess.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.resolve.delete({ where: { id } });
    });

    return Response.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
