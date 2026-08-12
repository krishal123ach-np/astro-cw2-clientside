$(document).ready(function () {

  // BOOKING FORM VALIDATION
  $("#bookingForm").on("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const fullName = $("#fullName").val().trim();
    if (fullName === "" || fullName.length < 2) {
      $("#fullNameError").show();
      isValid = false;
    } else {
      $("#fullNameError").hide();
    }

    const email = $("#email").val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      $("#emailError").show();
      isValid = false;
    } else {
      $("#emailError").hide();
    }

    const destination = $("#destination").val();
    if (destination === "") {
      $("#destinationError").show();
      isValid = false;
    } else {
      $("#destinationError").hide();
    }

    const rocketType = $("#rocketType").val();
    if (rocketType === "") {
      $("#rocketTypeError").show();
      isValid = false;
    } else {
      $("#rocketTypeError").hide();
    }

    const crewSize = Number($("#crewSize").val());
    if (crewSize < 1 || crewSize > 8 || $("#crewSize").val() === "") {
      $("#crewSizeError").show();
      isValid = false;
    } else {
      $("#crewSizeError").hide();
    }

    const launchDate = $("#launchDate").val();
    if (launchDate === "") {
      $("#launchDateError").show();
      isValid = false;
    } else {
      $("#launchDateError").hide();
    }

    if (!$("#terms").is(":checked")) {
      $("#termsError").show();
      isValid = false;
    } else {
      $("#termsError").hide();
    }

    if (isValid) {
      const booking = {
        id: Date.now(),
        name: fullName,
        email: email,
        destination: destination,
        rocket: rocketType,
        crew: crewSize,
        date: launchDate
      };

      let bookings = JSON.parse(localStorage.getItem("astro_bookings")) || [];
      bookings.push(booking);
      localStorage.setItem("astro_bookings", JSON.stringify(bookings));

      alert("Booking confirmed for " + fullName + " — " + destination);
      this.reset();
    }
  });

  // CONTACT FORM VALIDATION
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const cName = $("#cName").val().trim();
    if (cName === "") {
      $("#cNameError").show();
      isValid = false;
    } else {
      $("#cNameError").hide();
    }

    const cEmail = $("#cEmail").val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cEmail)) {
      $("#cEmailError").show();
      isValid = false;
    } else {
      $("#cEmailError").hide();
    }

    const cMessage = $("#cMessage").val().trim();
    if (cMessage.length < 10) {
      $("#cMessageError").show();
      isValid = false;
    } else {
      $("#cMessageError").hide();
    }

    if (isValid) {
      alert("Message sent. We'll get back to you soon.");
      this.reset();
    }
  });

});