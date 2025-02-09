import imageCompression from "browser-image-compression";

export async function compressImageFile(imageFile: File) {
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    return compressedFile;
  } catch (error) {
    console.log(error);
    return imageFile;
  }
}
