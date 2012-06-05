function switch_content(new_section_href) {
    var new_content = $(new_section_href);
    if(new_content.length == 0) return;
    var displayed_content = $('.content.active');
    displayed_content.fadeOut('fast', function () {
        $(this).toggleClass('active');
        new_content.fadeIn('fast', function () {
            $(this).toggleClass('active');
        })
    })
}
var set_active_content = function(){
    var hash = window.location.hash;
    if(hash){
        switch_content(hash);
    }
}

var show_voting = function(){
    $.getJSON('/session/list')
     .success(function(data){
        var sessionList = $('<ul>',{'class':"vote-list"});
        $(data).each(function(pres){

            sessionList.append(ich.vote(this));
        })

        $('#schedule').append(sessionList)
        $('.vote').on("click",function(){
            var button = $(this)
            var session_id = $(this).data("session-id");
            $.post('/session/vote',{id:session_id},function(){
                button
                    .text('Done')
                    .attr('disabled','disabled')
                    .addClass("vote-disabled")
            })

        })

    })
}
$(function(){
    $('input,textarea').placeholder();
    set_active_content()
    //show_voting();
    $('a.nav-item').click(function(){
        var new_section_href = $(this).attr('href').replace('/','');
        switch_content(new_section_href);
    })


});

