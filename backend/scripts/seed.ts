import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const primaryPath = resolve(__dirname, '../data/jsondata.json');
const fallbackPath = resolve(__dirname, '../jsondata.json');
const dataFilePath = existsSync(primaryPath) ? primaryPath : fallbackPath;

async function seedDatabase() {
  console.log(`📖 Reading data from: ${dataFilePath}`);

  let jsonData;
  try {
    const fileContent = readFileSync(dataFilePath, 'utf-8');
    jsonData = JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Failed to read or parse data file: ${(error as Error).message}`);
    process.exit(1);
  }

  console.log(`✅ Found ${jsonData.length} records to import`);

  const recordsToInsert = jsonData.map((item: any) => {
    // Determine the 'year' field based on end_year, published, or added date
    let year: number | null = null;

    // 1. Try parsing end_year
    if (item.end_year && String(item.end_year).trim() !== "") {
      const parsedYear = parseInt(String(item.end_year));
      if (!isNaN(parsedYear)) {
        year = parsedYear;
      }
    }

    // 2. Fallback to published date
    if (year === null && item.published) {
      const publishedDate = new Date(item.published);
      if (!isNaN(publishedDate.getTime())) {
        year = publishedDate.getFullYear();
      }
    }

    // 3. Fallback to added date
    if (year === null && item.added) {
      const addedDate = new Date(item.added);
      if (!isNaN(addedDate.getTime())) {
        year = addedDate.getFullYear();
      }
    }

    // Helper to clean string values
    const cleanString = (value: any): string | null => {
      if (value === "" || value === undefined || value === null) {
        return null;
      }
      return String(value);
    };

    // Helper to clean numeric values
    const cleanNumber = (value: any): number | null => {
      if (value === "" || value === undefined || value === null) {
        return null;
      }
      return Number(value);
    };

    return {
      end_year: cleanString(item.end_year),
      intensity: cleanNumber(item.intensity),
      sector: cleanString(item.sector),
      topic: cleanString(item.topic),
      insight: cleanString(item.insight),
      url: cleanString(item.url),
      region: cleanString(item.region),
      start_year: cleanString(item.start_year),
      impact: cleanString(item.impact),
      added: cleanString(item.added),
      published: cleanString(item.published),
      country: cleanString(item.country),
      relevance: cleanNumber(item.relevance),
      pestle: cleanString(item.pestle),
      source: cleanString(item.source),
      title: cleanString(item.title),
      likelihood: cleanNumber(item.likelihood),
      swot: cleanString(item.swot),
      city: cleanString(item.city),
      year: year
    };
  });

  console.log('🗑️  Deleting existing records...');
  try {
    await prisma.record.deleteMany({});
  } catch (error) {
    console.log("No existing records to delete or error occurred:", error);
  }

  console.log('💾 Inserting new records into database...');
  try {
    const result = await prisma.record.createMany({
      data: recordsToInsert
    });
    console.log(`✨ Successfully inserted ${result.count} records!`);
  } catch (error) {
    console.error("Error inserting records:", error);
    throw error;
  }

  await prisma.$disconnect();
}

seedDatabase().catch(async (error) => {
  console.error('❌ Error seeding database:', error);
  await prisma.$disconnect();
  process.exit(1);
});
