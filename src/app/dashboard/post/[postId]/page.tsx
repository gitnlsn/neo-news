"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { set, type z } from "zod";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ComplaintsPaginator } from "~/components/modules/sidebar/complaints-paginator";
import { PrivateLayout } from "~/components/private-layout";
import {
  RichTextEditor,
  type RichTextEditorRef,
} from "~/components/rich-text/editor";
import { Button } from "~/components/ui/button"; // Importar Button da pasta ui
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Container } from "~/components/ui/container";
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
import PageHeader from "~/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "~/components/ui/sidebar";
import { TagsInput } from "~/components/ui/tags-input";
import { Typography } from "~/components/ui/typography";
import { postSchema } from "~/schemas/form-validation/post";
import { api } from "~/trpc/react";

export default function ProfileForm() {
  const router = useRouter();
  const { postId } = useParams<{ postId: string }>();

  const queryClient = useQueryClient();

  const richTextEditorRef = useRef<RichTextEditorRef>(null);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      postId,
      title: "",
      content: "",
      images: [],
      tags: [],
    },
  });

  const richTextFieldArray = useFieldArray({
    control: form.control,
    name: "images",
  });

  const upsertProfileMutation = api.post.upsert.useMutation();

  const listProfiles = api.profile.paginate.useQuery({});

  const showPost = api.post.show.useQuery(
    { postId },
    { enabled: !!postId, refetchOnWindowFocus: false },
  );

  const breadcrumbItems = showPost.data
    ? [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Posts", link: "/dashboard/post" },
        {
          title: showPost.data.title,
          link: `/dashboard/post/${showPost.data.id}`,
        },
      ]
    : [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Posts", link: "/dashboard/post" },
      ];

  useEffect(() => {
    if (showPost.data && listProfiles.data) {
      form.reset({
        postId: showPost.data.id,

        profileId: showPost.data.profileId,
        title: showPost.data.title,
        content: showPost.data.content,
        images: showPost.data.images,
        tags: showPost.data.tags ?? [],
      });

      richTextEditorRef.current?.setContent(showPost.data.content);
    }
  }, [showPost.data, listProfiles.data, form]);

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    try {
      await upsertProfileMutation.mutateAsync(data);
      toast.success(
        postId === undefined
          ? "Post criado com sucesso"
          : "Post atualizado com sucesso",
      );
      router.back();
      queryClient.invalidateQueries({ queryKey: ["post"] });
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
      <SidebarProvider side="right" defaultOpen={postId !== undefined}>
        <Container className="px-0">
          <PageHeader breadcrumbItems={breadcrumbItems} rightSidebarTrigger />

          <Form {...form}>
            <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
              <Typography.H3 className="col-span-12">
                {postId ? "Atualizar" : "Criar"} Post
              </Typography.H3>

              {listProfiles.data?.total === 0 && (
                <Card className="col-span-12 border-yellow-600 bg-yellow-100">
                  <CardHeader>
                    <CardTitle>Você ainda não tem nenhum perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Typography.P>
                      O perfil é necessário pois você vai vincular o perfil ao
                      post. Para criar um novo perfil, clique no botão abaixo.
                    </Typography.P>
                  </CardContent>

                  <CardFooter>
                    <Button variant="outline" type="button">
                      <Link href="/dashboard/profile/create">Criar Perfil</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {listProfiles.data && listProfiles.data?.profiles.length > 0 && (
                <FormField
                  control={form.control}
                  name="profileId"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-12">
                      <FormLabel>Perfil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                        Esse será o perfil dentro do qual você publicará seu
                        post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                name="tags"
                render={({ field }) => (
                  <FormItem className="sm:col-span-12">
                    <FormLabel>Paravras chaves</FormLabel>
                    <FormControl>
                      <TagsInput
                        placeholder="Digite uma tag e pressione Enter"
                        tags={field.value ?? []}
                        onTagsChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Adicione palavras chaves para categorizar seu post. Essas
                      palavras chaves serão usadas para melhorar a busca do post
                      no Google.
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
                        onUploadImage={(file) =>
                          richTextFieldArray.append(file)
                        }
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
                isLoading={
                  upsertProfileMutation.isPending || showPost.isLoading
                }
              >
                {postId ? "Atualizar Post" : "Criar Post"}
              </Button>
            </FormWrapper>
          </Form>
        </Container>

        <Sidebar side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Reclamações</SidebarGroupLabel>
              <SidebarGroupContent>
                <ComplaintsPaginator postId={postId} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </PrivateLayout>
  );
}
