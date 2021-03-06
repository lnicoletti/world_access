
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 55, left: 50},
        width = 800 - margin.left - margin.right, // 830
        height = 650 - margin.top - margin.bottom; // 685
    

    // let store = {}

    // function loadData() {
    // return Promise.all([
    //     d3.json("data/cities_final.json"),
    // ]).then(datasets => {
    //     store.data = datasets[0];
    //     // store.geoJSON = datasets[1]
    //     return store;
    // })
    // }
    // loadData()
    // showData(store.data)
    // console.log(store)

    // projection = d3.geoMercator()
    //         .center([-73.9375, 40.7324])
    //         .scale((550000) / (2 * Math.PI))
    //         .translate([width / 2, height / 2])


    // tile = d3.tile()
    //         .size([width, height])
    //         .scale(projection.scale() * 2 * Math.PI)
    //         .translate(projection([0, 0]))

    // tiles = Promise.all(tile().map(async d => {
    //         d.data = await d3.json(`https://tile.nextzen.org/tilezen/vector/v1/256/all/${d[2]}/${d[0]}/${d[1]}.json?api_key=uwiMd7FoT82lNUvwToNksg`); // Sign up for an API key: https://www.nextzen.org
    //         return d;
    // }))

    // console.log(tiles)

    // slider values
    var dataWeights = d3.range(0, 11).map(function(d) {
        // return new Date(2000 + d, 01, 01);
        return (0 + d)/10;
        });
        console.log(dataWeights)

    // initial weights for each category
    // alWeight = 0.1
    // cWeight = 0.15
    // edWeight = 0.15
    // fcWeight = 0.15
    // hwbWeight = 0.2
    // mWeight = 0.15
    // nWeight = 0.1

    // have to start with all the same weights otherwise it wont work
    initialWeights = {alWeight: 0.142857, cWeight: 0.142857, 
                      edWeight: 0.142857, fcWeight: 0.142857, 
                      hwbWeight: 0.142857, mWeight: 0.142857, 
                      nWeight: 0.142857}
    
    // create variable to be updated on slider call
    newWeights = _.clone(initialWeights)
    console.log(newWeights)

    // create a slider for each category
    var sliderAL = makeSlider("#sliderAL", initialWeights.alWeight)
    var sliderC = makeSlider("#sliderC", initialWeights.cWeight)
    var sliderED = makeSlider("#sliderED", initialWeights.edWeight)
    var sliderFC = makeSlider("#sliderFC", initialWeights.fcWeight)
    var sliderHWB = makeSlider("#sliderHWB", initialWeights.hwbWeight)
    var sliderM = makeSlider("#sliderM", initialWeights.mWeight)
    var sliderN = makeSlider("#sliderN", initialWeights.nWeight)

    // put all sliders in array to be used in responsive function
    var sliders = [sliderAL, sliderC, sliderED, sliderFC, sliderHWB, sliderM, sliderN]

    d3.json("../data/cities_final.json").then((data) => {
    // d3.json("https://cdn.jsdelivr.net/gh/lnicoletti/world_access@master/hosted_data/cities_final.json").then((data) => {


        accessScore(data, initialWeights)

        console.log(data)  
        populateDropdown(data)
        
        initial_dataset = "Chicago"
        showData(data, initial_dataset)
        updateWeights(sliderAL, data, initial_dataset, status = "active")
        updateWeights(sliderC, data, initial_dataset, status = "active")
        updateWeights(sliderED, data, initial_dataset, status = "active")
        updateWeights(sliderFC, data, initial_dataset, status = "active")
        updateWeights(sliderHWB, data, initial_dataset, status = "active")
        updateWeights(sliderM, data, initial_dataset, status = "active")
        updateWeights(sliderN, data, initial_dataset, status = "active")
        // showData(data)
        // showData(data,tiles)


    })

    function populateDropdown(data) {
            var select = d3.select("#dropdown")

            console.log(d3.map(data.features, d=>d.properties.city).keys())

            unique_cities = d3.map(data.features, d=>d.properties.city).keys().sort(d3.ascending)

            select
                .append("option")
                .attr("value", "Chicago")
                .text("Chicago");

            select.selectAll("option")
            .data(unique_cities)
            .enter()
                .append("option")
                .attr("value", d=>d)
                .text(d=>d);
        }


    // function showData(data, tiles) {
    function showData(data, selected_dataset) {

    /////MAP PLOT
        console.log(data)
        // filter data for city display
        cities = data.features.filter(function(d){return d.properties.city == selected_dataset });
        // prepare data for kde
        access = cities.map(function(d){ return +d.properties.accessibil_sc; }) 
      
        console.log(cities)
        
        // Create feature collection for projection
        featureCollection = {type:"FeatureCollection", cities}
        // rename keys
        featureCollection['features'] = featureCollection['cities'];
        delete featureCollection['cities'];
        
        console.log(featureCollection)
        // console.log(cities.map(d=>d.properties.accessibil_sc))

        // define quantile colorscale
        let cScale = d3.scaleSequentialQuantile([...cities.map(d=>d.properties.accessibil_sc)], d3.interpolateInferno)

        // set projection               
        // let projection = d3.geoAlbers() d3.geoMercator()
        let projection = d3.geoMercator()
                            .fitSize([width, height], featureCollection)
                        //    .scale(7000)
                        //    .translate([width+1900, height+1500])

        // add zooming functionality
        const zoom = d3.zoom()
                        .scaleExtent([1, 8])
                        .on('zoom', zoomed);

        // const g = svg.append('g');

        // create the tiles for background map
        var pi = Math.PI,
        tau = 2 * pi;
        let tiles = d3.tile()
                .size([width, height])
                .scale(projection.scale() * tau)
                .translate(projection([0, 0]))
                ();

        // append the svg object to the body of the page
        var svg = d3.select("#charts")
                .append("svg")

        // draw the legend for map
        
        // create the background map
        let image = svg.selectAll("image")
            .data(tiles)
            .enter().append("image")
            // .attr("xlink:href", function(d){ return "https://cartodb-basemaps-" + "abcd"[d[1] % 4] + ".global.ssl.fastly.net/light_all/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("xlink:href", function(d){ return "https://cartodb-basemaps-" + "abcd"[d[1] % 4] + ".global.ssl.fastly.net/dark_all/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            // .attr("xlink:href", function(d){ return "http://a.tile.stamen.com/toner/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            // .attr("xlink:href", function(d){ return "https://tiles.stadiamaps.com/tiles/alidade_smooth/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("x", function(d) { return (d[0] + tiles.translate[0]) * tiles.scale; })
            .attr("y", function(d) { return (d[1] + tiles.translate[1]) * tiles.scale; })
            .attr("width", tiles.scale)
            .attr("height", tiles.scale)
            .attr("transform", "translate(" + (0) + "," + (30) + ")")
            .attr("id", "map")

        // plot the map
        let path = d3.geoPath()
                     .projection(projection)

    // const roads = svg.selectAll(".tile")
    //   .data(tiles)
    // .enter().append("path")
    //   .style("fill", "none")
    //   .attr("d", (d) => { return path(d.data.roads) })
    //   .style("stroke-width", .1)
    //   .style("stroke-opacity", .5)
    //   .style("stroke", "000");
        
        // console.log(tiles)
        
        plot = svg.selectAll("path")
                    .data(cities)
                    .enter().append("path")
                    .attr("id", "map")
                    .attr("class", "hex")
                    .attr("d", d => path(d))
                    // .attr("stroke", "white")
                    // .attr("stroke-width", "0.05px")
                    // .attr("fill", "black")
                    .attr("fill", d => cScale(+d.properties.accessibil_sc)) 
                    // .call(updateFill, selected_dataset)
                    .attr("opacity", "0.9")
                    .attr("transform", "translate(" + (0) + "," + (30) + ")")
                    .on("mouseover.tip", function() { d3.select(this).attr("stroke", "red").raise();})
                    .on("mouseout.tip", function() { d3.select(this).attr("stroke", null).raise();})
                    .on("mouseover.opall", function() { d3.selectAll(".hex").attr("opacity", "0.2");})
                    .on("mouseover.opt", function() { d3.select(this).attr("opacity", "0.9");})
                    .on("mouseout.opall", function() { d3.selectAll("path").attr("opacity", "0.9");})
                    .on("mouseover.bar", function(d) { displayData(d); })
                    .on("mouseout.bar", hideData);

            // g = svg.append("g")
            //     .attr("class", "legendQuant")
            //     // .attr("transform", "translate(700,-10)");
            //     .attr("transform", "translate(600,100)");

                  
            // var legendQuantize = d3.legendColor()
            //     .title("Accessibility")  
            //     .labelFormat(d3.format(".3n"))
            //     .useClass(true)
            //     .orient('vertical')
            //   .scale(cScale);

            // var thresholdScale = d3.scaleQuantile()
            //     .domain(cities.map(d=>d.properties.accessibil_sc))
            //     .range(d3.interpolateInferno(cities.map(d=>d.properties.accessibil_sc))
            //     .map(function(i) { return "q" + i + "-9"}));
                // .range(d3.range(10)
                // // .map(d3.interpolateInferno));
                // .map(function(i) { return "q" + i + "-9"}));

                // console.log(d3.interpolateInferno(cities.map(d=>d.properties.accessibil_sc)))

                // var legend = d3.legendColor()
                //     .labelFormat(d3.format(".2f"))
                //     .labels(d3.legendHelpers.thresholdLabels)
                //     .useClass(true)
                //     .scale(thresholdScale)

            // svg.select(".legendQuant")
            //         .call(legend);
            // svg.select(".legendQuant")
            //     .call(legendQuantize);

            // var rects = g.selectAll("rect")
            //     .data(d3.range(0,1, 0.03))
            //     .enter()
            //     .append("rect")
            //     .attr("width",15)
            //     .attr("height", 10)
            //     .attr("y", function(d,i) { return Math.floor(i / 100) * 20 + 10 })
            //     .attr("x", function(d,i) { return i % 100 * 15 })
            //     .attr("fill", function(d) { return cScale(d); })

        

////////// KDE PLOT
        // create the kde distribution and plot it
        var dist = d3.select("#summary")
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("id", "histogram")
                        .attr("transform",
                        "translate(" + margin.left*2 + "," + height/1.28 + ")")

        // add the x Axis
        maxAccess = d3.max(access)+0.019
        var x = d3.scaleLinear()
                    .domain([0, maxAccess])
                    .range([0, width/1.5]);

        dist.append("g")
            .attr("transform", "translate(0," + height/4 + ")")
            .call(d3.axisBottom(x).tickSize(0).ticks(5))
            .attr("id", "kdexAxis")
            .style("font-weight", "bold")
            // .style("fill", "grey")
        
        // add the y Axis
        var y = d3.scaleLinear()
                    .range([height/4, 0])
                    .domain([0, 7]);

        dist.append("g")
            .call(d3.axisLeft(y))
            .attr("id", "kdeyAxis"); 
        
        // Compute kernel density estimation
        var kde = kernelDensityEstimator(kernelEpanechnikov(0.007), x.ticks(90))
        var density =  kde(access)
        console.log(density)

        // build the histogram
        thresholds = x.ticks(130)
        // console.log(thresholds)
        bins = d3.histogram()
                .domain(x.domain())
                .thresholds(thresholds)
                (access)
        // console.log(bins)

        yBins = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length) / density.length])
                .range([height/4, 0])

        // draw the histogram
        hist = dist.append("g")
            .attr("class", "kdeBins")
            // .attr("fill", "none")
            // .attr("fill", "grey")
            // .attr("stroke", "darkgrey")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => x(d.x0) + 1)
            // .attr("y", d => yBins(d.length / density.length))
            // .attr("width", d => x(d.x1) - x(d.x0)-1.5)
            .attr("width", d => 3.2)
            // .attr("height", 0)
            // .attr("y", d=>yBins(0))
            // .transition()
            // .duration(3000)
            .attr("y", d => yBins(d.length / density.length))
            .attr("height", d => yBins(0) - yBins(d.length / density.length));

        // draw the kde distribution line
        line = dist.append("path")
            // .attr("class", "kdePath")
            .datum(density)
            .attr("fill", "#ff6d00")
            .attr("fill-opacity", ".07")
            .attr("stroke", "#ff6d00")
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
                .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
          );

        // add city name label
        distLabel = dist.append("text")
            .attr("x", (0))
            .attr("y", 0) // -85 previously
            .style("text-anchor", "left")
            // .style("font-size", "12px")
            .style("font", "25px Georgia")
            .attr("fill", "#ff6d00")
            // .attr("fill", function (d) { return myColor(d.values[0].party); })
                .text(selected_dataset);	
        
        // // add median line
        // dist.selectAll(".grid-line")
        //     .append("line")
        //     .attr("x1", x(d3.median(cities, d => +d.properties.accessibil_sc)))
        //     .attr("y1", 0)
        //     .attr("x2", x(d3.median(cities, d => +d.properties.accessibil_sc)))
        //     .attr("y2", 7)
        //     .attr("stroke", "black")
        //     .attr("stroke-width", 2)

            // console.log(y(d3.median(density, d => +d[0])))
        console.log(yBins(d3.median(cities, d => +d.properties.accessibil_sc).length / density.length))
        // add median accessibility text
        distText = dist.append("text")
            .attr("id", "medianBlurb")
            .attr("x", x(d3.median(cities, d => +d.properties.accessibil_sc))-70)
            .attr("y", -55) // -85 previously
            // .attr("y", yBins(d3.median(cities, d => +d.properties.accessibil_sc) / density.length))
            .style("text-anchor", "middle")
            // .style("font-size", "12px")
            .style("font", "14px Arial")
            // .attr("fill", function (d) { return myColor(d.values[0].party); })
            // .git shtml("Median Accessibility: " + d3.median(cities, d => Math.round(+d.properties.accessibil_sc*100)/100))
            .html("The median street in " + selected_dataset + " has an accessibility of: " + d3.median(cities, d => Math.round(+d.properties.accessibil_sc*100)/100))
            // .attr("font-weight", "light")
            // .text("The median street in ")
            // .append("tspan")
            // .attr("font-weight", "bold")
            // .text(selected_dataset)
            // .append("tspan")
            // .attr("font-weight", 300)
            // .text(" has an accessibility of: ")
            // .append("tspan")
            // .attr("font-weight", "bold")
            // .text(d3.median(cities, d => Math.round(+d.properties.accessibil_sc*100)/100))
            .call(wrap, 150)

            // wrap(distText, 150)

  ////// UPDATE            
    // update kde/hist plot when city changes
    function update(selectedGroup) {
        // Create new data with the selection
        var cities = data.features.filter(function(d){return d.properties.city == selectedGroup });
        access = cities.map(function(d){ return +d.properties.accessibil_sc; }) 
        var density =  kde(access)
        // Create new feature collection for projection
        featureCollection = {type:"FeatureCollection", cities}
        // rename keys
        featureCollection['features'] = featureCollection['cities'];
        delete featureCollection['cities'];
        // define new quantile colorscale
        let cScale = d3.scaleSequentialQuantile([...cities.map(d=>d.properties.accessibil_sc)], d3.interpolateInferno)

        // set new projection               
        let projection = d3.geoMercator()
                            .fitSize([width, height], featureCollection)
        
        tiles = d3.tile()
                .size([width, height])
                .scale(projection.scale() * tau)
                .translate(projection([0, 0]))
                ();

        // new bins for histogram
        bins = d3.histogram()
                .domain(x.domain())
                .thresholds(thresholds)
                (access)
        yBins = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length) / density.length])
                .range([height/4, 0])

        // Give these new data to update line and histogram
        line
            .datum(density)
            .transition()
            .duration(1000)
            .attr("fill", "#ff6d00")
            .attr("fill-opacity", ".07")
            .attr("stroke", "#ff6d00")
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
                .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); }));

        hist
            .data(bins)
            .transition()
            .duration(1000)
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => 3.2)
            .attr("y", d => yBins(d.length / density.length))
            .attr("height", d => yBins(0) - yBins(d.length / density.length));

        // Update Label
        // add city name label
        distLabel
        // .data(selectedGroup)
        //     .transition()
        //     .duration(1000)
            .attr("x", (0))
            .attr("y", 0) // -85 previously
            .style("text-anchor", "left")
            // .style("font-size", "12px")
            .style("font", "25px Georgia")
            .attr("fill", "#ff6d00")
            // .attr("fill", function (d) { return myColor(d.values[0].party); })
                .text(selectedGroup);


        // Update text
        distText
        .data(cities)
            // .transition()
            // .duration(1000)
            .attr("x", x(d3.median(cities, d => +d.properties.accessibil_sc))-70)
            .attr("y", -55) // -85 previously
            .style("text-anchor", "middle")
            // .style("font-size", "12px")
            .style("font", "14px Arial")
            .text("The median street in " + selectedGroup + " has an accessibility of: " + d3.median(cities, d => Math.round(+d.properties.accessibil_sc*100)/100))
            .call(wrap, 150)
            
        // Update map
        let path = d3.geoPath()
                     .projection(projection)
        
        d3.selectAll("#map")
                .remove("#map")

        image = svg.selectAll("image")
        // image
            .data(tiles)
            // .transition()
            // .duration(1000)
            .enter().append("image")
            // .attr("xlink:href", function(d){ return "https://cartodb-basemaps-" + "abcd"[d[1] % 4] + ".global.ssl.fastly.net/light_all/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("xlink:href", function(d){ return "https://cartodb-basemaps-" + "abcd"[d[1] % 4] + ".global.ssl.fastly.net/dark_all/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            // .attr("xlink:href", function(d){ return "http://a.tile.stamen.com/toner/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("x", function(d) { return (d[0] + tiles.translate[0]) * tiles.scale; })
            .attr("y", function(d) { return (d[1] + tiles.translate[1]) * tiles.scale; })
            .attr("width", tiles.scale)
            .attr("height", tiles.scale)
            .attr("transform", "translate(" + (0) + "," + (30) + ")")
            .attr("id", "map")

        plot = svg.selectAll("path")
        // plot
            .data(cities)
            // .transition()
            // .duration(200)
            .enter().append("path")
            .attr("id", "map")
            .attr("class", "hex")
            .attr("d", d => path(d))
            .attr("fill", d => cScale(+d.properties.accessibil_sc)) 
            .attr("opacity", "0.9")
            .attr("transform", "translate(" + (0) + "," + (30) + ")")
            .on("mouseover.tip", function() { d3.select(this).attr("stroke", "red").raise();})
            .on("mouseout.tip", function() { d3.select(this).attr("stroke", null).raise();})
            .on("mouseover.opall", function() { d3.selectAll(".hex").attr("opacity", "0.2");})
            .on("mouseover.opt", function() { d3.select(this).attr("opacity", "0.9");})
            .on("mouseout.opall", function() { d3.selectAll("path").attr("opacity", "0.9");})
            .on("mouseover.bar", function(d) { displayData(d); })
            .on("mouseout.bar", hideData);

        // u = svg.selectAll("path")
        //     .data(cities)
        // u
        // // plot
        //     // .data(cities)
        //     .enter().append("path")
        //     .merge(u) // get the already existing elements as well
        //     .transition() // and apply changes to all of them
        //     .duration(800)
        //     .attr("id", "map")
        //     .attr("class", "hex")
        //     .attr("d", d => path(d))
        //     .attr("fill", d => cScale(+d.properties.accessibil_sc)) 
        //     .attr("opacity", "0.9")
        //     .attr("transform", "translate(" + (0) + "," + (30) + ")")
        //     .on("mouseover.tip", function() { d3.select(this).attr("stroke", "red").raise();})
        //     .on("mouseout.tip", function() { d3.select(this).attr("stroke", null).raise();})
        //     .on("mouseover.opall", function() { d3.selectAll(".hex").attr("opacity", "0.2");})
        //     .on("mouseover.opt", function() { d3.select(this).attr("opacity", "0.9");})
        //     .on("mouseout.opall", function() { d3.selectAll("path").attr("opacity", "0.9");})
        //     .on("mouseover.bar", function(d) { displayData(d); })
        //     .on("mouseout.bar", hideData);
        // u
        //     .exit()
        //     .remove()

        }

        d3.select("#dropdown").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // re-initialize the weights
        accessScore(data, initialWeights)
        console.log(initialWeights)
        // make function inactive to prevent it from interacting with resetSliders
        updateWeights(sliderAL, data, selectedOption, status=0)
        updateWeights(sliderC, data, selectedOption, status=0)
        updateWeights(sliderED, data, selectedOption, status=0)
        updateWeights(sliderFC, data, selectedOption, status=0)
        updateWeights(sliderHWB, data, selectedOption, status=0)
        updateWeights(sliderM, data, selectedOption, status=0)
        updateWeights(sliderN, data, selectedOption, status=0)
        
        // reset newWeights variable to forget previous status
        newWeights = _.clone(initialWeights)
        // reset all sliders to equal weights
        resetSliders(initialWeights)
        // run the update function with this selected option
        update(selectedOption)
        // re-initialize updateWeights 
        updateWeights(sliderAL, data, selectedOption)
        updateWeights(sliderC, data, selectedOption)
        updateWeights(sliderED, data, selectedOption)
        updateWeights(sliderFC, data, selectedOption)
        updateWeights(sliderHWB, data, selectedOption)
        updateWeights(sliderM, data, selectedOption)
        updateWeights(sliderN, data, selectedOption)
    })
    
        svg.call(zoom);
        image.call(zoom)
    };

    function zoomed() {
         // the "zoom" event populates d3.event with an object that has
        // a "translate" property (a 2-element Array in the form [x, y])
        // and a numeric "scale" property
        var e = d3.event.transform,

        // now, constrain the x and y components of the translation by the
        // dimensions of the viewport
        tx = Math.min(0, Math.max(e.x, width - width * e.k)),
        ty = Math.min(0, Math.max(e.y, height - height * e.k));
        
        d3
        .selectAll('#map') // To prevent stroke width from scaling
        .attr("transform", [
          "translate(" + [tx, ty] + ")",
          "scale(" + e.k + ")"
        ].join(" "));

    }

    // // dropdown dataset selection
    // var dropDown = d3.select("#dropdown");

    // dropDown.on("change", function() {

    //     checked = true;

    //     selected_dataset = d3.event.target.value;

    //     console.log(selected_dataset)

    //     d3.selectAll("path")
    //             .remove("path")

    //     d3.select("#histogram")
    //             .remove("#histogram")

    //     d3.selectAll("image")
    //             .remove("image")
        
    //     // d3.selectAll(".osm-attribution-container")
    //     //         .remove(".osm-attribution-container")
                
    //     // d3.json("cities_final.json").then(showData)
    //     data.then(showData)
    //     // plot.call(updateFill, selected_dataset)
    // });

    var search = d3.select("#city").on("keypress", function() {
        if(d3.event.keyCode === 13) {
            selected_dataset = d3.event.target.value;
        
        console.log(selected_dataset)

        d3.selectAll("path")
                .remove("path")

        d3.select("#histogram")
                .remove("#histogram")

        d3.selectAll("image")
                .remove("image")
        
        data.then(showData)}
    
    });
        
            // console.log(document.getElementById("#city").value)

    function displayData(d) {

        d3.selectAll("#barchart")
        .remove("#barchart")

        // set the dimensions and margins of the graph
        var margin = {top: 40, right: 65, bottom: 15, left: 150},
            width = 390 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#summary")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("id", "barchart")
            .attr("transform",
                "translate(" + margin.left*1.2 + "," + margin.top + ")");

        // Parse the Data

        radarData = [{category: "Mobility Score",
                 value: Math.round(+d.properties.mobility_r*100)},
                 {category: "Active Living Score",
                 value: Math.round(+d.properties.active_liv_r *100)},
                 {category: "Entertainment Score",
                 value: Math.round(+d.properties.nightlife_r*100)},
                 {category: "Health and Wellbeing Score",
                 value: Math.round(+d.properties.health_wel_r*100)},
                 {category: "Food Choices Score",
                 value: Math.round(+d.properties.food_choic_r*100)},
                 {category: "Community Space Score",
                 value: Math.round(+d.properties.community_r*100)},
                 {category: "Education Score",
                 value: Math.round(+d.properties.education_r*100)}]

        // let cScale = d3.scaleSequentialQuantile([...radarData.map(d=>d.value)], d3.interpolateInferno)
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 100])
            .range([ 0, width]);
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .attr("id", "xAxis")
        //     .call(d3.axisBottom(x))
        //     .selectAll("text")
        //     .attr("transform", "translate(-10,0)rotate(-45)")
        //     .style("text-anchor", "end")
        //     .attr("font-size", "9px") 
        //     .attr("font-weight", "bold")

        // console.log(d3.max((radarData.map(d=>d.value))))
        // Y axis
        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(radarData.map(function(d) { return d.category; }))
            .padding(.1);
        svg.append("g")
            .attr("id", "baryAxis")
            .call(d3.axisLeft(y))
            // .attr("font-size", "20px") 
            // .attr("font-weight", "bold")

        //Bars
        svg.selectAll("myRect")
            .data(radarData)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function(d) { return y(d.category); })
            .attr("width", function(d) { return x(+d.value); })
            .attr("height", y.bandwidth()-5)
            .attr("fill", "#ff6d00")
            // .attr("fill", "orange")
            // .attr("stroke", "grey")
            .attr("stroke", "none")
            .attr("stroke-width", "1.2px")
            .append("text")
            .text(function(d) { return x(+d.value);})

        //data labels
        svg.selectAll("text.lab").data(radarData)
            .enter().append("text")
            .attr("class", "barLabels")
            // .attr('fill','black')
            .attr("text-anchor", "right")
            .attr("x", function(d) { return x(+d.value) + 5; })
            .attr("y", function(d) { return y(d.category)+20; })
            .html(function(d) {return (+d.value) + "%"})
            .attr("font-size", "10px") 
            .attr("font-weight", "bold") 

        // console.log(x.range()[1])
    }

    function hideData() {

        // d3.select("#scores")
        // .text("\u00A0");

        d3.selectAll("#barchart")
        .remove("#barchart")

        // yAxis = d3.selectAll("#yAxis")
        // yAxis.selectAll("path")
        //     .remove("path")
        // yAxis.selectAll("text")
        //     .remove("text")


        // xAxis = d3.selectAll("#xAxis")
        // xAxis.selectAll("path")
        //     .remove("path")
        // xAxis.selectAll("text")
        //     .remove("text")

        // d3.select("#scores")
        // .selectAll("path")
        // .remove("path");

        // d3.select("#datum")
        // .text("\u00A0");
    }

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

    // function to wrap text
    function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
     });
    }