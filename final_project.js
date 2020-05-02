
var makePie = function(datas)
{
    var screen = {width:width, height:height};
    
    var margins = {top:30, bottom:30, left:70, right:40};
    
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    var color = d3.scaleOrdinal(d3.schemeCatagory10);
    var pie = d3.pie();
    var w = 300;
    var h = 300;
    var outer_r = w/2;
    var inner_r = w/4;
    
    var arc = d3.arc()
        .innerRadius(inner_r)
        .outerRadius(outer_r);
    
    var target = d3.select("body")
        .append("svg")
            .attr("width",w)
            .attr("height",h);
    
    var arcs = target.selectAll("g.arc") //binds data to the wedges. generate pie-effied data
        .data(pie(datas))
        .enter()
        .append("g")
        .attr("class","arc")
        .attr("transform","translate("+outer_r+","+inner_r+")");
    
    arcs.append("path")
        .attr("fill",function(data,i){
              return color(i);
        })
        .attr("d",arc);
}

var emissionsPromise = d3.json("emissions_by_sector.json");
emissionsPromise.then(function(emissions) {
    var width = 1600;
    var height= 500;
    
    
}, function(err) {
    console.log("failed to get student data:", err);
});