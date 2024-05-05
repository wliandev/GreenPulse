function openModal(){
    // open all modals
    const ids = ['ESG','tech','foreign','healthcare','financial','energy','transportation','commercial','property','industrial','media','defense'];
    for (var i=0; i<ids.length; i++) {
        document.getElementById(ids[i]).style.visibility = "visible";   
    }
}

function closeESGModal(){
    // close ESG modal and filter results
    var filter = document.querySelectorAll('input[type=radio]:checked');
    var filter_array = Array.from(filter);
    var esg = [];
    for (var i = filter_array.length; i--;) {
        esg.push(String(filter_array[i].value).trim());
    }
    document.getElementById('ESG').style.visibility = "hidden";

    var elements = document.querySelectorAll('.esg');  
    for (var i = elements.length; i--;) {
        if (parseFloat(esg[0]) < parseFloat(elements[i].textContent) || String(elements[i].textContent) === " ") {
            elements[i].parentNode.style.display = "none";
            elements[i].parentNode.classList.toggle('visible');
        }
    }      
}

function closeIndustryModal(id){
    // close each industry modal and filter results
    var filter = document.querySelectorAll('input[type=checkbox]:not(:checked)');
    var filter_array = Array.from(filter);
    var ind = [];
    for (var i = filter_array.length; i--;) {
        ind.push(String(filter_array[i].value).trim());
    }
    document.getElementById(id).style.visibility = "hidden";

    var elements = document.querySelectorAll('.industry');  
    for (var i = elements.length; i--;) {
        if (ind.includes(String(elements[i].textContent).trim())) {
            elements[i].parentNode.style.display = "none";
            elements[i].parentNode.classList.toggle('visible');
        }
    }  
    calculateAvgESG();
}

function std(arr) {
    // calculate standard deviation
    let mean = arr.reduce((acc, curr) => {
        return acc + curr
    }, 0) / arr.length;
    arr = arr.map((k) => {
        return (k - mean) ** 2
    });
    let sum = arr.reduce((acc, curr) => acc + curr, 0);
    return Math.sqrt(sum / arr.length).toFixed(2)
}

function calculateAvgESG(){
    // calculate mean (this and above functions can be merged)
    const ids = ['e','s','g','esg']
    for (var i=0; i<ids.length; i++){
        var elements = document.querySelectorAll('.'+ids[i]);
        var arr = [];
        var score = 0;
        var count = 0
        for (var j=0; j<elements.length; j++) {
            if (!(String(elements[j].textContent) === " ") && !(elements[j].offsetParent === null)) {
                score += parseFloat(elements[j].textContent.trim());
                arr.push(parseFloat(elements[j].textContent.trim()));
                count += 1;
            }
        }
        score = (score / count).toFixed(2);
        var stand = std(arr);
        document.getElementById('avg_'+ids[i]).textContent = "Mean " + ids[i].toUpperCase() + " Score: " + String(score) + " (std. " + String(stand) + ")"; 
        document.getElementById('count').textContent = "Showing " + String(count) + " companies";  
    }
    // calculate distribution statistics
    var esg_nodelist = document.querySelectorAll('.esg');
    var esg_arr = [];
    for (var i=0; i<esg_nodelist.length; i++) {
        if (!(String(esg_nodelist[i].textContent) === " ") && !(esg_nodelist[i].offsetParent === null)) {
            esg_arr.push(parseFloat(esg_nodelist[i].textContent.trim()));
        }
    }
    const esg_sort = esg_arr.sort(function(a, b){return a - b})
    document.getElementById('min').textContent = "Min: " + String(esg_sort[0]); 
    document.getElementById('q1').textContent = "Q1: " + String(esg_sort[Math.floor(esg_sort.length*0.25) - 1]); 
    document.getElementById('median').textContent = "Median: " + String(esg_sort[Math.floor(esg_sort.length*0.50) - 1]); 
    document.getElementById('q3').textContent = "Q3: " + String(esg_sort[Math.floor(esg_sort.length*0.75) - 1]); 
    document.getElementById('max').textContent = "Max: " + String(esg_sort[esg_sort.length-1]); 

}

function showGraph(symbol) {

    document.getElementById('chart').replaceChildren();

    var mytooltip = document.getElementById("tooltip");

    if(mytooltip) {
        mytooltip.style.opacity = 0;
    }

    
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = window.innerWidth/2.2 - margin.left - margin.right,
        height = (window.innerHeight)/1.8 - margin.top - margin.bottom; 

    // append the svg object to the body of the page
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // Read the stock data
    d3.csv("/static/Stock_data/stock_" + symbol+ ".csv",

    // Format the stock data
    // Date,Open,High,Low,Close,Volume,Dividends,Splits
    function(d){
        return { date : d3.timeParse("%Y-%m-%d")(d.Date.split(" ")[0]), open : d.Open, high : d.High, low : d.Low, close : d.Close, volume : d.Volume, dividends : d.Dividends }
    },

    // plot the closing price
    function(data) {

        // Add X axis 
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; })) 
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "xAxis")
            .style('stroke', 'white')
            .call(d3.axisBottom(x));

        // Add left Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.close; })])
            .range([ height, 0 ]);
        svg.append("g")
            .attr("class", "yAxis")
            .style('stroke', 'white')
            .call(d3.axisLeft(y));    
    
        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.open) })
            )
                
        }

    )

    // Read the ESG data
    d3.csv("/static/ESG_data/esg_" + symbol+ ".csv",

    // Format the ESG data
    // index,timestamp,esgScore,governanceScore,environmentScore,socialScore
    function(d){
        return { date : d3.timeParse("%Y-%m-%d")(d.timestamp), esg: d.esgScore, gov : d.governanceScore, env : d.environmentScore, soc : d.socialScore }
    },
    // plot the esg score
    function(data) {

        // Define X axis 
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; })) // find cut off date
            .range([ 0, width ]);

        // Define right Y axis
        var y = d3.scaleLinear()
            .domain([0,50])
            .range([ height, 0 ]);
        
        // Add right Y axis
        svg.append("g")
            .attr("class", "yAxis")
            .attr('transform', 'translate(' + width + ', 0)')
            .style('stroke', 'white')
            .call(d3.axisRight(y));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("id", "line")
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .defined(function(d) { return d.esg != 0 })
                .curve(d3.curveLinear)
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.esg); })
                )
        
        // add a tooltip
        d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .attr('style', 'position: absolute; opacity: 0;');
        
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.date); } )
            .attr("cy", function (d) { return y(d.esg); } )
            .attr("r", 4)
            .style("fill", "#69b3a2")
            .on('mouseover', function(d) {
                d3.select('#tooltip').style('opacity', 1).text(d.esg)
            })
            .on('mouseout', function(d) {
                d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.esg)
            })
            .on('mousemove', function() {
                d3.select('#tooltip').style('opacity', 0)
            })
            .on('mousemove', function() {
                d3.select('#tooltip')
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY + 'px')
                })

            
        }
    
    )
}