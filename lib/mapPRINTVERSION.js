
// Code attributions: This code draws upon the following tutorials and examples.
//Tom Noda's blog for the arrows and functions to animate them - see http://www.tnoda.com/blog/2014-04-02

// Micheal Keller's, namely the function to convert lattitude and longidtude to x and y coordinates  
// http://bl.ocks.org/mhkeller/f41cceac3e7ed969eaeb

//Michell Chandra Basic US state Map - http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922

// Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
// https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

//Mike Bostock 'Let's Make a Map' tutorials  https://bost.ocks.org/mike/map/

//D3 Noob 'A simple D3 Map Explained' http://www.d3noob.org/2013/03/a-simple-d3js-map-explained.html

//Jessica Hamel - for the SVG images loaded in to the charts http://blockbuilder.org/jessihamel/9648495

    // Map set up
    var m_width = $("#map").width(),
        width = 900,
        height = 800;

    var projection = d3.geo.mercator()
        .scale(width * 65)
        .center([ -0.09, 51.505])
        .translate([width /2, height /2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width)
        .attr("class", "map_svg");

    var boroughs = svg.append("g")
        .attr("class","boroughs");

    var origin_circles = svg.append("g")
        .attr("class", "origin_circles");

    var destination_circles = svg.append("g");

    var rectangle = svg.append("g")
        .attr("class", "rectangleLabel");

    var labels = svg.append("g");

    //Infographic chart set up -
    var chartWidth = 500;
        chartHeight = 55;
        chartMargin = {top: 5, right: 30, bottom: 20, left: 20};

    var xScale = d3.scale.linear()
        .domain([0,55])
        .range([0, chartWidth - chartMargin.right - chartMargin.left]);

    var xAxis = d3.svg.axis()
        .scale(xScale);

    var xScale2 = d3.scale.linear()
        .domain([0,44])
        .range([0, chartWidth - chartMargin.right]);

    var xAxis2 = d3.svg.axis()
        .scale(xScale2);

//The code for the charts has been adapted from http://blockbuilder.org/jessihamel/9648495
    //First chart - svg images from borough
    var chart1Svg = d3.select("#chart1")
        .append("svg")
        .attr("width", chartWidth - chartMargin.left - chartMargin.right)
        .attr("height", chartHeight - chartMargin.top - chartMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        chart1Svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

    //Second chart - svg images from London

    var chart2Svg = d3.select("#chart2")
        .append("svg")
        .attr("width", chartWidth - chartMargin.left - chartMargin.right)
        .attr("height", chartHeight - chartMargin.top - chartMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        chart2Svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);


    // Third chart SVG images for the number of women from outside London
    var chartFromOutsideLondonSvg = d3.select("#chart3")
        .append("svg")
        .attr("width", chartWidth - chartMargin.left - chartMargin.right)
        .attr("height", chartHeight - chartMargin.top - chartMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        chartFromOutsideLondonSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

    //fourth chart showing SVG images for the number of women from unknown locations
    var chartFromUnkownSvg = d3.select("#chart4")
        .append("svg")
        .attr("width", chartWidth - chartMargin.left - chartMargin.right)
        .attr("height", chartHeight - chartMargin.top - chartMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        chartFromUnkownSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

    //Load the data then call the main function 'ready' to join the data sets 
    queue()
        .defer(d3.json, "data/topo_lad.json") //Topojson file of UK local authorities
        .defer(d3.csv, "data/boroughs.csv") //local authorities - name, code, lat and long = locations
        .defer(d3.csv, "data/routes_summary.csv") //routes between local authorities = routes

    .await(ready);


    function ready(error, uk, locations, routes) {
        //error
        if (error) throw error;
        
        //uk - topo_lad.json
        uk = uk;

        var mapTopojson = topojson.feature(uk, uk.objects.lad).features;

        //create the map
            boroughs.selectAll("path")
                .data(mapTopojson)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", function(d) { return "LAD13CD " + d.id; })
                .attr("id", function(d) { return d.id; })
                .on("mouseover", function(d) { showInfoAll.call(this, d); })
                .on("mouseout", function(d) { removeInfo(); });

        //Display calls to action
            d3.select("#tooltip_hover")
                .html( "<b>All journeys </b><br> Hover over or touch a London borough");

            d3.select("#tooltip_hover")
                 .classed("hidden", false);

      		d3.select("#instruction")
                .html( "<span class='tooltip_heading'>Domestic Abuse Migration Map</span><br>" +
                    "<span class='tooltip_text'> Women's journeys to access refuge in London, 1st April 2015 - 31st March 2016<br><br>" +
                    "<span id='allH1'>Showing all journeys</span><br><br><b>Roll over</b> the London boroughs to discover the journeys " +
                    "women made<br><br><b>Use the buttons above</b> the map to see just those arriving or leaving");

            d3.select("#instruction")
                 .classed("hidden", false);

        //locations = boroughs.csv - All UK local authorities
        locations = locations;

        var boroughNameById = d3.map(); //Borough name
            boroughBeds= d3.map(); //Number of beds in the borough

           //Routes into each Borough
            boroughRefugeTotal = d3.map(); // total number of women accessing refuge in the borough
            originBorough = d3.map(); //Count of women from the borough
            originKnownLondon = d3.map();
            originLondon = d3.map(); //Other London boroughs, where origin is known and unknown
            originLondonUnknown = d3.map(); //Other London, origin is unknown
            originUK = d3.map(); //Outside London where origin is known and unknown
            originUnknown = d3.map(); //Outside London, origin is unknown

            //Routes out of borough
            refugeAccess = d3.map(); //total number of women from borough accessing refuge (in borough and in London)
            destinationBorough = d3.map(); //number accessing refuge in their own borough
            destinationLondon = d3.map(); //number accessing refuge in other London boroughs
            helplineCallsById = d3.map();

        locations.forEach (function (d) {
            boroughNameById.set([d.code], d.name);
            boroughBeds.set([d.code], +d.beds);

            //Routes into each Borough
            boroughRefugeTotal.set([d.code], +d.boroughRefugeTotal);
            originBorough.set([d.code], d.originOwnBorough);
            originKnownLondon.set([d.code], d.originOtherLondon_known);
            originLondon.set([d.code], +d.originLondonTotal);
            originLondonUnknown.set([d.code], +d.originOtherLondonUnknown);
            originUK.set([d.code], +d.originOutsideLondonTotal);
            originUnknown.set([d.code], +d.originUnknown);

            //Routes out of borough
            refugeAccess.set([d.code], +d.boroughHousedLondonTotal);
            destinationBorough.set([d.code], +d.boroughHousedOwnBorough);
            destinationLondon.set([d.code], +d.boroughHousedLondon);
            helplineCallsById.set([d.code], d.helplineCalls);
          });

        routes = routes;

        function showInfoAll (d) {

        	d3.select("#instruction")
            	.classed("hidden", true);

            var code = d.id;

            //Filter Routes: Journeys into this borough from London, not including routes within borough
            var routesArrivingLondon = routes.filter(function (d)
                { if (d.lad_arrive_code == code && d.lad_depart_london == 1 && d.lad_depart_code != code && d.lad_depart_name != "Unknown London")
                { return true; } });

            //calculate the number of boroughs women arrive from (not including own borough)
            var boroughNumbersArrive = routesArrivingLondon.length; 

            //Filter Routes: Only include those which are unknown or outside london
            var routesUnknownOrOutsideLondon = routes.filter(function (d) { if ( d.lad_arrive_code == code && d.totalsNotLondon == 1 ) 
                {return true ;}   });

            //Filter Routes: Include all routes
            var routesArrivingLondonAndOutside = routes.filter(function (d) 
                { if ( d.lad_arrive_code == code && d.routesArrivingLondonAndOutside == 1 ) {return true ;}   });

            //Routes leaving this borough to other london boroughs, including routes within borough
            var routesDepartingLondon = routes.filter(function (d) 
                { if (d.lad_depart_code == code && d.lad_depart_london == 1) { return true; } });
            //Routes leaving this borough to other london boroughs, not including routes within borough
            var routesDepartingLondonOther = routes.filter(function (d) 
                { if (d.lad_depart_code == code && d.lad_depart_london == 1 && d.lad_arrive_code != code) { return true; } });

            var boroughNumbersDepart = routesDepartingLondonOther.length;

            // Set up the arrows for each route
            var arrowsAll = svg.append("svg:defs").selectAll("marker")
                .data(["end"])  // Different link/path types can be defined here
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");
            // display routes in to each borough
            var pathsIn = boroughs.selectAll(".routesin")
                .data(routesArrivingLondonAndOutside)
                .enter()
                .append("path")
                .attr("d", flyIn);

            //add a circle to each origin
            origin_circles.selectAll("circle")
                .data(routesArrivingLondonAndOutside)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return projection([+d.lon_depart, +d.lat_depart])[0]; })
                .attr("cy", function (d) { return projection([+d.lon_depart, +d.lat_depart])[1]; })
                .attr("r", function (d) { if (d.count == 1 ) { return 6; } else if (d.count > 14 ) { return 43 ; } else { return d.count*3 + 2; }});

            //add text to each circle denoting number of women coming from that borough
            origin_circles.selectAll("text")
                .data(routesArrivingLondonAndOutside)
                .enter()
                .append("text")
                .attr("x", function (d) { return projection([+d.lon_depart, +d.lat_depart])[0]; })
                .attr("y", function (d) { return projection([+d.lon_depart, +d.lat_depart])[1]; })
                .attr("dy", "0.32em")
                // .attr("dx", "0.1em")
                .text(function (d) {return d.count; })
                .attr("class", "circleLabel");

            //Add rectangle for unknown and outside london locations
            rectangle.selectAll("rect")
                .data(routesUnknownOrOutsideLondon)
                .enter()
                .append("rect")
                .attr("x", function (d) { return projection([+d.lon_depart -0.05, +d.lat_depart + 0.038 ])[0]; })
                .attr("y", function (d) { return projection([+d.lon_depart -0.05, +d.lat_depart + 0.038 ])[1]; })
                .attr("height", 110)
                .attr("width", 96)
                .attr("class", "rectangle");

            //add heading to rectangles for unspecified London/ unknown/outside London/
            rectangle.selectAll("text")
                .data(routesUnknownOrOutsideLondon)
                .enter()
                .append("text")
                .attr("x", function (d) { return projection([+d.lon_depart -0.046, +d.lat_depart + 0.03])[0]; })
                .attr("y", function (d) { return projection([+d.lon_depart -0.046, +d.lat_depart + 0.03])[1]; })
                .html(function (d) {return d.lad_depart_name ; });

            // Set up the arrows for each route
            var arrowsout = svg.append("svg:defs").selectAll("marker")
                .data(["end"])  // Different link/path types can be defined here
                .enter().append("svg:marker")    // This section adds in the arrows
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            // Show paths out of borough
            var pathsOut = boroughs.selectAll(".routesout")
                .data(routesDepartingLondon)
                .enter()
                .append("path")
                .attr("d", flyOut);

            //add a circle to each destination
                destination_circles.selectAll("circle")
                    .data(routesDepartingLondon)
                    .enter()
                    .append("circle")
                    .attr("class", "circle_destinations")
                    .attr("cx", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[0]; })
                    .attr("cy", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[1]; })

                    .attr("r", function (d) { if (d.count == 1 ) { return 6; } else { return d.count * 3 + 2; } });

            //add text to each circle denoting number of women going to that borough
                destination_circles.selectAll("text")
                    .data(routesDepartingLondon)
                    .enter()
                    .append("text")
                    .attr("x", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[0]; })
                    .attr("y", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[1]; })
                    .attr("dy", "0.32em")
                    .text(function (d) {return d.count; })
                    .attr("class", "circleLabel");


            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //showInfoAll mouseover: ALL ROUTES SUMMARY - TEXT. Each number has it's own id and color//
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //InfoWindow Heading
            var heading = d3.select("#infowindowHeading")
                .append("text")
                .html(function (d) { if (boroughNameById.get(code) === undefined) {return null; } else { return boroughNameById.get(code);} })
                .attr("class", "tooltip_heading");


            var refugeSpaces = d3.select("#totalRefuge")
                .append("text")
                .html( function (d) { if (boroughRefugeTotal.get(code) === undefined ) { return null; }
                        else if (boroughBeds.get(code) < 1 ) { return "<span id='spaces'>No </span> refuge spaces available"; }
                        else { return  "<span id='spaces'>" + boroughBeds.get(code) + " </span> refuge spaces available" ; }         }  )
                .attr("class", "tooltip_text");

                        var helplineCalls = d3.select("#helplineCalls")
                .append("text")
                .html( function (d) { if (helplineCallsById.get(code) === undefined) { return null; }
                        else if (helplineCallsById.get(code) < 1 ) 
                            { return "<span id='helplinecalls'>No </span> calls to the National Domestic Violence Helpline recorded. "; }
                        else 
                            { return "<span id='helplinecalls'>" + helplineCallsById.get(code) + 
                            " </span> calls to the National Domestic Violence Helpline. "; }         }  )
                .attr("class", "tooltip_text");

            var arrivalsHeading = d3.select("#arrivalsHeading")
                .append("text")
                .html( function (d) { if (boroughRefugeTotal.get(code) === undefined ) { return null; }
                        else { return  "<span id='arrivingH1'>Arriving to access refuge</span><span id='arriving'>" ; }  }  )
                .attr("class", "tooltip_text");


            var arrivalsInfo = d3.select("#arrivalsInfo")
                .append("text")
                .html( function (d) { if (boroughRefugeTotal.get(code) === undefined) { return null; }
                        else if ( boroughRefugeTotal.get(code) < 1) 
                            { return "<span id='arriving'>No </span> women were able to seek refuge in this borough." ; }
                        else 
                            { return  "<span id='arriving'>" + boroughRefugeTotal.get(code) + " </span>" + "  women accessed a refuge in " 
                            + boroughNameById.get(code) ; }         }  )
                .attr("class", "tooltip_text");

            var originFromBoroughText = d3.select("#arrivalsInfo")
                .append("text")
                .html( function (d) { if (boroughRefugeTotal.get(code) === undefined || boroughRefugeTotal.get(code) < 1 ) { return null; }
                        else if ( originBorough.get(code) < 1) 
                            { return ". Of these, <span id='arriving'>none*</span> were from " + boroughNameById.get(code) + ". " ; }
                        else if ( originBorough.get(code) == 1) 
                            { return ", including <span id='arriving'>" + originBorough.get(code) + "*</span></b> woman from " 
                                + boroughNameById.get(code) + ". " ; }
                        else { return  ", including <span id='arriving'>" + originBorough.get(code) + "*</span> women from " 
                            + boroughNameById.get(code) + ". " ; }         }  )
                .attr("class", "tooltip_text");

           var departuresHeading = d3.select("#departuresHeading")
                .append("text")
                .html( function (d) { if (refugeAccess.get(code) === undefined ) { return null; }
                    else { return "<span id='leavingH1'>Leaving to seek refuge**</span>" ; } } )
                .attr("class", "tooltip_text");


            var accessingRefugeText = d3.select("#departuresInfo")
                .append("text")
                .html( function (d) { if (refugeAccess.get(code) === undefined) { return null; }
                    else if ( refugeAccess.get(code) == destinationLondon.get(code)) 
                        { return "<span id='leaving'>" + refugeAccess.get(code) + " </span>" + " women from " 
                        + boroughNameById.get(code) + " were placed in a refuge in London. Of these, <span id='leaving'>" 
                        + destinationLondon.get(code) + "</span> left " + boroughNameById.get(code) + " to access a refuge."; }
                    else if ( originBorough.get(code) < 2) { return "<span id='leaving'>" + refugeAccess.get(code) + " </span>" 
                        + " woman from " + boroughNameById.get(code) + " were placed in a refuge in London. Of these, <span id='leaving'>" 
                        + destinationLondon.get(code) + "</span> left " + boroughNameById.get(code) + " to access a refuge."; }
                    else { return "<span id='leaving'>" + refugeAccess.get(code) + " </span>" + " women from " + boroughNameById.get(code) 
                        + " were placed in a refuge in London. Of these, <span id='leaving'>" + destinationLondon.get(code) + "</span> left " 
                        + boroughNameById.get(code) + " to access a refuge."; }         } )
                .attr("class", "tooltip_text");

            var astrix = d3.select("#astrix")
                .append("text")
                .html(function (d) { if (refugeAccess.get(code) === undefined ) { return null; } else 
                    { return "<span id='arrivingAstrix'>*</span>This is likely to be higher due to some unknown London or unspecified locations." 
                    + "<br><span id='leavingAstrix'>**</span>Where relevant, this includes women who stay in the borough." + 
                    " There is no data for those women leaving London to seek refuge." ; } })
                .attr("class", "astrix");

        }

        function showInfoIn () {

	            boroughs.selectAll("path")
	                .data(mapTopojson)
	                .enter()
	                .append("path")
	                .attr("d", path)
	                .attr("class", function(d) { return "LAD13CD " + d.id; })
	                .attr("id", function(d) { return d.id; })
	                .on("mouseover", function(d) { showroutesIn.call(this, d); })
	                .on("mouseout", function(d) { removeInfo(); });

	            d3.select("#tooltip_hover")
	                .html( "<b>Arriving to access a refuge </b><br> Hover over or touch a London borough");

	                d3.select("#tooltip_hover")
	                    .classed("hidden", false);

	            d3.select("#instruction")
	                .html( "<span class='tooltip_heading'>Domestic Abuse Migration Map</span> <br>"+
                        "<span class='tooltip_text'> Women's journeys to access refuge in London, 1st April 2015 - 31st March 2016<br><br>" +
                        "<span id='arrivingH1'>Showing journeys arriving</span><br><br><b>Roll over</b> the London boroughs to discover the" + 
                        " journeys women made<br><br><b>Use the buttons above</b> the map to see all journeys or just those leaving");

	            d3.select("#instruction")
	                 .classed("hidden", false);

            function showroutesIn (d) {

            	d3.select("#instruction")
            		.classed("hidden", true);

                var code = d.id;
                var boroughName = boroughNameById.get(code);
                var refugeTotal = boroughRefugeTotal.get(code);

                //Routes coming into this borough from London, not including routes within borough or unknown london routes
                var routesArrivingLondon = routes.filter(function (d) 
                {if(d.lad_arrive_code == code && d.lad_depart_london == 1 && d.lad_depart_name != "Unknown London" && d.lad_depart_code != code) 
                    { return true; } });
                //Only show routes which are unknown London, unknown or a summary of outside London (known and unknown)
                var routesUnknownOrOutsideLondon = routes.filter(function (d) 
                    { if ( d.lad_arrive_code == code && d.totalsNotLondon == 1 ) {return true ;}   });

                var routesArrivingLondonAndOutside = routes.filter(function (d) 
                    { if ( d.lad_arrive_code == code && d.routesArrivingLondonAndOutside == 1 ) {return true ;}   });
                var boroughNumbersIn  = routesArrivingLondon.length;
               // Set up the arrows for each route
                var arrows = svg.append("svg:defs").selectAll("marker")
                    .data(["end"])  // Different link/path types can be defined here
                    .enter().append("svg:marker")    // This section adds in the arrows
                    .attr("id", String)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 15)
                    .attr("refY", -1.5)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");

        // display routes in to each borough
                var pathsIn = boroughs.selectAll(".routesin")
                    .data(routesArrivingLondonAndOutside)
                    .enter()
                    .append("path")
                    .attr("d", flyIn);

        //Add rectangle for unknown and outside london locations
                rectangle.selectAll("rect")
                    .data(routesUnknownOrOutsideLondon)
                    .enter()
                    .append("rect")
                    .attr("x", function (d) { return projection([+d.lon_depart -0.05, +d.lat_depart + 0.038 ])[0]; })
                    .attr("y", function (d) { return projection([+d.lon_depart -0.05, +d.lat_depart + 0.038 ])[1]; })
                    .attr("height", 110)
                    .attr("width", 96)
                    .attr("class", "rectangle");

                rectangle.selectAll("text")
                    .data(routesUnknownOrOutsideLondon)
                    .enter()
                    .append("text")
                    .attr("x", function (d) { return projection([+d.lon_depart -0.043, +d.lat_depart + 0.03])[0]; })
                    .attr("y", function (d) { return projection([+d.lon_depart -0.043, +d.lat_depart + 0.03])[1]; })
                    .html(function (d) {return d.lad_depart_name ; });

            //add a circle to each origin
                origin_circles.selectAll("circle")
                    .data(routesArrivingLondonAndOutside)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return projection([+d.lon_depart, +d.lat_depart])[0]; })
                    .attr("cy", function (d) { return projection([+d.lon_depart, +d.lat_depart])[1]; })
                    .attr("r", function (d) 
                        { if (d.count == 1 ) { return 6; } else if (d.count > 14 ) { return 43 ; } else { return d.count * 3 + 2; } });

            //add text to each circle denoting number of women coming from that borough
                origin_circles.selectAll("text")
                    .data(routesArrivingLondonAndOutside)
                    .enter()
                    .append("text")
                    .attr("x", function (d) { return projection([+d.lon_depart, +d.lat_depart])[0]; })
                    .attr("y", function (d) { return projection([+d.lon_depart, +d.lat_depart])[1]; })
                    .attr("dy", "0.32em")
                    // .attr("dx", "0.1em")
                    .text(function (d) {return d.count; })
                    .attr("class", "circleLabel");

            // add place names
                labels.selectAll("text")
                    .data(routesArrivingLondon)
                    .enter()
                    .append("text")
                    .attr("class", "placeLabelOrigin")
                    .attr("x", function(d) { return projection([+d.lon_depart, +d.lat_depart])[0]; })
                    .attr("y", function(d) { return projection([+d.lon_depart, +d.lat_depart])[1]; })
                    .attr("dy", function (d) { if (+d.lat_depart < 51.5) { return "2em"; } else {return "-2em"; }})
                    .attr("dx", function (d) { if (+d.lon_depart < -0.15 ) { return "-2em"; } else {return "2em"; }})
                    .text(function (d){ return d.lad_depart_name; });


            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //showInfoIN mouseover: ONLY PINK ROUTES IN - TEXT AND CHARTS. Each number has it's own id and color//
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                //infoWindow heading, borough selected on Mouseover
                    var heading = d3.select("#infowindowHeading")
                        .append("text")
                        .html(function (d) { if (boroughName === undefined ) {return null; } else { return boroughName; } })
                        .attr("class", "tooltip_heading");

                    var totalRefugeText = d3.select("#totalRefugeArrivals")
                        .append("text")
                        .html( function (d) { if (refugeTotal === undefined ) { return null; }
                                else if (refugeTotal < 1 ) { return "There were no refuge spaces available in " 
                                    + boroughName + " at the end of March 2016."; }
                                else { return  "Of the <span id='arriving'>" + refugeTotal + "</span> women who accessed refuge space in " 
                                    + boroughName + ":" ; }         } )
                        .attr("class", "tooltip_text");

                //chart 1  - Women from this borough
                    var originFromBoroughText = d3.select("#text1")
                        .append("text")
                        .html( function (d) { if (refugeTotal === undefined || refugeTotal < 1 ) { return null; }
                                else if ( originBorough.get(code) < 1) { return "No one came from " + boroughName; }
                                else if ( originBorough.get(code) < 2) { return originBorough.get(code) + " woman came from " + boroughName; }
                                else { return  originBorough.get(code) + " women came from " + boroughName ; }         }  )
                        .attr("class", "chart_text");

                    var originBoroughPositions = [];
                        for(var i = 1;
                        i <= originBorough.get(code); i++)
                        { originBoroughPositions.push(i); }

                    var chartFromBorough = chart1Svg
                        .selectAll(".chart")
                        .data(originBoroughPositions)
                        .enter()
                        .append("image")
                        .attr("xlink:href", "img/womanArriving.svg")
                        .attr("x", -30)
                        .attr("y", 0)
                        .attr("width", 14)
                        .attr("height", 18)
                        .attr("transform", function(d){return 'translate('+ (xScale(d)) + ')';}) //move svgs along x-axis depending on pixel width
                        .attr("class", "chart");

                // chart 2 - women from within London
                    var chartFromLondonText = d3.select("#text2")
                        .append("text")
                        .html( function (d) { if (refugeTotal === undefined || refugeTotal < 1 ) { return null; }
                                else if (originLondon.get(code) < 1 ) 
                                    { return "No one came from other London boroughs"; }
                                else if (originLondonUnknown.get(code) < 1 ) 
                                    { return originLondon.get(code) + " women came from " + routesArrivingLondon.length 
                                    + " other London boroughs"; }
                                else if (originLondonUnknown.get(code) == 1 && routesArrivingLondon.length < 1 ) 
                                    { return originLondon.get(code) + " women came from other London boroughs (including " 
                                        + originLondonUnknown.get(code) + " unknown)" ; }
                                else 
                                    { return originLondon.get(code) + " women came from " + routesArrivingLondon.length + 
                                    " other London boroughs (including " + originLondonUnknown.get(code) + " unknown)" ; } }  )
                        .attr("class", "chart_text");


                    var originLondonPositions = [];
                        for(var j = 1;
                        j <= originLondon.get(code); j++)
                        { originLondonPositions.push(j); }

                    var chartFromLondon = chart2Svg
                        .selectAll(".chart")
                        .data(originLondonPositions)
                        .enter()
                        .append("image")
                        .attr("xlink:href", "img/womanArriving.svg")
                        .attr("x", -30)
                        .attr("y", 0)
                        .attr("width", 14)
                        .attr("height", 18)
                        .attr("transform", function(d){return 'translate('+ (xScale(d)) + ')';}) //move svgs along x-axis depending on pixel width
                        .attr("class", "chart");

                //chart 2 - women from outside London or unknown locations
                    var UKplusUnknown = (originUK.get(code) + originUnknown.get(code));

                    var chartFromOutsideLondonText = d3.select("#text3")
                        .append("text")
                        .html( function (d) { if (originUK.get(code) === undefined ) { return null; }
                                else if (refugeTotal < 1 ) { return null; }
                                else if (originUK.get(code) < 1 ) { return "No one came from outside London"; }
                                else { return originUK.get(code) + " women came from outside London" ; }         }  )
                        .attr("class", "chart_text");

                    var originUKPositions = [];
                        for(var k = 1;
                        k <= originUK.get(code); k++)
                        { originUKPositions.push(k); }

                    var chartFromOutsideLondon = chartFromOutsideLondonSvg
                        .selectAll(".chart")
                        .data(originUKPositions)
                        .enter()
                        .append("image")
                        .attr("xlink:href", "img/womanArriving.svg")
                        .attr("x", -30)
                        .attr("y", 0)
                        .attr("width", 14)
                        .attr("height", 18)
                        .attr("transform", function(d){return 'translate('+ (xScale(d)) + ')';}) //move svgs along x-axis depending on pixel width
                        .attr("class", "chart");

                //Chart 4 - Unknown locations

                     var originUnknownText = d3.select("#text4")
                        .append("text")
                        .html( function (d) { if (refugeTotal === undefined || refugeTotal < 1) { return null; }
                                else if ( originUnknown.get(code) < 1) { return null; }
                                else if ( originUnknown.get(code) == 1) { return originUnknown.get(code) 
                                    + " women came from an unspecified location "; }
                                else { return  originUnknown.get(code) 
                                    + " women came from unspecified locations" ; }         }  )
                        .attr("class", "chart_text");

                    var originUnkownPositions = [];
                        for(var l = 1;
                        l <= originUnknown.get(code); l++)
                        { originUnkownPositions.push(l); }

                    var chartFromUnkown = chartFromUnkownSvg
                        .selectAll(".chart")
                        .data(originUnkownPositions)
                        .enter()
                        .append("image")
                        .attr("xlink:href", "img/womanArriving.svg")
                        .attr("x", -30)
                        .attr("y", 0)
                        .attr("width", 14)
                        .attr("height", 18)
                        .attr("transform", function(d){return 'translate('+ (xScale(d)) + ')';})
                        .attr("class", "chart");

            }

        }

        function showInfoOut () {

            boroughs.selectAll("path")
                .data(mapTopojson)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", function(d) { return "LAD13CD " + d.id; })
                .attr("id", function(d) { return d.id; })
                .on("mouseover", function(d) { showroutesOut.call(this, d); })
                .on("mouseout", function(d) { removeInfo(); });

            d3.select("#tooltip_hover")
                .html( "<b>Leaving to seek refuge</b> <br>Hover over or touch a London borough");

            //Show the tooltip
            d3.select("#tooltip_hover")
                    .classed("hidden", false);

            d3.select("#instruction")
                .html( "<span class='tooltip_heading'>Domestic Abuse Migration Map</span>" +
                    " <br><span class='tooltip_text'> Women's journeys to access refuge in London, 1st April 2015 - 31st March 2016<br><br>" + 
                    "<span id='leavingH1'>Showing journeys leaving</span><br><br><b>Roll over</b> the London boroughs to discover the journeys" + 
                    " women made<br><br><b>Use the buttons above</b> the map to see all journeys or just those leaving");

            d3.select("#instruction")
                 .classed("hidden", false);

            function showroutesOut (d) {

            d3.select("#instruction")
            	.classed("hidden", true);

                var code = d.id;
                var boroughName = boroughNameById.get(code);


                //Routes leaving this borough to other london boroughs, not including routes within borough
                var routesDepartingLondon = routes.filter(function (d) 
                        { if (d.lad_depart_code == code && d.lad_depart_london == 1) { return true; } });

                // out of each borough
                var pathsOut = boroughs.selectAll(".routesout")
                    .data(routesDepartingLondon)
                    .enter()
                    .append("path")
                    .attr("d", flyOut);

            //add a circle to each destination
                destination_circles.selectAll("circle")
                    .data(routesDepartingLondon)
                    .enter()
                    .append("circle")
                    .attr("class", "circle_destinations")
                    .attr("cx", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[0]; })
                    .attr("cy", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[1]; })

                    .attr("r", function (d) { if (d.count == 1 ) { return 6; } else { return d.count * 3 + 2; } });

            //add text to each circle denoting number of women going to that borough
                destination_circles.selectAll("text")
                    .data(routesDepartingLondon)
                    .enter()
                    .append("text")
                    .attr("x", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[0]; })
                    .attr("y", function (d) { return projection([+d.lon_arrive+0.025, +d.lat_arrive])[1]; })
                    .attr("dy", "0.32em")
                    .text(function (d) {return d.count; })
                    .attr("class", "circleLabel");

                // add place names
                labels.selectAll("text")
                    .data(routesDepartingLondon)
                    .enter()
                    .append("text")
                    .attr("class", "placeLabelDeparture")
                    .attr("x", function(d) { return projection([+d.lon_arrive, +d.lat_arrive])[0]; })
                    .attr("y", function(d) { return projection([+d.lon_arrive, +d.lat_arrive])[1]; })
                    .attr("dy", function (d) { if (+d.lat_arrive < 51.5) { return "2em"; } else {return "-2em"; }})
                    .attr("dx", function (d) { if (+d.lon_arrive < -0.15 ) { return "-2em"; } else {return "2em"; }})
                    .text(function (d){ return d.lad_arrive_name; });


            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //showInfoOUT mouseover: ONLY BLUE ROUTES OUT - TEXT AND CHARTS. Each number has it's own id and color//
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                //infoWindow heading, borough selected on Mouseover
                var heading = d3.select("#infowindowHeading")
                    .append("text")
                    .html(function (d) { if (boroughNameById.get(code) === undefined) {return null; } else { return boroughNameById.get(code); } })
                    .attr("class", "tooltip_heading");

                var helplineCalls = d3.select("#helplineCalls")
                    .append("text")
                    .html( function (d) { if (helplineCallsById.get(code) === undefined) { return null; }
                            else if (helplineCallsById.get(code) < 1 ) 
                                { return "There were <span id='helplinecalls'>no</span> calls to the " + 
                                "National Domestic Violence Helpline recorded from " 
                            + boroughNameById.get(code) + "."; }
                            else 
                                { return "There were <span id='helplinecalls'>" + helplineCallsById.get(code) +
                            "</span> calls to the National Domestic Violence Helpline recorded from " + boroughNameById.get(code) + "."; }  }  )
                    .attr("class", "tooltip_text");


                var accessingRefugeText = d3.select("#departuresInfo")
                    .append("text")
                    .html( function (d) { if (refugeAccess.get(code) === undefined ) { return null; }
                        else if ( refugeAccess.get(code) == destinationLondon.get(code)) 
                            { return "Of the <span id='leaving'>" + refugeAccess.get(code) + " </span>" + " women from " 
                                    + boroughNameById.get(code) + " placed in a refuge in London*: "; }
                        else if ( originBorough.get(code) < 2) 
                            { return "Of the <span id='leaving'>" + refugeAccess.get(code) + " </span>" + " woman from " 
                                    + boroughNameById.get(code) + " placed in a refuge in London*:" ; }
                        else 
                            { return "Of the <span id='leaving'>" + refugeAccess.get(code) + " </span>" + " women from " 
                                    + boroughNameById.get(code) + " placed in a refuge in London*:"; }         } )
                .attr("class", "tooltip_text");


                // chart 1 - women moving to other London boroughs

                var chartToLondonText = d3.select("#text1")
                    .append("text")
                    .html( function (d) { if (refugeAccess.get(code) === undefined  || refugeAccess.get(code) < 1 ) { return null; }
                            else if (destinationLondon.get(code) < 1 ) { return "No one travelled to other London boroughs"; }
                            else { return destinationLondon.get(code) + 
                                " women travelled to " + routesDepartingLondon.length + " other London boroughs" ; }         }  )
                    .attr("class", "chart_text");

                var destinationLondonPositions = [];
                    for(var i = 1;
                    i <= destinationLondon.get(code); i++)
                    { destinationLondonPositions.push(i); }

                var chartFromLondon = chart1Svg
                    .selectAll(".chart")
                    .data(destinationLondonPositions)
                    .enter()
                    .append("image")
                    .attr("xlink:href", "img/womanLeaving.svg")
                    .attr("x", -30)
                    .attr("y", 0)
                    .attr("width", 14)
                    .attr("height", 18)
                    .attr("transform", function(d){return 'translate('+ (xScale(d)) + ')';})
                    .attr("class", "chart");

                //chart 2  - Women from this borough
                var stayInBoroughText = d3.select("#text2")
                    .append("text")
                    .html( function (d) { if (refugeAccess.get(code) === undefined || refugeAccess.get(code) < 1 ) { return null; }
                            else if ( destinationBorough.get(code) < 1) { return "No one stayed in " + boroughName; }
                            else { return  destinationBorough.get(code) + " women stayed in " + boroughName ; }         }  )
                    .attr("class", "chart_text");

                var stayInBoroughPositions = [];
                    for(var j = 1;
                    j <= destinationBorough.get(code); j++)
                    { stayInBoroughPositions.push(j); }

                var chartFromBorough = chart2Svg
                    .selectAll(".chart")
                    .data(stayInBoroughPositions)
                    .enter()
                    .append("image")
                    .attr("xlink:href", "img/womanLeaving.svg")
                    .attr("x", -30)
                    .attr("y", 0)
                    .attr("width", 14)
                    .attr("height", 18)
                    .attr("transform", function(d){return 'translate('+ (xScale(d)) + ')';}) //move svgs along x-axis depending on pixel width
                    .attr("class", "chart");

                var astrix = d3.select("#astrix2")
                .append("text")
                .html(function (d) { if (refugeAccess.get(code) === undefined ) { return null; } else 
                    { return "*Note there is no data for those women leaving London to seek refuge." ; } })
                .attr("id", "astrix2");

            }
        }

        function removeInfo () {

            d3.selectAll("circle")
                .remove();

            d3.selectAll("rect")
                .remove();

            d3.selectAll(".routesin")
                .remove();

            d3.selectAll(".routesout")
                .remove();

            d3.selectAll(".arrowIn")
                .remove();

            d3.selectAll(".arrowOut")
                .remove();

            d3.selectAll("text")
                .remove();

            d3.selectAll(".tooltip_heading")
                .remove();

            d3.selectAll(".tooltip_text")
                .remove();

            d3.selectAll(".astrix")
                .remove();

            d3.selectAll(".chart")
                .remove();

            d3.select("#tooltip_hover")
            	.classed("hidden", true);

            d3.select("#instruction")
            	.classed("hidden", true);


        }


        //buttons/event listeners for updating data on routes/arcs
    //1 Show routes in and out
        $('#all').on('click',function () {

            d3.selectAll("path").remove();

            boroughs.selectAll("path")
                .data(mapTopojson)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", function(d) { return "LAD13CD " + d.id; })
                .attr("id", function(d) { return d.id; })
                .on("mouseover", function(d) { showInfoAll.call(this, d); })
                .on("mouseout", function(d) { removeInfo(); });

            d3.select("#tooltip_hover")
                .html( "<b>All journeys </b><br>Hover over or touch a London borough");
            d3.select("#tooltip_hover")
                .classed("hidden", false);

            d3.select("#instruction")
                .html( "<span class='tooltip_heading'>Domestic Abuse Migration Map</span>" + 
                    " <br><span class='tooltip_text'> Women's journeys to access refuge in London, 1st April 2015 - 31st March 2016<br><br>" + 
                    "<span id='allH1'>Showing all journeys</span><br><br><b>Roll over</b> the London boroughs to " + 
                    " discover the journeys women made<br><br><b>Use the buttons above</b> the map to see just those arriving or leaving");

            d3.select("#instruction")
                 .classed("hidden", false);

        });
    //2 Show routes in (Women arriving)
        $('#routesIn').on('click',function (e) {

            d3.selectAll("path").remove();
            showInfoIn();

        });

    //3 Show routes out (women leaving)
        $('#routesOut').on('click',function (e) {

            d3.selectAll("path").remove();
            showInfoOut();

        });

