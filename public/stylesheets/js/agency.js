

$("#notification1").click(function(){
  $("#notification1").fadeOut();
});

setTimeout(function(){ 
  $("#notification1").fadeOut();
}, 3000);


//PAGINATION
//from 1 to 2 or vice versa
$(".newc1").click(function(){
  $(".ncb1").toggleClass("is-hidden");
  $(".ncb2").toggleClass("is-hidden");
});
//from 2 to 3 or vice versa
$(".newc2").click(function(){
  $(".ncb2").toggleClass("is-hidden");
  $(".ncb3").toggleClass("is-hidden");
});
//from 1 to 3 or vice versa
$(".newc3").click(function(){
  $(".ncb1").toggleClass("is-hidden");
  $(".ncb3").toggleClass("is-hidden");
});


//MODALS

//joinmodal
$(".joinButton").click(function(){
  $("#joinModal").addClass("is-active")
});
//deletemodal
$(".deleteButton").click(function(event){
  $("#deleteModal" + event.target.getAttribute("circle")).addClass("is-active")
});

//leavemodal
$(".leaveButton").click(function(event){
  $("#leaveModal" + event.target.getAttribute("agreement")).addClass("is-active")
});

//removemodal
$(".removeButton").click(function(event){
  $("#removeModal" + event.target.getAttribute("agreement")).addClass("is-active")
});

//close modal (universal)
$(".closeModal, .modal-background").click(function(){
  $(".modal").removeClass("is-active")
});


//auto-focus for searchbar
$('input[name="search"]').focus();


$(window).scroll(function() {

    if ($(this).scrollTop() > 200)
    {
        $('.mobile-search-bar').fadeIn("slow");
    }
    else
    {
      $('.mobile-search-bar').fadeOut("slow");
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

//Whats is this JS for. Label it?
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

//back to top button  
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
  $(".min1arrow").removeClass("has-text-grey-light")
  $(".plus1").removeClass("is-size-3")
  $(".plus1").addClass("has-text-grey-light")
  $(".plus1arrow").addClass("has-text-grey-light")
  $(".min1").addClass("is-size-3")
})

$("#plus1").click(function(){
  $(".plus1").removeClass("has-text-grey-light")
  $(".plus1arrow").removeClass("has-text-grey-light")
  $(".min1").removeClass("is-size-3")
  $(".min1").addClass("has-text-grey-light")
  $(".min1arrow").addClass("has-text-grey-light")
  $(".plus1").addClass("is-size-3")
})

//card height equalizer (deze code kan vast beter geschreven worden)
$(document).ready(function(){
    $('.circles').each(function(){  
      var highestBox = 0;
      $('.card-content', this).each(function(){
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      });  
      $('.card-content',this).height(highestBox);
    }); 
    
    $('.circles').each(function(){  
      var highestBox = 0;
      $('.circle--oneliner', this).each(function(){
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      });  
      $('.circle--oneliner',this).height(highestBox);
    }); 
    $('.circles').each(function(){  
      var highestBox = 0;
      $('.circle--title', this).each(function(){
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      });  
      $('.circle--title',this).height(highestBox);
    }); 

});

// dashboard chevron
$(".card-header-icon").click(function(event){
  $(".manageCircle" + event.target.getAttribute("circle")).toggleClass("is-hidden")
});

//show zip field when zipcode is missing
var zipInput = document.getElementById("zipinput");

function openZip(){
  if(zipInput.value.length > 0){
    $(".searchform--expand").addClass("is-hidden");
  }
}
openZip()


//fix mobile menu

// Write JS that only adds the 
// on-hover class in there when when screensize is 
// under a certain size.
// is-hoverable

// dropdown[0].addEventListener("mouseover", function( event ) {   
//     // highlight the mouseover target
//     dropdown[0].classList.add("is-active");

//     // reset the color after a short delay
//     setTimeout(function() {
//       dropdown[0].classList.remove("is-active");
//     }, 500);
//   }, false);
  
// window.addEventListener('touchstart', function() {
//   // the user touched the screen!
// });

function classToggle() {
    this.classList.toggle('is-active');
    this.classList.toggle(' ');
}


//add class above certain screensize
var dropdown = document.getElementsByClassName("dropdown");
	if (window.matchMedia("(min-width: 1000px)").matches) {
		dropdown[0].classList.add("is-hoverable");
	} else {
		dropdown[0].addEventListener('click', classToggle);
	}


//search console
//price
function getPrice() {
    var p = document.getElementById("price").value;
    document.getElementById("pricedisplay").innerHTML = " " + p;
}
//distance
function getDistance() {
    var d = document.getElementById("distance").value;
    document.getElementById("distancedisplay").innerHTML = " " + d;
}

//specify button
var landingHero = document.getElementById("landing-hero");
var searchConsole = document.getElementById("searchconsole");

function specificSearch() {
    landingHero.classList.add('is-hidden');
    searchConsole.classList.remove('is-hidden');
}


var specify = document.getElementById("specify");
specify.addEventListener('click', specificSearch);

//back button
function specificBack() {
    searchConsole.classList.add('is-hidden');
    landingHero.classList.remove('is-hidden');
}
var back = document.getElementById("back");
back.addEventListener('click', specificBack);