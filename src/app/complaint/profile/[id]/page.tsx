"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "~/components/ui/button";
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
import { Textarea } from "~/components/ui/textarea";
import { Typography } from "~/components/ui/typography";
import { complaintSchema } from "~/schemas/form-validation/complaint";
import { api } from "~/trpc/react";

export default function PostComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const showProfile = api.profile.publicShow.useQuery({
    profileId: id,
  });

  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      profileId: showProfile.data?.id ?? "",
      description: "",
    },
  });

  const createComplaint = api.complaint.create.useMutation({
    onSuccess: async () => {
      toast.success("Reclamação enviada com sucesso.");
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.back();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (showProfile.data) {
      form.setValue("profileId", showProfile.data.id);
    }
  }, [form, showProfile.data]);

  const onSubmit = async (data: z.infer<typeof complaintSchema>) => {
    const profileId = showProfile.data?.id;

    try {
      await createComplaint.mutateAsync({
        ...data,
        profileId,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao enviar reclamação");
      }
    }
  };

  return (
    <Container className="max-w-2xl py-10">
      <Typography.H2>Reportar</Typography.H2>

      {showProfile.data && (
        <Typography.P>
          Perfil a ser reportado:{" "}
          <Typography.Span className="font-semibold">
            {showProfile.data.title}
          </Typography.Span>{" "}
          (<Typography.Span>{showProfile.data.user.email}</Typography.Span>)
        </Typography.P>
      )}

      <Form {...form}>
        <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-12">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva sua reclamação em detalhes..."
                    disabled={createComplaint.isPending}
                    aria-label="Descrição da reclamação"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Essa reclamação será enviada para o administrador do site e
                  será avaliada.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="col-span-12  "
            isLoading={createComplaint.isPending}
          >
            Enviar Reclamação
          </Button>
        </FormWrapper>
      </Form>
    </Container>
  );
}
