import { zodResolver } from "@hookform/resolvers/zod";
import type { Editor } from "@tiptap/react";
import { YoutubeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RichTextButton } from "./button";

interface RichTextAddYoutubeVideoButtonProps {
  editor: Editor;
  onOpen?: (open: boolean) => void;
}

const schema = z.object({
  url: z.string().url(),
});

export const RichTextAddYoutubeVideoButton = ({
  editor,
  onOpen,
}: RichTextAddYoutubeVideoButtonProps) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    editor.commands.setYoutubeVideo({
      src: data.url,
      width: 640,
      height: 480,
    });
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        onOpen?.(open);
      }}
    >
      <DialogTrigger asChild className="-mt-[2px]">
        <RichTextButton>
          <YoutubeIcon />
        </RichTextButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar vídeo do Youtube</DialogTitle>
          <DialogDescription>
            Adicione um vídeo do Youtube para a sua postagem.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="url"
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

            <DialogClose>
              <Button>Adicionar</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
