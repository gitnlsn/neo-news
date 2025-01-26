"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
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
import PageHeader from "~/components/ui/page-header";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Typography } from "~/components/ui/typography";
import { useBreadcrumb } from "~/hooks/use-breadcrumb";
import { profileSchema } from "~/schemas/form-validation/profile";
import { api } from "~/trpc/react";
import { uploadImage } from "~/utils/api/upload-image";

export default function ProfileForm() {
  const { profileId } = useParams<{ profileId: string }>();

  const richTextEditorRef = useRef<RichTextEditorRef>(null);

  const { breadcrumbItems, setBreadcrumbItems } = useBreadcrumb({
    initialItems: [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Profile", link: "/dashboard/profile" },
    ],
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileId,
      title: "",
      description: "",
      logo: undefined,
      images: [],
    },
  });

  const richTextFieldArray = useFieldArray({
    control: form.control,
    name: "images",
  });

  const upsertProfileMutation = api.profile.upsert.useMutation();
  const showProfile = api.profile.show.useQuery(
    { profileId },
    { enabled: !!profileId },
  );

  useEffect(() => {
    if (showProfile.data) {
      form.reset({
        profileId: showProfile.data.id,

        title: showProfile.data.title,
        description: showProfile.data.description,
        images: showProfile.data.images,
        logo: showProfile.data.logo ?? undefined,
      });

      richTextEditorRef.current?.setContent(showProfile.data.description);

      const { title, id } = showProfile.data;
      if (title) {
        setBreadcrumbItems((current) => [
          ...current,
          { title, link: `/dashboard/profile/${id}` },
        ]);
      }
    }
  }, [showProfile.data, form, setBreadcrumbItems]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await upsertProfileMutation.mutateAsync(data);
      toast.success(
        profileId === undefined
          ? "Perfil criado com sucesso"
          : "Perfil atualizado com sucesso",
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    }
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const uploadedFile = await uploadImage(file);

    form.setValue("logo", uploadedFile);
  };

  return (
    <PrivateLayout>
      <div className="py-4 flex flex-row gap-4 items-center">
        <SidebarTrigger />
        <PageHeader breadcrumbItems={breadcrumbItems} />
      </div>

      <Form {...form}>
        <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
          <Typography.H3 className="col-span-12">Perfil</Typography.H3>

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="sm:col-span-12">
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input type="file" onChange={handleLogoChange} />
                </FormControl>
                {field.value && (
                  <img
                    src={field.value.url}
                    alt="Logo Preview"
                    className="mt-2 max-h-[600px] max-w-[600px] w-full mx-auto"
                  />
                )}
                <FormDescription>
                  Esse será o logo do seu perfil.
                </FormDescription>
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
                  Esse será o título do seu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-12">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <RichTextEditor
                    ref={richTextEditorRef}
                    onChange={field.onChange}
                    onUploadImage={(file) => richTextFieldArray.append(file)}
                  />
                </FormControl>
                <FormDescription>
                  Essa será a descrição do seu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="col-span-12"
            isLoading={upsertProfileMutation.isPending || showProfile.isLoading}
          >
            {profileId === undefined ? "Create Profile" : "Update Profile"}
          </Button>
        </FormWrapper>
      </Form>
    </PrivateLayout>
  );
}
