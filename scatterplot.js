// Set the margins and dimensions of the plot
var margin3 = { top: 50, right: 50, bottom: 50, left: 150 };
var width3 = 650 - margin3.left - margin3.right;
var height3 = 500 - margin3.top - margin3.bottom;
var xScale, yScale;

// Create the SVG element and set its dimensions
const svg3 = d3
  .select("#scatter-plot-chart")
  .append("svg")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// Load the data from the CSV file
d3.csv("2_scatterplot.csv")
  .then(function (data) {
    // Get the unique locations in the data
    var locations = [
      ...new Set(
        data.map(function (d) {
          return d.location;
        })
      ),
    ];

    // Add the locations to the dropdown menu
    d3.select("#location-dropdown")
      .selectAll("option")
      .data(locations)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      });

    // Create a function to update the scatter plot based on the selected location
    function updatePlot(selectedLocation) {
      // Filter the data to only include the relevant columns and selected location
  var filteredData = data
  .map(function (d) {
    return {
      location: d.location,
      stringency_index: +d.stringency_index,
      new_cases: +d.new_cases,
    };
  })
  .filter(function (d) {
    return (
      !isNaN(d.stringency_index) &&
      !isNaN(d.new_cases) &&
      d.location === selectedLocation
    );
  });

      // Create the scales for the x and y axes
      xScale = d3
        .scaleLinear()
        .domain(
          d3.extent(filteredData, function (d) {
            return d.stringency_index;
          })
        )
        .range([0, width3]);
      yScale = d3
        .scaleLinear()
        .domain(
          d3.extent(filteredData, function (d) {
            return d.new_cases;
          })
        )
        .range([height3, 0]);

      // Remove the old data points from the plot
      svg3.selectAll("circle").remove();

      // Add the data points to the plot
      svg3
        .selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .transition()
        .duration(2000)
        .attr("cx", function (d) {
          return xScale(d.stringency_index);
        })
        .attr("cy", function (d) {
          return yScale(d.new_cases);
        })
        .attr("r", 3)
        .attr("fill", "#6A51A3");

      // Update the x-axis and y-axis
      svg3.select(".x-axis").call(d3.axisBottom(xScale));
      svg3.select(".y-axis").call(d3.axisLeft(yScale));
    }

    // Add an event listener to the dropdown menu to update the scatter plot
    d3.select("#location-dropdown").on("change", function() {
        // Get the selected location
        selectedLocation = d3.select(this).property("value");
        // Call the updatePlot function with the selected location
        updatePlot(selectedLocation);
      });

    // Initialize the scatter plot with the first location in the dropdown menu
    updatePlot(locations[0]);

    // Add the x-axis
    svg3.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height3 + ")")
      .call(d3.axisBottom().scale(xScale));

    // Add the y-axis
    svg3.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft().scale(yScale));

       // Add the x axis label
    svg3
    .append("text")
    .attr("transform", `translate(225,440)`)
    .style("text-anchor", "middle")
    .text("stringency_index ");

  // Add the y axis label
  svg3
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -90)
    .attr("x",-220)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("New Cases");

    svg3
    .append("text")
    .attr("x", 235)
    .attr("y", -18)
    .attr("text-anchor", "middle")
    .text("how country manage the outbreak based on government response");
  })
  .catch(function (error) {
    console.log(error);
  });
