
/*
  AstroLaunch Expeditions — script.js
  -----------------------------------
  This file handles all interactive behavior across the site using jQuery.

  Sections in this file:
  1. Booking form validation (checks each field, saves valid bookings to localStorage)
  2. Contact form validation (checks each field, shows a confirmation)
  3. Mission Simulator (countdown, simulated landing, planet analysis results)
  4. Dashboard (reads saved bookings/reports from localStorage and displays them as cards)

  All code runs inside $(document).ready() to make sure the page has
  fully loaded before any JavaScript tries to interact with it.
*/






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

  // MISSION SIMULATOR 
  const planetData = {
    mars: {
      name: "Mars",
      gravity: "0.38g",
      temperature: "-63°C",
      atmosphere: "Thin CO2 — suit required",
      water: "Ice at poles",
      score: 58
    },
    europa: {
      name: "Europa",
      gravity: "0.13g",
      temperature: "-160°C",
      atmosphere: "Trace oxygen — suit required",
      water: "Subsurface ocean",
      score: 41
    },
    kepler: {
      name: "Kepler-186f",
      gravity: "1.1g",
      temperature: "-5°C",
      atmosphere: "Breathable with equipment",
      water: "Present",
      score: 82
    }
  };

  $("#simStart").on("click", function () {
    const chosenPlanet = $("#simPlanet").val();
    const planet = planetData[chosenPlanet];

    $("#statusLog").html("<p>Launch sequence starting...</p>");
    $("#countdown").show();

    let count = 5;
    $("#countdown").text(count);

    const countdownTimer = setInterval(function () {
      count--;

      if (count > 0) {
        $("#countdown").text(count);
      } else {
        clearInterval(countdownTimer);
        $("#countdown").text("LIFTOFF!");
        $("#statusLog").append("<p>Ignition confirmed. Heading to " + planet.name + ".</p>");

        setTimeout(function () {
          $("#statusLog").append("<p>Landing confirmed on " + planet.name + ".</p>");
          showResults(planet);
        }, 2000);
      }
    }, 1000);
  });

  function showResults(planet) {
    $("#gVal").text(planet.gravity);
    $("#tVal").text(planet.temperature);
    $("#aVal").text(planet.atmosphere);
    $("#wVal").text(planet.water);
    $("#scoreVal").text(planet.score + "%");

    const report = {
      id: Date.now(),
      planet: planet.name,
      score: planet.score
    };

    let reports = JSON.parse(localStorage.getItem("astro_reports")) || [];
    reports.push(report);
    localStorage.setItem("astro_reports", JSON.stringify(reports));
  }


  // DASHBOARD (My Missions page)
  if ($("#missionList").length > 0) {
    loadMissions();
  }

  function loadMissions() {
    const bookings = JSON.parse(localStorage.getItem("astro_bookings")) || [];
    const reports = JSON.parse(localStorage.getItem("astro_reports")) || [];

    $("#missionList").empty();

    if (bookings.length === 0 && reports.length === 0) {
      $("#missionList").html("<p>No missions saved yet.</p>");
      return;
    }

    bookings.forEach(function (booking) {
      const card = $("<div class='mission-card'></div>");
      const info = $("<span></span>").text(booking.destination + " — booked for " + booking.date);
      const removeButton = $("<button class='remove-btn'>Cancel</button>");

      removeButton.on("click", function () {
        removeBooking(booking.id);
      });

      card.append(info).append(removeButton);
      $("#missionList").append(card);
    });

    reports.forEach(function (report) {
      const card = $("<div class='mission-card'></div>");
      const info = $("<span></span>").text(report.planet + " — simulation, habitability " + report.score + "%");
      const removeButton = $("<button class='remove-btn'>Delete</button>");

      removeButton.on("click", function () {
        removeReport(report.id);
      });

      card.append(info).append(removeButton);
      $("#missionList").append(card);
    });
  }

  function removeBooking(id) {
    let bookings = JSON.parse(localStorage.getItem("astro_bookings")) || [];
    bookings = bookings.filter(function (b) {
      return b.id !== id;
    });
    localStorage.setItem("astro_bookings", JSON.stringify(bookings));
    loadMissions();
  }

  function removeReport(id) {
    let reports = JSON.parse(localStorage.getItem("astro_reports")) || [];
    reports = reports.filter(function (r) {
      return r.id !== id;
    });
    localStorage.setItem("astro_reports", JSON.stringify(reports));
    loadMissions();
  }