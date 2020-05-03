// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// =================================
var svg = d3.select("#scatter")
  .append("svg")
  .classed("chart", true)
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(statesData) {
  // Step 4: Parse the data
  // Format the data and convert to numerical values
  // =================================

  // Format the data
  statesData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });

  // Step 5: Create Scales
  //=============================================
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(statesData, d => d.poverty))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(statesData, d => d.healthcare)])
    .range([height, 0]);

     // Step 6: Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// Step 7: Append the axes to the chartGroup - ADD STYLING
  // ==============================================
  // Add bottomAxis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // add left axis
  chartGroup.append("g")
    .call(leftAxis);

// Step 8:Append initial circles and text to data points
  // ==============================================
  var circlesGroup = chartGroup.selectAll("circle")
      .data(statesData)
      .enter()
      .append("circle")
      .attr("r","15")
      .attr("fill"," #F7DC6F")
      .attr("opacity", ".5")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare));

  var textGroup = chartGroup.selectAll("text")
    .exit()
    .data(statesData)
    .enter()
    .append("text") 
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", "8px")
    .attr('text-anchor', 'middle')
    .attr("fill", "black");

    // Step 9: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`Healthcare:${d.healthcare}<br>Poverty:${d.poverty}
    `);
  });

  // Step 10: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
  
  // Step 11: Create event listeners to display and hide the tooltip
  // ==============================
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
// Step 12: Create axes labels
  // ==============================
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Without Healtcare(%)");
  
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });