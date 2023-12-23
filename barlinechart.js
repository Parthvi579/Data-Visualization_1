// Define chart dimensions
const margin4 = {top: 50, right:200, bottom: 50, left: 10};
const width4 = 650 - margin4.left - margin4.right;
const height4 = 500 - margin4.top - margin4.bottom;

// Create the SVG container
const svg4 = d3.select("#bar-line-chart").append("svg")
  .attr("width", width4 + margin4.left + margin4.right )
  .attr("height", height4 + margin4.top + margin4.bottom + margin4.top)
  .append("g")
  .attr("transform", "translate(" + 100 + "," + margin4.top + ")");

// Load the dataset
d3.csv("owid-covid-data.csv").then(data => {
  const countries = ["United States", "United Kingdom", "Brazil", "France", "Germany"];
  data = data.filter(d => countries.includes(d.location));

  // Group data by country, and select the maximum total_cases and gdp_per_capita values
  const groupedData = d3.rollup(data, v => ({
    total_cases: d3.max(v, d => +d.total_cases),
    gdp_per_capita: d3.max(v, d => +d.gdp_per_capita)
  }), d => d.location);

  // Convert the grouped data into an array of objects
  const countryData = Array.from(groupedData, ([location, value]) => ({location, ...value}));

  // Define the scales
  const x = d3.scaleBand().rangeRound([0, width4]).padding(0.1).domain(countryData.map(d => d.location));
  const y = d3.scaleLinear().range([height4, 0]).domain([0, d3.max(countryData, d => d.total_cases)]);
  const y2 = d3.scaleLinear().range([height4, 0]).domain([0, d3.max(countryData, d => d.gdp_per_capita)]);

  // Draw the bars
  svg4.selectAll(".bar")
    .data(countryData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.location))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.total_cases))
    .attr("height", d => height4 - y(d.total_cases));

  // Draw the line
  const line = d3.line()
    .x(d => x(d.location) + x.bandwidth() / 2)
    .y(d=> y2(d.gdp_per_capita));

    svg4.append("path")
.datum(countryData)
.attr("class", "line")
.attr("d", line);

// Define the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);
const yAxis2 = d3.axisRight(y2);

// Draw the axes
svg4.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + height4 + ")")
.call(xAxis);

svg4.append("g")
.attr("class", "axis")
.call(yAxis);

svg4.append("g")
.attr("class", "axis")
.attr("transform", "translate(" + width4 + ",0)")
.call(yAxis2);

// Add axis labels
svg4.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -150)
.attr("y", -20)
.attr("dy", "-3.5em")
.attr("text-anchor", "end")
.text("Total Cases");

svg4.append("text")
.attr("transform", "rotate(90)")
.attr("x", 250)
.attr("y", -435)
.attr("dy", "-3.5em")
.attr("text-anchor", "end")
.text("GDP per Capita");

svg4.append("text")
.attr("x", 250)
.attr("y", 450)
.attr("dy", "-0.5em")
.attr("text-anchor", "middle")
.text("Countries");

// Create the legend
const legend = svg4.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("text-anchor", "end")
  .attr("x", 240)
  .attr("y", -840)
  .selectAll("g")
  .data(["Total Cases", "GDP per Capita"])
  .enter().append("g")
  .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

// Add colored rectangles for the legend
legend.append("rect")
  .attr("x", 10)
  .attr("width", 19)
  .attr("height", 19)
  .attr("fill", (d, i) => i === 0 ? "#9e9ac8" : "red");

// Add the legend text
legend.append("text")
  .attr("x", 105)
  .attr("y", 9.5)
  .attr("dy", "0.32em")
  .text(d => d);

  svg4
  .append("text")
  .attr("x", width4 / 2 -25)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .text("Relationship Between GDP per Capita and COVID-19 Spread in Selected Countries");

}).catch(error => {
console.error("Error loading the dataset:", error);
});