import Link from "next/link";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { auth, signIn } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-600 to-purple-800 px-4 py-24 text-white">
        <Container className="max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Seu anúncio visível para o mundo todo
              </h1>
              <p className="text-xl text-purple-100">
                Publique seus anúncios gratuitamente e alcance milhares de
                pessoas interessadas no que você tem a oferecer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-white text-purple-700 hover:bg-purple-50"
                  >
                    <Link href="/anuncios/novo">
                      <Icons.plus className="mr-2 h-4 w-4" />
                      Criar Anúncio
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-white text-purple-700 hover:bg-purple-50"
                  >
                    <Link href="/api/auth/signin">
                      <Icons.google className="mr-2 h-4 w-4" />
                      Entrar com Google
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white text-purple-700 hover:bg-white/10"
                >
                  <Link href="/anuncios">Ver Anúncios</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Placeholder para ilustração */}
              <div className="aspect-square rounded-2xl bg-white/10" />
            </div>
          </div>
        </Container>
      </section>

      {/* Benefícios */}
      <section className="py-24">
        <Container className="max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Por que anunciar conosco?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Alta Visibilidade",
                description:
                  "Seus anúncios otimizados para mecanismos de busca",
              },
              {
                title: "Totalmente Gratuito",
                description: "Sem custos escondidos ou taxas de publicação",
              },
              {
                title: "Alcance Global",
                description: "Chegue a pessoas interessadas em todo o mundo",
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="bg-purple-50 border-none">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 inline-block rounded-full bg-purple-100 p-3">
                    <div className="h-8 w-8 rounded-full bg-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Como Funciona */}
      <section className="bg-gray-50 py-24">
        <Container className="max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Como funciona
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
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
              <Card
                key={step.title}
                className="border-none bg-transparent text-center"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                    {step.step}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="bg-purple-600 py-24 text-white">
        <Container className="max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mb-8 text-xl text-purple-100">
            Junte-se a milhares de pessoas que já estão anunciando na nossa
            plataforma
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-purple-700 hover:bg-purple-50"
          >
            <Link href={session ? "/anuncios/novo" : "/api/auth/signin"}>
              {session ? "Criar Anúncio" : "Criar Conta Grátis"}
            </Link>
          </Button>
        </Container>
      </section>
    </main>
  );
}
