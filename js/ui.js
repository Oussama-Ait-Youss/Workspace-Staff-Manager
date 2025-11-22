// 1. Sidebar Card Template
export function createSidebarCard(staff) {
    const li = document.createElement('li');
    li.id = `sidebar-staff-${staff.id}`; // Unique DOM ID
    li.dataset.id = staff.id;
    li.classList.add(
        'flex', 'items-center', 'justify-between', 'p-3', 'mb-3',
        'bg-gray-100', 'rounded-lg', 'shadow', 'border', 'border-gray-200'
    );

    li.innerHTML = `
        <div class="flex items-center space-x-3 pointer-events-none">
            <img src="${staff.photo}" class="w-12 h-12 rounded-full object-cover" 
                 alt="${staff.name}" onerror="this.src='assets/default_pic.png'">
            <div>
                <h3 class="text-lg font-semibold">${staff.name}</h3>
                <p class="text-sm text-gray-600">${staff.role}</p>
            </div>
        </div>
        <div class="flex space-x-2">
            <button class="delete-btn px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Delete
            </button>
        </div>
    `;
    return li;
}

// 2. Room (Hall) Card Template
export function createRoomCard(staff) {
    const div = document.createElement('div');
    div.className = "assigned-staff-card flex flex-col items-center bg-white p-2 rounded-lg shadow-md border-t-4 border-blue-500 mt-2 w-full";
    div.dataset.staffId = staff.id;
    
    div.innerHTML = `
        <img src="${staff.photo}" class="w-10 h-10 rounded-full object-cover" 
             alt="${staff.name}" onerror="this.src='assets/default_pic.png'">
        <p class="text-sm font-semibold mt-1 text-center">${staff.name}</p>
        <p class="text-xs text-gray-500">${staff.role}</p>
        <button class="remove-staff-btn text-red-500 text-xs mt-1 hover:text-red-700 font-bold">
            &times; Remove
        </button>
    `;
    return div;
}

// 3. Info Modal HTML
export function createInfoModalContent(staff) {
    return `
        <div class="flex items-center space-x-3 mb-4">
            <img src="${staff.photo}" class="w-16 h-16 rounded-full border object-cover" onerror="this.src='assets/default_pic.png'"/>
            <div>
                <p class="text-xl font-bold text-gray-800">${staff.name}</p>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${staff.role}</span>
            </div>
        </div>
        <div class="space-y-2">
            <p><strong>📧 Email:</strong> ${staff.email}</p>
            <p><strong>📱 Téléphone:</strong> ${staff.phone}</p>
        </div>
        <h3 class="text-lg font-semibold mt-6 mb-2 border-b pb-1">Expériences</h3>
        ${staff.experiences && staff.experiences.length > 0 ? `
            <ul class="space-y-2 max-h-40 overflow-y-auto">
                ${staff.experiences.map(exp => `
                    <li class="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                        <div class="flex justify-between">
                            <strong class="text-gray-800">${exp.title}</strong>
                            <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">${exp.years}</span>
                        </div>
                        <div class="text-sm text-gray-600">${exp.company}</div>
                        <p class="text-xs text-gray-500 mt-1 italic">${exp.description}</p>
                    </li>
                `).join('')}
            </ul>
        ` : `<p class="text-gray-400 italic">Aucune expérience enregistrée.</p>`}
    `;
}