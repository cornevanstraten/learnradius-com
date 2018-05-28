

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
 
