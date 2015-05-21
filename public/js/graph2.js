var w = window.innerWidth;
var h = window.innerHeight;



var text_center = false;
var outline = false;

var min_score = 0;
var max_score = 1;

var color = d3.scale.linear()
  .domain([min_score, (min_score+max_score)/2, max_score])
  .range(["lime", "yellow", "red"]);



  
var size = d3.scale.pow().exponent(1)
  .domain([1,100])
  .range([8,24]);
  
var force = d3.layout.force()
  .linkDistance(60)
  .charge(-300)
  .size([w,h]);

var default_node_color = "#ccc";
//var default_node_color = "rgb(3,190,100)";

var nominal_base_node_size = 8;
var nominal_text_size = 10;
var max_text_size = 24;
var nominal_stroke = .4;
var max_stroke = 4.5;
var max_base_node_size = 16;
var min_zoom = 0.1;
var max_zoom = 7;
var svg = d3.select("body").append("svg");
var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
var g = svg.append("g");
svg.style("cursor","move");
    
d3.json("/js/projects.json", function(graph) {
var linkedByIndex = {};
    graph.links.forEach(function(d) {
  linkedByIndex[d.source + "," + d.target] = true;
    });

  function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

  function hasConnections(a) {
    for (var property in linkedByIndex) {
        s = property.split(",");
        if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])          return true;
    }
  return false;
  }
  
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = g.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
  
  


  var node = g.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", function(d) { return d.type; })
    .on("mouseover", fade(.15))
    .on("mouseout", fade(1))
    .call(force.drag);
  
  
  

  var project = svg.selectAll(".project")
    .append("a")
      .attr("xlink:href", function(d) { return d.url; })
      .attr("class", "fancybox fancybox.iframe")
      .attr("data-fancybox-type", "iframe");

  project.append("circle")
    .attr("r", 2.5)
    .attr("class", "circle");



  var tag = svg.selectAll(".tag")
    .on("click", function(d){  });

  tag.append("text")
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
        
  var text = g.selectAll(".text")
    

  if (text_center)
   text.text(function(d) { return d.id; })
  .style("text-anchor", "middle");
  else 
  text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
    .text(function(d) { return '\u2002'+d.id; });

  

  zoom.on("zoom", function() {
  
    var stroke = nominal_stroke;
    if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
    link.style("stroke-width",stroke);
    
     
  var base_radius = nominal_base_node_size;
    if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
        
    
  //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
  if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });
  
  var text_size = nominal_text_size;
    if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
    text.style("font-size",text_size + "px");

  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  });
   
  svg.call(zoom);   
  
  resize();
  //window.focus();
  
    
  force.on("tick", function() {
    
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });
  
  function resize() {
    var width = window.innerWidth, height = window.innerHeight;
  svg.attr("width", width).attr("height", height);
    
  force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
    w = width;
  h = height;
  }
  
  function fade(opacity) {
    return function(d) {
      node.transition().duration(500).select("text").style("opacity", function(o) {
        thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      })
      link.transition().duration(500).style("stroke-opacity", function(o) {
        return o.source === d || o.target === d ? 1 : opacity;
      });
    };
  }
  
 
});




function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
} 


