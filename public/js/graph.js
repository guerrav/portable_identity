
// instantiate our D3plus viz object
var viz = d3plus.viz()
  .container(d3.select("body"))
  .background("#000")
  .font({ "family": [ 'aktiv-grotesk-std' ,'sans-serif' ], 
          "weight": 400})
  
  
  .tooltip({ 
              "background": "#333333",
              "size": false,
              "anchor" : "top center",
              "curtain":{"opacity":.8}})
  
  .edges({ "color": "#FF0521", // lineas rojas
            "opacity": .3 // color de los links
             })
 


  .color({ 
        "focus" : "#ff0029", // rojo cuando le das click 
        "primary": "#ffffff" // line en blanco con el hover
         // color de los nodos
        });

  
d3.json("/js/projects.json", function(graph) {

  var a = "<a class='btn fancybox fancybox.iframe' 'data-fancybox-type'='iframe' href='";
  var b = "";
  var c = "'>Leer entrada</a>";
  var titulo ="<p class='tituloprojecto'>Portable Identity</p>"

  
  var e = "<span class='tipo'>Entries with tag: ";
  
  var g = "</span>";


  var url = function(d) {
    
    if (b !== "none") {
      return a+b+c+titulo;
    } else if (b == "none") {      
      return e+g+titulo;
    }
  };

  var blanco = "#fff";
  var negro = "#000";


  viz
    .type("network")    // visualization type
    .nodes(graph.nodes)   // x and y position of nodes
    .edges(graph.links)
    .data(graph.nodes)
    .data({"large":2000})

    
    .size(function(d){ b = d.url; return d.type === "tag" ? 4 : 27 })
    .color(function(d){ return d.type === "tag" ? negro : blanco })
 
    .id("name") // key for which our data is unique on

    .tooltip({"html": url});
    
  viz.draw(); 

});
