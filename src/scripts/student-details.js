import {
	form,
	submitBtn,
	nameInput,
	idInput,
	emailInput,
	contactInput,
} from "./variables"

/**
 * Student Details Manager - Handles add, edit, delete operations
 */
class StudentDetailsManager {
	constructor() {
		this.students = []
		this.editingIndex = null
		this.STORAGE_KEY = "students_data"
		this.tableBody = document.getElementById("table-body")
		this.init()
	}

	/**
	 * Initialize the manager and set up event listeners
	 */
	init() {
		this.loadFromStorage()
		this.renderTable()
		this.setupEventListeners()
	}

	/**
	 * Set up form and table event listeners
	 */
	setupEventListeners() {
		form.addEventListener("submit", (e) => {
			e.preventDefault()
			this.handleFormSubmit()
		})
	}

	/**
	 * Handle form submission (add or update)
	 */
	handleFormSubmit() {
		const name = nameInput.value.trim()
		const id = idInput.value.trim()
		const email = emailInput.value.trim()
		const contact = contactInput.value.trim()

		// Validate all fields before proceeding
		if (!this.validateForm()) {
			return
		}

		const studentData = {
			name,
			id,
			email,
			contact,
		}

		if (this.editingIndex !== null) {
			// Update existing student
			this.students[this.editingIndex] = studentData
			this.editingIndex = null
			submitBtn.value = "Submit"
			console.log("Updated student:", studentData)
		} else {
			// Add new student
			this.students.push(studentData)
			console.log("Added student:", studentData)
		}

		this.saveToStorage()
		this.renderTable()
		this.resetForm()
	}

	/**
	 * Validate all form fields
	 * @returns {boolean} true if all fields are valid
	 */
	validateForm() {
		const name = nameInput.value.trim()
		const id = idInput.value.trim()
		const email = emailInput.value.trim()
		const contact = contactInput.value.trim()

		let isValid = true

		// Validate name (letters and spaces only)
		if (!/^[a-zA-Z\s]+$/.test(name) || name === "") {
			document.getElementById("err-name").textContent =
				"Please enter your name using letters only."
			nameInput.classList.add("invalid")
			isValid = false
		} else {
			document.getElementById("err-name").textContent = ""
			nameInput.classList.remove("invalid")
		}

		// Validate ID (numbers only)
		if (!/^\d+$/.test(id) || id === "") {
			document.getElementById("err-id").textContent =
				"Please enter your ID using numbers only."
			idInput.classList.add("invalid")
			isValid = false
		} else {
			document.getElementById("err-id").textContent = ""
			idInput.classList.remove("invalid")
		}

		// Validate email
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			document.getElementById("err-email").textContent =
				"Please enter a valid email address."
			emailInput.classList.add("invalid")
			isValid = false
		} else {
			document.getElementById("err-email").textContent = ""
			emailInput.classList.remove("invalid")
		}

		// Validate contact (10 digits)
		if (!/^\d{10}$/.test(contact)) {
			document.getElementById("err-contact").textContent =
				"Please enter your 10-digit contact number."
			contactInput.classList.add("invalid")
			isValid = false
		} else {
			document.getElementById("err-contact").textContent = ""
			contactInput.classList.remove("invalid")
		}

		return isValid
	}

	/**
	 * Edit a student record by index
	 * @param {number} index - Index of student to edit
	 */
	editStudent(index) {
		const student = this.students[index]
		nameInput.value = student.name
		idInput.value = student.id
		emailInput.value = student.email
		contactInput.value = student.contact

		this.editingIndex = index
		submitBtn.value = "Update"
		nameInput.focus()
	}

	/**
	 * Delete a student record by index
	 * @param {number} index - Index of student to delete
	 */
	deleteStudent(index) {
		if (confirm("Are you sure you want to delete this student?")) {
			this.students.splice(index, 1)
			this.saveToStorage()
			this.renderTable()
			console.log("Deleted student at index:", index)

			// Reset form if we were editing the deleted student
			if (this.editingIndex === index) {
				this.resetForm()
			}
		}
	}

	/**
	 * Render the student table with action buttons
	 */
	renderTable() {
		// Clear existing table body
		this.tableBody.innerHTML = ""

		if (this.students.length === 0) {
			const emptyRow = document.createElement("tr")
			emptyRow.innerHTML =
				'<td colspan="5" class="p-4 text-center text-gray-500">No students added yet</td>'
			this.tableBody.appendChild(emptyRow)
			return
		}

		// Add each student as a table row
		this.students.forEach((student, index) => {
			const row = document.createElement("tr")
			row.classList.add("border-b")

			row.innerHTML = `
				<td class="table-item">${this.escapeHtml(student.name)}</td>
				<td class="table-item">${this.escapeHtml(student.id)}</td>
				<td class="table-item">${this.escapeHtml(student.email)}</td>
				<td class="table-item">${this.escapeHtml(student.contact)}</td>
				<td class="table-item">
					<div class="table-buttons">
						<button 
							class="edit-btn btn" 
							data-index="${index}"
							title="Edit"
						>
							<img src="./src/icons/edit.png" alt="Edit" class="size-6 mx-auto">
						</button>
						<button 
							class="delete-btn btn" 
							data-index="${index}"
							title="Delete"
						>
							<img src="./src/icons/delete.png" alt="Delete" class="size-6 mx-auto">
						</button>
					</div>
				</td>
			`

			// Attach event listeners to edit and delete buttons
			row.querySelector(".edit-btn").addEventListener("click", () => {
				this.editStudent(index)
			})

			row.querySelector(".delete-btn").addEventListener("click", () => {
				this.deleteStudent(index)
			})

			this.tableBody.appendChild(row)
		})
	}

	/**
	 * Reset the form to initial state
	 */
	resetForm() {
		form.reset()
		this.editingIndex = null
		submitBtn.value = "Submit"
		nameInput.focus()

		// Clear all error messages
		document.getElementById("err-name").textContent = ""
		document.getElementById("err-id").textContent = ""
		document.getElementById("err-email").textContent = ""
		document.getElementById("err-contact").textContent = ""

		// Remove invalid styling
		nameInput.classList.remove("invalid")
		idInput.classList.remove("invalid")
		emailInput.classList.remove("invalid")
		contactInput.classList.remove("invalid")
	}

	/**
	 * Save students to localStorage
	 */
	saveToStorage() {
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.students))
		} catch (e) {
			console.error("Failed to save students to localStorage", e)
		}
	}

	/**
	 * Load students from localStorage
	 */
	loadFromStorage() {
		try {
			const raw = localStorage.getItem(this.STORAGE_KEY)
			if (!raw) {
				this.students = []
				return
			}
			const arr = JSON.parse(raw)
			if (Array.isArray(arr)) {
				this.students = arr
			} else {
				this.students = []
			}
		} catch (e) {
			console.error("Failed to load students from localStorage", e)
			this.students = []
		}
	}

	/**
	 * Escape HTML special characters to prevent XSS
	 * @param {string} text - Text to escape
	 * @returns {string} Escaped text
	 */
	escapeHtml(text) {
		const div = document.createElement("div")
		div.textContent = text
		return div.innerHTML
	}
}

// Initialize the Student Details Manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	window.studentManager = new StudentDetailsManager()
})

export { StudentDetailsManager }
