"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { PrivateLayout } from "~/components/private-layout";
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
import { Textarea } from "~/components/ui/textarea";
import { Typography } from "~/components/ui/typography";
import { profileSchema } from "~/schemas/form-validation/profile";
import { api } from "~/trpc/react";

export default function ProfileForm() {
  const router = useRouter();
  const profileId = router.query.profileId as string;

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: "",
      description: "",
      logo: undefined,
      images: [],
    },
  });

  const upsertProfileMutation = api.profile.upsertProfile.useMutation();
  const showProfile = api.profile.showProfile.useQuery(
    { profileId },
    { enabled: !!profileId },
  );

  useEffect(() => {
    if (showProfile.data) {
      form.reset({
        title: showProfile.data.title,
        description: showProfile.data.description,
        images: showProfile.data.images,
        logo: showProfile.data.logo ?? undefined,
      });
    }
  }, [showProfile.data, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await upsertProfileMutation.mutateAsync(data);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const breadcrumbItems = [
    { title: "Home", link: "/" },
    { title: "Profile", link: "/dashboard/profile" },
  ];

  console.log(form.watch(), form.formState.errors);

  return (
    <PrivateLayout>
      <div className="py-4 flex flex-row gap-4 items-center">
        <SidebarTrigger />
        <PageHeader breadcrumbItems={breadcrumbItems} />
      </div>

      <Form {...form}>
        <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
          <Typography.H3 className="col-span-12">Profile</Typography.H3>

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
                  <Textarea
                    placeholder="Insira a descrição"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Essa será a descrição do seu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormItem>
            <FormLabel>Logo</FormLabel>
            <FormControl>
              <Input type="file" onChange={handleLogoChange} />
            </FormControl>
            {logoPreview && (
              <img src={logoPreview} alt="Logo Preview" className="mt-2" />
            )}
            <FormDescription>Esse será o logo do seu perfil.</FormDescription>
          </FormItem> */}

          <Button
            type="submit"
            className="col-span-12"
            isLoading={upsertProfileMutation.isPending || showProfile.isLoading}
          >
            Update Profile
          </Button>
        </FormWrapper>
      </Form>
    </PrivateLayout>
  );
}
