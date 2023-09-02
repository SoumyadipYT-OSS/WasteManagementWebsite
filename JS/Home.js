// Geolocation configuration to database
//===================================================================================================================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcTvZ4CsSHVyR3qnKFEBFj-EWm-39t1Zw",
  authDomain: "wastemanagementsystem-101.firebaseapp.com",
  databaseURL: "https://wastemanagementsystem-101-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wastemanagementsystem-101",
  storageBucket: "wastemanagementsystem-101.appspot.com",
  messagingSenderId: "198727372594",
  appId: "1:198727372594:web:49ebda1274cb08b087912b",
  measurementId: "G-1YHL30YKMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase();

// Check if geolocation is supported by the browser
if (navigator.geolocation) {
  // Get the user's location
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Store the user's location in Firebase
      const userId = "user1"; // Replace with the user's unique identifier
      set(ref(database, userId), {
        latitude: userLat,
        longitude: userLng
      })
        .then(() => {
          console.log("User location stored successfully.");


          // Map configuration
          //===================================================================================================================================================
          // Define the tile layer using OpenStreetMap_DE URL and options.
          var OpenStreetMap_DE = new L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          });

          // Create the Leaflet map on the 'map' div.
          var map = L.map('mainmap');

          // Set the initial view of the map to the user's location and zoom level.
          var initialLatLng = L.latLng(userLat, userLng); // Use the user's location as the initial center.
          var initialZoom = 15.8; // Replace this value with the desired zoom level.
          map.setView(initialLatLng, initialZoom);

          // Add the OpenStreetMap_DE tile layer to the map.
          OpenStreetMap_DE.addTo(map);

          // Create a custom icon for the user's location marker
          var customIcon = L.icon({
            iconUrl: 'https://media.giphy.com/media/1oF1MaxVOqrgtG4hev/giphy.gif', // Replace with your custom marker image URL
            iconSize: [40, 40], // Replace with the width and height of your custom marker
            iconAnchor: [20, 52], // Replace with the coordinates of the anchor point of your custom marker (usually half of the icon size)
          });

          // Add the user's location marker to the map
          L.marker(initialLatLng, { icon: customIcon }).addTo(map);
          //===================================================================================================================================================



        })
        .catch((error) => {
          console.error("Error storing user location:", error);
        });
    },
    function (error) {
      console.error("Error getting user location:", error.message);
      const mainmapDiv = document.getElementById('mainmap');
      mainmapDiv.style.backgroundImage = 'url("https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg")';
      mainmapDiv.style.filter = 'blur(8px)';
      mainmapDiv.style.webkitFilter = 'blur(6px)';
      mainmapDiv.style.backgroundPosition = 'center';
      mainmapDiv.style.backgroundRepeat = 'no-repeat';
      mainmapDiv.style.backgroundSize = 'cover';
      mainmapDiv.style.fontWeight = 'bolder';
      mainmapDiv.innerText = 'Please enable location';
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
  const mainmapDiv = document.getElementById('mainmap');
  mainmapDiv.style.backgroundImage = 'url("https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg")';
  mainmapDiv.style.filter = 'blur(8px)';
  mainmapDiv.style.webkitFilter = 'blur(6px)';
  mainmapDiv.style.backgroundPosition = 'center';
  mainmapDiv.style.backgroundRepeat = 'no-repeat';
  mainmapDiv.style.backgroundSize = 'cover';
  mainmapDiv.style.fontWeight = 'bolder';
  mainmapDiv.innerText = 'Please enable location';
}




// --------------------------------------------------------------------------------------------
const ps = document.querySelectorAll('p');

window.addEventListener('scroll', () => {
  ps.forEach(p => {
    const rect = p.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      p.classList.add('in-view');
    } else {
      p.classList.remove('in-view');
    }
  });
});
// -------------------------------------------------------------------------------------------








// --------------------------------------------------------------
var text1 = document.querySelector('.text1 p');
window.addEventListener('scroll', function () {
  if (text1.getBoundingClientRect().top < window.innerHeight) {
    text1.classList.add('in-view');
  }
});
// --------------------------------------------------------------