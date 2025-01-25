import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import type { R2UploadResponse } from "~/schemas/api/R2UploadResponse";
import { auth } from "~/server/auth";
import { upload } from "~/use-cases/upload";
import { parseFile } from "~/utils/api/parseFile";

export const POST = async (
  req: NextRequest,
  res: NextResponse<R2UploadResponse>,
) => {
  /**
   * Validate that the user is logged in.
   */
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json({
      message:
        "Você precisa estar autenticado para fazer upload de imagens para um evento.",
    });
  }

  /**
   * Validate that the request method is POST.
   */
  if (req.method !== "POST") {
    return Response.json({ message: `Método '${req.method}' não autorizado.` });
  }

  try {
    console.log("Parsing file");

    const formData = await req.formData();

    const body = Object.fromEntries(formData);
    const file = body.image as File;

    const s3Client = new S3Client({
      region: env.CLOUDFLARE_R2_REGION,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
      endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    });

    const prisma = new PrismaClient();

    const image = await upload({
      file,
      prisma,
      s3Client,
    });

    return Response.json(
      { image, message: "Uploaded file with success." },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to upload file." },
      { status: 500 },
    );
  }
};

// Disable body parsing for this route since we are expecting a file with multipart.
export const config = {
  api: {
    bodyParser: false,
  },
};
