$(document).ready(function(){

    $('#favDepartment').on('click', function(){
        var favDepartment = $('#favDepartment').val();
        
        var valid = true;
        
        if(favDepartment === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger"> You cannot submit an empty field</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid === true){
            $.ajax({
                url: '/settings/interest',
                type: 'POST',
                data: {
                    favDepartment: favDepartment
                },
                success: function(){
                    setTimeout(function(){
                        window.location.reload();
                    }, 200);
                }
            })
        }else{
            return false;
        }
    });
    
    $('#favProfessor').on('click', function(){
        var favDepartment = $('#favProfessor').val();
        
        var valid = true;
        
        if(favProfessor === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger"> You cannot submit an empty field</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid === true){
            $.ajax({
                url: '/settings/interest',
                type: 'POST',
                data: {
                    favProfessor: favProfessor
                },
                success: function(){
                    setTimeout(function(){
                        window.location.reload();
                    }, 200);
                }
            })
        }else{
            return false;
        }
    });
});