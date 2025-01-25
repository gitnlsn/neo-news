import { createReadStream } from "node:fs";
import type { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createId } from "@paralleldrive/cuid2";
import type { PrismaClient } from "@prisma/client";
import { env } from "~/env";

interface uploadProps {
  prisma: PrismaClient;
  s3Client: S3Client;

  file: File;
}

export const upload = async ({ file, prisma, s3Client }: uploadProps) => {
  console.log("Uploading image");

  const fileId = createId();

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileId,
      Body: fileBuffer,
    },
  });

  await upload.done();

  return await prisma.file.create({
    data: {
      id: fileId,
      storageProvider: "r2-cloudflare",
      originalName: file.name,
      generatedName: fileId,
      sizeInBytes: file.size,
      mimeType: file.type,
      url: `${env.CLOUDFLARE_R2_PUBLIC_PATH}/${fileId}`,
    },
  });
};
