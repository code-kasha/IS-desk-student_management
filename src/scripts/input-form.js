import {
	form,
	submitBtn,
	nameInput,
	idInput,
	emailInput,
	contactInput,
} from "./variables"

/**
 * Represents a single form field with validation metadata.
 * @typedef {Object} FormField
 * @property {HTMLInputElement} input - The input element in the form.
 * @property {HTMLElement} error - Container to display error messages.
 * @property {string} name - Friendly field name for messages.
 * @property {boolean} touched - Tracks whether the user has interacted with the field.
 * @property {function(string): boolean} validate - Validation function; returns true if valid.
 * @property {string} errorMsg - Error message displayed if validation fails.
 */

/** @type {FormField[]} All form fields with validation rules and error messages */
const fields = [
	{
		input: nameInput,
		error: document.getElementById("err-name"),
		name: "Name",
		touched: false,
		validate: (v) => /^[a-zA-Z\s]+$/.test(v) && v.trim() !== "",
		errorMsg: "Please enter your name using letters only.",
	},
	{
		input: idInput,
		error: document.getElementById("err-id"),
		name: "ID",
		touched: false,
		validate: (v) => /^\d+$/.test(v) && v.trim() !== "",
		errorMsg: "Please enter your ID using numbers only.",
	},
	{
		input: emailInput,
		error: document.getElementById("err-email"),
		name: "Email",
		touched: false,
		validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
		errorMsg: "Please enter a valid email address (example: name@example.com).",
	},
	{
		input: contactInput,
		error: document.getElementById("err-contact"),
		name: "Contact",
		touched: false,
		validate: (v) => /^\d{10}$/.test(v),
		errorMsg: "Please enter your 10-digit contact number.",
	},
]

/**
 * Show an error message and mark field invalid.
 * @param {FormField} field
 * @param {string} message
 */
const setError = (field, message) => {
	field.error.textContent = message
	field.input.classList.add("invalid")
}

/**
 * Clear the error message and remove invalid styling.
 * @param {FormField} field
 */
const clearError = (field) => {
	field.error.textContent = ""
	field.input.classList.remove("invalid")
}

/**
 * Validate a single field:
 * - Cleans input values
 * - Checks validation
 * - Displays error if field is touched
 * @param {FormField} field
 * @returns {boolean} true if valid
 */
const validateField = (field) => {
	if (field.name === "Name")
		field.input.value = field.input.value.replace(/[^a-zA-Z\s]/g, "")
	if (field.name === "ID")
		field.input.value = field.input.value.replace(/\D/g, "")
	if (field.name === "Contact")
		field.input.value = field.input.value.replace(/\D/g, "").slice(0, 10)

	if (!field.validate(field.input.value)) {
		if (field.touched) setError(field, field.errorMsg)
		return false
	} else {
		clearError(field)
		return true
	}
}

/**
 * Validate all fields and update submit button state.
 * @returns {boolean} true if all fields are valid
 */
const validateAll = () => {
	const allValid = fields.every(validateField)
	submitBtn.disabled = !allValid
	return allValid
}

// Attach event listeners to mark fields as touched and validate on input/focus
fields.forEach((field) => {
	field.input.addEventListener("focus", () => {
		field.touched = true
		validateField(field)
	})
	field.input.addEventListener("input", () => {
		validateField(field)
		validateAll()
	})
})

// Form submission handler
form.addEventListener("submit", (e) => {
	if (!validateAll()) {
		e.preventDefault()
		fields.forEach((f) => (f.touched = true)) // Show all errors
		validateAll()
	}
})

// Initial validation for submit button state
validateAll()
