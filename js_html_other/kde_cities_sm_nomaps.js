// set the dimensions and margins of the graph
    var margin = {top: 30, right: 20, bottom: 55, left: 50},
        width = 210 - margin.left - margin.right,
        height = 210 - margin.top - margin.bottom;
    
    d3.json("../data/cities_final.json").then((data) => {
        console.log(data)
        showData(data.features)

        console.log(d3.select("#South-America").html())
        
        d3.selectAll("button").on("click", function() {
            let value = d3.select(this).html()
            console.log(value)
            if (value != "World") {
              filteredData = data.features.filter(d => d.properties.Continent === value);
              
            } else {
              filteredData = data.features.filter(d => d.properties.Continent !== value)
            }
            showData(filteredData)
          })
    })

    // get the data
  function showData(data) {
      // Filter city of interest
      var cities = d3.nest()
          .key(function(d) { return d.properties.city; })
          .entries(data);
    
      console.log(cities)

      // // filter for paper
      // cities = cities.filter(d=>(d.key === "Paris")|(d.key === "Tokyo")|(d.key === "Bogota")|
      //                           (d.key === "Taipei")|(d.key === "Sydney")|(d.key === "Istanbul")|
      //                           (d.key === "Nairobi")|(d.key === "Ho Chi Minh")|(d.key === "Houston"))
    
    d3.select("#charts").selectAll("svg").remove()
        // append the svg object to the body of the page
    var svg = d3.select("#charts").selectAll("svg")
    .data(cities)
        .enter().append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

      // add the x Axis
      // maxAccess = d3.max(access)
      var x = d3.scaleLinear()
                .domain([0, 1])
                .range([0, width])

      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickSize(0).ticks(5))
          .attr("id", "xAxis")
        //   d3.selectAll("path.domain").remove();
      // add the y Axis
      var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, 12]);

      svg.append("g")
          .call(d3.axisLeft(y))
          .attr("id", "yAxis");          

      var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); });

      cScale = d3.scaleSequential(d3.interpolateOranges)
                  .domain([0.4, 1.1]);
      console.log(d3.interpolateOranges)
      // Compute kernel density estimation
      var kde = kernelDensityEstimator(kernelEpanechnikov(0.007), x.ticks(30))
    //   var density =  kde(data.features.map(function(d){ return +d.properties.accessibil_sc; }))
    //   var density = cities.map(function(d){ return kde(+d.values.properties); })
    //   var test = cities.filter(function(d){ return +d.values.properties.accessibil_sc; })
    //   test = cities.map(function(d) {return {
    //   key: d.key,
    //   values: d.values[100].properties.accessibil_sc}})

    density = cities.map(function(d) {return {
        key: d.key,
        accessibil_sc: d.values.map(d=>d.properties.accessibil_sc),
        accessibil_median: d3.median(d.values.map(d=>d.properties.accessibil_sc)),
        values: kde(d.values.map(d=>d.properties.accessibil_sc))}})
    
    // density.sort(function(x, y){
    //     // return d3.ascending(x.MV - x.LV, y.MV - y.LV);
    //     return d3.descending(+x.accessibil_median, +y.accessibil_median);
    // })
// DRAW KDE curves
    density = density.sort(function(a,b) { return d3.descending(+a.accessibil_median, +b.accessibil_median) })
      
      console.log(density)
      // Plot the curves
      dist = svg.append("g")
          .attr("id", "curves")
          .append("path")
          .attr("class", "mypath")
          .data(density)
          .attr("fill", "white")
          .attr("opacity", "0.8")
          .attr("stroke", d=>cScale(+d.accessibil_median))
          .attr("stroke-width", 2)
          .attr("stroke-linejoin", "round")
          .attr("d", function(d) {return line(d.values); })
          
      dist.attr("fill", d=>cScale(+d.accessibil_median))
        // .attr("fill-opac", ".1")

    // Add Labels
     svg.append("text")
     .data(density)
      // .data(density.sort(function(a,b) { return +a.accessibil_median - +b.accessibil_median }))
        .attr("x", (0))
        .attr("y", height + 30) // -85 previously
        .style("text-anchor", "left")
        // .style("font-size", "12px")
        .style("font", "18px Georgia")
        // .attr("fill", "#ff6d00")
        .attr("fill", d=>cScale(+d.accessibil_median))
        // .attr("fill", function (d) { return myColor(d.values[0].party); })
            .text(function(d) { return d.key; });	

     svg.append("text")
      .data(density)
        // .data(density.sort(function(a,b) { return +a.accessibil_median - +b.accessibil_median }))
        .attr("x", (0))
        .attr("y", height + 45) // -85 previously
        .style("text-anchor", "left")
        // .style("font-size", "12px")
        .style("font", "10px Arial")
        // .attr("fill", function (d) { return myColor(d.values[0].party); })
        .text("Median Accessibility: ")
        .attr("fill", "rgb(167, 167, 167)")
        .append("tspan")
        .attr("font-weight", "bold")
        .attr("fill", "rgb(167, 167, 167)")
        .text(d=>Math.round(+d.accessibil_median*100)/100);

      // median line
      svg.append("line")
        .data(density)
        .attr("x1", d=>x(+d.accessibil_median))
        .attr("x2", d=>x(+d.accessibil_median))
        .attr("y1", 50)
        .attr("y2", 126)
        // .attr("d", function(d) {return line((+d.accessibil_median, +d.accessibil_median)); })
        .attr("stroke", "grey")
        .style("stroke-dasharray", ("3, 3"))
        .attr("fill", "rgb(167, 167, 167)")
        .attr("stroke-width", "0.5px")

      // median label
      var medText = d3.select("#charts").select("svg")
          .data(density)
          // .attr("class", "description")
          .append("text")
          .text("Median accessibility")
          .attr("x", d=>x(+d.accessibil_median))
          .attr("y", 68)
          .style("font-family", "arial")
          .style("font-size", "10")
          .attr("text-anchor", "middle")
          .attr("fill", "rgb(167, 167, 167)")
      
    
    };
    // });
    
    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
      return function(V) {
        return X.map(function(x) {
          return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }
