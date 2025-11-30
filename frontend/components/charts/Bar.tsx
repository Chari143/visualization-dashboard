"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Datum = { year: number; relevance: number; count: number };
type Props = { data: Datum[] };
export default function Bar({ data }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const xScale = d3.scaleBand()
      .domain(data.map((d) => String(d.year)))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.relevance) || 10])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", "#4b5563");

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .style("color", "#4b5563");

    const bars = svg.selectAll<SVGRectElement, Datum>("rect.bar").data(data, (d) => String(d.year));

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(String(d.year))!)
      .attr("y", (d) => yScale(d.relevance))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.relevance))
      .attr("fill", "#8b5cf6")
      .attr("rx", 4)
      .append("title")
      .text((d) => `Year: ${d.year}\nTotal Relevance: ${d.relevance}\nRecord Count: ${d.count}`);

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
