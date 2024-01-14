import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();

export const runtime = "edge";

const generateStepsContext = `
Your role is to generate a specific and actionable description of step to guide the user reach their resolution goal. For context, steps should look like this "Create a study schedule and stick to it consistently.",
"Take regular breaks during study sessions to maintain focus and prevent burnout.",
"Utilize active learning techniques such as summarizing information in your own words or teaching concepts to someone else." The individual's resolution is to *insert_goal_here* in the category/theme of *insert_theme_here*. They have set a timeframe to achieve this goal in *insert_days_here* days. The elaborate description of the goal is here: *insert_description_here*.
The steps the user is already being asked to follow in an array here: *insert_previousSteps_here*.
Make sure that the step you generate is not a repeat of any of the steps that were already provided.
Please limit your response to one sentence. Your response should be in the form of a valid JSON with only the question.
`;

export async function POST(request: Request) {
  const body = await request.json();
  const queryType = body.prompt.queryType;

  console.log("generating response :)", queryType);

  let context: any[] = [];

  if (queryType == "generateStep") {
    const goal = body.prompt.goal;
    const theme = body.prompt.theme;
    const timeframeFrom = new Date(body.prompt.timeframeFrom);
    const timeframeTo = new Date(body.prompt.timeframeTo);
    const describe = body.prompt.describe;
    const nextSteps = body.prompt.nextSteps;

    // Calculate the number of days
    const daysDifference: number = Math.floor(
      (timeframeTo.getTime() - timeframeFrom.getTime()) / (1000 * 60 * 60 * 24)
    );

    const systemContext = generateStepsContext
      .replace("*insert_description_here*", describe)
      .replace("*insert_goal_here*", goal)
      .replace("*insert_theme_here*", theme)
      .replace("*insert_days_here*", daysDifference.toString())
      .replace("*insert_previousSteps_here*", nextSteps);

    context.push({ role: "system", content: systemContext });
    console.log("response generated :)", systemContext);
  }

  const completion = await openai.chat.completions.create({
    messages: context,
    model: "gpt-3.5-turbo",
    stream: true,
  });

  const stream = OpenAIStream(completion);
  return new StreamingTextResponse(stream);
}
