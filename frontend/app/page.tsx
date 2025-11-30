"use client";
import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import Scatter from "../components/charts/Scatter";
import Bar from "../components/charts/Bar";
import { fetchRecords, fetchYearSummary } from "../lib/api";

type RecordItem = {
  intensity?: number;
  likelihood?: number;
  relevance?: number;
  region?: string;
  country?: string;
  city?: string;
  topic?: string;
};
type YearSummary = { year: number; relevance: number; count: number };

export default function Home() {
  const [filters, setFilters] = useState<Record<string, string | string[] | undefined>>({});
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [yearSummary, setYearSummary] = useState<YearSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recordsRes, summaryRes] = await Promise.all([
          fetchRecords({ ...filters, limit: 1000 }),
          fetchYearSummary(filters)
        ]);
        setRecords((recordsRes.records || []) as RecordItem[]);
        setYearSummary((summaryRes.data || []) as YearSummary[]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);



  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Visualization Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <Filters onChange={setFilters} />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-lg font-semibold text-gray-900 mb-1">Intensity vs Likelihood</div>
              <div className="text-sm text-gray-600 mb-4">Bubble size represents relevance, color indicates region</div>
              {loading ? (
                <div className="h-[360px] flex items-center justify-center text-gray-500 animate-pulse">
                  Loading Chart...
                </div>
              ) : (
                <Scatter
                  data={records.map((r) => ({
                    intensity: r.intensity,
                    likelihood: r.likelihood,
                    relevance: r.relevance,
                    region: r.region,
                    country: r.country,
                    city: r.city,
                    topic: r.topic,
                  }))}
                />
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-lg font-semibold text-gray-900 mb-1">Relevance by Year</div>
              <div className="text-sm text-gray-600 mb-4">Total relevance score aggregated by year</div>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500 animate-pulse">
                  Loading Chart...
                </div>
              ) : (
                <Bar data={yearSummary} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
