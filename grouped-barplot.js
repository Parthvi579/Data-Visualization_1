// set the dimensions and margins of the graph
const margin6 = {top: 50, right: 50, bottom: 50, left: 150};
   const width6 = 700 - margin6.left - margin6.right;
   const height6 = 500 - margin6.top - margin6.bottom;

      // The svg
      const svg6 = d3.select("#grouped-barchart")
      .append("svg")
      .attr("width", width6 + margin6.left + margin6.right + 100)
      .attr("height", height6 + margin6.top + margin6.bottom +50 )
    .append("g")
      .attr("transform",`translate(${margin6.left},${margin6.top})`);

      function updatelinechart(loc){
    
      // Parse the Data
      d3.csv("4_Groupedbarchart.csv").then((data) => {

          const dataUS = data.filter((d) => d.location=== loc);
          console.log(dataUS);
        
      
        // Define the columns to use in the chart
        const columns = [
          "new_vaccinations_smoothed",
          "new_cases_smoothed",
          "total_boosters",
        ];
      
        // Set the x-axis scale and axis
        const xScale = d3
          .scaleBand()
          .domain(dataUS.map((d) => d.quarter))
          .range([0, width6])
          .paddingInner(0.1)
          .paddingOuter(0.5);
        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
      
        // Set the y-axis scale and axis
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(dataUS, (d) => d3.max(columns, (c) => +d[c]))])
          .range([height6, 0])
          .nice();
        const yAxis = d3.axisLeft(yScale);
      
        // Create the bars for each data category
        const bars = svg6
          .selectAll("g")
          .data(dataUS)
          .join("g")
          .attr("transform", (d) => `translate(${xScale(d.quarter)},0)`);
        bars
          .append("rect")
          .attr("x", 0)
          .attr("y", (d) => yScale(+d.new_vaccinations_smoothed))
          .attr("height", (d) => yScale(0) - yScale(+d.new_vaccinations_smoothed))
          .attr("width", xScale.bandwidth() / 3)
          .attr("fill", "#6A51A3")
          .attr("opacity", 0.8)
        bars
          .append("rect")
          .attr("x", xScale.bandwidth() / 3)
          .attr("y", (d) => yScale(+d.new_cases_smoothed))
          .attr("height", (d) => yScale(0) - yScale(+d.new_cases_smoothed))
          .attr("width", xScale.bandwidth() / 3)
          .attr("fill", "red")
          .attr("opacity", 0.8);
        bars
          .append("rect")
          .attr("x", (xScale.bandwidth() * 2) / 3)
          .attr("y", (d) => yScale(+d.total_boosters))
          .attr("height", (d) => yScale(0) - yScale(+d.total_boosters))
          .attr("width", xScale.bandwidth() / 3)
          .attr("fill", "green")
          .attr("opacity", 0.8);
      
        // Add the x-axis to the chart
        svg6
          .append("g")
          .attr("class", "axis-x")
          .attr("transform", `translate(0,${height6})`)
          .call(xAxis);
      
        // Add the y-axis to the chart
        svg6.append("g").attr("class", "axis-y").call(yAxis);
 
  // Add a legend to the chart
  const legend = svg6
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width6 - 100}, 10)`);

    // legend
    // .append("text")
    // .attr("x", 25)
    // .attr("y", 5)
    // .text(dataUS,d=>d.location);

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#6A51A3");
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 14)
    .text("New Vaccinations");
  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 30)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "red");
  legend.append("text").attr("x", 25).attr("y", 44).text("New Cases");
  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 60)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "green");
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 74)
    .text("Total Boosters");

  // Add a label for the x-axis
  svg6
    .append("text")
    .attr("x", width6 / 2)
    .attr("y", height6 + margin6.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Quarter");

  // Add a label for the y-axis
  svg6
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height6 / 2)
    .attr("y", 50 - margin6.left)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Number of Vaccinations, Cases, and Boosters");

    svg6
    .append("text")
    .attr("x", 235)
    .attr("y", -18)
    .attr("text-anchor", "middle")
    .text("Effect of vaccinations on the spread of cases Specially Booster Dose ");
      
})

}  
updatelinechart("United Kingdom");  