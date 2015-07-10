function randomColor() {

  var color = '#'; 
  var letters = ['ffffff','cccccc','ffff00','00ffff','00ff00','0000ff','C7B299'];
  color += letters[Math.floor(Math.random() * letters.length)];
  document.getElementById('back').style.background = color; 

  function choose(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  var colors = ['#000000','#ff0000','#999999','#009245','#93278f'];
  
  
  var outputs = document.getElementsByClassName('output');
  for(var i = 0, l = outputs.length; i < l; i++) {
      var output = outputs[i];
      output.style.color = choose(colors);
      
      
      output.className += ' font' + Math.floor(
          Math.random() * 5 + 1);
  }
}
