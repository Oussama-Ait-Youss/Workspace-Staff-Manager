export function AddWorker() {
    const staffForm = document.getElementById('staffForm');
    const staffList = document.getElementById('staff_list');
    const addStaffModal = document.getElementById('addStaffModal');
    // Get values from form
    const staffName = document.getElementById('staffName').value;
    const staffRole = document.getElementById('staffRole').value;
    const fileInput = document.getElementById('dropzone-file');
    const previewImage = document.getElementById('preview-image');
    const uploadUi = document.getElementById('upload-ui');

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

}