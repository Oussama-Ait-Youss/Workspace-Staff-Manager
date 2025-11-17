// import { openStaffModal } from './openStaffModal';
import { savelocalstorage } from './savalocalstorage.js';



let counter = 0;
export function AddWorker() {





    const staffForm = document.getElementById('staffForm');
    const staffList = document.getElementById('staff_list');
    const addStaffModal = document.getElementById('addStaffModal');
    // Get values from form
    const staffName = document.getElementById('staffName').value;
    const staffRole = document.getElementById('staffRole').value;
    const staffEmail = document.getElementById('staffEmail').value
    const staffPhone = document.getElementById('staffPhone').value
    const fileInput = document.getElementById('dropzone-file');
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

        if (title || years) {
            experiences.push({ title, company, description, years });
        }
    });
    // const fileInput = document.getElementById('dropzone-file');
    // const previewImage = document.getElementById('preview-image');
    // const uploadUi = document.getElementById('upload-ui');
    fileInput.addEventListener('change', function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                previewImage.src = e.target.result;   // 
                previewImage.classList.remove('hidden');
                uploadUi.classList.add('hidden');     // Hide upload UI
            };

            reader.readAsDataURL(file);
        }
    });





    // Handle photo - use preview image or default
    let image_src;
    if (previewImage.src) {
        image_src = previewImage.src;
    } else {
        image_src = 'assets/defualt_pic.jpg';
    }
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
        'transi'// 
    );
    li.dataset.id = counter;




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

    let staffList_data = JSON.parse(localStorage.getItem("staff")) || [];

    staffList_data.push(staff);
    savelocalstorage(staffList_data);
    // display the modal of the worker
    // li.addEventListener("click", () => openStaffModal(staff));

    // Reset form and close modal
    staffForm.reset();

    // Reset image preview
    previewImage.classList.add('hidden');
    uploadUi.classList.remove('hidden');
    previewImage.src = '';

    // Close modal
    addStaffModal.classList.add('hidden');

}