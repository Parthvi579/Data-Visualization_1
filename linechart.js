// Set the dimensions and margins of the graph
const margin = { top: 100, right: 30, bottom: 50, left: 100 };
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Select the SVG element
const svg = d3
  .select("#line-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Define a variable to keep track of the current location
let currentLocation;

  function updatelinechart(loc){


// If the location has not changed, do nothing
if (loc === currentLocation) {
  return;
}
// Set the current location to the new location
currentLocation = loc;

// Load the data from the CSV file
d3.csv("1_linechart.csv")
  .then((data) => {
    // Filter the data for the specific countries
    const filteredData = data.filter((d) => {
      return d.location === loc;
    });

    // Format the data and group it by location
    const groupedData = d3.group(filteredData, (d) => d.location);
    const formattedData = Array.from(groupedData, ([key, value]) => {
      return {
        location: key,
        values: value.map((d) => ({
          date: new Date(d.date),
          cases: +d.total_cases,
        })),
      };
    });

    // Set the x and y scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(formattedData, (d) => d3.max(d.values, (v) => v.cases)),
      ])
      .range([height, 0]);

    // Set the line generator
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.cases));

    // Add a tooltip to the chart
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

       // Select the lines and update the data
       const lines = svg.selectAll(".line").data(formattedData);

       // Remove any lines that are no longer needed
       lines.exit().remove();
 
       // Add new lines for any new data
       const newLines = lines.enter().append("path");

    // Merge the new lines with the existing lines and update their attributes
      lines
        .merge(newLines)
        .attr("class", "line")
        .attr("d", (d) => line(d.values))
        .style("stroke", "red")
        .style("fill", "none")
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          const totalCases = d3.sum(d.values, (v) => v.cases);
          tooltip
            .html(
              `<strong>${
                d.location
              }</strong><br>Total Cases: ${totalCases.toLocaleString()}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);     
        
        const totalCases = d3.sum(d.values, (v) => v.cases);
        tooltip
          .html(
            `<strong>${
              d.location
            }</strong><br>Total Cases: ${totalCases.toLocaleString()}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });
    
      svg.selectAll(".x-axis").remove();
      svg.selectAll(".y-axis").remove();

    // Add the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g").attr("class", "y-axis").call(yAxis);

    // Add a title to the chart
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .text("COVID-19 pandemic grow over the countries");

      svg.selectAll(".lehgend").remove();
      svg.selectAll(".legend-label").remove();

    // Add a legend to the chart
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 450}, 0)`);

    legend
      .selectAll(".legend")
      .data(formattedData)
      .enter()
      .append("line") // Replace rect with line
      .attr("class", "legend")
      .attr("x1", 0) // Set starting x coordinate
      .attr("y1", (d, i) => i * 20 + 5) // Set starting y coordinate
      .attr("x2", 10) // Set ending x coordinate
      .attr("y2", (d, i) => i * 20 + 5) // Set ending y coordinate
      .style("stroke", "red")
      .style("stroke-width", 2); // Set line thickness

    legend
      .selectAll(".legend-label")
      .data(formattedData)
      .enter()
      .append("text")
      .attr("class", "legend-label")
      .attr("x", 15)
      .attr("y", (d, i) => i * 20 + 10)
      .text((d) => d.location);

    // Add the x axis label
    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top -60})`)
      .style("text-anchor", "middle")
      .text("Quarterly Data");

    // Add the y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Total Cases");
  })
  .catch((error) => {
    console.log(error);
  });
  
  }

  updatelinechart("United Kingdom");
