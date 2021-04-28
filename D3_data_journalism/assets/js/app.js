// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 15
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group
var displayGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);

// Scales
var xScale = d3.scaleLinear()
    .domain([0, d3.max(data,function(d){
    return +d.poverty;
    })])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(data,function(d){
    return +d.healthcare;
    })])
    .range([height, 0]);

// Create axis
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

displayGroup.append("g")
    .attr("transform", `translate(0, ${height}`)
    .call(bottomAxis);

displayGroup.append("g")
    .call(leftAxis);

// Data for cirles and append
var circlesDataGroup = displayGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "20")
    .attr("fill", "purple")
    .classed("stateCircle", true)

// State abbreviations
displayGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d,i) => xScale(d.poverty))
    .attr("y", d => (yScale(d.healthcare)))
    .classed("stateText", true)
    .text(d => d.abbr)
    .on("mouseover", function(d) {
        toolTip.show(d);
    })
    .on("mouseout", function(d,i) {
        toolTip.hide(d);
    });

// x and y labels
displayGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 5)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .attr("data-axis-name", "healthcare")
    .text("Lacks Healthcare(%)");

displayGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 15})`)
    .attr("data-axis-name", "poverty")
    .classed("aText", true)
    .text("In Poverty (%)");

// ToolTip
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 30])
    .html(function(d) {
        return (`${d.abbr}<br>Healthcare(%): ${d.healthcare} <br>Poverty: ${d.poverty}`);
    });


displayGroup.call(toolTip);

circlesDataGroup.on("mouseover", function(d) {
    toolTip.show(d);
})
    .on("mouseout", function(d, i){
        toolTip.hide(d);
    });

});