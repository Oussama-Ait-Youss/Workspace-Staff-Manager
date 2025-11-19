const staffList = document.getElementById('staff_list');



export function loadStaff() {
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

        // --- MODIFIED: Added Delete Button and button container ---
        li.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${staff.photo}" class="w-12 h-12 rounded-full" alt="${staff.name}">
                <div>
                    <h3 class="text-lg font-semibold">${staff.name}</h3>
                    <p class="text-sm text-gray-600">${staff.role}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button class="edit-btn px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Edit</button>
                <button class="delete-btn px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
            </div>
        `;
        // --------------------------------------------------------

        staffList.appendChild(li);

        // --- NEW: Attach Event Listener to the Delete Button ---
        const deleteButton = li.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            // Use the shared deleteWorker function
            deleteWorker(staff.id, li);
        });
        // --------------------------------------------------------
    });
}
// This function needs to be accessible by both loadStaff and AddWorker.
// Assuming 'savelocalstorage' is globally available or imported in your main script.
function deleteWorker(staffId, listItem) {
    // 1. Remove from DOM
    listItem.remove();

    // 2. Update Local Storage
    let staffList_data = JSON.parse(localStorage.getItem("staff")) || [];
    const updatedList = staffList_data.filter(staff => staff.id !== staffId);

    // Assuming savelocalstorage is available
    localStorage.setItem('staff',JSON.stringify(updatedList))
}