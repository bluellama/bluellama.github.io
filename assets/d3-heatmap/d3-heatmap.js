
const padding = ({
  top: 50,
  bottom: 150,
  left: 100,
  right: 200
});




/* 
Define title
User Story #1: My heat map should have a title with a corresponding id="title".
User Story #2: My heat map should have a description with a corresponding id="description".
*/
const title = "Global Mean Surface Temperature"
const subtitle = "1753-2015"

var header = d3.select(".viz")
.append("div")
.html(title)
.attr("id", "title");

var subheader = d3.select(".viz")
.append("div")
.html(subtitle)
.attr("id", "description");



/* get data / define dynamic components */
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

d3.json(url)
  .then((data) => callback(data))
  .catch((err) => console.log(err));

function callback(data) {  
  /* define x scale + axis
  User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".
  
  User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.
*/
  
 
  
  var chart = ({
  width: 3 * Math.ceil(data.monthlyVariance.length / 12),
  height: 33 * 12
});/* define non-dynamic components*/
var svg = d3.select(".viz")
.append("svg")
.attr("width", (chart.width + padding.left + padding.right))
.attr("height", (chart.height + padding.top + padding.bottom));
  
  var years = data.monthlyVariance.map((d) => d.year);  
  var uniqueyears = [...new Set(years)]
  var xscale = d3.scaleBand()
  .domain(years)
  .range([padding.left, chart.width + padding.left]);
    
  var xaxis = d3.axisBottom()
  .scale(xscale)
  .tickValues(uniqueyears.filter((y) => y % 10 === 0))
  .tickFormat(function (year) {
      var date = new Date(0);
      date.setUTCFullYear(year);
      var format = d3.timeFormat('%Y');
      return format(date);
    })
    .tickSize(10, 1);;
  
  svg.append('g')
  .attr("id", "x-axis")
  .classed('x-axis', true)
  .attr("transform", "translate(" + 0 + "," + (padding.top + chart.height) + ")")
  .call(xaxis)

  
  /* define y scale + axis

  User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".
  
  User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.
*/
  var yscale = d3.scaleBand()
  .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  .rangeRound([padding.top, (chart.height + padding.top)]);
  
  
  var yaxis = d3.axisLeft()
  .scale(yscale)
  .tickFormat(function (d) {
    var date = new Date(0);
    date.setUTCMonth(d);
    return d3.timeFormat('%B')(date);
  });
  //tick size
  
  svg.append('g')
  .attr('transform', 'translate('+ padding.left +
        ',' + 0 + ')')
  .attr('id', 'y-axis')
  .call(yaxis);
  
  /* define legend + color scale
  User Story #13: My heat map should have a legend with a corresponding id="legend".

User Story #14: My legend should contain rect elements.

User Story #15: The rect elements in the legend should use at least 4 different fill colors.

*/
  var stepcount = 10;
  var variance = data.monthlyVariance.map((d) => d.variance);

  var stepwidth = (d3.max(variance) - d3.min(variance)) / stepcount;
  var minmax = d3.extent(variance).map((d) => d + data.baseTemperature);
  
  var colorsteps = function(min, max, steps){
    var temparray = [];
    var stepwidth = (d3.max(variance) - d3.min(variance)) / stepcount;
    for(var i= 1; i< steps; i++) {
      temparray.push(min + stepwidth * i);
    }
    return temparray;
  }(d3.min(variance), d3.max(variance), stepcount);
  
  var legendwidth = 400;
  var colorscale = d3.scaleThreshold()
  .domain(colorsteps)
  .range(["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"].reverse());
 
  var legendscale = d3.scaleLinear()
  .domain([d3.min(variance) - stepwidth + data.baseTemperature, d3.max(variance) + stepwidth + data.baseTemperature])
  .range([padding.left ,(legendwidth + padding.left)])
 
  var ticks = colorscale.domain().map((d) => d + data.baseTemperature);
  var allticks = minmax.concat(ticks);
  var allticksasc = allticks.sort(d3.ascending);  
  
  var legendaxis = d3.axisBottom()
  .scale(legendscale)
  .tickValues(allticks)
  .tickFormat(d3.format('.1f'));

  var legend = svg.append('g')
  .attr('id', 'legend')
  .classed('legend', true);
  
  legend.append('g').
  attr('transform', 'translate(0, ' + (chart.height + padding.top + padding.bottom / 2) + ')')
  .call(legendaxis);
  
  legend
    .append('g')
    .selectAll('rect')
  .data(colorscale.range())
  .enter()
  .append('rect')
  .attr('x', (d, i) => legendscale(allticksasc[i]))
  .attr('y', (chart.height + padding.top + padding.bottom / 2 - legendwidth / (stepcount + 2)))
  .attr('width', legendwidth / (stepcount + 2))
  .attr('height', legendwidth / (stepcount + 2))
  .style('fill', (d,i) => d);
  
 legend.append('g')
  	.append('text')
  	.attr('transform', 'translate(' + (legendwidth /2 + padding.left)  + ', ' + (chart.height + padding.top + padding.bottom / 2 +40) + ')')
	.attr('text-anchor', 'middle')
	.text("Mean surface tempterature in ºC")
  /* plot data points 
  User Story #5: My heat map should have rect elements with a class="cell" that represent the data.
  
  User Story #6: There should be at least 4 different fill colors used for the cells.
  
  User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.

  User Story #8: The data-month, data-year of each cell should be within the range of the data.

  User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.

  User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.

*/
  var tip = d3.select('.viz').append('div').attr("class", "d3-tip")

  svg
    .append('g')
    .classed('map', true)
    .selectAll("rect")
  .data(data.monthlyVariance)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("data-month", (d) => d.month -1)
  .attr("data-year", function(d) 
        {
    return d.year})
  .attr("data-temp", (d) => d.variance + data.baseTemperature)
  .attr("x", function (d, i) {
    return xscale(d.year)}
       )
  .attr("y", (d) => yscale(d.month - 1))
  .attr("width", (d) => xscale.bandwidth(d.year))
  .attr("height", (d) => yscale.bandwidth(d.month -1))
  .attr("fill", (d) => colorscale(d.variance))
  .style('stroke', 'lightgray')
  .on('mouseover', function(event,d) {
   tip.style("opacity", 1)
	.style('top', event.pageY + 50 + 'px')
	.style('left', event.pageX + 50 + 'px')
	.html(function () {
     var date = new Date(d.year, d.month - 1);
  return d3.timeFormat('%Y - %B')(date) + '<br>Compared to mean: ' + d3.format('+.1f')(d.variance) + '° C' + 
    '<br>Absolute temp: ' + d3.format('.1f')(d.variance + data.baseTemperature) + '° C' ;
   })
	      }
     )
  .on('mouseout', tip.hide);

  
  /* 
  User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

User Story #17: My tooltip should have a data-year property that corresponds to the data-year of the active area.
*/
  
};


