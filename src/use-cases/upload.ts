import { createReadStream } from "node:fs";
import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { PrismaClient } from "@prisma/client";
import type formidable from "formidable";
import { v4 } from "uuid";
import { env } from "~/env";

interface uploadProps {
  prisma: PrismaClient;
  s3Client: S3Client;

  file: formidable.File;
}

export const upload = async ({ file, prisma, s3Client }: uploadProps) => {
  const fileId = v4();

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

  return await prisma.image.create({
    data: { id: fileId },
  });
};
