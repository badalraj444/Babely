export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET); // Replace with your preset

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace with your cloud name
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    return data.secure_url; // This is your image URL
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);




