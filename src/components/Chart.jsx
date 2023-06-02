import PropTypes from "prop-types";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

function Chart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    console.log(data);
    const padding = { top: 40, right: 20, bottom: 20, left: 40 };
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.6;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3
      .select("#chart-container")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("width", "auto")
      .style("height", "auto")
      .style("background-color", "rgba(0,0,0,0.9)")
      .style("color", "white")
      .style("padding", "1.25rem 1rem")
      .style("pointer-events", "none")
      .style("border-radius", "6px")
      .style("font-size", "0.75rem");

    const x = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year - 1),
        d3.max(data, (d) => d.Year + 1),
      ])
      .range([padding.left, width - padding.right]);

    const y = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => d.Seconds * 1000),
        d3.max(data, (d) => d.Seconds * 1000),
      ])
      .range([padding.bottom, height - padding.bottom]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

    const svg = d3.select(chartRef.current);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding.left}, 0)`)
      .call(yAxis);

    svg
      .selectAll("circle")
      .data(data)
      .join(
        (enter) => enter.append("circle"),
        (update) => update.attr("class", "dot"),
        (exit) => exit.remove()
      )
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
      .attr("id", (d, i) => i)
      .attr("cx", (d) => x(d.Year))
      .attr("cy", (d) => y(new Date(d.Seconds * 1000)))
      .attr("r", 5)
      .attr("fill", (d) => color(d.Doping !== ""))
      .on("mouseover", (e, d) => {
        const circle = document.getElementById(e.target.id);
        circle.style.opacity = 0.75;

        tooltip.transition().duration(200).style("visibility", "visible");
        tooltip
          .html(
            `
            <p><b>${d.Name} | ${d.Nationality}</b></p>
            <p>Year: ${d.Year}</p>
            <p>Time: ${d.Time}</p>
            ${d.Doping ? `<br><p>${d.Doping}</p>` : ""}
                
          `
          )
          .attr("data-year", d.Year)
          .style("left", e.clientX - 60 + "px")
          .style("top", e.clientY - 160 + "px");
      })
      .on("mouseout", (e) => {
        const circle = document.getElementById(e.target.id);
        circle.style.opacity = 1;

        tooltip.transition().duration(200).style("visibility", "hidden");
      });

    const legends = svg.append("g").attr("id", "legend");

    const legend = legends
      .selectAll("#legend")
      .data(color.domain())
      .join(
        (enter) => enter.append("g"),
        (update) => update.attr("class", "legend-label"),
        (exit) => exit.remove()
      )
      .attr("transform", (d, i) => `translate(0, ${height / 2 - i * 30})`);

    legend
      .append("rect")
      .attr("x", width - padding.right)
      .attr("width", "1rem")
      .attr("height", "1rem")
      .style("fill", color);

    legend
      .append("text")
      .attr("x", width - (padding.right + 8))
      .attr("y", 12)
      .attr("font-size", "0.75rem")
      .attr("text-anchor", "end")
      .text((d) =>
        d ? "Riders with doping allegations" : "No Doping Allegations"
      );
  }, [data]);

  return (
    <>
      <svg className="w-[75vw] h-[60vh]" ref={chartRef}></svg>
    </>
  );
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Chart;
