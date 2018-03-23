(function($){
    $.deparam = $.deparam || function(uri){
        if(uri === undefined){
            uri = window.location.pathname;
        }
        
        var value1 = window.location.pathname;
        var value2 = value1.split('/');
        var value3 = value2.pop();        //get the last value from array and return it
        return value3;
    }
    
    
    
})(jQuery);
