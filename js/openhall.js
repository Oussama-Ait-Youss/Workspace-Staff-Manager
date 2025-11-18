/**
 * Opens the staff selection modal and filters staff based on the clicked room/hall name, 
 * applying custom assignment rules.
 */
export function openHallStaffModal(hallName) {
    const addWorkerToHallModal = document.getElementById('add_worker_to_hall_modal');
    const modalStaffList = document.getElementById('modalStaffList');
    
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

        // CONFERENCE staff only goes to Conference (assuming the hall name is "Conference")
        if (staffRole === 'conference' && targetHall === 'conference') {
            return true;
        }

        // --- Flexible Assignments ---

        // MANAGER: Can be assigned everywhere
        if (staffRole === 'manager') {
            return true;
        }

        // NETTOYAGE: Can be assigned everywhere EXCEPT Salle d'Archives 
        // (Assuming the archive hall name is "Archives" or "Archives" is mapped to "Personnal" or "Salle d'Archives")
        // Based on your HTML: Salle 5 is 'Archives'.
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
    modalTitle.textContent = `Personnel assignable à: ${hallName}`; // Changed title to reflect eligibility
    
    // 5. Generate List Content (same structure as before)
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
                'shadow-sm', 'border', 'border-blue-300', 'cursor-pointer' // Added cursor for selection
            );

            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${staff.photo}" class="w-8 h-8 rounded-full object-cover" 
                         alt="${staff.name}" onerror="this.onerror=null; this.src='assets/defualt_pic.jpg';">
                    <div>
                        <p class="text-md font-medium">${staff.name}</p>
                        <p class="text-sm text-gray-500">${staff.role}</p>
                    </div>
                </div>
                <button class="select-staff-btn bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600">Sélectionner</button>
            `;
            
            ul.appendChild(item);
        });
        modalStaffList.appendChild(ul);
    }
    
    // 6. Display the modal
    addWorkerToHallModal.classList.remove('hidden');
}

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
        
        if (hallNameElement) {
            const hallName = hallNameElement.textContent.trim();
            // Call the function to open the modal with filtered staff
            openHallStaffModal(hallName);
        }
    }
});