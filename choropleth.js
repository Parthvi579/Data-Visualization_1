const width5 = 600;
const height5 = 500;
var SelectedCountry;


const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "maptooltip")
  .style("opacity", 0);

// Create the SVG container
const svg5 = d3.select("#choropleth-map").append("svg")
  .attr("width", width5)
  .attr("height", height5);

// Map and projection
const path = d3.geoPath();
const projection = d3
  .geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([width5 / 2, height5 / 2]);

// Data and color scale
const data = new Map();
const relatedData = new Map();
const colorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemePurples[7]);

// Load external data and boot
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv(
    //   "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
    "5_choroplethmap.csv",
    function (d) {
      data.set(d.code, +d.total_cases);
      let tot_c = +d.total_cases;
      let tot_d = +d.total_deaths;
      let tot_v = +d.total_vaccinations;
      let loc = d.location;
      let people_v= +d.people_vaccinated;
      relatedData.set(d.code, [tot_c, tot_d, tot_v, loc, people_v]);
    }
  ),
]).then(function (loadData) {
  let topo = loadData[0];

  let mouseOver = function (event, d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");

    let country_data = relatedData.get(this.__data__.id);
    if (country_data != undefined) {
      tooltip.transition().duration(1000).style("opacity", 0.9);
      tooltip.html(
        country_data[3] +
          "<br>TotalCases: " +
          (country_data[0] || 0) +
          // "<br>TotalDeaths: " +
          // (country_data[1] || 0) +
          "<br>TotalVaccines: " +
          (country_data[2] || 0)
      );
      tooltip.style("left", event.pageX + 10 + "px");
      tooltip.style("top", event.pageY - 10 + "px");
    }
  };

  let mouseClick = function (event,d){
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");

    let country_data = relatedData.get(this.__data__.id);
    if (country_data != undefined) {
      clicked_countryname(country_data[3]);
      
  }
};
  let mouseLeave = function (d) {
    tooltip.transition().duration(1000).style("opacity", 0);
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.8);
    d3.select(this).transition().duration(200).style("stroke", "transparent");
    SelectedCountry=null;
  };

  // Draw the map
  svg5
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Country";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("click",mouseClick)
    .on("mouseleave", mouseLeave);

    let circleMouseOver = function (event, d) {
      let country_data = relatedData.get(d.id);
      if (country_data != undefined) {
        tooltip.transition().duration(1000).style("opacity", 0.9);
        tooltip.html(
          country_data[3] + "<br>Total Death: " + (country_data[1] || 0)
        );
  
        tooltip.style("left", event.pageX + 10 + "px");
        tooltip.style("top", event.pageY - 10 + "px");
      }
    };
  
    let circleMouseLeave = function (d) {
      tooltip.transition().duration(1000).style("opacity", 0);
    };
  
    const circleSizeScale = d3
      .scaleSqrt()
      .domain([0, 1500000000]) // Adjust the domain based on the min and max population values
      .range([0, 5]); // Adjust the range based on the desired min and max circle sizes
  
    // Add circles for population
    svg5
      .append("g")
      .selectAll("circle")
      .data(topo.features)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return projection(d3.geoCentroid(d))[0];
      })
      .attr("cy", function (d) {
        return projection(d3.geoCentroid(d))[1];
      })
      .attr("r", function (d) {
        let country_data = relatedData.get(d.id);
        return country_data ? circleSizeScale(country_data[2  ]) : 0;
      })
      .style("fill", "#e74c3c") // Change the fill color
      .style("opacity", 0.6)
      .attr("stroke", "#ffffff") // Add a stroke for better visibility
      .attr("stroke-width", 0.5)
      .on("mouseover", circleMouseOver) // Bind the circleMouseOver function
      .on("mouseleave", circleMouseLeave); // Bind the circleMouseLeave function
  
      const legend = svg5
    .append("g")
    .attr("transform", "translate(" + (width5 - 150) + "," + (height5 - 50) + ")");
  
    legend
    .append("circle")
    .attr("cx", -320)
    .attr("cy", -420)
    .attr("r", 8)
    .style("fill", "#e74c3c");
  
    legend
    .append("text")
    .attr("x", -305)
    .attr("y", -420)
    .text("Total Death")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

    svg5
  .append("text")
  .attr("x", 330)
  .attr("y", 380)
  .attr("text-anchor", "middle")
  .text(" geographical position of a country change how the pandemic impacted them");
});
