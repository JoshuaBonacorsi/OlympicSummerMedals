queue()
    .defer(d3.json, "/static/data/preprocessed_data.json")
    .defer(d3.json, "/static/geojson/world_map.json")
    .await(makeGraphs);

function makeGraphs(error, preprocdataJson, worldJson) {
	//Store dataJson data
	var data = preprocdataJson;

	// Correct Year column
	var dateFormat = d3.time.format("%Y");
	data.forEach(function(d) {
		d["Year"] = dateFormat.parse(d["Year"].toString());
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(data);

	//Define Dimensions
	var all = ndx.groupAll();
	var medalDim = ndx.dimension(function(d) { return d["Medal"]; });
	var yearDim = ndx.dimension(function(d) { return d["Year"]; });
	var countryDim = ndx.dimension(function(d) { return d["Country"]; });
	var genderDim  = ndx.dimension(function(d) { return d["Gender"]; });
	var athleteDim  = ndx.dimension(function(d) { return d["Athlete"]; });
	var sportDim = ndx.dimension(function(d) { return d["Sport"]; });
	var cityDim = ndx.dimension(function(d) { return d["City"]; });

	//Calculate metrics
	var numByYear = yearDim.group()
	var numByMedal = medalDim.group();
	var numByGender = genderDim.group();
	var numByCountry = countryDim.group();
	var numBySport = sportDim.group();
	var numByCity = cityDim.group();
	var athleteByYear = yearDim.group().reduceSum(function(d){return d.nb;})

	//Permet de compter pour un groupe spécifique, le nombre de lignes distinctes
	function unique_count_groupall(group) {
		return {
		  value: function() {
			return group.all().filter(kv => kv.value).length;
		  }
		};
	  }

	//Define values (to be used in charts)
	var minYear = yearDim.bottom(1)[0]["Year"];
	var maxYear = yearDim.top(1)[0]["Year"]
	var max_country = numByCountry.top(1)[0].value ;

    //Charts
	var yearChart = dc.lineChart("#year-chart");
	var medalChart = dc.rowChart("#medal-chart");
	var genderChart = dc.pieChart("#gender-chart");
	var sportChart = dc.rowChart("#sport-chart");
	var worldChart = dc.geoChoroplethChart("#world-chart");
	var numMBSChart = dc.numberDisplay("#total-medals-nd");
	var numABSChart = dc.numberDisplay("#total-athletes-nd");
	var cityChart = dc.barChart("#city-chart")
	var yearChart2 = dc.lineChart("#year-chart")


	yearChart
		.width(1200)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(yearDim)
		.group(numByYear)
		.colors(['#2E2EFF'])
		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))
		.elasticY(true)
		.yAxis().ticks(4);

	medalChart
		.width(430)
		.height(250)
        .dimension(medalDim)
        .group(numByMedal)
		.elasticX(true)
		.ordering(function(y){
			if(y.key == "Bronze") return 2;
			else if(y.key == "Silver") return 1;
			else return 0 ;
		})
		.colors(["#EACE65", "#F2F1F1","#9A6E4A"])
        .xAxis().ticks(4);
		
	cityChart
		.width(900)
		.height(400)
        .dimension(cityDim)
        .group(numByCity)
		.x(d3.scale.ordinal().domain(['Los Angeles','Barcelona','Atlanta','Moscow','Seoul','Athens','Montreal','Beijing','Sydney']))
        .xUnits(dc.units.ordinal)
		.colors(['#211193', '#2d0f9f', '#3a0baa', '#4607b6', '#5303c1', '#5f00cd', '#6b00d9', '#7800e4', '#8400f0'])
		.colorAccessor(function(d){
			cities = ['Los Angeles','Barcelona','Atlanta','Moscow','Seoul','Athens','Montreal','Beijing','Sydney']
			return cities.indexOf(d.x);})
		.elasticY(true)
        .yAxis().ticks(4);

	yearChart2
		.width(1250)
		.height(400)
        .dimension(yearDim)
        .group(athleteByYear)
		.x(d3.time.scale().domain([1976.0, 1980.0, 1984.0, 1988.0, 1992.0, 1996.0, 2000.0, 2004.0, 2008.0]))
		.elasticX(true)
		.colors(['#211193', '#2d0f9f', '#3a0baa', '#4607b6', '#5303c1', '#5f00cd', '#6b00d9', '#7800e4', '#8400f0'])
		.colorAccessor(function(d){
			var myDate = new Date(d.x);
			year = myDate.getFullYear();
			years = [1976.0, 1980.0, 1984.0, 1988.0, 1992.0, 1996.0, 2000.0, 2004.0, 2008.0]
			return years.indexOf(year);})
		.elasticY(true)
        .yAxis().ticks(4);

	genderChart
        .width(420)
        .height(250)
        .dimension(genderDim)
		.colors(["#211193","#D693E5"])
        .group(numByGender)
		.label(function (d) {
            var percent = (d.value / numByGender.all().reduce(function(a,b){return a+b.value;}, 0) * 100).toFixed(2);
            return d.data.key + ": " + percent + "%";});

	sportChart
		.width(900)
		.height(800)
		.dimension(sportDim)
		.group(numBySport)
		.elasticX(true)
		.colors(["#6115CB", "#6B24D0", "#7633D5", "#813CE1", "#8C45E6", "#974EF1", "#A056F6", "#AB5FFB", 
			"#B667FF", "#BF70FF", "#C97AFF", "#D283FF", "#DD8CFF", "#E695FF", "#F09EFF", "#FAA7FF", 
			"#FFA9FD", "#FFA0F4", "#FF98EC", "#FF8FE4", "#FF87DC", "#FF7ED4", "#FF76CC", "#FF6DBF", 
			"#FF65B7", "#FF5CAE", "#FF54A6", "#FF4B9E", "#FF4396"])
		.xAxis().ticks(4);

	worldChart.width(1250)
		.height(400)
		.dimension(countryDim)
		.group(numByCountry)
		.colors(["#D9D9FF", "#ADADFF", "#8080FF", "#5454FF", "#2929FF"])
		.colorDomain([0, max_country])
		.overlayGeoJson(worldJson["features"], "country", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.equirectangular())
		.title(function (p) {
			return "Country : " + p["key"]
					+ "\n"
					+ "Medals : " + Math.round(p["value"]);
		});

	numMBSChart
    .formatNumber(d3.format("d"))
    .valueAccessor(function(d){
		return d; })
    .group(all);

	numABSChart
    .formatNumber(d3.format("d"))
    .valueAccessor(function(d){
		return d; })
    .group(unique_count_groupall(athleteDim.group()));
		
    dc.renderAll();
};