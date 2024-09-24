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
                Dear Admin,
                A new drop taxi booking has been made. Here are the details:
                Customer Name: ${customerName}
                Pickup Location: ${customerPickupLoc}
                Drop-off Location: ${customerDropLoc}
                Pickup Time: ${customerPickupTime}
                Contact Number: ${customerNumber}
                Please ensure that you are available at the designated pickup location on time to provide the service to our valued customer.\n
                Thank you!
                Best regards,\n
                Drop taxi, Chennai
            `;

            // URL encode the message
            const urlEncodedMessage = encodeURIComponent(messageText);

        
        console.log(messageText);
            // Construct the URL for the Telegram API request
            const url = `https://api.telegram.org/bot6577358669:AAHaR6p_uZ0sGDRwuxS0YKqyg-BVSpZPcZI/sendMessage?chat_id=-4231118038&text=${urlEncodedMessage}`;
        console.log(url);
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
const apiKey = 'CvBHxlan7n1vSlyPb4yJrb3DL0aSACdZotfvRdye';
// Handle input for both pickup point and drop point to trigger API call
$('.t-dropdown-input').on('input', function() {
    const dropdownList = $(this).next('.t-dropdown-list');
    const query = $(this).val().trim();

    // Check which input is being used
    if ($(this).attr('id') === 'pickup-point' || $(this).attr('id') === 'drop-point') {
        console.log("Input detected for:", $(this).attr('id'));
        
        if (query.length > 2) {
            // Call the appropriate fetch function based on the input
            if ($(this).attr('id') === 'pickup-point') {
                fetchPickupSuggestions(query);
            } else if ($(this).attr('id') === 'drop-point') {
                fetchDropSuggestions(query);
            }
        } else {
            // Hide dropdown and add empty class to hide border
            dropdownList.slideUp('fast').addClass('empty');
        }
    }
});

// Fetch suggestions for pickup point
function fetchPickupSuggestions(query) {
    fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                updateDropdown($('#pickup-dropdown-list'), data.predictions);
            }
        })
        .catch(error => {
            console.error('Error fetching pickup point suggestions:', error);
        });
}

// Fetch suggestions for drop point (dummy URL for example)
function fetchDropSuggestions(query) {
    fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${apiKey}`) // Update with actual endpoint if different
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                updateDropdown($('#drop-dropdown-list'), data.predictions);
            }
        })
        .catch(error => {
            console.error('Error fetching drop point suggestions:', error);
        });
}

// Update the dropdown list with suggestions
function updateDropdown(dropdownList, predictions) {
    dropdownList.empty(); // Clear the existing list

    if (predictions.length > 0) {
        predictions.forEach(prediction => {
            const listItem = $('<li class="t-dropdown-item"></li>').text(prediction.description);
            dropdownList.append(listItem);
        });
        dropdownList.removeClass('empty'); // Remove empty class to show border
        dropdownList.slideDown('fast', function() {
            $(this).css('display', 'block'); // Ensures the display is set to block
        });
    } else {
        dropdownList.addClass('empty'); // Add empty class if no predictions
        dropdownList.slideUp('fast'); // Hide if no results
    }
}

// Handle dropdown visibility for the clicked input
$('.t-dropdown-input').on('click', function() {
    const dropdownList = $(this).next('.t-dropdown-list');

    // Close any other open dropdowns before opening the current one
    $('.t-dropdown-list').not(dropdownList).slideUp('fast');

    // Toggle the current dropdown
    dropdownList.slideToggle('fast');
});

// Handle dropdown item selection
$('.t-dropdown-list').on('click', 'li.t-dropdown-item', function() {
    const selectedText = $(this).text();
    const dropdownInput = $(this).closest('.input-wrapper').find('.t-dropdown-input');
    dropdownInput.val(selectedText);

    // Close the dropdown after selection
    dropdownInput.next('.t-dropdown-list').slideUp('fast').empty(); // Clear the list
});

// Close dropdown if clicked outside
$(document).on('click', function(event) {
    if (!$(event.target).closest('.t-dropdown-input, .t-dropdown-list').length) {
        // Close and clear both dropdowns if clicked outside
        $('#pickup-dropdown-list').slideUp('fast').empty();
        $('#drop-dropdown-list').slideUp('fast').empty();
    }
});

// Set dynamic width for the dropdown list
$('.t-dropdown-list').width($('.t-dropdown-input').width());

// Clear the input field
$('.t-dropdown-input').val('');
// END //
  /*  
 var autocomplete;
 autocomplete = new google.maps.places.Autocomplete((document.getElementById('input-3')), {
  types: ['geocode'],
  componentRestrictions: {
   country: "IN"
  }
 });
  
 google.maps.event.addListener(autocomplete, 'place_changed', function () {
  document.getElementById('input-3').value = autocomplete.getPlace();
 });

    var autocomplete_drop;
 autocomplete = new google.maps.places.Autocomplete((document.getElementById('input-4')), {
  types: ['geocode'],
  //componentRestrictions: {
   //country: "USA"
  //}
 });
  
 google.maps.event.addListener(autocomplete_drop, 'place_changed', function () {
  document.getElementById('input-4').value = autocomplete.getPlace();
 });
*/

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
