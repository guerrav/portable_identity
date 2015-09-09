function randomColor() {

  var color = '#'; 
  // colores fondo
  var letters = ['f2f2f2','e6e6e6','ccd2cc','b3b3ac'];
  color += letters[Math.floor(Math.random() * letters.length)];
  document.getElementById('back').style.background = color; 

  function choose(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  //colores texto
  var colors = ['#ff4f56','#534741','#003abb','#454659','#245261'];
  
  
  var outputs = document.getElementsByClassName('output');
  for(var i = 0, l = outputs.length; i < l; i++) {
      var output = outputs[i];
      output.style.color = choose(colors);
      
      
      output.className += ' font' + Math.floor(
          Math.random() * 5 + 1);
  }
}
