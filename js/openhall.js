// 1. Define the global variable for the current hall target
let currentTargetHall = null;

// A utility function to retrieve the full staff object by ID (needed for assignment logic)
function getStaffById(id) {
    const allStaff = JSON.parse(localStorage.getItem('staff')) || [];
    return allStaff.find(staff => staff.id === id);
}

// ----------------------------------------------------------------------
/**
 * Opens the staff selection modal and filters staff based on the clicked room/hall name, 
 * applying custom assignment rules AND checking if they are already assigned.
 */
export function openHallStaffModal(hallName) {

    const addWorkerToHallModal = document.getElementById('add_worker_to_hall_modal');
    const modalStaffList = document.getElementById('modalStaffList');

    // Set the global target hall *BEFORE* any processing
    currentTargetHall = hallName;

    // 1. Retrieve staff data
    const allStaff = JSON.parse(localStorage.getItem('staff')) || [];

    // Normalize Hall Name for comparison
    const targetHall = hallName.toLowerCase();

    // ============================================================
    // ✅ NEW FIX: Get list of IDs already inside ANY Hall
    // ============================================================
    // We look for every card currently displayed in a room to ensure we don't clone Alex
    const assignedCards = document.querySelectorAll('.assigned-staff-card');
    // Create an array of IDs (converted to Numbers to match staff.id)
    const assignedStaffIds = Array.from(assignedCards).map(card => Number(card.dataset.staffId));
    // ============================================================

    // 2. Custom Filtering Logic based on Rules + Availability
    const filteredStaff = allStaff.filter(staff => {
        
        // --- CHECK 1: IS ALREADY ASSIGNED? ---
        if (assignedStaffIds.includes(staff.id)) {
            return false; // Don't show them if they are already in a room
        }

        const staffRole = staff.role.toLowerCase();

        // --- CHECK 2: Strict, Exclusive Assignments ---

        // RECEPTIONNISTE only goes to Reception
        if (staffRole === 'receptionniste' && targetHall === 'reception') {
            return true;
        }

        // IT TECH only goes to Salle des Serveurs
        if (staffRole === 'it tech' && targetHall === 'serveur') {
            return true;
        }

        // Security-Guy only goes to Salle de Sécurité
        if (staffRole === 'security-guy' && targetHall === 'security') {
            return true;
        }

        // CONFERENCE staff only goes to Conference
        if (staffRole === 'conference' && targetHall === 'conference') {
            return true;
        }

        // MANAGER: Can be assigned everywhere
        if (staffRole === 'manager') {
            return true;
        }

        // NETTOYAGE: Can be assigned everywhere EXCEPT Salle d'Archives 
        if (staffRole === 'nettoyage' && targetHall !== 'archives') {
            return true;
        }

        // If none of the specific rules are met
        return false;
    });

    // 3. Clear previous content
    modalStaffList.innerHTML = '';

    // 4. Update Modal Title
    const modalTitle = addWorkerToHallModal.querySelector('h2');
    modalTitle.textContent = `Personnel assignable à: ${hallName}`;

    // 5. Generate List Content
    if (filteredStaff.length === 0) {
        modalStaffList.innerHTML = `<p class="text-gray-500 p-4 text-center">Aucun personnel éligible (ou disponible) trouvé pour ${hallName}.</p>`;
    } else {
        const ul = document.createElement('ul');
        ul.classList.add('space-y-2');

        filteredStaff.forEach(staff => {
            const item = document.createElement('li');
            item.dataset.id = staff.id;
            item.classList.add(
                'flex', 'items-center', 'justify-between', 'p-2', 'bg-white', 'rounded',
                'shadow-sm', 'border', 'border-blue-300', 'cursor-pointer'
            );

            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${staff.photo}" class="w-8 h-8 rounded-full object-cover" 
                             alt="${staff.name}" onerror="this.onerror=null; this.src='assets/defualt_pic.png';">
                    <div>
                        <p class="text-md font-medium">${staff.name}</p>
                        <p class="text-sm text-gray-500">${staff.role}</p>
                    </div>
                </div>
                <button class="select-staff-btn bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600" data-staff-id="${staff.id}">Sélectionner</button>
            `;

            // Add event listener for the selection button
            const selectButton = item.querySelector('.select-staff-btn');
            selectButton.addEventListener('click', (e) => {
                const staffId = parseInt(selectButton.dataset.staffId);
                const selectedStaff = getStaffById(staffId); 

                if (selectedStaff) {
                    assignStaffToHall(selectedStaff, hallName);
                } else {
                    console.error('Staff member not found for ID:', staffId);
                }
            });

            ul.appendChild(item);
        });
        modalStaffList.appendChild(ul);
    }

    // 6. Display the modal
    addWorkerToHallModal.classList.remove('hidden');
}

// ----------------------------------------------------------------------

// Get the parent container for the room layout
const hallLayout = document.querySelector('.parent');

// Attach the listener using event delegation to handle clicks on all '+' buttons
hallLayout.addEventListener('click', (e) => {
    const roomButton = e.target.closest('.add_btn');

    if (roomButton) {
        const parentDiv = roomButton.parentElement;
        const hallNameElement = parentDiv.querySelector('p');

        if (hallNameElement) {
            const hallName = hallNameElement.textContent.trim();
            openHallStaffModal(hallName);
        }
    }
});

// ----------------------------------------------------------------------

/**
 * Helper function to handle DOM removal from hall
 */
function removeStaffFromHall(staffId, cardElement) {
    cardElement.remove();
}

/**
 * Takes a staff object and the target hall name, updates the DOM, 
 * and closes the selection modal.
 */
function assignStaffToHall(staff, hallName) {
    const addWorkerToHallModal = document.getElementById('add_worker_to_hall_modal');

    // 1. Find the target room div
    const hallLayoutDivs = document.querySelectorAll('#parent > div');
    let targetDiv = null;

    hallLayoutDivs.forEach(div => {
        const pElement = div.querySelector('p');
        if (pElement && pElement.textContent.trim() === hallName) {
            targetDiv = div;
        }
    });

    if (!targetDiv) {
        console.error(`Could not find the target hall div for: ${hallName}`);
        return;
    }

    // Capacity Check
    if (Number(targetDiv.querySelector('span').textContent) >= 2) {
        alert('You reach the maximum number of worker in the room...');
        return;
    }

    // 2. Create the staff card HTML for the hall view
    const staffCardHTML = `
        <div data-staff-id="${staff.id}" class="assigned-staff-card flex flex-col items-center bg-white p-2 rounded-lg shadow-md border-t-4 border-blue-500 mt-2">
            <img src="${staff.photo}" class="w-10 h-10 rounded-full object-cover" alt="${staff.name}" onerror="this.onerror=null; this.src='assets/defualt_pic.png';">
            <p class="text-sm font-semibold mt-1">${staff.name}</p>
            <p class="text-xs text-gray-500">${staff.role}</p>
            <button class="remove-staff-btn text-red-500 text-xs mt-1 hover:text-red-700">Remove</button>
        </div>
    `;

    // 3. Append the staff card to the target hall div
    const addButton = targetDiv.querySelector('.add_btn');
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = staffCardHTML.trim();
    const newStaffCard = tempWrapper.firstChild;

    // Visual Updates
    if (targetDiv.querySelector('span').textContent !== 0) {
        if (targetDiv.querySelector('p').textContent !== 'Conference' && targetDiv.querySelector('p').textContent !== 'Personnal') {
            targetDiv.classList.remove('bg-red-600');
        }
    }

    if (addButton) {
        addButton.insertAdjacentElement('beforebegin', newStaffCard);
    } else {
        targetDiv.appendChild(newStaffCard);
    }

    // Update Capacity
    let capacity = Number(targetDiv.querySelector('span').textContent) + 1;
    targetDiv.querySelector('span').textContent = capacity;

    // ============================================================
    // REMOVE FROM SIDEBAR
    // ============================================================
    const sidebarItem = document.getElementById(`sidebar-staff-${staff.id}`) 
                     || document.querySelector(`#staff_list [data-id="${staff.id}"]`);

    if (sidebarItem) {
        sidebarItem.remove();
    } else {
        console.warn("Could not find sidebar item to remove.");
    }

    // 4. Attach event listener to the newly created 'Remove' button
    const removeButton = newStaffCard.querySelector('.remove-staff-btn');
    removeButton.addEventListener('click', () => {
        
        removeStaffFromHall(staff.id, newStaffCard);
        
        // Update capacity
        capacity = Number(targetDiv.querySelector('span').textContent) - 1;
        targetDiv.querySelector('span').textContent = capacity;

        if (capacity === 0) {
            if (targetDiv.querySelector('p').textContent !== 'Conference' && targetDiv.querySelector('p').textContent !== 'Personnal') {
                targetDiv.classList.add('bg-red-600');
            }
        }
        
        // Return to sidebar
        restoreStaffToSidebar(staff);
    });

    // 5. Hide the modal
    addWorkerToHallModal.classList.add('hidden');
    currentTargetHall = null;
}

/**
 * Re-creates the staff card and appends it back to the main sidebar list.
 * Re-attaches Edit and Delete listeners correctly.
 */
function restoreStaffToSidebar(staff) {
    const staffList = document.getElementById('staff_list');

    // Create the list item
    const li = document.createElement('li');
    li.id = `sidebar-staff-${staff.id}`;
    li.dataset.id = staff.id;
    li.classList.add('bg-gray-50', 'p-3', 'rounded-lg', 'shadow-sm', 'flex', 'items-center', 'justify-between', 'border', 'border-gray-200');

    li.innerHTML = `
       <div class="flex items-center space-x-3">
            <img src="${staff.photo}" class="w-12 h-12 rounded-full object-cover" alt="${staff.name}" onerror="this.onerror=null; this.src='assets/defualt_pic.png';">
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

    // Re-attach DELETE functionality
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ FIX: Only delete from LocalStorage AFTER confirmation
                let allStaff = JSON.parse(localStorage.getItem('staff')) || [];
                allStaff = allStaff.filter(s => s.id !== staff.id);
                localStorage.setItem('staff', JSON.stringify(allStaff));

                // Remove from DOM
                li.remove();

                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Worker has been deleted.",
                    icon: "success"
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "The worker is safe :)",
                    icon: "error"
                });
            }
        });
    });

    // Re-attach EDIT functionality (placeholder)
    const editBtn = li.querySelector('.edit-btn');
    if(editBtn) {
        editBtn.addEventListener('click', () => {
             // If you have an edit function, call it here.
             console.log('Edit clicked for', staff.name);
        });
    }

    staffList.appendChild(li);
}