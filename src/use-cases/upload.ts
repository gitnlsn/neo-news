import { createReadStream } from "node:fs";
import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createId } from "@paralleldrive/cuid2";
import type { PrismaClient } from "@prisma/client";
import type formidable from "formidable";
import { env } from "~/env";

interface uploadProps {
  prisma: PrismaClient;
  s3Client: S3Client;

  file: formidable.File;
}

export const upload = async ({ file, prisma, s3Client }: uploadProps) => {
  const fileId = createId();

  const fileStream = createReadStream(file.filepath);

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileId,
      Body: fileStream,
    },
  });

  await upload.done();

  return await prisma.file.create({
    data: {
      id: fileId,
      storageProvider: "r2-cloudflare",
      originalName: file.originalFilename ?? "",
      generatedName: fileId,
      sizeInBytes: file.size,
      mimeType: file.mimetype ?? "",
      url: `${env.CLOUDFLARE_R2_PUBLIC_PATH}/${fileId}`,
    },
  });
};
