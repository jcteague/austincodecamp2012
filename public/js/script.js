Modernizr.load({
    test: Modernizr.input.placeholder,
    nope: [
        'placeholder_polyfill.min.css',
        'placeholder_polyfill.jquery.min.combo.js'
    ]
});

$(function(){

    $('a.nav-item').click(function(){
        var new_section_href = $(this).attr('href').replace('/','');
        var new_content = $(new_section_href);
        var displayed_content = $('.content.active');
        displayed_content.fadeOut('fast',function(){
            $(this).toggleClass('active');
            new_content.fadeIn('fast',function(){
                $(this).toggleClass('active');
            })
        })


        console.log(new_section)
    })
});

var show_content()