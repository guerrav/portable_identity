var svg = d3.select("body").append("svg"),
  r = 15;
var force = d3.layout.force();


d3.json("/js/projects.json", function(graph) {

  force
    .nodes(graph.nodes)
    .links(graph.links)
    .gravity(0.25)
    .charge(-1000)
    .friction(.75)
    .linkStrength(1)
    .on("tick", tick)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

  var node = svg.selectAll(".node")
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

  project.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("class", "shadow")
    .text(function(d) { return d.name; });

  project.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text(function(d) { return d.name; });

  




  var tag = svg.selectAll(".tag")
    .on("click", function(d){  });

  tag.append("text")
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });


  resize();
  d3.select(window).on("resize", resize);

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("r", r);
    tag
      .selectAll("circle")
      .attr("r", r);
    project
      .selectAll("image")
      .attr("width", r*2)
      .attr("height", r*2);
    node.attr("transform", function(d) { return  "translate(" + Math.max(r, Math.min(width - r, d.x)) + "," + Math.max(r, Math.min(height - r, d.y)) + ")"});
  }

  function resize() {
    width = window.innerWidth, height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
  }

  var linkedByIndex = {};

  graph.links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

  function fade(opacity) {
    return function(d) {
      node.transition().duration(500).select("image").style("opacity", function(o) {
        thisOpacity = isConnected(d, o) ? 1 : opacity;
        if (isConnected(d,o) == 1) { // iterate through every node (o) and if current node (d) is connected
          console.log(o.index); // log the name of each connected node
        };
        this.setAttribute('opacity', thisOpacity);
        return thisOpacity;
      })
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