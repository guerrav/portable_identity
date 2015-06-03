var htmlButton = "<a id='fancybox fancybox.iframe' data-fancybox-type='iframe' href='http://www.google.com' target='_blank'>Click here to go to Google</a>"


// instantiate our D3plus viz object
var viz = d3plus.viz()
  .container(d3.select("body"))
  .background("#000")
  .font({ "family": [ 'aktiv-grotesk-std' ,'sans-serif' ], 
          "weight": 400})
  
  
  .tooltip({ "font":{"color": "#ffffff"},
              "background": "#333333",
              "curtain":{"opacity":.9}})
  
  .edges({ "color": "#FF0521", // lineas rojas
            "opacity": .3 // color de los links
             })
  
  .color({ 
        "focus" : "#ff0029", // rojo cuando le das click 
        "primary": "#ffffff", // line en blanco con el hover
        "scale": ["#ffffff"] // color de los nodos
        });

  
d3.json("/js/projects.json", function(graph) {

  var a = "<a class='btn fancybox fancybox.iframe' 'data-fancybox-type'='iframe' href='";
  var b = "";
  var c = "'>Leer entrada</a>";
  var titulo ="<p class='tituloprojecto'>Portable Identity</p>"

  
  var e = "<span class='tipo'>Entries with tag: ";
  var f = "";
  var g = "</span>";


  var url = function(d) {
    
    if (b !== "none") {
      return a+b+c+titulo;
    } else if (b == "none") {
      return e+g+titulo;
    }
  };


  viz
    .type("network")    // visualization type
    .nodes(graph.nodes)   // x and y position of nodes
    .edges(graph.links)
    .data(graph.nodes)
    .data({"large":2000})
    
    .size(function(d){ b = d.url; f = d.type; return d.type == "tag" ? 4 : 25 })
    .id("name") // key for which our data is unique on

    .tooltip({"html": url});
    
  viz.draw(); 

});
