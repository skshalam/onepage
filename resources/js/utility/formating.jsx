// Function to mask phone number
export function maskPhoneNumber(phoneNumber) {
    const fourDigitRegex = /\d{4}(?=\d{5}$)/;
    if (fourDigitRegex.test(phoneNumber)) {
        return phoneNumber.replace(fourDigitRegex, '****');
    } else {
        return phoneNumber;
    }
}
// Function to format number
export function formatNumberWithCommas(number) {
    const numberString = number.toString();
    const parts = numberString.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedInteger + (decimalPart ? '.' + decimalPart : '');
}