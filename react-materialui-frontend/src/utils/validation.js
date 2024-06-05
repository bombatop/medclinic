// utils/validation.js
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phoneNumber) => {
    const re = /^\+?[0-9]{7,15}$/;
    return re.test(String(phoneNumber));
};

export const validateName = (name) => {
    const re = /^[А-Яа-яЁё\s]+$/;
    return re.test(String(name));
};
