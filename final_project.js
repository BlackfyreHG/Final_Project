
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
    var inner_r = 0;
    
    var arc = d3.arc()
        .innerRadius(inner_r)
        .outerRadius(outer_r);
    
    var target = d3.select("body")
        .append("svg")
            .attr("width",graph.width)
            .attr("height",graph.height);
    
    test_data = [5,10,15,20,60];
    console.log("datas: "+datas);
    /*values = d3.map(datas,function(data){return data.value;});
    console.log("values: "+values);*/
    var arcs = target.selectAll("g.arc") //binds data to the wedges. generate pie-effied data
        .data(pie(test_data))
        .enter()
        .append("g")
        .attr("class","arc")
        .attr("transform","translate("+2*outer_r+","+graph.height/2+")");
    
    arcs.append("path")
        .attr("fill",function(data,i){
              return color(i);
        })
        .attr("d",arc);
}

//var emissionsPromise = d3.json("https://blackfyrehg.github.io/Final_Project/emissions_by_sector.json");
var emissionsPromise = d3.json("emissions_by_sector.json");
emissionsPromise.then(function(emissions) {
    var width = 1600;
    var height= 500;
    console.log("window has height: "+height+" , and width:"+width);
   // console.log("emissions: "+emissions[0].value)
    drawPie(emissions,width,height);
    
}, function(err) {
    console.log("failed to get student data:", err);
});