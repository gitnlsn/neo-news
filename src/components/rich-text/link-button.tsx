import { zodResolver } from "@hookform/resolvers/zod";
import type { Editor } from "@tiptap/react";
import { LinkIcon, UnlinkIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { RichTextButton } from "./button";

interface RichTextLinkButtonProps {
  editor: Editor;
}

const schema = z.object({
  url: z.string().url({ message: "URL inválida" }),
  classButton: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export const RichTextLinkButton = ({ editor }: RichTextLinkButtonProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      classButton: false,
    },
  });

  const notAllowedUrlsQuery = api.webRisk.getNotAllowedUrls.useQuery();
  const checkUrlMutation = api.webRisk.checkUrl.useMutation();

  const setLink = async (data: FormData) => {
    if (notAllowedUrlsQuery.data?.includes(data.url)) {
      form.setError("url", { message: "URL não permitida" });
      return;
    }

    const webRiskAnalysis = await checkUrlMutation.mutateAsync({
      uri: data.url,
    });

    if (!webRiskAnalysis.isSafe) {
      form.setError("url", { message: "URL não permitida" });
      return;
    }

    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: data.url,
          class: data.classButton ? "as-button" : undefined,
        })
        .run();
      form.reset();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleUnlink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="-mt-[2px]">
          <RichTextButton>
            <LinkIcon />
          </RichTextButton>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar link</DialogTitle>
            <DialogDescription>
              Insira a URL do link que deseja adicionar
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                form.handleSubmit(setLink)(e);
              }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        defaultValue={editor.getAttributes("link").href}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classButton"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Call to action</FormLabel>
                      <FormDescription>
                        Escolhendo essa opção, o link será exibido como um botão
                        clicável.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={checkUrlMutation.isPending}
              >
                Adicionar
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <RichTextButton
        onClick={handleUnlink}
        disabled={!editor.isActive("link")}
      >
        <UnlinkIcon />
      </RichTextButton>
    </>
  );
};
