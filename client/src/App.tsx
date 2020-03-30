import React, { useEffect, useState } from "react";
import daily from "./data/daily_prices.json";
import annual from "./data/annual_prices.json";
import monthly from "./data/monthly_prices.json";
import weekly from "./data/weekly_prices.json";
import * as d3 from "d3";
import "./App.css";
import { Card } from "antd";
import { Select } from "antd";

const { Option } = Select;

const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const horizontal = margin.left + margin.right;
const vertical = margin.top + margin.bottom;
const width = 1200 - horizontal;
const height = 600 - vertical;

const dataSet: { [key: string]: any[] } = {
  daily,
  annual,
  weekly,
  monthly
};

function App() {
  const [data, setData] = useState("daily");

  useEffect(() => {
    const svg = d3
      .select("#price-data")
      .append("svg")
      .attr("height", height + vertical)
      .attr("width", width + horizontal);

    const g = svg
      .append("g")
      .attr("height", height)
      .attr("width", width)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -25)
      .attr("transform", `rotate(-90)`)
      .attr("text-anchor", "middle")
      .attr("fill", "#008dff")
      .attr("font-size", 20)
      .text("Dollars Per Million Btu");

    g.append("g")
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#008dff")
      .attr("font-size", 20)
      .text("Year");

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(dataSet[data], d => d.Price) + 3]);
    const yAxisCall = d3.axisLeft(yScale).ticks(5);
    g.append("g").call(yAxisCall);

    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(dataSet[data], d => new Date(d.Date)) as Date[]);
    const xAxisCall = d3.axisBottom(xScale);
    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxisCall);

    const line = d3
      .line()
      .x((d: any) => xScale(d.Date))
      .y((d: any) => yScale(d.Price));

    g.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#008dff")
      .attr("stroke-width", 3)
      .attr("d", line(dataSet[data] as any) as any);

    return () => {
      d3.select("#price-data")
        .selectAll("svg")
        .remove();
    };
  }, [data]);

  return (
    <div className={"App"}>
      <Card
        title={`${data} Historical Prices`}
        extra={
          <Select
            defaultValue="daily"
            style={{ width: 120 }}
            onChange={value => setData(value)}
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="annual">Annual</Option>
          </Select>
        }
      >
        <div id="price-data" />
        <Card.Meta description={"Henry Hub Natural Gas Spot Price"} style={{marginLeft: margin.left}}/>
      </Card>
    </div>
  );
}

export default App;
