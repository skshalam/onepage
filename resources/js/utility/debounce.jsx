export function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        // Clear the previous timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Set a new timeout
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}