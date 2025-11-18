import { validateForm } from './Form-validation.js';
import { Exp_FormData } from './Experience-Form.js';
import { AddWorker } from './AddWorker.js';
import {openHallStaffModal} from './openhall.js'
// import { savelocalstorage } from './savalocalstorage.js'; // Not needed if used only in AddWorker

// Select elements
const btnAdd = document.getElementById("add_staff");   
const modal = document.getElementById("addStaffModal"); 
const closeModal = document.getElementById("closeModal"); 
const staffForm = document.getElementById('staffForm');
const staffList = document.getElementById('staff_list');
const Ajouter_Exp = document.getElementById('Ajouter_Exp');
const staffInfoModal = document.getElementById('staffInfoModal');
const infoModalCloseBtn = document.getElementById('info_modal_btn_close');
const addWorkerToHallModal = document.getElementById('add_worker_to_hall_modal');

// Image Upload Elements
const fileInput = document.getElementById('dropzone-file');
const previewImage = document.getElementById('preview-image');
const uploadUi = document.getElementById('upload-ui');

// --- INITIAL SETUP AND UTILITY FUNCTIONS ---

/**
 * Global function to close the staff assignment modal (used by HTML inline click)
 */
function closeStaffModal() {
    addWorkerToHallModal.classList.add('hidden');
}
// Make the function available globally (needed because of the inline onclick in index.html)
window.closeStaffModal = closeStaffModal;


/**
 * Function to load staff data from local storage and render the list.
 */
function loadStaff() {
    const data = JSON.parse(localStorage.getItem('staff')) || [];
    staffList.innerHTML = ''; // Clear existing list

    data.forEach(staff => {
        const li = document.createElement('li');
        li.classList.add(
            'flex', 'items-center', 'justify-between', 'p-3', 'mb-3',
            'bg-gray-100', 'rounded-lg', 'shadow',
            'transi'
        );
        li.dataset.id = staff.id;

        li.innerHTML = `
        <div class="flex items-center space-x-3">
            <img src="${staff.photo}" class="w-12 h-12 rounded-full" alt="${staff.name}">
            <div>
                <h3 class="text-lg font-semibold">${staff.name}</h3>
                <p class="text-sm text-gray-600">${staff.role}</p>
            </div>
        </div>
        <button class="px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit</button>
        `;
        staffList.appendChild(li);
    });
}

// --- EVENT LISTENERS ---

// 1. Load data on page load
window.addEventListener('load', loadStaff);

// 2. Open Add Staff modal
btnAdd.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

// 3. Close Add Staff modal
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Close when clicking outside the Add Staff modal content
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// 4. Close Worker Info modal
infoModalCloseBtn.addEventListener("click", () => {
    staffInfoModal.classList.add("hidden");
});
// Close when clicking outside the Info modal content
staffInfoModal.addEventListener("click", (e) => {
    if (e.target === staffInfoModal) {
        staffInfoModal.classList.add("hidden");
    }
});

// 5. Image Preview Listener (Runs once)
fileInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;   
            previewImage.classList.remove('hidden');
            uploadUi.classList.add('hidden');     
        };
        reader.readAsDataURL(file);
    }
});

// 6. Add dynamic experience form
Ajouter_Exp.addEventListener('click', function () {
    Exp_FormData();
});


// 7. Validate form and add worker 
staffForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
        console.log('Form validation failed');
        return; // Stop if validation fails
    }
    
    // Add the worker and save to local storage
    AddWorker();
    
    // After adding, reload the list to show the new item, 
    // especially if we need updated functionality (like editing)
    loadStaff(); 
});


// 8. Show worker info using Event Delegation on staff_list
staffList.addEventListener('click', (e) => {
    // Traverse up to find the closest LI, which holds the worker ID
    const listItem = e.target.closest('li[data-id]');
    
    // Check if the click was on the list item (not the edit button)
    if (listItem && !e.target.closest('button')) { 
        const worker_id = Number(listItem.dataset.id);
        const modalContent = document.getElementById('modalContent');
        
        const localStorage_data = localStorage.getItem('staff');
        const data = JSON.parse(localStorage_data) || [];

        // Find the specific staff member
        const staff = data.find(s => s.id === worker_id);

        if (staff) {
            staffInfoModal.classList.remove('hidden');
            modalContent.innerHTML = `
                <div class="flex items-center  space-x-3 mb-4">
                    <img src="${staff.photo}" class="w-12 h-12 rounded-full border" alt="${staff.name} photo" />
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
                                <strong>${exp.title || 'N/A'}</strong> – ${exp.company || 'N/A'}<br>
                                <em>${exp.years || 'N/A'}</em><br>
                                <p>${exp.description || ''}</p>
                            </li>
                        `).join('')}
                    </ul>
                ` : `<p class="text-gray-500">Aucune expérience ajoutée.</p>`}
            `;
        }
    }
    // TODO: Add logic here to handle the "Edit" button click.
});


// 9. Open 'Add Staff to Hall' modal
const add_staff_to_hall = document.getElementById('add_staff_to_hall');

add_staff_to_hall.addEventListener('click', () => {
    const modalStaffList = document.getElementById('modalStaffList');
    
    // Get staff data from Local Storage (ensures modal is up-to-date)
    const staffData = JSON.parse(localStorage.getItem('staff')) || [];

    // Clear previous content
    modalStaffList.innerHTML = '';
    
    if (staffData.length === 0) {
        modalStaffList.innerHTML = '<p class="text-gray-500 p-4 text-center">Aucun personnel disponible à sélectionner.</p>';
    } else {
        const ul = document.createElement('ul');
        ul.classList.add('space-y-2');
        
        staffData.forEach(staff => {
            const item = document.createElement('li');
            item.dataset.id = staff.id;
            item.classList.add(
                'flex', 'items-center', 'justify-between', 'p-2', 'bg-gray-50', 'rounded', 
                'hover:bg-blue-50', 'cursor-pointer', 'border', 'border-transparent'
            );

            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${staff.photo}" class="w-8 h-8 rounded-full" alt="${staff.name}">
                    <div>
                        <p class="text-md font-medium">${staff.name}</p>
                        <p class="text-sm text-gray-500">${staff.role}</p>
                    </div>
                </div>
                <div class="selection-indicator w-3 h-3 bg-gray-300 rounded-full ml-2 transition-colors"></div>
            `;
            
            // Add click event to select/deselect staff
            item.addEventListener('click', function () {
                this.classList.toggle('bg-blue-100');
                this.classList.toggle('border-blue-300');
                const indicator = this.querySelector('.selection-indicator');
                indicator.classList.toggle('bg-green-500');
                indicator.classList.toggle('bg-gray-300');
            });
            ul.appendChild(item);
        });
        modalStaffList.appendChild(ul);
    }
    
    addWorkerToHallModal.classList.remove('hidden');
});