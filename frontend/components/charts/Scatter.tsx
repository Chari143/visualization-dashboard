"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Datum = {
  intensity?: number;
  likelihood?: number;
  relevance?: number;
  region?: string;
  country?: string;
  city?: string;
  topic?: string;
};

type Props = {
  data: Datum[];
};
export default function Scatter({ data }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 360;
    const margin = { top: 20, right: 150, bottom: 40, left: 40 };

    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const validData = data.filter((d) => d.intensity !== undefined && d.likelihood !== undefined);

    if (validData.length === 0) return;

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(validData, (d) => d.intensity || 0) || 10])
      .nice()
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(validData, (d) => d.likelihood || 0) || 10])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(validData, (d) => d.relevance || 0) || 10])
      .range([3, 12]); 

    const uniqueRegions = Array.from(new Set(validData.map((d) => d.region || "Unknown"))).filter(Boolean);
    const colorScale = d3.scaleOrdinal(uniqueRegions, d3.schemeTableau10);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", 35)
        .attr("fill", "#4b5563")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text("Intensity →"));

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 15)
        .attr("fill", "#4b5563")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("↑ Likelihood"));

    svg.selectAll("circle.dot")
      .data(validData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.intensity || 0))
      .attr("cy", (d) => yScale(d.likelihood || 0))
      .attr("r", (d) => radiusScale(d.relevance || 0))
      .attr("fill", (d) => colorScale(d.region || "Unknown"))
      .attr("opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .append("title")
       .text((d) => 
        `Region: ${d.region}\nCountry: ${d.country || ""}\nCity: ${d.city || ""}\nTopic: ${d.topic || ""}\nIntensity: ${d.intensity}\nLikelihood: ${d.likelihood}\nRelevance: ${d.relevance}`
       );

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    uniqueRegions.slice(0, 12).forEach((region, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      
      row.append("circle")
        .attr("r", 5)
        .attr("fill", colorScale(region));
      
      row.append("text")
        .attr("x", 12)
        .attr("y", 5)
        .style("font-size", "11px")
        .style("font-family", "sans-serif")
        .style("fill", "#374151")
        .text(region.length > 15 ? region.substring(0, 15) + "..." : region);
    });

  }, [data]);

  return (
    <div className="w-full h-full">
      <svg 
        ref={svgRef} 
        className="w-full h-auto bg-white rounded-lg"
        style={{ maxHeight: '400px' }}
      />
    </div>
  );
}
