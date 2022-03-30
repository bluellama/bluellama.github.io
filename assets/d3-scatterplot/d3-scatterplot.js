import * as d3 from "https://cdn.skypack.dev/d3@7.3.0";

const padding =
      ({
        top: 30,
        left : 80,
        right : 100,
        bottom : 50
      });
const chart = ({
  x: 500,
  y :350
});

const dopeoptions = [
"doping", "no doping"];

var timeFormat = d3.timeFormat('%M:%S');


/*xAxis = g => g
    .attr("transform", "translate(0, 50px)")
    .call(d3.axisBottom(x))*/

var svgCanvas = d3.select(".vizcontainer")
.append("svg")
.attr("width", chart.x + padding.left + padding.right)
.attr("height", chart.y + padding.top + padding.bottom)

var tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")

var yAxisLabel = svgCanvas
.append("text")
.attr("class", "axislabel")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")
.attr("x", -(chart.y / 2 + 20))
.attr("y", (padding.left / 2))
.text("Time in Minutes")
;

var xAxisLabel = svgCanvas
.append("text")
.attr("class", "axislabel")
.attr("text-anchor", "middle")
.attr("x", (chart.x / 2 + padding.left))
.attr("y", (chart.y + padding.top))
.text("Year")
;


var color = d3.scaleOrdinal(d3.schemeCategory10);

color.domain(dopeoptions);


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then((dataset) => {
  
  var timesarray = dataset.map(d=> new Date(String(1970), 0, 1, 1, d.Time.split(":")[0], d.Time.split(":")[1]))

  
  var yearsarray = dataset.map((d) => d.Year)
  
  var yearrange = d3.extent(yearsarray)
  
  var xscale = d3.scaleLinear()
.domain([yearrange[0]-1, yearrange[1]+1])
.range([padding.left, (chart.x + padding.left)])
  
  var yscale = d3.scaleTime()
.domain(d3.extent(timesarray))
.range([padding.top, chart.y])

 var xAxis = d3.axisBottom(xscale)
 .tickFormat(d3.format('d'))
 var yAxis = d3.axisLeft(yscale).tickFormat(timeFormat);
 
 svgCanvas.append('g').call(xAxis)
  .attr("transform", "translate(" + 0 + ", " + (chart.y ) + ")").attr("id", "x-axis");
  
  svgCanvas.append('g').call(yAxis)
  .attr("transform", "translate(" + padding.left + ", " + 0 + ")").attr("id", "y-axis");
  
  var legend = svgCanvas.append("g").attr("id", "legend")
  
  legend.selectAll("rect")
  .data(dopeoptions)
  .enter()
  .append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("x", chart.x + padding.left - 30)
  .attr("y", (d,i) => chart.y / 2 + 15 * i)
  .style("fill", (d)  => color(d));
  
  legend.selectAll("text")
  .data(dopeoptions)
  .enter()
  .append("text")
  .text((d) => d)
  .attr("x", chart.x + padding.left -20)
  .attr("y", (d,i) => chart.y / 2 + 15 * i + 10);
  
  
  svgCanvas
  .selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("data-xvalue", (d) =>  d.Year)
  .attr("data-yvalue", (d,i) => timesarray[i])
  .attr("cx", (d) => xscale(d.Year))
  .attr("cy", (d, i) => yscale(timesarray[i]))
  .attr("r", 6)
  .attr("class", "dot")
  .style("fill", function(d) {
    return color(d.Doping === '' ? 'no doping': 'doping')
  })
  .style("stroke", "#000")
  .on("mouseover", function (event, d) {
      tooltip.attr("id", "tooltip")
        .attr("data-year", d.Year)
        .html(d.Year + ": " + d.Name + " " + d.Nationality
                  + "<br>Time: "
                  +d.Time
                  +"<br><br>"
                  +d.Doping)
      .style("opacity", 1)
      .style("left", event.pageX + "px")
      .style("top", event.pageY + + 30 + "px")
      })
   .on("mouseout", function () {
    tooltip.style("opacity", 0)
  } );
  
  
  
});
