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
      {/* Hero Section */}
      <section className="border-b bg-background">
        <Container className="py-24">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Seu anúncio visível para o mundo todo
              </h1>
              <p className="text-muted-foreground max-w-[600px] text-base sm:text-xl">
                Publique seus anúncios e alcance milhares de pessoas
                interessadas no que você tem a oferecer.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Começe já</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/post">Ver Anúncios</Link>
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
              Por que anunciar conosco?
            </h2>
            <p className="text-muted-foreground max-w-[600px] text-center">
              Uma plataforma completa para seus anúncios, com todas as
              ferramentas que você precisa.
            </p>
          </div>
          <div className="grid gap-4 mt-8 md:grid-cols-3">
            {[
              {
                title: "Alta Visibilidade",
                description:
                  "Seus anúncios otimizados para mecanismos de busca",
                icon: "search",
              },
              {
                title: "Interface Intuitiva",
                description: "Plataforma moderna e fácil de usar",
                icon: "wallet",
              },
              {
                title: "Alcance Global",
                description: "Chegue a pessoas interessadas em todo o mundo",
                icon: "globe",
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
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
              Como funciona
            </h2>
            <p className="text-muted-foreground max-w-[600px] text-center">
              Comece a anunciar em três passos simples
            </p>
          </div>
          <div className="grid gap-4 mt-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Crie sua conta",
                description: "Processo simples e rápido de cadastro",
              },
              {
                step: "2",
                title: "Publique seu anúncio",
                description: "Interface intuitiva para criar seu anúncio",
              },
              {
                step: "3",
                title: "Alcance pessoas",
                description: "Seu anúncio disponível para todos interessados",
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

      {/* CTA Section */}
      <section className="border-t bg-background/50">
        <Container className="py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground max-w-[600px]">
              Junte-se a milhares de pessoas que já estão anunciando na nossa
              plataforma
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/login">Comece Agora</Link>
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
