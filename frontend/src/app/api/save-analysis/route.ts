import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { report, image } = body;

    if (!report || !image) {
      return NextResponse.json({ error: "Missing report or image" }, { status: 400 });
    }

    // 1. Ensure user exists in our DB
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      // Create user if not exists (in a real app, this might be handled via Clerk Webhooks)
      // Since we don't have their email easily here without calling clerk client, we use a placeholder or skip if schema allows.
      // Wait, schema requires email. We can fetch from clerk or just use a dummy for now.
      // Actually, let's just use userId@placeholder.com if it's the first time.
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@placeholder.com`,
          role: "USER"
        }
      });
    }

    // 2. Ensure they have a project
    let project = await prisma.project.findFirst({
      where: { userId: userId }
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: "My App",
          userId: userId
        }
      });
    }

    // 3. Create the Analysis
    const analysis = await prisma.analysis.create({
      data: {
        projectId: project.id,
        status: "COMPLETED",
        screenshotUrl: image, // saving base64 here
        overallScore: report.overall_score,
        accessibilityScore: report.accessibility_score,
        visualClarityScore: report.visual_clarity_score,
        conversionScore: report.conversion_score,
      }
    });

    // 4. Create Recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      await prisma.recommendation.createMany({
        data: report.recommendations.map((rec: any) => ({
          analysisId: analysis.id,
          severity: rec.severity,
          impact: rec.impact,
          category: rec.category,
          description: rec.description,
          suggestedFix: rec.suggested_fix,
          markerX: rec.coordinates ? rec.coordinates[0] : null,
          markerY: rec.coordinates ? rec.coordinates[1] : null,
        }))
      });
    }

    // 5. Create Report Summary
    await prisma.report.create({
      data: {
        analysisId: analysis.id,
        strengths: report.strengths || [],
        weaknesses: report.weaknesses || []
      }
    });

    return NextResponse.json({ success: true, analysisId: analysis.id });
  } catch (error) {
    console.error("Save analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
