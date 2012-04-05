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
$(function(){
    $('input,textarea').placeholder();
    set_active_content()
    $('a.nav-item').click(function(){
        var new_section_href = $(this).attr('href').replace('/','');
        switch_content(new_section_href);
    })
});

