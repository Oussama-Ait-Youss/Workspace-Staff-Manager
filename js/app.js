import * as Data from './data.js';
import * as UI from './ui.js';
import * as HallManager from './hallManager.js';
import { validateForm, validateFile } from './Form-validation.js';
import { Exp_FormData } from './Experience-Form.js';

// DOM Elements
const els = {
    staffList: document.getElementById('staff_list'),
    btnAdd: document.getElementById('add_staff'),
    addModal: document.getElementById('addStaffModal'),
    closeModal: document.getElementById('closeModal'),
    form: document.getElementById('staffForm'),
    fileInput: document.getElementById('dropzone-file'),
    previewImg: document.getElementById('preview-image'),
    uploadUi: document.getElementById('upload-ui'),
    addExpBtn: document.getElementById('Ajouter_Exp'),
    
    // Hall Modal Elements
    hallModal: document.getElementById('add_worker_to_hall_modal'),
    hallStaffList: document.getElementById('modalStaffList'),
    
    // Info Modal
    infoModal: document.getElementById('staffInfoModal'),
    infoContent: document.getElementById('modalContent'),
    closeInfoBtn: document.getElementById('info_modal_btn_close'),
    closeInfoFooter: document.getElementById('info_modal_btn_close_footer')
};

// --- 1. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
});

// Function to render the entire sidebar list
export function renderSidebar() {
    const staffData = Data.getStaffData();
    const assignedIds = Array.from(document.querySelectorAll('.assigned-staff-card'))
                             .map(el => Number(el.dataset.staffId));

    els.staffList.innerHTML = '';

    staffData.forEach(staff => {
        // Only render if NOT currently in a room
        if (!assignedIds.includes(staff.id)) {
            const card = UI.createSidebarCard(staff);
            els.staffList.appendChild(card);

            // Attach Delete Listener
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Stop modal from opening
                handleDelete(staff.id);
            });
        }
    });
}

// Listen for "Restoration" from HallManager
document.addEventListener('restoreStaff', () => {
    renderSidebar();
});


// --- 2. Form Handling (Add Staff) ---
els.btnAdd.addEventListener('click', () => els.addModal.classList.remove('hidden'));
els.closeModal.addEventListener('click', () => els.addModal.classList.add('hidden'));
els.addExpBtn.addEventListener('click', Exp_FormData);

els.fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            els.previewImg.src = e.target.result;
            els.previewImg.classList.remove('hidden');
            els.uploadUi.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Collect Experiences
    const experiences = [];
    document.querySelectorAll('.exp-form').forEach(exp => {
        experiences.push({
            title: exp.querySelector('.exp-title').value,
            company: exp.querySelector('.exp-company').value,
            years: exp.querySelector('.exp-year').value,
            description: exp.querySelector('.exp-description').value
        });
    });

    const newStaff = {
        id: Data.generateId(),
        name: document.getElementById('staffName').value,
        role: document.getElementById('staffRole').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
        photo: els.previewImg.src.includes('data:image') ? els.previewImg.src : 'assets/defualt_pic.png',
        experiences: experiences
    };

    Data.addStaffToData(newStaff);
    renderSidebar();
    
    // Reset & Close
    els.form.reset();
    els.previewImg.src = '';
    els.previewImg.classList.add('hidden');
    els.uploadUi.classList.remove('hidden');
    document.getElementById('experienceContainer').innerHTML = '';
    els.addModal.classList.add('hidden');
    
    Swal.fire("Success", "Employé ajouté avec succès", "success");
});


// --- 3. Delete Logic ---
function handleDelete(id) {
    Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Cette action est irréversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer!"
    }).then((result) => {
        if (result.isConfirmed) {
            Data.deleteStaffFromData(id);
            renderSidebar();
            Swal.fire("Supprimé!", "L'employé a été supprimé.", "success");
        }
    });
}


// --- 4. Info Modal Logic ---
els.staffList.addEventListener('click', (e) => {
    const card = e.target.closest('li');
    if (card && !e.target.classList.contains('delete-btn')) {
        const staff = Data.getStaffById(card.dataset.id);
        if (staff) {
            els.infoContent.innerHTML = UI.createInfoModalContent(staff);
            els.infoModal.classList.remove('hidden');
        }
    }
});

const closeInfo = () => els.infoModal.classList.add('hidden');
els.closeInfoBtn.addEventListener('click', closeInfo);
els.closeInfoFooter.addEventListener('click', closeInfo);


// --- 5. Room Assignment Logic ---
// Global Close for HTML inline calls (if any remain)
window.closeStaffModal = () => els.hallModal.classList.add('hidden');

// Delegate click on Room "+" buttons
document.querySelector('#parent').addEventListener('click', (e) => {
    if (e.target.classList.contains('add_btn')) {
        const roomName = e.target.parentElement.querySelector('p').textContent.trim();
        openAssignmentModal(roomName);
    }
});

function openAssignmentModal(roomName) {
    const staffAvailable = HallManager.getEligibleStaff(roomName);
    
    els.hallStaffList.innerHTML = '';
    document.querySelector('#add_worker_to_hall_modal h2').textContent = `Ajouter à: ${roomName}`;

    if (staffAvailable.length === 0) {
        els.hallStaffList.innerHTML = `<p class="text-center p-4 text-gray-500">Personne n'est disponible pour ce poste.</p>`;
    } else {
        const ul = document.createElement('ul');
        ul.className = "space-y-2";
        
        staffAvailable.forEach(staff => {
            const li = document.createElement('li');
            li.className = "flex justify-between items-center p-2 bg-gray-50 rounded border hover:bg-blue-50 cursor-pointer";
            li.innerHTML = `
                <div class="flex items-center gap-2">
                    <img src="${staff.photo}" class="w-8 h-8 rounded-full">
                    <span>${staff.name} <small class="text-gray-500">(${staff.role})</small></span>
                </div>
                <button class="bg-green-500 text-white px-2 py-1 rounded text-xs">Choisir</button>
            `;
            
            li.addEventListener('click', () => {
                HallManager.assignStaffToRoom(staff.id, roomName);
                els.hallModal.classList.add('hidden');
            });
            
            ul.appendChild(li);
        });
        els.hallStaffList.appendChild(ul);
    }
    
    els.hallModal.classList.remove('hidden');
}