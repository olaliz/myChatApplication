$(document).ready(function(){
    
    $('#favorite').on('submit', function(e){
        e.preventDefault();
        
        var id = $('#id').val();
        var lifestyleFaculty = $('#lifestyle_Faculty').val();

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                lifestyleFaculty: lifestyleFaculty
            },
            success: function(){
                console.log(lifestyleFaculty);
            }
        })
        
    });
});