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
let roundTripValue = 'No';
let formattedPickupTime='';
let formattedDate='';
let distance =0;
inputDate.min = ` ₹{year}- ₹{month}- ₹{day}`;
const navToggleFunc = function () {
  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}
const dateInput = document.getElementById('input-5');
const timeInput = document.getElementById('input-6');
const timeError = document.getElementById('time-error');

function validateTime() {
    const today = new Date();
    const selectedDate = new Date(dateInput.value);
    const currentTime = today.toTimeString().split(":").slice(0, 2).join(":");

    // If date is today, restrict the time to be after the current time
    if (selectedDate.toDateString() === today.toDateString()) {
      if (timeInput.value && timeInput.value <= currentTime) {
        timeInput.setCustomValidity('Please choose the time later than now');
      } else {
        timeInput.setCustomValidity('');
      }
    } else {
      timeInput.setCustomValidity('');
    }
}
// Listen for changes in date and time fields
dateInput.addEventListener('change', validateTime);
timeInput.addEventListener('change', validateTime);


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
function calculateFare(){
    let cabType = document.getElementById('input-7').value;
     let ratePerKm;

    switch (cabType) {
        case 'Hatchback(Rs.14/km)':
            ratePerKm = 14;
            break;
        case 'Sedan(Rs.15/km)':
            ratePerKm = 15;
            break;
        case 'SUV/MPV(Rs.19/km)':
            ratePerKm = 19;
            break;
        case 'Innova(Rs.20/km)':
            ratePerKm = 20;
            break;
        case 'Innova Crysta(Rs.25/km)':
            ratePerKm = 25;
            break;
        default:
            console.log('Unknown car type selected');
            return 0; // Return 0 if the car type is not recognized
    }
    let driverBetta = distance>400?500:300;
    let totalfare = (distance * ratePerKm)+driverBetta;
    return "Rs."+ Math.round(totalfare)+"/-";
}
 function showSuccessMessage() {
    document.querySelector('.input-wrapper-success').style.display = 'flex';
    document.getElementById('customer_name').innerText = document.getElementById('input-1').value;
    document.getElementById('customer_pickup_loc').innerText = document.getElementById('pickup-point').value;
    document.getElementById('customer_drop_loc').innerText = document.getElementById('drop-point').value;
    document.getElementById('customer_pickup_time').innerText = formattedDate+" "+formattedPickupTime;
    document.getElementById('customer_number').innerText = document.getElementById('input-2').value;
    document.getElementById('cab_type').innerText = document.getElementById('input-7').value;
    document.getElementById('round_trip').innerText = roundTripValue;
    document.getElementById('distance').innerText = distance+" km";
    let fare = calculateFare();
    document.getElementById('fare').innerText = fare?fare:"-";
}
function constructGoogleMapsLink(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
function sendEmail(thisObj){
  /*emailjs.sendForm('service_x5onnnv', 'template_wn5q4ha', thisObj)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessMessage();
        }, function (error) {
            console.log('FAILED...', error);
            alert('Error sending email. Please try again later.');
        });*/
}
function formateDate(date){
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}
function convertTo12HourFormat(time) {
    if(!time)return;
    let [hours, minutes] = time.split(':');
    let period = 'AM';

    hours = parseInt(hours);

    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) hours -= 12;
    } else if (hours === 0) {
        hours = 12; // Midnight edge case
    }

    return `${hours}:${minutes} ${period}`;
}


function getDistanceBetweenPoints(pickupCoords, dropCoords, callback) {
    const url = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${pickupCoords.lat},${pickupCoords.lng}&destinations=${dropCoords.lat},${dropCoords.lng}&mode=driving&api_key=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.rows && data.rows.length > 0 && data.rows[0] && data.rows[0].elements && data.rows[0].elements.length > 0) {
                distance = data.rows[0].elements[0].distance; // distance in meters
                distance = distance?distance/1000:0;
                distance = distance.toFixed(1);
                callback(); // Convert to kilometers
            } else {
                console.error('No routes found');
                callback(null);
            }
        })
        .catch(error => {
            console.error('Error fetching distance:', error);
            callback(null);
        });
}

