$(function(){
    for(var i = 0; i < sessions.length; i++){

        console.log("input[name='presentations["+i+"'][description]']")
        console.log($("input[name='presentations["+i+"'][description]']"))
        $("input[name='presentations["+i+"][_id]']").val(sessions[i]._id);
        $("input[name='presentations["+i+"][title]']").val(sessions[i].title);
        $("input[name='presentations["+i+"][description]']").val(sessions[i].description);
        $("input[name='presentations["+i+"][duration]']").find('option')

        $('select[name="presentations[1][duration]"] option[value="'+sessions[i].duration+'"]').attr('selected','selected')

    }
})