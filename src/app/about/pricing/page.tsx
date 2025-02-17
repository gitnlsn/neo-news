import { Check } from "lucide-react";
import { PublicLayout } from "~/components/layout/public-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <Check className="h-5 w-5 text-primary" />
    <span className="text-sm text-muted-foreground">{children}</span>
  </div>
);

export default function Pricing() {
  return (
    <PublicLayout>
      <Container className="items-center py-8">
        <Typography.H1>Planos</Typography.H1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Gratuito</CardTitle>
              <CardDescription>Acesso completo à plataforma</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <FeatureItem>Editor de texto rico</FeatureItem>
              <FeatureItem>Upload de imagens e vídeos</FeatureItem>
              <FeatureItem>Indexação automática no Google</FeatureItem>
              <FeatureItem>
                Compartilhamento em redes sociais (em breve)
              </FeatureItem>
              <FeatureItem>Gestão básica de campanhas (em breve)</FeatureItem>
            </CardContent>
          </Card>

          <Card className="max-w-lg border-dashed">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>Recursos exclusivos e avançados</CardDescription>
              <CardDescription>Em Breve</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <FeatureItem>Todas as features do plano Gratuito</FeatureItem>
              <FeatureItem>Gestão de campanhas (em breve)</FeatureItem>
              <FeatureItem>
                Assistente AI premium com recursos avançados (em breve)
              </FeatureItem>
            </CardContent>
          </Card>
        </div>
      </Container>
    </PublicLayout>
  );
}
