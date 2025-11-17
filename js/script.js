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


// show worker info

const staff_list = document.getElementById('staff_list')
staff_list.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const worker_id = Number(e.target.dataset.id)
        const staffInfoModal = document.getElementById('staffInfoModal')
        const modalContent = document.getElementById('modalContent')

        const localStorage_data = localStorage.getItem('staff')
        const data = JSON.parse(localStorage_data)

        data.forEach(staff => {
            if (staff.id === worker_id) {
                staffInfoModal.classList.remove('hidden');
                modalContent.innerHTML = `
                    <div class="flex items-center space-x-3 mb-4">
                        <img src="${staff.photo}" class="w-16 h-16 rounded-full border" />
                        <div>
                            <p class="text-lg font-semibold">${staff.name}</p>
                            <p class="text-sm text-gray-600">${staff.role}</p>
                        </div>
                    </div>

                    <p><strong>Email:</strong> ${staff.email}</p>
                    <p><strong>Téléphone:</strong> ${staff.phone}</p>

                    <h3 class="text-lg font-semibold mt-4 mb-2">Expériences:</h3>
                    ${staff.experiences && staff.experiences.length > 0 ? `
                        <ul class="space-y-2">
                            ${staff.experiences.map(exp => `
                                <li class="p-2 bg-gray-100 rounded">
                                    <strong>${exp.title}</strong> – ${exp.company}<br>
                                    <em>${exp.years}</em><br>
                                    <p>${exp.description}</p>
                                </li>
                            `).join('')}
                        </ul>
                    ` : `<p class="text-gray-500">No experiences added.</p>`}
                `;
            }
        });
    }
});

const info_modal_btn_close = document.getElementById('info_modal_btn_close')
info_modal_btn_close.addEventListener('click',(e)=>{
    e.preventDefault();
    const staffInfoModal = document.getElementById('staffInfoModal')
    staffInfoModal.classList.add('hidden')
    
})














