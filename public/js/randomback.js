function randomColor() {

  var color = '#'; 
  var letters = ['338a47','003abb','615041','cccccc','4d4d4d','414a4a','848d91'];
  color += letters[Math.floor(Math.random() * letters.length)];
  document.getElementById('back').style.background = color; 

  function choose(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  var colors = ['#FFFF00','#FF4F56','#000000','#00FFB1'];
  
  
  var outputs = document.getElementsByClassName('output');
  for(var i = 0, l = outputs.length; i < l; i++) {
      var output = outputs[i];
      output.style.color = choose(colors);
      
      
      output.className += ' font' + Math.floor(
          Math.random() * 5 + 1);
  }
}
