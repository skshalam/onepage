export function decodeBase64(base64String) {
    try {
        // Decode the Base64 string
        let decodedString = atob(base64String);
        return decodedString;
    } catch (e) {
        console.error("Invalid Base64 string", e);
        return null;
    }
}