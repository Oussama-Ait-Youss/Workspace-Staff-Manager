const STORAGE_KEY = "staff_data";

// 1. Get all staff
export function getStaffData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// 2. Save all staff
export function saveStaffData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 3. Add a new staff member
export function addStaffToData(newStaff) {
    const staffList = getStaffData();
    staffList.push(newStaff);
    saveStaffData(staffList);
}

// 4. Delete a staff member
export function deleteStaffFromData(id) {
    let staffList = getStaffData();
    // Filter out the ID
    staffList = staffList.filter(s => s.id !== Number(id));
    saveStaffData(staffList);
}

// 5. Find specific staff by ID
export function getStaffById(id) {
    const staffList = getStaffData();
    return staffList.find(s => s.id === Number(id));
}

// 6. Generate a Safe Unique ID (Date.now() is safer than length)
export function generateId() {
    return Date.now(); 
}