
var drawPie = function(datas,width,height)
{
    var screen = {width:width, height:height};
    
    var margins = {top:30, bottom:30, left:70, right:40};
    
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    //var color = d3.scaleOrdinal(d3.schemeCatagory10);
     var color = d3.scaleOrdinal(d3.schemeDark2);

    var pie = d3.pie();
    var w = graph.width;
    var h = graph.height;
    var outer_r = h/2;
    var inner_r = h/4;
    
    var arc = d3.arc()
        .innerRadius(inner_r)
        .outerRadius(outer_r);
    
    var target = d3.select("body")
        .append("svg")
            .attr("width",graph.width)
            .attr("height",graph.height);
    
    values = datas.map(function(data){return data.value;});
    console.log("values:");
    console.log(values);
    var arcs = target.selectAll(".arc") //binds data to the wedges. generate pie-effied data
        .data(pie(values))
        .enter()
        .append("g")
        .classed("arc","true")
        .attr("transform","translate("+2*outer_r+","+graph.height/2+")")
    
        .on("mouseover",function(value){
            d3.selectAll(".arc").classed("fade",true);
            d3.select(this).classed("fade",false);
            d3.select(this).select("#sector")
                .classed("hidden",false);
            
        })
        .on("mouseout",function(value){
            d3.selectAll(".arc").classed("fade",false);
            d3.selectAll(".arc").select("#sector")
                .classed("hidden",true);
        });
    
    arcs.append("path")
        .attr("fill",function(data,i){
              return color(i);
        })
        .attr("d",arc);
    
    arcs.append("text")
        .attr("id","sector")
        .attr("transform",function(data){
            c = arc.centroid(data);
            x = c[0];
            y = c[1]-40; //+20;
            return "translate("+x+","+y+")";
        })
        .attr("text-anchor","middle")
        .text(function(data,i){
            return datas[i].sector; 
        })
        .classed("hidden","false");
    
     arcs.append("text")
        .attr("transform",function(data){
            c = arc.centroid(data);
            x = c[0];
            y = c[1]; //+20;
            return "translate("+x+","+y+")";
        })
       .attr("id","value")
       .attr("text-anchor","middle")
       .text(function(data){
            return data.value + "%"; 
        });
        
    /*target.append("text")
        .text("percent of C02 emissions")
        .attr("transform","translate("+2*h/3+","+h/2+")");*/
}


var emissionsPromise = d3.json("https://blackfyrehg.github.io/Final_Project/emissions_by_sector.json");
//var emissionsPromise = d3.json("emissions_by_sector.json");
emissionsPromise.then(function(emissions) {
    var width = 1600;
    var height= 500;
    console.log("window has height: "+height+" , and width:"+width);
    drawPie(emissions ,width,height);
    
}, function(err) {
    console.log("failed to get student data:", err);
});