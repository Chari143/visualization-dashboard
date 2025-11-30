import { Router } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

const router = Router();

const FILTER_KEYS = [
  "end_year",
  "topic",
  "sector",
  "region",
  "pestle",
  "source",
  "swot",
  "country",
  "city",
  "start_year",
  "impact"
] as const;


const buildWhereClause = (query: Record<string, any>): Prisma.RecordWhereInput => {
  const where: Prisma.RecordWhereInput = {};

  for (const key of FILTER_KEYS) {
    const raw = query[key];
    if (Array.isArray(raw)) {
      const cleaned = raw.map((v) => String(v).trim()).filter((v) => v !== "");
      if (cleaned.length > 0) (where as any)[key] = { in: cleaned };
    } else if (raw !== undefined && raw !== null) {
      const v = String(raw).trim();
      if (v !== "") (where as any)[key] = v;
    }
  }
  return where;
};

router.get("/meta", async (req, res) => {
  try {
    const result: Record<string, string[]> = {};

    await Promise.all(FILTER_KEYS.map(async (field) => {
      const scalarField = Prisma.RecordScalarFieldEnum[field as keyof typeof Prisma.RecordScalarFieldEnum];
      const values = await prisma.record.findMany({
        distinct: [scalarField],
        select: { [field]: true },
        where: ({ [field]: { not: null } } as Prisma.RecordWhereInput)
      });

      result[field] = values
        .map((v: any) => v[field])
        .filter((val: any) => val && String(val).trim() !== "")
        .sort();
    }));

    res.json(result);
  } catch (error) {
    console.error("Meta API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/records", async (req, res) => {
  try {
    const where = buildWhereClause(req.query);
    const limit = req.query.limit ? Number(req.query.limit) : 500;

    const records = await prisma.record.findMany({
      where,
      take: limit,
      orderBy: { year: 'desc' }
    });

    res.json({ records });
  } catch (error) {
    console.error("Records API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/summary/year", async (req, res) => {
  try {
    const where = buildWhereClause(req.query);
    where.year = { not: null };

    const aggregation = await prisma.record.groupBy({
      by: [Prisma.RecordScalarFieldEnum.year],
      where,
      _sum: { relevance: true },
      _count: { _all: true },
      orderBy: { year: 'asc' }
    });

    const data = aggregation.map((group) => ({
      year: group.year,
      relevance: group._sum.relevance || 0,
      count: group._count._all
    }));

    res.json({ data });
  } catch (error) {
    console.error("Year Summary API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
