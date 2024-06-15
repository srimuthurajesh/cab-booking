'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navbar = document.querySelector("[data-navbar]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const inputDate = document.getElementById('input-5');
const now = new Date();
const year = now.getFullYear().toString();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');
inputDate.min = ` ₹{year}- ₹{month}- ₹{day}`;
const navToggleFunc = function () {
  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}
const inputTime = document.getElementById('input-6');
inputTime.addEventListener('input', function() {
    console.log("inside 24");
    const selectedDate = new Date(this.value);
    const currentDate = new Date();
    if (selectedDate.toDateString() === currentDate.toDateString()) {
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        inputTime.min = ` ₹{hours}: ₹{minutes}`;
    } else {
        inputTime.min = null; // Allow any time if the date is not the current date
    }
});
navToggleBtn.addEventListener("click", navToggleFunc);
overlay.addEventListener("click", navToggleFunc);

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", navToggleFunc);
}



/**
 * header active on scroll
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10 ? header.classList.add("active")
    : header.classList.remove("active");
});
 function showSuccessMessage() {
    document.querySelector('.input-wrapper-success').style.display = 'flex';
    document.getElementById('customer_name').innerText = document.getElementById('input-1').value;
    document.getElementById('customer_pickup_loc').innerText = document.getElementById('input-3').value;
    document.getElementById('customer_drop_loc').innerText = document.getElementById('input-4').value;
    document.getElementById('customer_pickup_time').innerText = document.getElementById('input-6').value;
    document.getElementById('customer_number').innerText = document.getElementById('input-2').value;
}
document.addEventListener('DOMContentLoaded', function () {
    emailjs.init('fKdTn44q0lXV5IXY4');

    const form = document.getElementById('hero-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        showSuccessMessage();        
        /*emailjs.sendForm('service_x5onnnv', 'template_wn5q4ha', this)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showSuccessMessage();
            }, function (error) {
                console.log('FAILED...', error);
                alert('Error sending email. Please try again later.');
            });*/
        
            const customerName = document.getElementById('customer_name').innerText;
            const customerPickupLoc = document.getElementById('customer_pickup_loc').innerText;
            const customerDropLoc = document.getElementById('customer_drop_loc').innerText;
            const customerPickupTime = document.getElementById('customer_pickup_time').innerText;
            const customerNumber = document.getElementById('customer_number').innerText;

            // Construct the message with placeholders replaced
            const messageText = `
                Dear Admin,<br>
            A new drop taxi booking has been made. Here are the details:<br><br>
            Customer Name: ${customerName}<br>
            Pickup Location: ${customerPickupLoc}<br>
            Drop-off Location: ${customerDropLoc}<br>
            Pickup Time: ${customerPickupTime}<br>
            Contact Number: ${customerNumber}<br> <br>
            Please ensure that you are available at the designated pickup location on time to provide the service to our valued customer.<br>
            Thank you!<br>
            Best regards,<br>
            Drop taxi, Chennai
            `;

            // URL encode the message
            const urlEncodedMessage = encodeURIComponent(messageText);

        
            console.log(messageText);
            // Construct the URL for the Telegram API request
            const url = `https://api.telegram.org/bot6577358669:AAHaR6p_uZ0sGDRwuxS0YKqyg-BVSpZPcZI/sendMessage?chat_id=-4231118038&text=${urlEncodedMessage}&parse_mode=html`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        console.log('Message sent successfully:', data);
                    } else {
                        console.error('Error sending message:', data);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        
    });
});

$(document).ready(function(){

//DropDown input - select
$('.t-dropdown-input').on('click', function() {
    console.log("been caled");
	$('.t-dropdown-list').slideDown('fast');
});

$('.t-select-btn').on('click', function() {
   $('.t-dropdown-list').slideUp('fast');

	if(!$(this).prev().attr('disabled')){
    $(this).prev().trigger('click');
	}
});

//$('.t-dropdown-input').width($('.t-dropdown-select').width() - $('.t-select-btn').width() - 13);

//width for t-list
$('.t-dropdown-list').width($('.t-dropdown-input').width());

$('.t-dropdown-input').val('');

$('li.t-dropdown-item').on('click', function() {
  var text = $(this).html();
  $('.t-dropdown-input').val(text);
  $('.t-dropdown-list').slideUp('fast');
});

$(document).on('click', function(event) {
  if ($(event.target).closest(".t-dropdown-input, .t-select-btn").length)
    return;
  $('.t-dropdown-list').slideUp('fast');
  event.stopPropagation();
});
// END //


});

function populate(carType){
  if(!carType)return;
  $('.t-dropdown-input').val(carType);  
   $('html, body').animate({
        scrollTop: $('.t-dropdown-input').offset().top
    }, 1, function() {
        // Focus on the input field after scrolling
        $('.t-dropdown-input').focus();
    });
}
