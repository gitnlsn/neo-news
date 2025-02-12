"use client";

import type React from "react";
import { PrivateLayout } from "~/components/private-layout"; // Importando o layout privado
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"; // Importando o componente Card do Shadcn
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Dialog } from "~/components/ui/dialog";
import PageHeader from "~/components/ui/page-header";

const DashboardPage: React.FC = () => {
  return (
    <PrivateLayout>
      <PageHeader
        breadcrumbItems={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Dashboard</CardTitle>
          <CardDescription>
            Aqui, em breve, você terá uma visão geral de suas postagens e
            perfis.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl ">O que é um perfil?</CardTitle>
          <CardDescription>
            O perfil é a identidade do autor das publicações. Você pode ter mais
            de um perfil, caso queria fazer publicações em nome de mais de uma
            organização. O perfil sempre aparecerá vinculado à publicação, por
            meio de um link.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">O que é um post?</CardTitle>
          <CardDescription>
            O post é a publicação que você quer fazer. A publicação ficará
            exposta à ferramenta de busca da Google, para poder ser encontrada
            mais facilmente por usuários da internet. O post é feito com
            RichText e pode ser feito com texto formatado, podem ser incluidas
            imagens e videos do youtube.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl">Feedbacks</CardTitle>
            <CardDescription className="flex flex-col gap-2">
              Você tem uma sugestão de melhoria? Algo que gostaria de ver no
              Neo-news? Quer relatar um problema? Deixe seu feedback aqui.
            </CardDescription>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Deixe seu feedback</Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen w-fit [&>button]:hidden">
              <iframe
                title="Formulário de Feedback"
                src="https://docs.google.com/forms/d/e/1FAIpQLSeYf5ezlSSVRv5Wd1FPM8AHkzHwDyx_8644CBH0aO5SZznJiw/viewform?embedded=true"
                width="640"
                height="813"
              >
                Carregando…
              </iframe>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </PrivateLayout>
  );
};

export default DashboardPage;
