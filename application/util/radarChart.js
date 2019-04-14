/*
 * Radar Chart Class
 * inspired by the work of alangrafu
 * https://github.com/alangrafu/radar-chart-d3
*/

class RadarChart {
	constructor(element, data, options) {
		this.config = {
			width: 600,				//width of diagram
			height: 600,			//heigth of diagram
			levels: 5,				//Number of displayed inner circles
			margin: {top:20, right:20, bottom:20, left:20},
			maxValue: 0,			//Value of the outermost point
			wrapWidth: 60,			//Word wrap after x pixels
			labelFactor: 1.2,		//Multiplier how far the out the labels should be placed in relation to radius
			opacityArea: 0.35,		//opacity of connected area
			dotRadius: 4,			//Radius of the dots
			opacityCircles: 0.075,	//opacity of the area in each circle
			strokeWidth: 2,			//Width of the stroke around each datapoint
			roundStrokes: false,	//If true there will be no hard corners
			color: d3.scaleOrdinal(d3.schemeCategory10)
		};

		this.element = element;
		this.data = data;

		if('undefined' !== typeof options) {
			for (const elem in options) {
				if ('undefined' !== typeof options[i]) {
					config[elem] = options[elem];
				}
			}
		}

		this.redraw();
	}

	redraw() {
		let maxValue = Math.max(this.config.maxValue, d3.max(this.data, function(i) {return d3.max(i.map(function(o) {return o.value}))}));

		let allAxis = (this.data[0].map(function(i, j){return i.axis})),
			total = allAxis.length,
			radius = Math.min(this.config.width/2, this.config.height/2),
			Format = d3.format('d'),
			angleSlice = Math.PI * 2 / total;

		let rScale = d3.scaleLinear()
			.range([0, radius])
			.domain([0, maxValue]);

		// Create Svg

		d3.select(this.element).select("svg").remove();

		let svg = d3.select(this.element).append("svg")
			.attr("width", this.config.width + this.config.margin.left + this.config.margin.right)
			.attr("height", this.config.height + this.config.margin.top + this.config.margin.bottom)
			.attr("class", "radar"+this.element);

		let g = svg.append('g')
			.attr("transform", "translate(" + (this.config.width/2 + this.config.margin.left) + "," + (this.config.height/2 + this.config.margin.top) + ")" );

		//glow Filter
		let filter = g.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

		//Wrapper for the grid & axes
		let axisGrid = g.append("g").attr("class", "axisWrapper");

		let level = Math.floor(maxValue/10);
		let step = level > 5 ? 2 : 1;

		axisGrid.selectAll(".levels")
			.data(d3.range(1, 2).reverse())
			.enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", function(d, i){return radius;})
			.style("fill", "#CDCDCD")
			.style("fill-opacity", this.config.opacityCircles)

		//Draw the background circles
		axisGrid.selectAll(".levels")
			.data(d3.range(step,(level+1), step).reverse())
			.enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", function(d, i){return (radius/maxValue)*d*10;})
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", this.config.opacityCircles)
			.style("filter" , "url(#glow)");

		//Indaction Text for lines
		axisGrid.selectAll(".axisLabel")
			.data(d3.range(1,(level+1)).reverse())
			.enter().append("text")
			.attr("class", "axisLabel")
			.attr("x", 4)
			.attr("y", function(d){return (radius/maxValue)*-d*10;})
			.attr("dy", "0.4em")
			.style("font-size", "10px")
			.attr("fill", "#737373")
			.text(function(d,i) { return Format(d * 5 * step); });

		//Draw axis
		//Create the straight lines radiating outward from the center
		let axis = axisGrid.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");
		//Append the lines
		axis.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
			.attr("class", "line")
			.style("stroke", "white")
			.style("stroke-width", "2px");

		//Append the labels at each axis
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", (function(d, i){ return rScale(maxValue * this.config.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); }).bind(this))
			.attr("y", (function(d, i){ return rScale(maxValue * this.config.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); }).bind(this))
			.text(function(d){return d})
			.call(this.wrap, this.config.wrapWidth);

		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////

		//The radial line function
		let radarLine = d3.radialLine()
			.curve(d3.curveLinearClosed)
			.radius(function(d) { return rScale(d.value); })
			.angle(function(d,i) {	return i*angleSlice; });

		if(this.config.roundStrokes) {
			radarLine.curve(d3.curveCardinalClosed)
		}

		//Create a wrapper for the blobs
		var blobWrapper = g.selectAll(".radarWrapper")
			.data(this.data)
			.enter().append("g")
			.attr("class", "radarWrapper");

		//Append the backgrounds
		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", function(d,i) { return radarLine(d); })
			.style("fill", (function(d,i) { return this.config.color(i); }).bind(this))
			.style("fill-opacity", this.config.opacityArea)
			.on('mouseover', function (d,i){
				//Dim all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1);
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);
			})
			.on('mouseout', (function(){
				//Bring back all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", this.config.opacityArea);
			}).bind(this));

		//Create the outlines
		blobWrapper.append("path")
			.attr("class", "radarStroke")
			.attr("d", function(d,i) { return radarLine(d); })
			.style("stroke-width", this.config.strokeWidth + "px")
			.style("stroke", (function(d,i) { return this.config.color(i); }).bind(this))
			.style("fill", "none")
			.style("filter" , "url(#glow)");

		//Append the circles
		blobWrapper.selectAll(".radarCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarCircle")
			.attr("r", this.config.dotRadius)
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", (function(d,i,j) { return this.config.color(j); }).bind(this))
			.style("fill-opacity", 0.8);

		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////

		//Wrapper for the invisible circles on top
		var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(this.data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");

		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", this.config.dotRadius*1.5)
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				let newX =  parseFloat(d3.select(this).attr('cx')) - 10;
				let newY =  parseFloat(d3.select(this).attr('cy')) -
				 10;

				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(Format(d.value))
					.transition().duration(200)
					.style('opacity', 1);
			})
			.on("mouseout", function(){
				tooltip.transition().duration(200)
					.style("opacity", 0);
			});

		//Set up the small tooltip for when you hover over a circle
		var tooltip = g.append("text")
			.attr("class", "tooltip")
			.style("opacity", 0);

	}

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text
	wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}//wrap
}

module.exports = RadarChart;
