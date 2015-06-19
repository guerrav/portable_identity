$(document).ready(function() {
  
  $('a.fancybox').fancybox({
    'type': 'iframe',
    'helpers' : {
        'overlay' : {
            'css' : {
                'background' : 'rgba(0, 0, 0, 0)'
            }
        }
    },
    'topRatio' :0.13,
    'minHeight' : 400,
    'maxWidth' : 500,
    'padding': 0
  });
  
});