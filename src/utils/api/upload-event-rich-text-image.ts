import type { File as FileType } from "@prisma/client";
interface Response {
  uploadedFile: FileType;
}

export const uploadEventRichTextImage = async (image: File) => {
  const multipartFormData = new FormData();
  multipartFormData.append("image", image);

  const response = await fetch("/api/r2/image-upload", {
    method: "POST",
    body: multipartFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const { uploadedFile } = (await response.json()) as Response;

  return uploadedFile;
};
