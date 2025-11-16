import { validateForm } from './Form-validation.js';




// Select elements
const btnAdd = document.getElementById("add_staff");   // Button to open modal
const modal = document.getElementById("addStaffModal"); // Modal container
const closeModal = document.getElementById("closeModal"); // Close button
const plan = document.querySelector('.plan');

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

const Ajouter_Exp = document.getElementById('Ajouter_Exp');




const fileInput = document.getElementById('dropzone-file');
const previewImage = document.getElementById('preview-image');
const uploadUi = document.getElementById('upload-ui');

fileInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;   // Show image
            previewImage.classList.remove('hidden');
            uploadUi.classList.add('hidden');     // Hide upload UI
        };

        reader.readAsDataURL(file);
    }
});



document.getElementById('Ajouter_Exp').addEventListener('click', function () {
    const container = document.getElementById('experienceContainer');

    // Create a new experience input group
    const expDiv = document.createElement('div');
    expDiv.classList.add('flex', 'flex-col', 'space-y-2', 'p-3', 'rounded-lg', 'bg-gray-200');

    expDiv.innerHTML = `
        <input type="text" name="experience_title[]" placeholder="Titre du poste"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="experience_company[]" placeholder="Entreprise"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="experience_duration[]" placeholder="Durée (Ex: 2020-2022)"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <textarea name="experience_description[]" placeholder="Description"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <button type="button" class="remove-exp  py-1 bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
    `;

    container.appendChild(expDiv);

    // Add event listener to remove button
    expDiv.querySelector('.remove-exp').addEventListener('click', function () {
        container.removeChild(expDiv);
    });
});
// #############################
const staffForm = document.getElementById('staffForm');
const staffList = document.getElementById('staff_list');
const addStaffModal = document.getElementById('addStaffModal');

staffForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
        console.log('Form validation failed');
        return; // Stop if validation fails
    }

    // Get values from form
    const staffName = document.getElementById('staffName').value;
    const staffRole = document.getElementById('staffRole').value;

    // Handle photo - use preview image or default
    let image_src;
    if (previewImage.src && previewImage.src !== window.location.href) {
        image_src = previewImage.src;
    } else {
        image_src = 'assets/defualt_pic.jpg'; // Note: typo in "default"
    }

    // Create staff object
    const staff = {
        name: staffName,
        role: staffRole,
        photo: image_src
    };

    // Create new li element
    const li = document.createElement('li');
    li.classList.add('flex', 'items-center', 'justify-between', 'p-3', 'mb-3', 'bg-gray-100', 'rounded-lg', 'shadow');

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

    // Reset form and close modal
    staffForm.reset();

    // Reset image preview
    previewImage.classList.add('hidden');
    uploadUi.classList.remove('hidden');
    previewImage.src = '';

    // Close modal
    addStaffModal.classList.add('hidden');

    console.log('Staff added successfully:', staff);
});














