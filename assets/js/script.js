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

document.addEventListener('DOMContentLoaded', function () {
    emailjs.init('fKdTn44q0lXV5IXY4');

    const form = document.getElementById('hero-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
            alert('Email sent successfully!');
                
        /*emailjs.sendForm('service_x5onnnv', 'template_wn5q4ha', this)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Email sent successfully!');
            }, function (error) {
                console.log('FAILED...', error);
                alert('Error sending email. Please try again later.');
            });*/
    });
});