//This next curly brace closes the main function (ready) click/buttons don't work outside of this. 
// Other functions do and leave them outside of here to make them reuseable in and outside of the ready function.
}

//The following code is adapted from http://www.tnoda.com/blog/2014-04-02 to draw the arrows and create the transition along the paths, 
// it has been merged with the function to convert the latitude and longitude in this example 
// see http://bl.ocks.org/mhkeller/f41cceac3e7ed969eaeb

        function flyIn(d, origin, destination) {
            
            //this is adapted from http://bl.ocks.org/mhkeller/f41cceac3e7ed969eaeb
            var originFrom = [ +d.lon_depart, +d.lat_depart];
            var destinationTo = [ +d.lon_arrive, +d.lat_arrive ];
            var depart = d.lad_depart_name;

            var routeIn = boroughs.append("path")
                .datum({type: "LineString", coordinates: [ originFrom, destinationTo ] })
                .attr("class", "routesin")
                .attr("d", path);

            var l = routeIn.node().getTotalLength();

            var arrowIn = svg.append("path")
                .attr("class", "arrowIn")
                .attr("d", "M-5,0 L-15,15 L15,0 L-15,-15 Z");

            transitionIn(arrowIn, routeIn);
        }

        function transitionIn(arrowIn, routeIn) {
            var l = routeIn.node().getTotalLength();

            arrowIn.transition()
                .duration(l * 50)
                .attrTween("transform", deltaIn(arrowIn, routeIn.node()));

        }

        function deltaIn(arrowIn, pathIn) {
            var l = pathIn.getTotalLength();
            var moveArrowIn = arrowIn;
                return function(i) {
                  return function(t) {
                    var p = pathIn.getPointAtLength(t * l);

                    var t2 = Math.min(t + 0.05, 1);
                    var p2 = pathIn.getPointAtLength(t2 * l);

                    var x = p2.x - p.x;
                    var y = p2.y - p.y;

                    //adjust this for rotation of SVG arrow on path
                    var r = 360 - Math.atan2(-y, x) * 180 / Math.PI;
                    // the last number controls the size and the penultimate is the speed it comes up at
                    var s = Math.min(Math.sin(Math.PI * t) * 0.7, 0.4);

                    return "translate(" + p.x + "," + p.y + ") scale(" + s + ") rotate(" + r + ")";
                  };
                };
        }
        //blue routes out fo a borough
        function flyOut(d, origin, destination) {
            var originFrom = [ +d.lon_depart, +d.lat_depart];
            var destinationTo = [ +d.lon_arrive+0.025, +d.lat_arrive];
            var routeOut = boroughs.append("path")
               .datum({type: "LineString", coordinates: [ originFrom, destinationTo] })
               .attr("class", "routesout")
               .attr("d", path);

            var arrowOut = svg.append("path")
               .attr("class", "arrowOut")
               .attr("d", "M-5,0 L-15,15 L15,0 L-15,-15 Z");

            transitionOut(arrowOut, routeOut);

        }

        function transitionOut(arrowOut, routeOut) {
            var l = routeOut.node().getTotalLength();

            arrowOut.transition()
                .duration(l * 60)
                .attrTween("transform", deltaOut(arrowOut, routeOut.node()));

        }

        function deltaOut(arrowOut, pathOut) {
            var l = pathOut.getTotalLength();
            var moveArrowOut = arrowOut;
                return function(i) {
                    return function(t) {
                        var p = pathOut.getPointAtLength(t * l);

                        var t2 = Math.min(t + 0.05, 1);
                        var p2 = pathOut.getPointAtLength(t2 * l);

                        var x = p2.x - p.x;
                        var y = p2.y - p.y;

                        //adjust this for rotation of SVG arrow on path
                        var r = 360 - Math.atan2(-y, x) * 180 / Math.PI;
                        // the last numbers controls the size
                        var s = Math.min(Math.sin(Math.PI * t) * 0.7, 0.4);

                        return "translate(" + p.x + "," + p.y + ") scale(" + s + ") rotate(" + r + ")";
                    };
                };
        }

    $(window).resize(function() {

        var w = $("#map").width();
          svg.attr("width", w);
          svg.attr("height", w * height / width);
    });


