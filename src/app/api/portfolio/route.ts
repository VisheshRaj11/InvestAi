export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  
  const [holdings, user] = await Promise.all([
    prisma.holding.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { walletBalance: true } })
  ]);

  return NextResponse.json({ holdings, walletBalance: user?.walletBalance || 0 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { ticker, companyName, shares, price, action } = await req.json(); // action: "buy" | "sell"

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const totalCost = shares * price;

  if (action === "buy") {
    if (user.walletBalance < totalCost) return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });

    const existingHolding = await prisma.holding.findFirst({ where: { userId, ticker } });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: totalCost } },
      });

      if (existingHolding) {
        const newShares = existingHolding.shares + shares;
        const newAvg = ((existingHolding.shares * existingHolding.avgBuyPrice) + totalCost) / newShares;
        await tx.holding.update({
          where: { id: existingHolding.id },
          data: { shares: newShares, avgBuyPrice: newAvg },
        });
      } else {
        await tx.holding.create({
          data: { userId, ticker, companyName, shares, avgBuyPrice: price },
        });
      }
    });
    return NextResponse.json({ success: true });
  } 
  
  if (action === "sell") {
    const existingHolding = await prisma.holding.findFirst({ where: { userId, ticker } });
    if (!existingHolding || existingHolding.shares < shares) {
      return NextResponse.json({ error: "Insufficient shares to sell" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: totalCost } },
      });

      if (existingHolding.shares === shares) {
        await tx.holding.delete({ where: { id: existingHolding.id } });
      } else {
        await tx.holding.update({
          where: { id: existingHolding.id },
          data: { shares: { decrement: shares } },
        });
      }
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}