function sendTelegramMsg(){
    const customerName = document.getElementById('customer_name').innerText;
    const customerPickupLoc = document.getElementById('customer_pickup_loc').innerText;
    const customerDropLoc = document.getElementById('customer_drop_loc').innerText;
    const customerNumber = document.getElementById('customer_number').innerText;
    const pickupMapLink = constructGoogleMapsLink(pickupCoords.lat, pickupCoords.lng);
    const dropMapLink = constructGoogleMapsLink(dropCoords.lat, dropCoords.lng);
    const pickupTime = document.getElementById('customer_pickup_time').innerText;
    const cabType = document.getElementById('cab_type').innerText;
    const fare = document.getElementById('fare').innerText;
    
   
        // Construct the message with placeholders replaced
        const messageText = `
            Dear Admin,
            A new drop taxi booking has been made. Here are the details:
           
            Customer Name: ${customerName}  
            Contact Number: ${customerNumber}  
            Pickup Location: ${customerPickupLoc}  
            Pickup Map Link: ${pickupMapLink}  
            Drop Location: ${customerDropLoc}  
            Drop Map Link: ${dropMapLink}  
            Pickup Date/Time: ${pickupTime}  
            Cab Type: ${cabType}
            Total Distance: ${distance} km  
            Round Trip: ${roundTripValue}  
            Appro Fare: ${fare}  
            
            Please ensure that you are available at the designated pickup location on time to provide the service to our valued customer.\n
            Thank you!
            Best regards,\n
            Moon Drop taxi, Chennai
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
           
}
emailjs.init('fKdTn44q0lXV5IXY4');
document.getElementById('hero-form').addEventListener('submit', function (event) {   
    event.preventDefault(); // Prevent form submission 
    getDistanceBetweenPoints(pickupCoords, dropCoords, ()=> {
        if(distance < 100){
            const dropInput = document.getElementById("drop-point");
            dropInput.setCustomValidity("Distance must be lesser than 100 km.");
            dropInput.reportValidity();    
            return 
        }
        formattedPickupTime = convertTo12HourFormat(document.getElementById("input-6").value);
        formattedDate = formateDate(document.getElementById("input-5").value);
        console.log(this);
        showSuccessMessage();        
        sendEmail(this);
        sendTelegramMsg();
        this.reset();
     });
});

    
const apiKey = 'CvBHxlan7n1vSlyPb4yJrb3DL0aSACdZotfvRdye';
// Handle input for both pickup point and drop point to trigger API call
$('.t-dropdown-input').on('input', function() {
    const dropdownList = $(this).next('.t-dropdown-list');
    const query = $(this).val().trim();

    // Check which input is being used
    if ($(this).attr('id') === 'pickup-point' || $(this).attr('id') === 'drop-point') {
        console.log("Input detected for:", $(this).attr('id'));
        
        if (query.length > 1) {
            // Call the appropriate fetch function based on the input
            if ($(this).attr('id') === 'pickup-point') {
                    debouncedFetchPickupSuggestions(query); // Use debounced functio
            } else if ($(this).attr('id') === 'drop-point') {
                debouncedFetchDropSuggestions(query);
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
                listItem.data('lat', prediction.geometry.location.lat);
                listItem.data('lng', prediction.geometry.location.lng);
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
   if (dropdownInput.attr('id') === 'pickup-point' || dropdownInput.attr('id') === 'drop-point') {
        dropdownInput.next('.t-dropdown-list').slideUp('fast').empty(); // Clear the list
    } else {
        dropdownInput.next('.t-dropdown-list').slideUp('fast'); // Just close for other inputs
    }
});

// Close dropdown if clicked outside
$(document).on('click', function(event) {
    if (!$(event.target).closest('.t-dropdown-input, .t-dropdown-list').length) {
        // Close and clear both dropdowns if clicked outside
        $('#pickup-dropdown-list').slideUp('fast').empty();
        $('#drop-dropdown-list').slideUp('fast').empty();
        console.log($('#t-dropdown-list'));
        const dropInput = document.getElementById("drop-point");
        if(dropInput.value!=""){
            dropInput.setCustomValidity("");
        }
        $('#t-dropdown-list').slideUp('fast');
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
                const selectedItem = items.eq(currentIndex);
                if($(this).attr('id')==="pickup-point"){
                    pickupCoords = {
                        lat: selectedItem.data('lat'),
                        lng: selectedItem.data('lng')
                    };
                }else if($(this).attr('id')==="drop-point"){
                    dropCoords = {
                        lat: selectedItem.data('lat'),
                        lng: selectedItem.data('lng')
                    };    
                }
                console.log(pickupCoords);
                console.log(dropCoords);
                
                $(this).val(selectedItem.text()); // Set the input value    
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


function populate(carType){
  if(!carType)return;
  $('.cartype').val(carType);  
   $('html, body').animate({
        scrollTop: $('.t-dropdown-input').offset().top
    }, 1, function() {
        $('.t-dropdown-input').focus();
    });
}

document.getElementById('round-trip').addEventListener('change', function() {
    roundTripValue = this.checked ? 'Yes' : 'No';
    console.log('Round Trip:', roundTripValue);
});