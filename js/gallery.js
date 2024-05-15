"use strict";

/**
 * Selects a random full image at the start and displays it.
 */
function showRandomImageAtStart() {
    // Select all 6 links (<a>) in the thumbnail section. They contain the URLs to the full images.
    let links = document.querySelectorAll('#thumbnails .card-link');

    // Select a random entry out of these 6.
    function getRandomLink(links) {
        return links[getRandomInt(0, links.length)];
    }

    let randomLink = getRandomLink(links);
    let imageUrl = randomLink.getAttribute('href');
    let imageDescription = randomLink.querySelector('img').getAttribute('alt');

    // Call switchFullImage() with the URL of the random image and the alt attribute of the thumbnail
    switchFullImage(imageUrl, imageDescription);

    // Set a background color (classes .bg-dark and .text-white) to the card-body of your random image (hint: it's the sibling element of your link).
    let cardBody = randomLink.closest('.card').querySelector('.card-body');
    cardBody.classList.add('bg-dark', 'text-white');
}

/**
 * Prepare the links on the full images so that they execute the following tasks:
 * - Switch the full image to the one that has been clicked on.
 * - Set the highlight under the current thumbnail.
 * - Load the notes for the current image.
 */
function prepareLinks() {
    // Select all the 6 links (<a>) in the thumbnail section.
    let linksThumbnail = document.querySelectorAll('#thumbnails .card-link');

    // Set an event listener for the click event on every <a> element.
    linksThumbnail.forEach(link => {
        link.addEventListener("click", function(event) {
            // Verhindern das Standardverhalten des Links
            event.preventDefault();

            // The callback of the listener should do the following things:
            // Remove the .bg-dark and .text-white classes from the card where it's currently set.
            document.querySelectorAll('.card-body.bg-dark').forEach(card => {
                card.classList.remove('bg-dark', 'text-white');
            });

            // Add both classes again to the card where the click happened (hint: "this" contains the very <a> element, where the click happened).
            let cardBody = this.closest('.card').querySelector('.card-body');
            cardBody.classList.add('bg-dark', 'text-white');

            // Call switchFullImage() with the URL clicked link and the alt attribute of the thumbnail.
            let imageUrl = this.getAttribute('href');
            let imageDescription = this.querySelector('img').getAttribute('alt');
            switchFullImage(imageUrl, imageDescription);

            // Implement and then call loadNotes() with the key for the current image (hint: the full image's URL makes an easy and unique key).
            loadNotes(imageUrl);
        });
    });
}

/**
 * Stores or deletes the updated notes of an image after they have been changed.
 */
function storeNotes() {
    // Select the notes field and add a blur listener.
    let notesField = document.getElementById('notes');
    notesField.addEventListener('blur', function () {
        // When the notes field loses focus, store the notes for the current image in the local storage.
        let currentImageUrl = document.querySelector('#fullImage img').getAttribute('src');
        let notes = notesField.innerHTML;
        // If the notes field is empty, remove the local storage entry.
        if (notes.trim() === '') {
            localStorage.removeItem(currentImageUrl);
        } else {
            localStorage.setItem(currentImageUrl, notes);
        }
    });
}

/**
 * Switches the full image in the <figure> element to the one specified in the parameter. Also updates the image's alt
 * attribute and the figure's caption.
 * @param {string} imageUrl The URL to the new image (the image's src attribute value).
 * @param {string} imageDescription The image's description (used for the alt attribute and the figure's caption).
 */
function switchFullImage(imageUrl, imageDescription) {
    // Get the <img> element for the full image. Select it by its class or tag name.
    let img = document.querySelector('.figure-img');
    // Set its src and alt attributes with the values from the parameters (imageUrl, imageDescription).
    img.setAttribute('src', imageUrl);
    img.setAttribute('alt', imageDescription);
    // Select the <figcaption> element.
    let figcaption = document.querySelector('.figure-caption');
    // Set the description (the one you used for the alt attribute) as its text content.
    figcaption.innerText = imageDescription;
}

/**
 * Loads the notes from local storage for a given key and sets the contents in the notes field with the ID notes.
 * @param {string} key The key in local storage where the entry is found.
 */
function loadNotes(key) {
    // Select the notes field.
    let notesField = document.getElementById('notes');
    // Check the local storage at the provided key.
    let storedNotes = localStorage.getItem(key);
    // If there's an entry, set the notes field's HTML content to the local storage's content.
    // If there's no entry, set the default text "Enter your notes here!".
    if (storedNotes) {
        notesField.innerHTML = storedNotes;
    } else {
        notesField.innerHTML = 'Enter your notes here!';
    }
}

/**
 * Returns a random integer value between min (included) and max (excluded).
 * @param {number} min The minimum value (included).
 * @param {number} max The maximum value (excluded).
 * @returns {number} A random integer value between min (included) and max (excluded).
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Gets the whole thing started.
 */
showRandomImageAtStart();
prepareLinks();
storeNotes();
