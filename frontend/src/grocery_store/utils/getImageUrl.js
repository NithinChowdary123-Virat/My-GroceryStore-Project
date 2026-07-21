const BACKEND_URL = "https://grocerystore-backend-clif.onrender.com";

export function getImageUrl(image) {
    if (!image) return null;
    if (image.startsWith("http")) return image;  // Cloudinary URL (already complete)
    return BACKEND_URL + image;                   // old local path (fallback)
}