Promise.all([ d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'), d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')]).then(function(files) { 
  
  
  
  var USMAP = files[1];
  var EDU = files[0];
  var colors = d3.schemeGreens[9];
  console.log('edu: ', EDU)
  //console.log('usmap: ', USMAP)
  
  var topojsonObject = topojson.feature(USMAP, USMAP.objects.counties); 
  var topojsonDataSet = topojsonObject.features;
  
  console.log('topojsonObject', topojsonObject);
  //console.log('topojsonDataSet', topojsonDataSet);
  
  var eduArray = EDU.map((d) => d.bachelorsOrHigher);
  var eduMin = d3.min(eduArray);
  var eduMax = d3.max(eduArray);
  var colorLevels = 8;
  
  
  var eduScale = d3.scaleThreshold()
  .domain(d3.range(eduMin, eduMax, (eduMax-eduMin)/colorLevels))
  .range(colors);
  
  var legendWidth = 30 * colorLevels;
  var xScale = d3.scaleLinear()
  .domain([eduMin, eduMax])
  .range([0, legendWidth]);
  
  var legendbar = d3.axisBottom(xScale)
  .tickValues(eduScale.domain())
  .tickFormat((d) => Math.round(d) + '%');
  
  console.log('eduscale: ',   eduScale.domain());
  
 /* d3.select('body')
  .data(EDU)
  .enter()
  .append('h1')
  .html('hi')
  */
 var chart = ({width: 1200, height: 600})
 console.log("you made it this far") 

  var svg = d3.select("#viz")
  .append("svg")
  .attr("width", chart.width)
  .attr("height", chart.height)
  
   var legend = svg.append('g')
   .attr('id', 'legend')
   .attr('transform', 'translate(600, 50)')
   
   var tooltip = d3.select("#viz")
   .append("div")
   .attr("id", "tooltip")
   .attr("class", "tooltip")
   .style("opacity", 0);
   
  
  legend.append('g')
  .selectAll('rect')
  .data(eduScale.domain()
    /*eduScale.range().map(function(c) {
    var spread = eduScale.invertExtent(c);
    console.log('spread:', spread);
    if(spread[0] == null {
       spread[0] = xScale.domain()[0];
       }
     if(spread[1] == null) {
       spread[1] = xScale.domain()[1]}
  }                       
    return spread;
  })
  */)
  .enter()
  .append('rect')
  .attr('x',  (d) => xScale(d))
  .attr('y', 0)
  .attr('height', 6)
  .attr('width', xScale(eduScale.domain()[1]) - xScale(eduScale.domain()[0]) )
  .attr('fill',  (d) => eduScale(d))
   
   legend.append('g').call(legendbar)
  .select('.domain')
  .remove();
  //^removes the horizontal bar of the scale
  
  
  svg.append('g')
  .selectAll('path')
  .data(topojsonDataSet)
  .enter()
  .append('path')
  .attr('data-fips', (d) => d.id)
  .attr('data-education', function(d) {
    var countymatch = EDU.filter((ed) => d.id === ed.fips)
    return countymatch[0].bachelorsOrHigher
  })
  .attr('class', 'county')
  .attr('stroke', '#CCCCCC')
  .attr('fill', function(d) {
    var countymatch = EDU.filter((ed) => d.id === ed.fips)
   // console.log('rate', eduScale(countymatch[0].bachelorsOrHigher))
    return eduScale(countymatch[0].bachelorsOrHigher)
  })
  .attr('d', d3.geoPath())
  .on('mouseover', function(event, d) {
    tooltip.style('opacity', 1)
    .attr('data-education', function() {
    var countymatch = EDU.filter((ed) => d.id === ed.fips)
    return countymatch[0].bachelorsOrHigher
  })
    .html(function() {
      var countymatch = EDU.filter((ed) => d.id === ed.fips)
      
      var a = countymatch[0].area_name;
      var b = countymatch[0].state;
      var c = countymatch[0].bachelorsOrHigher;
      //console.log('tooltip', countymatch[0] );
      return a + ', ' + b + ': ' + c + '%';
     
    })
    .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px');
  })
  .on('mouseout', function() {
    tooltip.style('opacity', 0)
  })
  
  
  
}).catch(function(err){})
