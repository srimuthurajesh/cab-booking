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
let pickupCoords = {};
let dropCoords = {};
inputDate.min = ` ₹{year}- ₹{month}- ₹{day}`;
const navToggleFunc = function () {
  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}
const inputTime = document.getElementById('input-6');
inputTime.addEventListener('input', function() {
    const selectedTime = this.value;
    const currentTime = new Date();
    
    const currentHours = currentTime.getHours().toString().padStart(2, '0');
    const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0');
    const formattedCurrentTime = `${currentHours}:${currentMinutes}`;
    
    // Ensure the min time is set dynamically if the current time is today
    if (this.value && new Date().toDateString() === currentTime.toDateString()) {
        inputTime.min = formattedCurrentTime;
    } else {
        inputTime.min = '12:00'; // Default min time
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
    document.getElementById('customer_pickup_loc').innerText = document.getElementById('pickup-point').value;
    document.getElementById('customer_drop_loc').innerText = document.getElementById('drop-point').value;
    document.getElementById('customer_pickup_time').innerText = document.getElementById('input-6').value;
    document.getElementById('customer_number').innerText = document.getElementById('input-2').value;
}
function constructGoogleMapsLink(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
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
            const pickupMapLink = constructGoogleMapsLink(pickupCoords.lat, pickupCoords.lng);
            const dropMapLink = constructGoogleMapsLink(dropCoords.lat, dropCoords.lng);


            // Construct the message with placeholders replaced
            const messageText = `
                Dear Admin,
                A new drop taxi booking has been made. Here are the details:
                Customer Name: ${customerName}
                Pickup Location: [${customerPickupLoc}](${pickupMapLink})
                Drop-off Location: [${customerDropLoc}](${dropMapLink})     
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
         /*   fetch(url)
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
        */
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
                    debouncedFetchPickupSuggestions(query); // Use debounced functio
//                fetchPickupSuggestions(query);
            } else if ($(this).attr('id') === 'drop-point') {
                debouncedFetchDropSuggestions(query);
//                fetchDropSuggestions(query);
            }
        } else {
            // Hide dropdown and add empty class to hide border
            dropdownList.slideUp('fast').addClass('empty');
        }
    }
});
// Debounce function to limit the rate of function execution
function debounce(fn, delay) {
    let timeoutID;
    return function(...args) {
        if (timeoutID) {
            clearTimeout(timeoutID); // Clear the previous timeout if the function is called again
        }
        timeoutID = setTimeout(() => {
            fn.apply(this, args); // Execute the function after the delay
        }, delay);
    };
}
const debouncedFetchPickupSuggestions = debounce(function(query) {
    fetchPickupSuggestions(query);
}, 300); // 300ms delay

// Debounced version of the API call for drop point
const debouncedFetchDropSuggestions = debounce(function(query) {
    fetchDropSuggestions(query);
}, 300); // 300ms delay

// Fetch suggestions for pickup point
function fetchPickupSuggestions(query) {
    fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                let dropPointValue = $('#drop-point').val().trim();
                updateDropdown($('#pickup-dropdown-list'), data.predictions, dropPointValue, 'pickup');
            }
        })
        .catch(error => {
            console.error('Error fetching pickup point suggestions:', error);
        });
}

// Fetch suggestions for drop point (dummy URL for example)
function fetchDropSuggestions(query) {
    
    fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${apiKey}&components=country:IN`) // Update with actual endpoint if different
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                let pickupPointValue = $('#pickup-point').val().trim(); // Get the current value of pickup point

                updateDropdown($('#drop-dropdown-list'), data.predictions, pickupPointValue,'drop');
            }
        })
        .catch(error => {
            console.error('Error fetching drop point suggestions:', error);
        });
}

// Update the dropdown list with suggestions
function updateDropdown(dropdownList, predictions, otherFieldValue, fieldType) {
    dropdownList.empty(); // Clear the existing list

    if (predictions.length > 0) {
        predictions.forEach(prediction => {
            if (prediction.description !== otherFieldValue) {
                const listItem = $('<li class="t-dropdown-item"></li>').text(prediction.description);
                dropdownList.append(listItem);
                // Store the coordinates based on the field type
                listItem.on('click', function() {
                    if (fieldType === 'pickup') {
                        pickupCoords = {
                            lat: prediction.geometry.location.lat,
                            lng: prediction.geometry.location.lng
                        };
                    } else if (fieldType === 'drop') {
                        dropCoords = {
                            lat: prediction.geometry.location.lat,
                            lng: prediction.geometry.location.lng
                        };
                    }
                });
            }
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
   // Check if it's the pickup or drop point input
    if ($(this).attr('id') === 'pickup-point' || $(this).attr('id') === 'drop-point') {
        // If the dropdown is empty, add the 'empty' class
        if (dropdownList.children('li').length === 0) {
            dropdownList.addClass('empty');
        } else {
            dropdownList.removeClass('empty');
        }
    }
    // Toggle the current dropdown
    dropdownList.slideToggle('fast');
});

// Handle dropdown item selection
$('.t-dropdown-list').on('click', 'li.t-dropdown-item', function() {
    const selectedText = $(this).text();
    const dropdownInput = $(this).closest('.input-wrapper').find('.t-dropdown-input');
    dropdownInput.val(selectedText);
    console.log("d");
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
    
    //dropdown selecrted by key down and enter
    let currentIndex = -1; // Tracks the index of the currently highlighted item
    
$('.t-dropdown-input').on('keydown', function(event) {
    const dropdownList = $(this).next('.t-dropdown-list');
    const items = dropdownList.find('li.t-dropdown-item');

    if (dropdownList.is(':visible')) {
        if (event.key === 'ArrowDown') {
            // Move down in the list
            event.preventDefault();
            currentIndex++;
            if (currentIndex >= items.length) currentIndex = 0;
            highlightItem(items, currentIndex);
        } else if (event.key === 'ArrowUp') {
            // Move up in the list
            event.preventDefault();
            currentIndex--;
            if (currentIndex < 0) currentIndex = items.length - 1;
            highlightItem(items, currentIndex);
        } else if (event.key === 'Enter') {
            // Select the highlighted item
            event.preventDefault();
            if (currentIndex >= 0) {
                const selectedItem = items.eq(currentIndex).text();
                $(this).val(selectedItem); // Set the input value
                dropdownList.slideUp('fast'); // Close the dropdown
            }
        }
    }
});
function highlightItem(items, index) {
    items.removeClass('highlight'); // Remove highlight from all items
    items.eq(index).addClass('highlight'); // Highlight the current item
}

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
