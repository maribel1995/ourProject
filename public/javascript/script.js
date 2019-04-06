$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

document.addEventListener('DOMContentLoaded', function(){
    let stars = document.querySelectorAll('.star');
    stars.forEach(function(star){
        star.addEventListener('click', setRating); 
    });
    
    let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
    let target = stars[rating - 1];
    target.dispatchEvent(new MouseEvent('click'));
});
function setRating(ev){
    let span = ev.currentTarget;
    let stars = document.querySelectorAll('.star');
    let match = false;
    let num = 0;
    stars.forEach(function(star, index){
        if(match){
            star.classList.remove('rated');
        }else{
            star.classList.add('rated');
        }
        //are we currently looking at the span that was clicked
        if(star === span){
            match = true;
            num = index + 1;
        }
    });
    document.querySelector('.stars').setAttribute('data-rating', num);
    document.querySelector('#rating').setAttribute('value', num)
}

$( ".fa-heart" ).click(function() {
     $( this ).css("color","red");
  });


$(function(){
    var categories = [];

    $('[data-filter-category]').click(function(e){
        e.preventDefault();

        var category = $(this).data('filter-category');

        $(this).toggleClass('btn-primary btn-secondary');

        if($(this).hasClass('btn-primary')) {
            categories.push(category);
        } else {
            categories.splice(categories.indexOf(category), 1);
        }

        filterCategories();
    });

    function filterCategories() {
        if(categories.length > 0) {
            $('[data-category]').hide();
            
            categories.forEach(function(category) {
                $('[data-category=' + category + ']').show();
            });
        } else {
            $('[data-category]').show();
        }
    }
});
