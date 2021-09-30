async function getData(){
    let data = await d3.csv("wealth-health-2014.csv", d3.autoType);
    return data;
} 
getData().then(data => {
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 650 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let domain = data.map(item => item.Income);
    let range = data.map(item => item.LifeExpectancy);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(domain))
        .range([0, width])
    const yScale = d3.scaleLinear()
        .domain(d3.extent(range))
        .range([height, 0])
    svg.selectAll('.chart')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Income) + 10)
        .attr('cy', d => yScale(d.LifeExpectancy) - 10)
        .attr('r', (d) => {
            if (d.Population > 1000000000) {
                return 30;
            } else if (d.Population > 1000000) {
                return 8;
            } else if (d.Population > 100000) {
                return 4;
            } else {
                return 3;
            }
        })
        .attr('opacity', .6)
        .style('fill', (d) => colorScale(d.Region))
        .style('stroke', 'black')
        .on("mouseenter", (event, d) => {
        const pos = d3.pointer(event, window);
        const format = d3.format(",")
        d3.select(".tooltip")
            .html(
	        `<div>Country: ${d.Country}` 
            + `<div>Region: ${d.Region}` 
            + `<div>Population: ${format(d.Population)}` 
            + `<div>Income: ${format(d.Income)}` 
            + `<div>Life Expectancy: ${parseInt(d.LifeExpectancy)}` 
            )	 
	    // show the tooltip
            document.querySelector(".tooltip").setAttribute('style', `display: block; left: ${pos[0]}px; top: ${pos[1]}px`);
        })
        .on("mouseleave", (event, d) => {
	    // hide the tooltip 
            document.querySelector(".tooltip").setAttribute('style', 'display: none');
        });

    
    // Axis
    const xAxis = d3.axisBottom()
        .ticks(5, "s")
	    .scale(xScale);
    const yAxis = d3.axisLeft()
	    .scale(yScale);
    svg.append("g")
	    .attr("class", "axis x-axis")
	    .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
    svg.append("g")
	    .attr("class", "axis y-axis")
	    .call(yAxis);

    // Legend
    const regions = ['East Asia & Pacific', 'South Asia', 'America', 'Sub-Saharan Africa', 'Europe & Central Asia', 'Middle East & North Africa']
    svg.selectAll('.chart')
        .data(regions)
        .enter()
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('x', 450)
        .attr('y', (_, i) =>
            300 + 20*i
        )
        .style('fill', (d)=>colorScale(d));

    svg.selectAll('.chart')
        .data(regions)
        .enter()
        .append('text')
        .attr('height', 20)
        .attr('x', 475)
        .attr('y', (_, i) => (i * 20) + 310 )
        .text((d) => d)
        .attr('font-size', 13)
    
    let xAxisLabel = ['Income']
    svg.selectAll('.chart')
        .data(xAxisLabel)
        .enter()
        .append('text')
        .attr('height', 20)
        .attr('x', 550)
        .attr('y', 450)
        .text(d => d)
        .attr('font-size', 15)

    let yAxisLabel = ['Life Expectancy']
    svg.selectAll('.chart')
        .data(yAxisLabel)
        .enter()
        .append('text')
        .attr('height', 20)
        .attr('x', -100)
        .attr('y', 190)
        .attr('transform', 'translate(200,100)rotate(90)')
        .text(d => d)
        .attr('font-size', 15)
});
