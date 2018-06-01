

$("#notification1").click(function(){
  $("#notification1").fadeOut();
})

setTimeout(function(){ 
  $("#notification1").fadeOut();
}, 3000);


//PAGINATION
//from 1 to 2 or vice versa
$(".newc1").click(function(){
  $(".ncb1").toggleClass("is-hidden");
  $(".ncb2").toggleClass("is-hidden");
})
//from 2 to 3 or vice versa
$(".newc2").click(function(){
  $(".ncb2").toggleClass("is-hidden");
  $(".ncb3").toggleClass("is-hidden");
})
//from 1 to 3 or vice versa
$(".newc3").click(function(){
  $(".ncb1").toggleClass("is-hidden");
  $(".ncb3").toggleClass("is-hidden");
})


//MODALS

//joinmodal
$("#joinButton").click(function(){
  $("#joinModal").addClass("is-active")
})
//deletemodal
$(".deleteButton").click(function(event){
  $("#deleteModal" + event.target.getAttribute("circle")).addClass("is-active")
})

//leavemodal
$(".leaveButton").click(function(event){
  $("#leaveModal" + event.target.getAttribute("agreement")).addClass("is-active")
})
//removemodal
$(".removeButton").click(function(event){
  $("#removeModal" + event.target.getAttribute("agreement")).addClass("is-active")
})

//close modal (universal)
$(".closeModal, .modal-background").click(function(){
  $(".modal").removeClass("is-active")
})


//auto-focus for searchbar
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

$(document).ready(function(){
    $('.searchform--expand--button').click(function(){
        var link = $(this);
        $('.searchform--expand').toggleClass('is-hidden', function() {
            if ($(this).is(":visible")) {
                 link.html(' <i class="fa fa-angle-left"></i>');                
            } else {
                 link.html('<i class="fa fa-angle-right"></i>');                
            }        
        });
            
    });
});

$('.button--favorite').hover(
       function(){ $(this).html('<i class="fa fa-heart"></i>') },
       function(){ $(this).html('<i class="fa fa-heart-o"></i>') }
);

var header = $(".cta-content");
  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();
      if (scroll >= 600) {
          header.addClass("cta-visible");
        } else {
          header.removeClass("cta-visible");
        }
});

$(window).scroll(function() {    
  var scroll = $(window).scrollTop();
    if (scroll >= 620) {
        $('.pdp-mentor--name').addClass("rotate-out");
      } else {
        $('.pdp-mentor--name').removeClass("rotate-out");
      }
});

// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
  
$(window).on('scroll', function(){
  if ($(this).scrollTop() > 800) {
      $('.top').removeClass('is-hidden');
  } else {
      $('.top').addClass('is-hidden');
  }
});
 

//review javascript 
$("#min1").click(function(){
  $(".min1").removeClass("has-text-grey-light")
  $(".plus1").removeClass("is-size-3")
  $(".plus1").addClass("has-text-grey-light")
  $(".min1").addClass("is-size-3")
})

$("#plus1").click(function(){
  $(".plus1").removeClass("has-text-grey-light")
  $(".min1").removeClass("is-size-3")
  $(".min1").addClass("has-text-grey-light")
  $(".plus1").addClass("is-size-3")
})
