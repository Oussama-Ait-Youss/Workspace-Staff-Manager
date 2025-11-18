import { savelocalstorage } from './savalocalstorage.js';

// Initialize the counter based on existing staff length or 0.
// This ensures IDs are somewhat persistent across sessions.
// For robust ID generation, you might find the maximum existing ID, but
// using the length as an offset is a simple way to prevent immediate overlaps.
let counter = JSON.parse(localStorage.getItem("staff"))?.length || 0; 


export function AddWorker() {
    // DOM elements
    const staffForm = document.getElementById('staffForm');
    const staffList = document.getElementById('staff_list');
    const addStaffModal = document.getElementById('addStaffModal');
    
    // Get values from form
    const staffName = document.getElementById('staffName').value;
    const staffRole = document.getElementById('staffRole').value;
    const staffEmail = document.getElementById('staffEmail').value
    const staffPhone = document.getElementById('staffPhone').value
    // fileInput is not needed here as we use the previewImage source
    const previewImage = document.getElementById('preview-image');
    const uploadUi = document.getElementById('upload-ui');


    // Collect experiences
    const expForms = document.querySelectorAll('.exp-form');
    let experiences = [];

    expForms.forEach(exp => {
        const title = exp.querySelector('.exp-title')?.value.trim();
        const company = exp.querySelector('.exp-company')?.value.trim();
        const description = exp.querySelector('.exp-description')?.value.trim();
        const years = exp.querySelector('.exp-year')?.value.trim();

        // Only add experience if title or years is provided
        if (title || years) {
            experiences.push({ title, company, description, years });
        }
    });
    
    // *** REMOVED MISPLACED fileInput.addEventListener('change', ...) ***
    // This event listener logic must live in script.js and run only once.

    // Handle photo - use preview image source (base64 data) or default.
    // Check if the preview image actually holds the file data.
    let image_src = previewImage.src && previewImage.src.includes('data:image') 
        ? previewImage.src 
        : 'assets/defualt_pic.png';

    // Increment counter for the new staff ID
    counter++;
    
    // Create staff object
    const staff = {
        id: counter,
        name: staffName,
        role: staffRole,
        email: staffEmail,
        phone: staffPhone,
        photo: image_src,
        experiences
    };

    // Create new li element
    const li = document.createElement('li');
    li.classList.add(
        'flex', 'items-center', 'justify-between', 'p-3', 'mb-3',
        'bg-gray-100', 'rounded-lg', 'shadow',
        'transi'
    );
    li.dataset.id = counter;


    // Create the HTML for the new staff member list item
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

    // Append li to ul
    staffList.appendChild(li);

    // Update Local Storage
    let staffList_data = JSON.parse(localStorage.getItem("staff")) || [];
    staffList_data.push(staff);
    savelocalstorage(staffList_data);
    
    // Note: The logic to display the modal of the worker (openStaffModal) is commented out/missing.

    // Reset form and close modal
    staffForm.reset();

    // Reset image preview
    previewImage.classList.add('hidden');
    uploadUi.classList.remove('hidden');
    previewImage.src = '';
    
    // Clear all dynamically added experience forms (keep only one blank one, or none)
    document.getElementById('experienceContainer').innerHTML = '';

    // Close modal
    addStaffModal.classList.add('hidden');

}