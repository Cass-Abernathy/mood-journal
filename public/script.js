// grab the page elements
const moodForm = document.getElementById("mood-form");
const moodInput = document.getElementById("mood");
const noteInput = document.getElementById("note");
const statusText = document.getElementById("status");
const entriesList = document.getElementById("entries");

// ROUTE 3 (CLIENT SIDE): GET THE SAVED MOODS AND SHOW THEM
async function showMoods() {
    // Ask the server for every saved mood (a GET request)
    const serverReply = await fetch("/data");
    const moods = await serverReply.json();

    // Empty the list first, so entries don't appear twice
    entriesList.textContent = "";

    // Add one list item for each saved mood
    for (const entry of moods) {
        //start with the date and mood, e.g., "10/21/2026: happy"
        let text = entry.date + ": " + entry.mood;
        //only add the note if there is one
        if (entry.note !== "") {
            text =text + ": " + entry.note;
        }

        //Make a new <li>, put the text in it, and add it to the list
        const listItem = document.createElement("li");
        listItem.textContent = text;
        entriesList.appendChild(listItem);
    }
}

// ROUTE 2 (CLIENT SIDE): SEND A NEW MOOD TO THE SERVER
async function saveMood(event) {
    //stop the form from reloading the page
    event.preventDefault();

    //package up hat the user entered
    const newMood = {
        mood: moodInput.value,
        note: noteInput.value
    };

    //send it to the server with a POST request
    const serverReply = await fetch("/new-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMood)
    });

    //read the server's reply and show it on the page
    const replyText = await serverReply.json();
    statusText.textContent = replyText.message;

    //Clear the form, ready for the next entry
    moodForm.reset();

    //Refresh the list so the new mood shows up right away
    await showMoods();
}

// LISTEN FOR THE FORM BEING SUBMITTED
moodForm.addEventListener("submit", saveMood);

// WHEN THE PAGE FIRST LOADS, SHOW WHAT'S ALREADY SAVED
showMoods();
