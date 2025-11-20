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
 * applying custom assignment rules.
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

    // 2. Custom Filtering Logic based on Rules
    const filteredStaff = allStaff.filter(staff => {
        const staffRole = staff.role.toLowerCase();

        // --- Strict, Exclusive Assignments ---

        // RECEPTIONNISTE only goes to Reception
        if (staffRole === 'receptionniste' && targetHall === 'reception') {
            return true;
        }

        // IT TECH only goes to Salle des Serveurs (assuming the hall name for Server Room is "Serveur")
        if (staffRole === 'it tech' && targetHall === 'serveur') {
            return true;
        }

        // Security-Guy only goes to Salle de Sécurité (assuming the hall name is "Security")
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

        // If none of the specific rules are met, the staff member is not eligible for this room.
        return false;
    });

    // 3. Clear previous content
    modalStaffList.innerHTML = '';

    // 4. Update Modal Title
    const modalTitle = addWorkerToHallModal.querySelector('h2');
    modalTitle.textContent = `Personnel assignable à: ${hallName}`;

    // 5. Generate List Content
    if (filteredStaff.length === 0) {
        modalStaffList.innerHTML = `<p class="text-gray-500 p-4 text-center">Aucun personnel éligible trouvé pour ${hallName}.</p>`;
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

            // --- FIX: Add event listener for the selection button ---
            const selectButton = item.querySelector('.select-staff-btn');
            selectButton.addEventListener('click', (e) => {
                const staffId = parseInt(selectButton.dataset.staffId);
                const selectedStaff = getStaffById(staffId); // Retrieve the full staff object

                if (selectedStaff) {
                    // Call the assignment function with the full staff object and the current hall name
                    assignStaffToHall(selectedStaff, hallName);
                } else {
                    console.error('Staff member not found for ID:', staffId);
                }
            });
            // ----------------------------------------------------

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
    // Check if the clicked element or its closest ancestor is one of the room buttons
    const roomButton = e.target.closest('.add_btn');

    if (roomButton) {
        // Find the parent div of the button (div1, div2, etc.)
        const parentDiv = roomButton.parentElement;

        // Find the <p> element within that div to get the room/hall name
        const hallNameElement = parentDiv.querySelector('p');
        const hallcapacity = parentDiv.querySelector('#capacity_nbr')

        if (hallNameElement) {
            const hallName = hallNameElement.textContent.trim();
            // Call the function to open the modal with filtered staff
            openHallStaffModal(hallName);
        }
    }
});

// ----------------------------------------------------------------------
/**
 * Takes a staff object and the target hall name, updates the DOM, 
 * and closes the selection modal.
 */
// A helper function to handle the removal logic
function removeStaffFromHall(staffId, cardElement) {
    // 1. Remove the staff card element from the DOM
    cardElement.remove();

    // 2. OPTIONAL: Update Local Storage / Assignment state here
    // If you are tracking assignments in localStorage, you must update that data here.
    console.log(`Removed staff ID ${staffId}. Remember to update your assignment state in localStorage!`);
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

    // Use insertAdjacentHTML to inject the card and keep a reference to it
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = staffCardHTML.trim();
    const newStaffCard = tempWrapper.firstChild;
    let capacity = 0
    if (targetDiv.querySelector('span').textContent !== 0) {
        if (targetDiv.querySelector('p').textContent !== 'Conference' || targetDiv.querySelector('p').textContent !== 'Personnal') {

            targetDiv.classList.remove('bg-red-600')
        }
    }


    // make the maximum number of persone in room 2.
    if (Number(targetDiv.querySelector('span').textContent) >= 2) {
        alert('you reach the maximum number of worker in the room...')
        return;
    }

    if (addButton) {
        // Insert the card before the button
        addButton.insertAdjacentElement('beforebegin', newStaffCard);
    } else {
        // Fallback: append to the end of the div
        targetDiv.appendChild(newStaffCard);
    }
    capacity = Number(targetDiv.querySelector('span').textContent) + 1
    targetDiv.querySelector('span').textContent = capacity

    // 4. *** FIX: Attach the event listener to the newly created 'Remove' button ***
    const removeButton = newStaffCard.querySelector('.remove-staff-btn');
    removeButton.addEventListener('click', () => {
        // Call the helper function to handle removal from DOM and (if applicable) storage
        removeStaffFromHall(staff.id, newStaffCard);
        capacity = Number(targetDiv.querySelector('span').textContent) - 1
        targetDiv.querySelector('span').textContent = capacity
        if (capacity === 0) {
            // Use AND (&&) to ensure BOTH conditions must be met for the block to run
            if (targetDiv.querySelector('p').textContent !== 'Conference' && targetDiv.querySelector('p').textContent !== 'Personnal') {

                targetDiv.classList.add('bg-red-600');
            }
        }
    });
    // **************************************************************************


    // 5. Hide the modal
    addWorkerToHallModal.classList.add('hidden');

    // Optional: Reset the global variable
    currentTargetHall = null;

    // Note: If you are tracking assignments in localStorage, you must update that state here or in removeStaffFromHall.
}