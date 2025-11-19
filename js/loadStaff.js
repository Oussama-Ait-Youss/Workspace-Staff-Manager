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
        staffList.appendChild(li);
    });
}