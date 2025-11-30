"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchMeta } from "../lib/api";

type Filters = {
  end_year?: string;
  topic?: string[];
  sector?: string[];
  region?: string[];
  pestle?: string[];
  source?: string[];
  swot?: string[];
  country?: string[];
  city?: string[];
  start_year?: string[];
  impact?: string[];
};

type Props = {
  onChange: (filters: Filters) => void;
};

export default function Filters({ onChange }: Props) {
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState<Filters>({});

  // Load filter options from backend on mount
  useEffect(() => {
    fetchMeta().then((data) => setOptions(data));
  }, []);

  // Propagate filter changes to parent
  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  // Handle multi-select toggles
  const toggleFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const list = (Array.isArray(prev[key]) ? (prev[key] as string[]) : []) as string[];
      const currentValues = new Set<string>(list);

      if (currentValues.has(value)) currentValues.delete(value);
      else currentValues.add(value);

      return { ...prev, [key]: Array.from(currentValues) };
    });
  };

  const clearAll = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (val) => val && (Array.isArray(val) ? val.length > 0 : true)
  );

  // Reusable component for multi-select chips
  const renderFilterSection = (key: keyof Filters, label: string) => {
    const availableOptions = options[key as string] || [];
    const selectedOptions = new Set<string>(Array.isArray(filters[key]) ? (filters[key] as string[]) : []);
    
    // Limit shown options to 20 to keep UI clean
    const displayOptions = availableOptions.slice(0, 20);

    if (displayOptions.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-sm font-semibold text-gray-700">{label}</div>
        <div className="flex flex-wrap gap-2">
          {displayOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleFilter(key, option)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                selectedOptions.has(option)
                  ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:shadow-sm"
              }`}
            >
              {option.length > 20 ? option.substring(0, 18) + "..." : option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const endYearOptions = useMemo(() => (options["end_year"] || []).filter(Boolean), [options]);

  return (
    <div className="flex flex-col gap-4">
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
        >
          Clear All Filters
        </button>
      )}

      {endYearOptions.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-sm font-semibold text-gray-700">End Year</div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            value={filters.end_year || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, end_year: e.target.value || undefined }))}
          >
            <option value="">All Years</option>
            {endYearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {renderFilterSection("topic", "Topics")}
      {renderFilterSection("sector", "Sector")}
      {renderFilterSection("region", "Region")}
      {renderFilterSection("pestle", "PEST")}
      {renderFilterSection("source", "Source")}
      {renderFilterSection("swot", "SWOT")}
      {renderFilterSection("country", "Country")}
      {renderFilterSection("city", "City")}
      {renderFilterSection("start_year", "Start Year")}
      {renderFilterSection("impact", "Impact")}
    </div>
  );
}
