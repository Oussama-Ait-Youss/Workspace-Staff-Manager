const validationRules = {
    'staffName': {
        // Allows letters, spaces, hyphens, and apostrophes (for complex names), minimum 2 characters
        regex: /^[A-Za-z\s'-]{2,}$/, 
        message: "Nom invalide (min. 2 lettres, pas de chiffres/symboles)"
    },
    'staffPhone': {
        // Matches 10 digits starting with 06 or 07 (Moroccan format)
        regex: /^0[67]\d{8}$/, 
        message: "Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres"
    },
    'staffEmail': {
        // Standard email regex
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Format d'email invalide"
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
    // Check if the field is empty (required check)
    if (!value.trim()) {
        toggleError(field, true, 'Ce champ est obligatoire.');
        return false;
    }
    
    // Check against specific regex rule
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
    
    // Clear previous error
    dropzoneFileError.textContent = '';
    dropzoneFileError.classList.add('hidden');
    
    let isValid = true;

    // Check if file is selected
    if (!fileInput.files || fileInput.files.length === 0) {
        dropzoneFileError.textContent = "Veuillez ajouter votre photo.";
        dropzoneFileError.classList.remove('hidden');
        isValid = false;
    } else {
        const fileName = fileInput.value;
        // Corrected: Profile pictures should be standard image formats. Removed 'pdf'.
        const allowedTypes = ['jpg', 'jpeg', 'png', 'gif']; 
        
        // Get file extension
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        
        // Check file type
        if (!allowedTypes.includes(fileExtension)) {
            dropzoneFileError.textContent = "Seuls les types d'images (jpg, jpeg, png, gif) sont acceptés.";
            dropzoneFileError.classList.remove('hidden');
            isValid = false;
        }
        
        // Optional: Check file size (e.g., max 5MB)
        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file && file.size > maxSize) {
            dropzoneFileError.textContent = "La taille du fichier est trop grande. Maximum: 5MB";
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
    
    // Clear role error (as role is a <select> and always has a value selected)
    toggleError('staffRole', false); 

    // Validate fields. Using && here ensures we don't skip validation, 
    // but we correctly accumulate the overall result in 'isValid'.
    // If isValid is already false, we keep it false.
    isValid = validateField(staffName.id, staffName.value) && isValid;
    isValid = validateField(staffEmail.id, staffEmail.value) && isValid;
    isValid = validateField(staffPhone.id, staffPhone.value) && isValid;

    // Corrected: Crucially, include validateFile result in the main validation result
    isValid = validateFile() && isValid;

    return isValid; // Returns true only if all validations passed
}

export { validateForm, validateField, toggleError, validateFile };