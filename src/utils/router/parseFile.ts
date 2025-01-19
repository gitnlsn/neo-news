import formidable from "formidable";
import type { NextApiRequest } from "next";

export const parseFile = (req: NextApiRequest) => {
  return new Promise<formidable.File>((resolve, reject) => {
    const form = formidable({
      allowEmptyFiles: false,
      maxFieldsSize: 1 * 1024 * 1024, // 3 MBs
      multiples: false,
      keepExtensions: true,
    });

    form.parse(req, (err, _, files) => {
      if (err) {
        return reject(err);
      }

      if (!files.file) {
        return reject(new Error("File not found."));
      }

      const file = files.file;

      if (!file) {
        return reject(new Error("File not found."));
      }

      const fileItem = file[0];

      if (!fileItem) {
        return reject(new Error("File not found."));
      }

      resolve(fileItem);
    });
  });
};
