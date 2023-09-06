import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, set, update, get, onChildAdded, onValue, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
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
const app = initializeApp(firebaseConfig);
const database = getDatabase();





function createPickupRequest() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userId = "testuser"; // To be changed 
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const currentTime = new Date().toISOString(); // Get current time in ISO format
        // Reference to the user's database node
        const userRef = ref(database, `users/${userId}`);

        // Retrieve the current request count
        get(userRef).then((snapshot) => {
          const userData = snapshot.val();
          let requestCount = userData.requestCount || 0; // Default to 0 if not set

          // Increment the request count
          requestCount++;
          // Create the new request object
          const newRequest = {
            pickupStatus: "generated",
            pickupTime: currentTime
          };
          // Check if the user has previous requests
          if (userData.prevrequests && Array.isArray(userData.prevrequests)) {
            // Set the current request count as the index
            const currentIndex = requestCount - 1;
            userData.prevrequests[currentIndex] = newRequest;
          } else {
            // Initialize the prevrequests array with null values
            userData.prevrequests = Array(requestCount).fill(null);
            // Add the new request as the last item
            userData.prevrequests.push(newRequest);
          }
          // Update the user's data
          const updates = {
            pickupRequested: true,
            pickupLocation: {
              latitude: userLat,
              longitude: userLng
            },
            pickupStatus: "generated",
            pickupTime: currentTime,
            requestCount: requestCount, // Update the request count
            prevrequests: userData.prevrequests // Update the prevrequests array
          };
          // Update the user's node with the new data
          update(userRef, updates)
            .then(() => {
              console.log("Pickup request created successfully.");
              // You can show a success message or perform additional actions here
            })
            .catch((error) => {
              console.error("Error creating pickup request:", error);
              // Handle errors or show an error message
            });
        })
          .catch((error) => {
            console.error("Error retrieving user data:", error);
          });
      },
      function (error) {
        console.error("Error getting user location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

const nowButton = document.getElementById("nowButton");
if (nowButton) {
  nowButton.addEventListener("click", createPickupRequest);
}
// Retrieve and display previous pickup requests
let userRef;
let userData;
function getPreviousRequests() {
  // Replace with the actual user ID
  // Reference to the user's data node
  userRef = ref(database, "users");
  // Listen for changes to the user's data
  onValue(userRef, (snapshot) => {
    userData = snapshot.val();
    var data=snapshot.val();
    for (const userId in data) {
      if (data.hasOwnProperty(userId)) {
        const uid = data[userId].username;
        console.log("UserId: "+uid);
      }      
    }
    if (userData && userData.prevrequests) {
      const previousRequestsDiv = document.querySelector(".previousrequests");
      if (previousRequestsDiv) {
        // Clear the previous requests div
        previousRequestsDiv.innerHTML = "";
        // Create a Bootstrap row to contain the cards
        let row = document.createElement("div");
        row.classList.add("row");
        // Iterate through the previous requests
        for (let index = userData.prevrequests.length - 1; index >= 0; index--) {
          const request = userData.prevrequests[index];
          if (request && !request.deleted) {
            // Determine the class based on the status
            let cardBodyClass = "";
            if (request.pickupStatus) {
              switch (request.pickupStatus) {
                case "generated":
                  cardBodyClass = "gen";
                  break;
                case "ongoing":
                  cardBodyClass = "ong";
                  break;
                case "completed":
                  cardBodyClass = "comp";
                  break;
                case "cancelled":
                  cardBodyClass = "canc";
                  break;
                default:
                  cardBodyClass = ""; // Handle other statuses if needed
              }
            }
            const requestElement = createRequestCard(index, request.pickupStatus, request.pickupTime);
            // Find the card-body element inside the requestElement
            const cardBody = requestElement.querySelector(".card-body");
            // Add the determined class to the card-body element
            if (cardBodyClass) {
              cardBody.classList.add(cardBodyClass);
            }
            row.appendChild(requestElement);
            // If three cards are added to the row, create a new row
            if (row.childElementCount === 3) {
              previousRequestsDiv.appendChild(row);
              row = document.createElement("div");
              row.classList.add("row");
            }
          }
        }

        // Add any remaining cards to the previousRequestsDiv
        if (row.childElementCount > 0) {
          previousRequestsDiv.appendChild(row);
        }
      }
    }
  });
}





//Creating Cards
function createRequestCard(requestNo, status, time) {
  const col = document.createElement("div");
  col.classList.add("col-md-4");

  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("c1");
  card.classList.add("card-zoom");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = `Request No. ${requestNo}`;

  const cardText = document.createElement("p");
  cardText.classList.add("card-text", "card-status");
  cardText.textContent = `Status: ${status}`;

  const cardTime = document.createElement("p");
  cardTime.classList.add("card-text", "card-time");
  cardTime.textContent = `Time: ${formatTime(time)}`;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("d-flex", "justify-content-end");

  const cardButton = document.createElement("button");
  cardButton.classList.add("btn", "btn-sm", "btn-zoom");
  cardButton.innerHTML = '<abbr title="Cancel"> <i class="bi bi-trash3 delbut"></i></abbr>';

  // Check if "reached" is true, then add the "Picked Up" button
  if (status === "generated" && userData.prevrequests[requestNo] && userData.prevrequests[requestNo].reached) {
    const pickedUpButton = document.createElement("button");
    pickedUpButton.classList.add("btn", "btn-sm", "btn-success");
    pickedUpButton.textContent = "Picked Up";

    // Add a click event listener to the "Picked Up" button
    pickedUpButton.addEventListener("click", () => {
      // Update the status to "ongoing"
      status = "ongoing";
      cardText.textContent = `Status: ${status}`;
      // Remove the "Picked Up" button
      buttonDiv.removeChild(pickedUpButton);
      // Update the status in the database (assuming userRef is accessible here)
      const updates = {};
      updates[`prevrequests/${requestNo}/pickupStatus`] = status;
      update(userRef, updates);
    });
    buttonDiv.appendChild(pickedUpButton);
  }

  // Add a click event listener to the cancel button
  cardButton.addEventListener("click", () => {
    // Check the current status
    if (status === "generated") {
      // Update the status to "cancelled"
      status = "cancelled";
      cardText.textContent = `Status: ${status}`;
      // Update the status in the database (assuming userRef is accessible here)
      const updates = {};
      updates[`prevrequests/${requestNo}/pickupStatus`] = status;
      update(userRef, updates);
    } else if (status === "cancelled" || status === "completed") {
      // Remove the card from the DOM
      col.remove();
      // Update the status to "deleted"
      status = "deleted";
      cardText.textContent = `Status: ${status}`;
      // Update the status in the database
      const updates = {};
      updates[`prevrequests/${requestNo}/pickupStatus`] = status;
      updates[`prevrequests/${requestNo}/deleted`] = true;
      update(userRef, updates)
      // Remove the entry from the database
      //  const updates = {};
      //  updates[`prevrequests/${requestNo}`] = null;
      //  update(userRef, updates);
    }
  });

  buttonDiv.appendChild(cardButton);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(cardTime);
  cardBody.appendChild(buttonDiv);
  card.appendChild(cardBody);
  col.appendChild(card);
  return col;
}

document.addEventListener("DOMContentLoaded", () => {
  getPreviousRequests();
});





function formatTime(isoTime) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return new Date(isoTime).toLocaleString('en-US', options);
}





//