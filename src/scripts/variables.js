/** @type {HTMLFormElement} The registration form element */
export const form = document.getElementById("student-details")

/** @type {HTMLButtonElement|HTMLInputElement} The submit button */
export const submitBtn = document.getElementById("submit-details")

/** @type {HTMLInputElement} Name input field (letters and spaces only) */
export const nameInput = document.getElementById("s_name")

/** @type {HTMLInputElement} ID input field (numbers only) */
export const idInput = document.getElementById("s_id")

/** @type {HTMLInputElement} Email input field (valid email format) */
export const emailInput = document.getElementById("s_email")

/** @type {HTMLInputElement} Contact input field (exactly 10 digits) */
export const contactInput = document.getElementById("s_contact")
