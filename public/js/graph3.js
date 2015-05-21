
// instantiate our D3plus viz object
var viz = d3plus.viz()
  .container(d3.select("body"))
  .background("#000")
  .font({ "family": [ 'aktiv-grotesk-std' ,"sans-serif" ], 
          "weight": "400" })
  .shape({ "value": 7 })
  .legend({ "icons": false })
  .tooltip({ "font":{"color": "#ffffff"}})
  .edges({ "color": "#ff0029", // color de los links
            "opacity": .5 })
  
  .color({ 
        "focus" : "#ff0029", // rojo cuando le das click 
        "primary": "#ffffff", // line en blanco con el hover
        "scale": ["#ffffff"]
        });

  
d3.json("/js/projects.json", function(graph) {
  viz
    .type("network")    // visualization type
    .nodes(graph.nodes)   // x and y position of nodes
    .edges(graph.links) // list of node connections
    .id("name")         // key for which our data is unique on
    .draw()             // finally, draw the visualization!


});
