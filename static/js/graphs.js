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
	var medalDim = ndx.dimension(function(d) { return d["Medal"]; });
	var yearDim = ndx.dimension(function(d) { return d["Year"]; });
	var countryDim = ndx.dimension(function(d) { return d["Country"]; });
	var genderDim  = ndx.dimension(function(d) { return d["Gender"]; });

	//Calculate metrics
	var numByYear = yearDim.group()
	var numByMedal = medalDim.group();
	var numByGender = genderDim.group();
	var numByCountry = countryDim.group();

	//Define values (to be used in charts)
	var minYear = yearDim.bottom(1)[0]["Year"];
	var maxYear = yearDim.top(1)[0]["Year"]
	var max_country = numByCountry.top(1)[0].value ;

    //Charts
	var yearChart = dc.lineChart("#time-chart");
	var medalChart = dc.rowChart("#poverty-level-row-chart");
	var genderChart = dc.pieChart("#resource-type-row-chart");
	var worldChart = dc.geoChoroplethChart("#us-chart");

	yearChart
    .width(600)
    .height(160)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(yearDim)
    .group(numByYear)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minYear, maxYear]))
    .elasticY(true)
    .xAxisLabel("Year")
    .yAxisLabel("Medals")
    .yAxis().ticks(4);

	genderChart
        .width(300)
        .height(250)
        .dimension(genderDim)
        .group(numByGender);

	medalChart
		.width(300)
		.height(250)
        .dimension(medalDim)
        .group(numByMedal)
        .xAxis().ticks(4);


	worldChart.width(1200)
		.height(400)
		.dimension(countryDim)
		.group(numByCountry)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_country])
		.overlayGeoJson(worldJson["features"], "country", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.equirectangular())
		.title(function (p) {
			return "Country : " + p["key"]
					+ "\n"
					+ "Medals : " + Math.round(p["value"]);
		})

    dc.renderAll();
};