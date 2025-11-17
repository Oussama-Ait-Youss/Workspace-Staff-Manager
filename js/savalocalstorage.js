export function savelocalstorage(staff) {
    // 1. Get existing list or empty array
    localStorage.setItem("staff", JSON.stringify(staff));
}