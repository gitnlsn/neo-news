import type { File } from "@prisma/client";

export interface R2UploadResponse {
  message: string;
  image?: File;
}
