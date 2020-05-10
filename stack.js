var getString = function(data)
{
    var names = ["Nuclear","Coal","Oil","Natural Gas","Hydro","Wind","Solar"];
    
    if(data.energy=="nuclear") //checks if the top of the rectangle is the same as the bottom. 
    {
        string = "Nuclear";
    }
    else if(data.energy=="coal")
    {
        string = "Coal";
    }
    else if(data.energy=="oil")
    {
        string = "Oil";
    }
    else if(data.energy=="NG")
    {
        string = "Natrual Gas";
    }
    else if(data.energy=="hydro")
    {
        string = "Hydro";
    }
    else if(data.energy=="wind")
    {
        string = "Wind";
    }
    else{
        string = "Solar";
    }
    return string;
} 

    
var drawStack = function(datas,width,height)
{
    var screen = {width:width, height:height};
    var margins = {top:30, bottom:40, left:200, right:40};
    var graph = 
    {
        width: screen.width - margins.left - margins.right,
        height: screen.height - margins.top - margins.bottom,
    }
    var xTitle = "Comparable Metrics";
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
    setAxesTitles(margins, graph, "svg", xTitle, yTitle);
    
    var stack = d3.stack()
                  .keys(["solar","wind","hydro","NG","oil","coal","nuclear"])
                  .order(d3.stackOrderDescending); //puts order as largest to smallest.
    
    var series = stack(datas);
    var colors = d3.scaleOrdinal(d3.schemeDark2);
    var colors2 = ["#FFD700","#FFF8DC","#4169E1","#DEB887","#2F4F4F","#696969","#6B8E23"];
    
     console.log(datas);
     console.log(series);
    //Add a group for each row of data
    var groups = svg.selectAll(".stack")
                .data(series)
                .enter()
                .append("g")
                .attr("class",function(row){
                    bindEnergyToRect(row); //Buts the same data class into each rectangles data as well
                    return row.key;})
                .style("fill",function(d,i){
                    return colors2[i];
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
                    return xScale(i)+1;
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
    rects.on("mouseover",function(data){
        var energy = data.energy;
        var column_id = "#"+this.id;
        var label_id = "#label_"+this.id
        var newTitle = findTitle(column_id,"long");
        var new_yScale = getNewYscale(graph,margins,series,column_id);
        updateAxes("svg",xScale,new_yScale);
        setAxesTitles(margins, graph, "svg", xTitle, newTitle);
        d3.selectAll("rect").classed("fade",true);
        d3.selectAll(column_id).classed("fade",false);
        
        d3.select(this).classed("selected",true);
        //d3.selectAll(label_id).classed("hidden",false);
        
        //Tooltip
        var xpos = parseFloat(d3.select(this).attr("x"))+xScale.bandwidth()/2+55;
        var ypos = parseFloat(d3.select(this).attr("y"));
        d3.select("#tooltip")
            .attr("id","tooltip")
            .style("left",xpos+"px")
            .style("top",ypos+"px")
            .select("#energy").text(getString(data));
        d3.select("#tooltip").select("#size").text(data.data[energy]+" "+findTitle("#column_"+data["column"]),"abrev");
       d3.select("#tooltip").classed("hidden",false);
    })
    .on("mouseout",function(value){
        var label_id = "#label_"+this.id;
        updateAxes("svg",xScale,yScale);
        setAxesTitles(margins, graph, "svg", xTitle, yTitle);
        d3.selectAll("rect").classed("fade",false);
        d3.select("#tooltip").classed("hidden",true);
        d3.select(this).classed("selected",false);
        /*d3.select(this).attr("height",function(d,i){
                    var local_scale = getNewYscale(graph,margins,series,"#column_"+i)
                    return 1.1*local_scale(d[0])-local_scale(d[1]);
        });*/
        
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
                    return xScale(index)+xScale.bandwidth()/2;
                })
                .attr("y", function(data,index)
                {
                    console.log(data);
                    var loc_Scale = getNewYscale(graph,margins,series,"#column_"+index);
                    return loc_Scale(data[0]) - (loc_Scale(data[0])-loc_Scale(data[1]))/5;  
                })
                .attr("fill","black")
                .attr("id", function(d,i){
                    return "label_column_"+i;
                 })
                .classed("rect_label",true)
                .text(function(data){return getString(data);}) //currently does nothing. 
                .classed("hidden",function(d){if(d[0]==d[1]){return true;}
                                              else{return false;}});
}
var bindEnergyToRect = function(row) //appends energy and column data to the d3 generated series data.
//Specifically, appends these to the rects objects inside each group in the groups object. 
{
    for(var i = 0; i<row.length;i++)
    {
        row[i]["energy"] = row.key;
        row[i]["column"] = i;
    }
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
    tick_labels = [["Construction","Cost"],["Operation","Cost"],["Fuel","Cost"],["Current","Production"],["Thermal","Content"],["group6"]];
    d3.select(".xaxis").selectAll(".tick").select("text").text('');
    var xticks = target.append("g").classed("xticks",true);
    for (var i = 1; i <=tick_labels.length;i++)
    {
        var x = i*(xScale.bandwidth()+4) + margins.left - xScale.bandwidth()/2;
        for(var j = 0; j<tick_labels[i-1].length; j++)
        {
            var y = graph.height + 20 + j*12;
            xticks.append("text")
            .attr("text-anchor", "middle")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("fill","black")
                    .text(tick_labels[i-1][j])
                    .style("font-size",20);
        }
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
        .attr("id","labelx")
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graph.width / 2)-20)
        .attr("y", graph.height + margins.bottom+20);
    labels.append("g")
        .attr("transform","translate(60," + 
              (margins.top + (graph.height / 2)) + ")")
        .append("text")
        .text(yTitle)
        //.classed("label", true)
        .attr("id","labely")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
}

var updateAxes = function(target, xScale, yScale) 
{
    //var xAxis = d3.axisBottom(xScale);
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

var findTitle = function(id,length)
{
    var title= "Error";
    if (length=="long"){
        if(id=="#column_0"){ //checks if the top of the rectangle is the same as the bottom. 
            title = "Dollars per Kilo-Watt";
        }
        else if(id=="#column_1"){title = "Millions of Dollars per Kilo-Watt-hour";}
        else if(id=="#column_2"){title = "Dollars per Kilo-Watt-hour";}
        else if(id=="#column_3"){title = "Gigia-Watt-Hours";}
        else if(id=="#column_4"){title = "Log10 scale Btu (British Thermal Units)";}
        else {title = "henry si cool";}
    }
    else{
        if(id=="#column_0"){ //checks if the top of the rectangle is the same as the bottom. 
            title = "$/KW";
        }
        else if(id=="#column_1"){title = "M$/KWh";}
        else if(id=="#column_2"){title = "$/KWh";}
        else if(id=="#column_3"){title = "GWh";}
        else if(id=="#column_4"){title = "Btu";}
        else {title = "henry si cool";}
    }
    return title; 
}

var  getNewYscale = function(graph,margins,series,id)
{
    var yScale = d3.scaleLinear()
            .domain([0, 80])
            .range([graph.height, margins.top]);
    if(id=="#column_0"){ //checks if the top of the rectangle is the same as the bottom. 
        var column = series[0];
        //column.data.nuclear+column.data.oil+column.data.NG+column.data.hydro+column.data.wind+column.data.solar;
        yScale = d3.scaleLinear()
            .domain([0, 18458])
            //.domain([0,280])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_1"){
        yScale = d3.scaleLinear()
            .domain([0, 142.09])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_2"){
        yScale = d3.scaleLinear()
            .domain([0, 0.1036])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_3"){
        yScale = d3.scaleLinear()
            .domain([0, 4328830])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_4"){
        yScale = d3.scaleLinear()
            .domain([0, 20.43])
            .range([graph.height, margins.top]);
    }
    else if(id=="#column_5"){
        yScale = d3.scaleLinear()
            .domain([0, 420])
            .range([graph.height, margins.top]);
    }
    else{
        var yScale = d3.scaleLinear()
            .domain([0, 420])
            .range([graph.height, margins.top]);
    }
    return yScale;
}

//d3.json("https://blackfyrehg.github.io/Final_Project/emissions_by_sector.json");
var stackPromise = d3.json("https://blackfyrehg.github.io/Final_Project/stack_data.json");
stackPromise.then(function(stack_data) {
    drawStack(stack_data,1200,550);
    
}, function(err) {
    console.log(err);
});
