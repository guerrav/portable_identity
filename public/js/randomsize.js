function randomSize() {

    
  var outputs = document.getElementsByClassName('foto');
    for(var i = 0, l = outputs.length; i < l; i++) {
        var output = outputs[i];
        
        var posx = (Math.random() * $(document).width());
        var posy = (Math.random() * $(document).height());
        output.style.marginLeft = posx + 'px';
        output.style.marginTop = posy - 70 + 'px';
        
        
        
        output.className += ' size' + Math.floor(
            Math.random() * 4 + 1);
    }
}