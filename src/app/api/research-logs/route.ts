export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  
  const logs = await prisma.researchLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(logs);
}