import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const instructionMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer in python language. Use code comments for explanations",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new NextResponse("Hugging Face API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro=await checkSubscription();
    
    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired", {status:403});
    }

    const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/codegen-350M-mono", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          ...messages.map(msg => msg.content),
          instructionMessage.content
        ].join("\n"),
        options: {
          use_cache: false,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Log the raw response text
      console.error("Error Response Text:", errorText); // Log it for debugging
      const errorData = await response.json();
      console.error("Error details:", errorData);
      return new NextResponse(`Hugging Face API error: ${errorData.error}`, { status: response.status });
    }
    const data = await response.json();
    console.log(data);
    
    // Assuming the model returns the response in a standard format
    const generatedMessage = data[0]?.generated_text || "No response generated.";

    if(!isPro) await increaseApiLimit();

    return NextResponse.json({ content: generatedMessage });
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
