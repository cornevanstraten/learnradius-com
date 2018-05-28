

$("#notification1").click(function(){
  $("#notification1").fadeOut();
})

setTimeout(function(){ 
  $("#notification1").fadeOut();
}, 3000);


//pagination new circle form
$(".newc1").click(function(){
  $(".ncb1").toggleClass("is-hidden");
  $(".ncb2").toggleClass("is-hidden");
})

$(".newc2").click(function(){
  $(".ncb2").toggleClass("is-hidden");
  $(".ncb3").toggleClass("is-hidden");
})

$(".newc3").click(function(){
  $(".ncb1").toggleClass("is-hidden");
  $(".ncb3").toggleClass("is-hidden");
})


$('input[name="search"]').focus();

$(window).scroll(function() {

    if ($(this).scrollTop()>200)
    {
        $('.mobile-search-bar').fadeOut("slow");
    }
    else
    {
      $('.mobile-search-bar').fadeIn("slow");
    }
});

$(window).on('scroll', function(){
    if ($(this).scrollTop() > 500) {
        $('.searchform').removeClass('is-hidden');
       
    } else {
        $('.searchform').addClass('is-hidden');
    }
}); 
 