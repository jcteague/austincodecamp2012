$(function(){
    animate_descriptions();
    init_form_submit()
    for(var i = 0; i < sessions.length; i++){
        $("input[name='presentations["+i+"][_id]']").val(sessions[i]._id);
        $("input[name='presentations["+i+"][title]']").val(sessions[i].title);
        $("textarea[name='presentations["+i+"][description]']").val(sessions[i].description);
        $("input[name='presentations["+i+"][duration]']").find('option')

        $('select[name="presentations[1][duration]"] option[value="'+sessions[i].duration+'"]').attr('selected','selected')

    }
})

var animate_descriptions =function(){
    $('textarea.presentation-description')
        .focus(function(){
            $(this).animate({
                height:"+=100"
            },800)
                .blur(function(){
                    $(this).animate({height:"20"},800)
                })
        })
}
var init_form_submit = function(){

    $('form').submit(function(evt){
        var form = $(this)
        var submit_button = $('#session-submit')
        evt.preventDefault();

        submit_button.hide()
        $('#processing-started-message').show()
        $.post(form.attr('action'),form.serialize(),function(){
            $('#processing-started-message').hide()
            $('#processing-complete-message').show()
            setInterval(function(){
                $('#processing-complete-message').hide();
                submit_button.show();
             },3000)
        })
    })

}
