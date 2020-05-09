var getString = function(data)
{
    if(data[1]==data.data.nuclear) //checks if the top of the rectangle is the same as the bottom. 
    {
        string = "nuclear";
    }
    else if(data[0]==data.data.nuclear)
    {
        string = "coal";
    }
    else if(data[1]==data.data.nuclear + data.data.coal + data.data.oil)
    {
        string = "oil";
    }
    else if(data[0]==data.data.nuclear + data.data.coal + data.data.oil)
    {
        string = "natrual gas";
    }
    else if(data[0]==data.data.nuclear + data.data.coal + data.data.oil+data.data.NG)
    {
        string = "hydro";
    }
    else if(data[0]==data.data.nuclear + data.data.coal + data.data.oil+data.data.NG+data.data.hydro)
    {
        string = "wind";
    }
    else{
        string = "solar";
    }
    return string; 
}

var drawStack = function(datas,width,height)
{
    var screen = {width:width, height:height};
    var margins = {top:30, bottom:30, left:70, right:40};
    var graph = 
    {
        width: screen.width - margins.left - margins.right,
        height: screen.height - margins.top - margins.bottom,
    }
    var xTitle = "Xtitle is constant";
    var yTitle = "this is the initial Y";
    
    var svg = d3.select("body") //svg object drawn too
        .append("svg")
            .attr("width",width)
            .attr("height",height);
    
    //--------------Creates scales and axis--------------
    var xScale = d3.scaleBand()
                .domain(d3.range(datas.length))
                .range([margins.left, graph.width])
                .paddingInner(0.05);
    
    var yScale = d3.scaleLinear()
                .domain([0,85])
                .range([graph.height, margins.bottom]);
    
    createAxes(margins,graph,svg,xScale,yScale);
    changeXticks(margins,graph,svg,xScale);
    //---------------------------------------------------
    
    //gives axis labels. 
    setAxesTitles(margins, graph, "svg", xTitle, yTitle)
    
    var stack = d3.stack()
                  .keys(["solar","wind","hydro","NG","oil","coal","nuclear"])
                  .order(d3.stackOrderDescending); //puts order as largest to smallest.
    
    var series = stack(datas);
    var colors = d3.scaleOrdinal(d3.schemeDark2);
    
    console.log(datas);
    console.log(series);
    //Add a group for each row of data
    var groups = svg.selectAll(".stack")
                .data(series)
                .enter()
                .append("g")
                .attr("class","stack")
                .style("fill",function(d,i){
                    return colors(i);
                });/*
                .on("mouseover",function(column){
                    d3.selectAll(".stack").classed("fade",true);
                    d3.select(this).classed("fade",false);

                })
                .on("mouseout",function(value){
                    d3.selectAll(".stack").classed("fade",false);
                });*/
    
    //Add a rectangle for each data value
    var rects = groups.selectAll("rect")
                .data(function(data){return data;}) //grabs child elements of "series" and binds those to the rectangles. 
                .enter()
                .append("rect")
                .attr("x",function(d,i){
                    return xScale(i);
                })
                .attr("y",function(d,i){
                    var local_scale = getNewYscale(graph,margins,series,"#column_"+i);
                    return local_scale(d[1]);
                })
                .attr("height",function(d,i){
                    var local_scale = getNewYscale(graph,margins,series,"#column_"+i)
                    return local_scale(d[0])-local_scale(d[1]);
                })
                .attr("width",xScale.bandwidth())
                .attr("id",function(d,i){return "column_"+i;});
    
    //---------------Changing rect labels and Axis titles----------------
    rects.on("mouseover",function(column){
        var column_id = "#"+this.id;
        var label_id = "#label_"+this.id
        var newTitle = findTitle(column_id);
        var new_yScale = getNewYscale(graph,margins,series,column_id);
        updateAxes("svg",xScale,new_yScale);
        setAxesTitles(margins, graph, "svg", xTitle, newTitle);
        d3.selectAll("rect").classed("fade",true);
        d3.selectAll(column_id).classed("fade",false);
        d3.selectAll(label_id).classed("hidden",false);
    })
    .on("mouseout",function(value){
        var label_id = "#label_"+this.id;
        updateAxes("svg",xScale,yScale);
        setAxesTitles(margins, graph, "svg", xTitle, yTitle);
        d3.selectAll("rect").classed("fade",false);
        d3.selectAll(label_id).classed("hidden",true);
    });
    //----------------------------------------------------------------------
    
    //Makes text labels for each rect in the stack
    groups.selectAll("text")
                .data(function(data){return data;})
                .enter()
                .append("text")
                .attr("text-anchor", "middle")
                .attr("x", function(rect, index)
                {   
                    return xScale(index)+margins.left-10;
                })
                .attr("y", function(data,index)
                {
                    var loc_Scale = getNewYscale(graph,margins,series,"#column_"+index);
                    return loc_Scale(data[0]) - (loc_Scale(data[0])-loc_Scale(data[1]))/2;  
                })
                .attr("fill","black")
                .attr("id", function(d,i){return "label_column_"+i;})
                .classed("rect_label",true)
                .text(function(data){return getString(data);})
                .classed("hidden",true);
}

