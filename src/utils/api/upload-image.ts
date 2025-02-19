import type { UploadedFile } from "~/types/UploadedFile";
import { compressImageFile } from "../next-client/compress-image-file";

interface Response {
  image: UploadedFile;
}

export const uploadImage = async (file: File) => {
  const compressedFile = await compressImageFile(file);

  const multipartFormData = new FormData();
  multipartFormData.append("image", compressedFile);

  const response = await fetch("/api/r2/image-upload", {
    method: "POST",
    body: multipartFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const { image } = (await response.json()) as Response;

  return image;
};
