import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Container } from "~/components/ui/container";

import Image from "next/image";
import TamaraGak from "~/assets/landing-page/tamara-gak-GWbIHT51VT4-unsplash.jpg";
import { PublicLayout } from "~/components/layout/public-layout";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="border-b bg-background">
        <Container className="py-24">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Plataforma simples e intuitiva para suas publicações
              </h1>
              <p className="text-muted-foreground max-w-[600px] text-base sm:text-xl">
                Editor completo e fácil de usar para criar posts com ótima
                formatação. Você tem controle total: edite ou remova suas
                publicações quando quiser, diretamente na plataforma.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Comece já</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/post">Anúncios</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-square rounded-lg border bg-muted">
                <Image
                  src={TamaraGak}
                  alt="news"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="border-b bg-background/50">
        <Container className="py-20">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Ferramentas para seu conteúdo
            </h2>
            <p className="text-muted-foreground max-w-[600px] text-center">
              Tudo que você precisa em uma única plataforma
            </p>
          </div>
          <div className="grid gap-4 mt-8 md:grid-cols-3">
            {[
              {
                title: "Editor Intuitivo",
                description:
                  "Formatação simples com rich text, títulos e listas",
                icon: "✍️",
              },
              {
                title: "Gestão de Mídia",
                description:
                  "Adicione imagens e vídeos do YouTube com facilidade",
                icon: "🎥",
              },
              {
                title: "Controle Total",
                description:
                  "Edite ou remova suas publicações a qualquer momento",
                icon: "🎮",
              },
              {
                title: "Publicação Simples",
                description: "Publique seu conteúdo em poucos cliques",
                icon: "🚀",
              },
              {
                title: "Gestão Prática",
                description:
                  "Painel intuitivo para gerenciar todas suas publicações",
                icon: "📊",
              },
              {
                title: "Suas Regras",
                description:
                  "Você decide quando publicar, editar ou remover conteúdo",
                icon: "✅",
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Steps Section */}
      <section className="border-b">
        <Container className="py-20">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Comece a publicar em minutos
            </h2>
            <p className="text-muted-foreground max-w-[600px] text-center">
              Processo simples para criar e gerenciar seu conteúdo
            </p>
          </div>
          <div className="grid gap-4 mt-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Acesse a plataforma",
                description: "Entre em sua área exclusiva de publicações",
              },
              {
                step: "2",
                title: "Crie conteúdo",
                description: "Use o editor intuitivo com todas as ferramentas",
              },
              {
                step: "3",
                title: "Gerencie publicações",
                description: "Edite ou remova conteúdo quando precisar",
              },
            ].map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted text-sm font-semibold">
                      {step.step}
                    </span>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Coming Soon Section */}
      <section className="border-b bg-background/50">
        <Container className="py-20">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Novidades em breve
            </h2>
            <p className="text-muted-foreground max-w-[600px] text-center">
              Vamos trabalhar em novas funcionalidades para tornar sua
              experiência ainda melhor
            </p>
          </div>
          <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Integração com Redes Sociais",
                description:
                  "Publique diretamente no Facebook, Instagram e LinkedIn com um único clique",
                icon: "🔗",
              },
              {
                title: "Armazenamento em Nuvem",
                description:
                  "Integração com Google Drive para imagens e YouTube para vídeos",
                icon: "☁️",
              },
              {
                title: "Gestão de Campanhas",
                description:
                  "Configure e gerencie campanhas para seus anúncios e posts",
                icon: "📈",
              },
              {
                title: "Assistente IA",
                description:
                  "Crie conteúdo com ajuda de inteligência artificial",
                icon: "🤖",
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-background/50">
        <Container className="py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Comece a publicar com confiança
            </h2>
            <p className="text-muted-foreground max-w-[600px]">
              Plataforma simples e completa para criar, editar e gerenciar suas
              publicações
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/login">Começe agora</Link>
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