var createAxes = function(margins,graph,target,xScale,yScale)
{
    // Setup axes
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale);
    
    // Draw the axes
    target.append("g")
        .attr("class","xaxis")
        .attr("transform","translate("+0+","+(graph.height)+")")
        .call(xAxis);
     target.append("g")
        .attr("class","yaxis")
        .attr("transform","translate("+margins.left+","+0+")")
        .call(yAxis);
    
}

//Creates the xlabels for each column on the graph. 
var changeXticks = function(margins,graph,target,xScale)
{
    tick_labels = ["group1","group2","gorup3","group4","group5","group6"];
    d3.select(".xaxis").selectAll(".tick").select("text").text('');
    var xticks = target.append("g").classed("xticks",true);
    for (var i = 1; i <=tick_labels.length;i++)
    {
        var x = i*(xScale.bandwidth()+4) + margins.left - xScale.bandwidth()/2;
        var y = graph.height + margins.bottom/1.5;
        xticks.append("text")
        .attr("text-anchor", "middle")
                .attr("x", x)
                .attr("y", y)
                .attr("fill","black")
                .text(tick_labels[i-1]);
        //.attr("transform","rotate(45)");
    }
}

// Sets the titles of the axes
var setAxesTitles = function(margins, graph, target, xTitle, yTitle) 
{
    var labels = d3.select(target)
                   .append("g")
                   .classed("labels", true);
    labels.append("text")
        .text(xTitle)
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graph.width / 2))
        .attr("y", graph.height + margins.bottom+20);
    labels.append("g")
        .attr("transform","translate(20," + 
              (margins.top + (graph.height / 2)) + ")")
        .append("text")
        .text(yTitle)
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
}

var updateAxes = function(target, xScale, yScale) 
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    /*d3.select(".x-axis")
        .transition()
        .duration(1000)
        .call(xAxis)*/
    
    d3.select(".yaxis")
        .transition()
        .duration(1000)
        .call(yAxis)
    
    d3.select(target)
        .selectAll(".labels")
        .remove();
}

var findTitle = function(id)
{
    var title= "Error";
    if(id=="#column_0"){ //checks if the top of the rectangle is the same as the bottom. 
        title = "zeroes";
    }
    else if(id=="#column_1"){title = "firsts";}
    else if(id=="#column_2"){title = "seconds";}
    else if(id=="#column_3"){title = "thirds";}
    else if(id=="#column_4"){title = "fourths";}
    else {title = "fifths";}
    return title; 
}

var  getNewYscale = function(graph,margins,series,id)
{
    var yScale = d3.scaleLinear()
            .domain([0, 80])
            .range([graph.height, margins.top]);
    if(id=="#column_0"){ //checks if the top of the rectangle is the same as the bottom. 
        yScale = d3.scaleLinear()
            .domain([0, 70])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_1"){
        yScale = d3.scaleLinear()
            .domain([0, 140])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_2"){
        yScale = d3.scaleLinear()
            .domain([0, 210])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_3"){
        yScale = d3.scaleLinear()
            .domain([0, 280])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_4"){
        yScale = d3.scaleLinear()
            .domain([0, 350])
            .range([graph.height, margins.top]);
    }
    else {
        yScale = d3.scaleLinear()
            .domain([0, 420])
            .range([graph.height, margins.top]);
    }
    return yScale;
}

//d3.json("https://blackfyrehg.github.io/Final_Project/emissions_by_sector.json");
var stackPromise = d3.json("https://blackfyrehg.github.io/Final_Project/stack_data.json");
stackPromise.then(function(stack_data) {
    drawStack(stack_data,800,500);
    
}, function(err) {
    console.log(err);
});
