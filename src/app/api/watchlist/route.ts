export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(watchlist);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { ticker, companyName, action } = await req.json();

  if (action === "add") {
    try {
      const item = await prisma.watchlist.create({
        data: { userId, ticker, companyName },
      });
      return NextResponse.json(item);
    } catch (e) {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 400 });
    }
  } else if (action === "remove") {
    await prisma.watchlist.deleteMany({
      where: { userId, ticker },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}