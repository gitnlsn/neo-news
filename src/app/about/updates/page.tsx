import { PublicLayout } from "~/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";

interface UpdateItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "novidade" | "melhoria" | "correção";
}

const updatesData: UpdateItem[] = [
  {
    id: "launch",
    date: "2024-03-25",
    title: "Lançamento da Plataforma",
    description:
      "É com grande satisfação que anunciamos o lançamento da nossa plataforma! Aqui você pode criar seu perfil personalizado e compartilhar suas ideias através de posts ricos em conteúdo. Nosso editor permite formatar textos, adicionar imagens e vídeos de forma intuitiva. Além disso, todo conteúdo publicado é otimizado para aparecer nos resultados de busca do Google, garantindo maior visibilidade para suas publicações.",
    category: "novidade",
  },
];

const getCategoryStyle = (category: UpdateItem["category"]) => {
  const styles = {
    novidade: "bg-purple-100 text-purple-800",
    melhoria: "bg-blue-100 text-blue-800",
    correção: "bg-green-100 text-green-800",
  };
  return styles[category];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UpdatesPage() {
  return (
    <PublicLayout>
      <Container>
        <div className="py-8">
          <Typography.H1 className="mb-8">
            Novidades da Plataforma
          </Typography.H1>

          <div className="space-y-6">
            {updatesData.map((update) => (
              <Card key={update.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <time
                      className="text-sm text-muted-foreground"
                      dateTime={update.date}
                    >
                      {formatDate(update.date)}
                    </time>
                    <span
                      className={`px-3 py-1 text-sm rounded-full capitalize ${getCategoryStyle(update.category)}`}
                    >
                      {update.category}
                    </span>
                  </div>
                  <CardTitle>{update.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </PublicLayout>
  );
}
