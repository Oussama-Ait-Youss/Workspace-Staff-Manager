import { validateForm } from './Form-validation.js';
import { Exp_FormData } from './Experience-Form.js';
import { AddWorker } from './AddWorker.js';
import { savelocalstorage } from './savalocalstorage.js';



// Select elements
const btnAdd = document.getElementById("add_staff");   // Button to open modal
const modal = document.getElementById("addStaffModal"); // Modal container
const closeModal = document.getElementById("closeModal"); // Close button
const plan = document.querySelector('.plan');
const staffForm = document.getElementById('staffForm');
const staffList = document.getElementById('staff_list');
const addStaffModal = document.getElementById('addStaffModal');
const Ajouter_Exp = document.getElementById('Ajouter_Exp');







// Open modal
btnAdd.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

// Close modal
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Close when clicking outside the modal content
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});




// add dynamic form experience
document.getElementById('Ajouter_Exp').addEventListener('click', function () {
    Exp_FormData();
});


// validate form and add worker 
staffForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
        console.log('Form validation failed');
        return; // Stop if validation fails
    }
    AddWorker();
});














