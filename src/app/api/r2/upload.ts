import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";
import type { R2UploadResponse } from "~/schemas/api/R2UploadResponse";
import { upload } from "~/use-cases/upload";
import { parseFile } from "~/utils/router/parseFile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<R2UploadResponse>,
) {
  const file = await parseFile(req);

  const s3Client = new S3Client({
    region: env.CLOUDFLARE_R2_REGION,
    credentials: {
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  });

  const prisma = new PrismaClient();

  try {
    const image = await upload({
      file,
      prisma,
      s3Client,
    });

    return res
      .status(200)
      .json({ imageId: image.id, message: "Uploaded file with success." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload file." });
  }
}

// Disable body parsing for this route since we are expecting a file with multipart.
export const config = {
  api: {
    bodyParser: false,
  },
};
