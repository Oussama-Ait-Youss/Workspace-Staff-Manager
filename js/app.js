import { validateForm } from './Form-validation.js';
import { Exp_FormData } from './Experience-Form.js';
import { AddWorker } from './AddWorker.js';
import { openHallStaffModal } from './openhall.js'
import { savelocalstorage } from './savalocalstorage.js';
import { loadStaff } from './loadStaff.js';


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
const closeFooterBtn = document.getElementById('info_modal_btn_close_footer');

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


// --- EVENT LISTENERS ---

// 1. Load data on page load
window.addEventListener('load', loadStaff());

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

// 6. addeventlistener  when you Add dynamic experience form
Ajouter_Exp.addEventListener('click', function () {
    Exp_FormData();
});


// 7. addeventlistener when you Validate form and add worker 
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


// 8. addevent listener when you click to Show worker info using staff_list
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
    function closeModal() {
        staffInfoModal.classList.add('hidden');
    }

    // Attach event listeners to the close buttons
    closeFooterBtn.addEventListener('click', closeModal);
});



// 9. Open 'Add Staff to Hall' modal
const add_staff_to_hall = document.getElementById('add_staff_to_hall');

add_staff_to_hall.addEventListener('click', (e) => {
    e.preventDefault();
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
            // item.classList.add(
            //     'flex', 'items-center', 'justify-between', 'p-2', 'bg-gray-50', 'rounded',
            //     'hover:bg-blue-50', 'cursor-pointer', 'border', 'border-transparent'
            // );

            item.innerHTML = `
                    <img src="${staff.photo}" class="w-8 h-8 rounded-full" alt="${staff.name}">
                    <div>
                        <p class="text-md font-medium">${staff.name}</p>
                        <p class="text-sm text-gray-500">${staff.role}</p>
                    </div>
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


// addeventlistener to view button 
//###########################################
// 1. Get references to the elements
const viewModalButton = document.getElementById('view_modal');
const sallesModal = document.getElementById('modal_of_salles_in_mobile');
const sallesContentContainer = document.getElementById('salles_content_container');
const closeSallesModalButton = document.getElementById('close_salles_modal');
const parent = document.getElementById('parent');



// i remove the part of display salle when you click view button
// const shallowClone = parent.cloneNode(true);




// // 2. Define the HTML content to be injected (The hall/room grid)
// // Note: We MUST remove the 'hidden md:grid' classes from the parent div 
// // so it is visible inside the mobile modal.
// const sallesHTML = `
//     <div class="parent w-full h-full grid grid-cols-2 gap-3 p-2 bg-gray-100">
        
//         <div class="div1 flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-md">
//             <p class="text-lg font-semibold text-center text-blue-800">Conference</p>
//             <button id="add_staff_to_hall"
//                 class="add_btn bg-blue-600 text-white py-1 m-1 rounded-lg shadow hover:bg-blue-700 w-1/2 mt-2">+</button>
//         </div>

//         <div class="div2 flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-md">
//             <p class="text-lg font-semibold text-center">Security</p>
//             <button
//                 class="add_btn bg-blue-600 text-white py-1 m-1 rounded-lg shadow hover:bg-blue-700 w-1/2 mt-2">+</button>
//         </div>

//         <div class="div3 flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-md">
//             <p class="text-lg font-semibold text-center">Serveur</p>
//             <button
//                 class="add_btn bg-blue-600 text-white py-1 m-1 rounded-lg shadow hover:bg-blue-700 w-1/2 mt-2">+</button>
//         </div>

//         <div class="div4 flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-md">
//             <p class="text-lg font-semibold text-center">Personnal</p>
//             <button
//                 class="add_btn bg-blue-600 text-white py-1 m-1 rounded-lg shadow hover:bg-blue-700 w-1/2 mt-2">+</button>
//         </div>

//         <div class="div5 flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-md">
//             <p class="text-lg font-semibold text-center">Archives</p>
//             <button
//                 class="add_btn bg-blue-600 text-white py-1 m-1 rounded-lg shadow hover:bg-blue-700 w-1/2 mt-2">+</button>
//         </div>

//         <div class="div6 flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-md">
//             <p class="text-lg font-semibold text-center">Reception</p>
//             <button
//                 class="add_btn bg-blue-600 text-white py-1 m-1 rounded-lg shadow hover:bg-blue-700 w-1/2 mt-2">+</button>
//         </div>
        
//         <div class="div7 bg-white rounded-lg shadow-inner"></div>
//         <div class="div8 bg-white rounded-lg shadow-inner"></div>
//     </div>
// `;


// // 3. Click event listener to open the modal
// viewModalButton.addEventListener('click', (e) => {
//     // Inject the HTML content
//     e.preventDefault();

//     console.log("button is clicked")
//     sallesContentContainer.innerHTML = sallesHTML;
//     sallesModal.classList.remove('hidden');

//     // Display the modal
    
// });

// 4. Click event listener to close the modal
closeSallesModalButton.addEventListener('click', () => {
    sallesModal.classList.add('hidden');
});