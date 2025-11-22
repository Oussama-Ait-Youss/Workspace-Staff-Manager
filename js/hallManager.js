import { getStaffById } from './data.js';
import { createRoomCard, createSidebarCard } from './ui.js';
import { renderSidebar } from './app.js'; // Circular dependency handled by passing function or simple re-render

// --- Capacity Helpers ---
function updateRoomCapacity(roomDiv, change) {
    const span = roomDiv.querySelector('span');
    let current = Number(span.textContent);
    let max = 2; // Hardcoded limit
    let newCount = current + change;

    // Clamp 
    if (newCount < 0) newCount = 0;
    span.textContent = newCount;

    // Visual Feedback (Red if full)
    const roomName = roomDiv.querySelector('p').textContent.trim();
    // Optional: Don't turn certain rooms red if you don't want to
    if (newCount >= max) {
        roomDiv.classList.add('bg-red-100', 'border-red-500'); 
    } else {
        roomDiv.classList.remove('bg-red-100', 'border-red-500');
    }
}

// --- Main Logic: Assign Staff ---
export function assignStaffToRoom(staffId, roomName) {
    const staff = getStaffById(staffId);
    
    // 1. Find the Room DOM Element
    const allRooms = document.querySelectorAll('#parent > div');
    let targetRoom = null;
    
    allRooms.forEach(div => {
        const title = div.querySelector('p');
        if (title && title.textContent.trim() === roomName) targetRoom = div;
    });

    if (!targetRoom) return;

    // 2. Check Capacity
    const currentCap = Number(targetRoom.querySelector('span').textContent);
    if (currentCap >= 2) {
        Swal.fire("Room Full", "Cette salle a atteint sa capacité maximale.", "error");
        return;
    }

    // 3. Create Visual Card
    const roomCard = createRoomCard(staff);
    
    // 4. Add to Room (Before the button)
    const addBtn = targetRoom.querySelector('.add_btn');
    targetRoom.insertBefore(roomCard, addBtn);

    // 5. Update Capacity
    updateRoomCapacity(targetRoom, 1);

    // 6. Remove from Sidebar (Visual Only)
    const sidebarItem = document.getElementById(`sidebar-staff-${staffId}`);
    if (sidebarItem) sidebarItem.remove();

    // 7. Add "Remove" Listener specific to this card
    roomCard.querySelector('.remove-staff-btn').addEventListener('click', () => {
        removeStaffFromRoom(staff, roomCard, targetRoom);
    });
}

// --- Main Logic: Remove Staff ---
function removeStaffFromRoom(staff, cardElement, roomElement) {
    // 1. Remove Card
    cardElement.remove();
    
    // 2. Update Capacity
    updateRoomCapacity(roomElement, -1);

    // 3. Put back in Sidebar
    const staffList = document.getElementById('staff_list');
    // We re-import renderSidebar logic or manually append
    // Ideally, trigger an event, but manual append is fine here:
    // We need to re-attach the delete listener, so referencing app.js is tricky.
    // **Simplification:** Just trigger a custom event that app.js listens to.
    document.dispatchEvent(new CustomEvent('restoreStaff', { detail: staff }));
}

// --- Filter Logic (Who can go where?) ---
export function getEligibleStaff(hallName) {
    // Get all currently assigned IDs to prevent cloning
    const assignedIds = Array.from(document.querySelectorAll('.assigned-staff-card'))
                             .map(el => Number(el.dataset.staffId));

    const allStaff = JSON.parse(localStorage.getItem('staff_data')) || []; // Use Key from data.js
    const targetHall = hallName.toLowerCase();

    return allStaff.filter(staff => {
        if (assignedIds.includes(staff.id)) return false; // Already busy

        const role = staff.role.toLowerCase();
        
        // Rules
        if (role === 'manager') return true;
        if (role === 'receptionniste' && targetHall === 'reception') return true;
        if (role === 'it tech' && targetHall === 'serveur') return true;
        if (role === 'security-guy' && targetHall === 'security') return true;
        if (role === 'conference' && targetHall === 'conference') return true;
        // Nettoyage everywhere EXCEPT Archives
        if (role === 'nettoyage' && targetHall !== 'archives') return true;

        return false;
    });
}