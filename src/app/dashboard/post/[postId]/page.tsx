"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { set, type z } from "zod";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PrivateLayout } from "~/components/private-layout";
import {
  RichTextEditor,
  type RichTextEditorRef,
} from "~/components/rich-text/editor";
import { Button } from "~/components/ui/button"; // Importar Button da pasta ui
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormWrapper,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input"; // Importar Input da pasta ui
import PageHeader, { NavigationItem } from "~/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Typography } from "~/components/ui/typography";
import { useBreadcrumb } from "~/hooks/use-breadcrumb";
import { postSchema } from "~/schemas/form-validation/post";
import { api } from "~/trpc/react";

export default function ProfileForm() {
  const { postId } = useParams<{ postId: string }>();

  const richTextEditorRef = useRef<RichTextEditorRef>(null);

  const { breadcrumbItems, setBreadcrumbItems } = useBreadcrumb({
    initialItems: [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Post", link: "/dashboard/post" },
    ],
  });

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      postId,
      title: "",
      content: "",
      images: [],
    },
  });

  const richTextFieldArray = useFieldArray({
    control: form.control,
    name: "images",
  });

  const upsertProfileMutation = api.post.upsert.useMutation();
  const showPost = api.post.show.useQuery({ postId }, { enabled: !!postId });

  const listProfiles = api.profile.paginate.useQuery({});

  useEffect(() => {
    if (showPost.data) {
      form.reset({
        postId: showPost.data.id,

        profileId: showPost.data.profileId,
        title: showPost.data.title,
        content: showPost.data.content,
        images: showPost.data.images,
      });

      richTextEditorRef.current?.setContent(showPost.data.content);

      const { title, id } = showPost.data;
      if (title) {
        setBreadcrumbItems((current) => [
          ...current,
          { title, link: `/dashboard/post/${id}` },
        ]);
      }
    }
  }, [showPost.data, form, setBreadcrumbItems]);

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    try {
      await upsertProfileMutation.mutateAsync(data);
      toast.success(
        postId === undefined
          ? "Post criado com sucesso"
          : "Post atualizado com sucesso",
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar post");
      }
    }
  };

  return (
    <PrivateLayout>
      <div className="py-4 flex flex-row gap-4 items-center">
        <SidebarTrigger />
        <PageHeader breadcrumbItems={breadcrumbItems} />
      </div>

      <Form {...form}>
        <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
          <Typography.H3 className="col-span-12">Post</Typography.H3>

          <FormField
            control={form.control}
            name="profileId"
            render={({ field }) => (
              <FormItem className="sm:col-span-12">
                <FormLabel>Perfil</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listProfiles.data?.profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Esse será o perfil dentro do qual você publicará seu post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-12">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o título"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Esse será o título do seu post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="sm:col-span-12">
                <FormLabel>Conteúdo</FormLabel>
                <FormControl>
                  <RichTextEditor
                    ref={richTextEditorRef}
                    onChange={field.onChange}
                    onUploadImage={(file) => richTextFieldArray.append(file)}
                  />
                </FormControl>
                <FormDescription>
                  Essa será o conteúdo do seu post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="col-span-12"
            isLoading={upsertProfileMutation.isPending || showPost.isLoading}
          >
            {postId ? "Atualizar Post" : "Criar Post"}
          </Button>
        </FormWrapper>
      </Form>
    </PrivateLayout>
  );
}
