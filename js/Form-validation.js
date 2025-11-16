const validationRules = {
    'staffName': {
        regex: /^[A-Za-z\s]{2,}$/, // Fixed: allows letters and spaces, minimum 2 chars
        message: "Invalid name (minimum 2 letters)"
    },
    'staffPhone': {
        regex: /^0[67]\d{8}$/, // Fixed: matches 06/07 followed by 8 digits
        message: "Phone number must be 10 digits starting with 06 or 07"
    },
    'staffEmail': {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email format"
    }
};

function toggleError(field, show, message = '') {
    const errorField = document.getElementById(field + '-error');
    const inputField = document.getElementById(field);

    if (show) {
        errorField.classList.remove('hidden');
        errorField.textContent = message;
        if (inputField) {
            inputField.classList.add('border-red-500'); // Visual feedback
        }
    } else {
        errorField.classList.add('hidden');
        errorField.textContent = '';
        if (inputField) {
            inputField.classList.remove('border-red-500');
        }
    }
}

function validateField(field, value) {
    if (validationRules[field] && !validationRules[field].regex.test(value)) {
        toggleError(field, true, validationRules[field].message);
        return false;
    } else {
        toggleError(field, false);
        return true;
    }
}

function validateFile() {
    const fileInput = document.getElementById('dropzone-file');
    const dropzoneFileError = document.getElementById('dropzone-file-error-zone');
    const fileName = fileInput.value;
    
    // Clear previous error
    dropzoneFileError.textContent = '';
    dropzoneFileError.classList.add('hidden');
    
    let isValid = true;

    // Check if file is selected
    if (!fileInput.files || fileInput.files.length === 0) {
        dropzoneFileError.textContent = "Please add your photo";
        dropzoneFileError.classList.remove('hidden');
        isValid = false;
    } else {
        // Get file extension
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        const allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'];
        
        // Check file type
        if (!allowedTypes.includes(fileExtension)) {
            dropzoneFileError.textContent = "Only types are accepted: jpg, jpeg, png, pdf";
            dropzoneFileError.classList.remove('hidden');
            isValid = false;
        }
        
        // Optional: Check file size (e.g., max 5MB)
        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file && file.size > maxSize) {
            dropzoneFileError.textContent = "File size too large. Maximum size is 5MB";
            dropzoneFileError.classList.remove('hidden');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateForm() {
    let isValid = true;

    const staffName = document.getElementById('staffName');
    const staffEmail = document.getElementById('staffEmail');
    const staffPhone = document.getElementById('staffPhone');

    // Validate each field
    if (!validateField(staffName.id, staffName.value)) {
        isValid = false;
    }

    if (!validateField(staffEmail.id, staffEmail.value)) {
        isValid = false;
    }

    if (!validateField(staffPhone.id, staffPhone.value)) {
        isValid = false;
    }

    // Validate file
    if (!validateFile()) {
    }

    return isValid; // Return true only if all validations pass
}

export { validateForm, validateField, toggleError, validateFile };