"use client";

import type React from "react";
import { PrivateLayout } from "~/components/private-layout"; // Importando o layout privado
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"; // Importando o componente Card do Shadcn
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
    </PrivateLayout>
  );
};

export default DashboardPage;
