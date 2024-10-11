import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new NextResponse("Hugging Face API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    // Call Hugging Face API for image generation
    const response = await fetch("https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          use_cache: false,
        },
      }),
    });

    // const rawText = await response.text(); // Get the raw text response
    // console.log("Raw Response Text:", rawText);

    if (!response.ok) {
      const errorText = await response.text(); // Log the raw response text
      console.error("Error Response Text:", errorText); // Log it for debugging
      return new NextResponse(`Hugging Face API error: ${errorText}`, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer(); // Get the raw binary response as an ArrayBuffer
    const base64Image = Buffer.from(imageBuffer).toString("base64"); // Convert to Base64
    const dataUrl = `data:image/jpeg;base64,${base64Image}`; 

    if (!isPro) await increaseApiLimit();

    // Return generated images
    return NextResponse.json({image: dataUrl});
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
