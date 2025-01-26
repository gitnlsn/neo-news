import { zodResolver } from "@hookform/resolvers/zod";
import type { File as UploadedFile } from "@prisma/client";
import type { Editor } from "@tiptap/react";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { uploadImage } from "~/utils/api/upload-image";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RichTextButton } from "./button";

interface RichTextAddImageButtonProps {
  editor: Editor;
  onUploadImage?: (file: UploadedFile) => void;
  onOpen?: (open: boolean) => void;
}

const schema = z.object({
  type: z.enum(["url", "upload"]),
  imageUrl: z.string().url().optional(),
  file: z.instanceof(File).optional(),
});

export const RichTextAddImageButton = ({
  editor,
  onOpen,
  onUploadImage,
}: RichTextAddImageButtonProps) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "url",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { type, imageUrl, file } = data;

    if (type === "url" && imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }

    if (type === "upload" && file) {
      try {
        setLoading(true);
        const uploadedFile = await uploadImage(file);
        onUploadImage?.(uploadedFile);
        editor.chain().focus().setImage({ src: uploadedFile.url }).run();
      } catch (error) {
        toast.error("Erro ao carregar imagem");
        return;
      } finally {
        setLoading(false);
      }
    }

    form.reset();
    setOpen(false);
    onOpen?.(false);
  };

  const uploadedImage = form.watch("file");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpen?.(open);
      }}
    >
      <DialogTrigger asChild className="-mt-[2px]">
        <RichTextButton>Imagem</RichTextButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Carregar imagem</DialogTitle>
          <DialogDescription>
            Escolha uma opção: upload ou URL
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      if (value === "upload") {
                        form.setValue("imageUrl", undefined);
                      }

                      if (value === "url") {
                        form.setValue("file", undefined);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a produtora desse evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"url"}>URL</SelectItem>
                      <SelectItem value={"upload"}>Upload</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") === "url" && (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do evento"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("type") === "upload" && (
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Imagem</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="hover:cursor-pointer"
                        accept="image/*"
                        placeholder="Imagem"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          form.setValue("file", file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("type") === "upload" && uploadedImage && (
              <div className="col-span-3 flex flex-col items-center justify-center">
                <FormItem className="relative mx-auto">
                  <Image
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Event cover"
                    width={500}
                    height={500}
                    className="max-h-[500px] object-contain"
                  />

                  <Button
                    variant="secondary"
                    onClick={() => form.setValue("file", undefined)}
                    className="absolute top-2 left-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </FormItem>
              </div>
            )}

            <Button type="submit" className="col-span-3" isLoading={loading}>
              Enviar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
