import * as d3 from "https://cdn.skypack.dev/d3@7.3.0";

const canvaswidth = 800;
const canvasheight = 400;
const canvaspadding = 0;
const xpadding = 60;
const ypadding = 100;
const toppadding = 20;
const tooltipbuffer = 150 + 70;
const tooltipybuffer = 10;

var tooltip = d3.select(".visualization").append("div").
attr("id", "tooltip").style("opacity", 0);

var overlay = d3.
select('.visualization').
append('div').
attr('class', 'overlay').
style('opacity', 0);


var svgCanvas = d3.select(".visualization").
append("svg").
attr("style", "outline: thin solid black;").
attr("width", canvaswidth + xpadding + 20).
attr("height", canvasheight + ypadding + toppadding);



d3.json(
'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').

then(data => {


  var unpackedvalues = data.data.map(d => d[1]);


  var timeseries =
  data.data.map(d => new Date(d[0]));

  var seriesmax = d3.max(unpackedvalues);
  var seriesmin = d3.min(unpackedvalues);

  var serieslength = unpackedvalues.length;
  var barwidth = canvaswidth / serieslength;

  //for normalizing values
  var verticalscale = d3.scaleLinear().domain([0, seriesmax]).range([0, canvasheight]);

  var yaxisscale = d3.scaleLinear().domain([0, seriesmax]).range([canvasheight, 0]);

  var tooltipscale = d3.scalePow().
  exponent(0.8).
  domain([0, serieslength]).
  range([0, tooltipbuffer]);

  var tooltipscaley = d3.scalePow().
  exponent(0.8).
  domain([verticalscale(seriesmin), verticalscale(seriesmax)]).
  range([canvasheight - 90, tooltipybuffer]);


  var xMax = new Date(d3.max(timeseries));
  xMax.setMonth(xMax.getMonth() + 3);

  var timescale = d3.scaleTime().domain([d3.min(timeseries), xMax]).range([0, canvaswidth]);

  var scaledseries = unpackedvalues.map(function (d) {
    return verticalscale(d);
  });

  var xaxis = d3.axisBottom().scale(timescale);
  var yaxis = d3.axisLeft().scale(yaxisscale);

  svgCanvas.append('g').
  call(xaxis).
  attr("id", "x-axis").
  attr('transform', 'translate(' + xpadding + ', ' + (canvasheight + toppadding) + ')');

  svgCanvas.append('g').
  call(yaxis).
  attr("id", "y-axis").
  attr('transform', 'translate(' + xpadding + ',' + toppadding + ')');


  svgCanvas.append('text').
  attr('transform', 'rotate(-90)').
  attr('x', -canvasheight + 80).
  attr('y', 15).
  attr('class', 'axisLabel').
  text("GDP in Billions of USD($)");

  svgCanvas.append('text').
  attr('x', canvaswidth / 2 + xpadding).
  attr('y', canvasheight + toppadding + 40).
  attr('class', 'axisLabel').
  text("Year");

  svgCanvas.append('text').
  attr('x', canvaswidth - 300).
  attr('y', canvasheight + ypadding).
  attr('class', 'infoLink').
  text("datasource: https://www.bea.gov/resources/methodologies/nipa-handbook");


  svgCanvas.selectAll("rect").
  data(scaledseries).
  enter().
  append("rect").
  attr("data-date", (d, i) => data.data[i][0]).
  attr("data-gdp", (d, i) => unpackedvalues[i]).
  attr("x", (d, i) => xpadding + timescale(timeseries[i])).
  attr("y", d => canvasheight - d + toppadding).
  attr("index", (d, i) => i).
  attr("width", barwidth).
  attr("height", d => d).
  attr("class", "bar").
  attr("fill", "#000066").
  on('mouseover', function (event, d) {

    var i = this.getAttribute('index');

    overlay.
    transition().
    duration(0).
    style('height', d + 'px').
    style('width', barwidth + 'px').
    style('opacity', 0.9).
    style('left', i * barwidth + 'px').
    style('top', canvasheight - d + toppadding + 'px').
    style('transform', 'translateX(60px)');


    tooltip.transition().duration(200).style('opacity', 0.9);

    tooltip.
    html(data.data[i][0] + ":<br>$" + d3.format(",")(data.data[i][1]) + " Billion").
    attr("data-date", data.data[i][0]).
    style("left", i * barwidth - tooltipscale(i) + 60 + "px").
    style("top", tooltipscaley(d) + "px");
  }).
  on('mouseout', function () {
    tooltip.transition().duration(200).style('opacity', 0);
    overlay.transition().duration(200).style('opacity', 0);
  })


}).catch(e => console.log(e));
