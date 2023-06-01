const newPartyFormContainer = document.querySelector("#new-party-form");
const partyContainer = document.querySelector("#party-container");

const PARTIES_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/parties";
const GUESTS_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/guests";
const RSVPS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/rsvps";
const GIFTS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/gifts";

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  // your code here
  try {
    const response = await fetch(`${GUESTS_API_URL}/party/${id}`, {
      method: "DELETE",
    });
    const guests = await guestsResponse.json();
    console.log(guests);
    getAllParties();

    // reload the window
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // fetch party details from server
    const party = await getPartyById(id);

    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    // create new HTML element to display party details
    const partyDetailsElement = document.createElement("div");
    partyDetailsElement.classList.add("party-details");
    partyDetailsElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guests, index) => `
              <li>
                <div>${guests.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join("")}
          </ul>
            <button class="close-button">Close</button>
        `;
    partyContainer.appendChild(partyDetailsElement);

    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    console.error(error);
  }
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = "";
    parties.forEach((party) => {
      const partyElement = document.createElement("div");
      partyElement.classList.add("party");
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      partyContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        // your code here
        event.preventDefault();
        renderSinglePartyById(party.id);
      });

      // delete party
      const deleteButton = partyElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        // your code here
        event.preventDefault();
        removePartyById(party.id);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const createNewPartyForm = () => {
  let formHtml = `
    <form>
    <label for="title">Title</label>
    <input type="text" id="title" name="title" placeholder="Title">
    <label for="desciption">Description</label>
    <input type="text" id="description" name="description" placeholder="Description">
    <label for="date">Date</label>
    <input type="text" id="date" name="date" placeholder="Date">
    <label for="time">Time</label>
    <input type="time" id="time" name="time" placeholder="Time">
    <label for="location">Location</label>
    <input type="location" id="location" name="location" placeholder="Location">
    <button type="submit">Add Party</button>
    </form>
    `;

  newPartyFormContainer.innerHTML = formHtml;

  let form = newPartyFormContainer.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let partyData = {
      title: form.title.valueOf,
      description: form.description.valueOf,
      date: form.date.value,
      time: form.time.value,
      location: form.location.valueOf,
    };

    await createNewParty(
      partyData.title,
      partyData.description,
      partyData.date,
      partyData.time,
      partyData.location
    );

    const party = await getAllParties();
    renderParties(party);

    form.title.value = "";
    form.description.value = "";
    form.date.value = "";
    form.time.value = "";
    form.location.value = "";
  });
};

// create new party
const createNewParty = async (title, description, date, time, location) => {
  try {
    const response = await fetch(PARTIES_API_URL, {
      method: "POST",
      body: JSON.stringify({ title, description, date, time, location }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const party = await response.json();
    console.log(party);
  } catch (error) {
    console.error(error);
  }
};
// init function
const init = async () => {
  // your code here
  const parties = await getAllParties();
  renderParties(parties);
  createNewPartyForm();
};

init();
