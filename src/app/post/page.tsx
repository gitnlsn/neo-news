import {
  type Post,
  PrismaClient,
  type File as UploadedFile,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getUrlsFromHtml } from "~/utils/use-cases/get-urls-from-html";

type PagePost = Post & {
  imageUrl: string | undefined;
};

// Função para buscar os posts (simulada)
async function getPosts(): Promise<PagePost[]> {
  const prisma = new PrismaClient();

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
    },

    include: {
      images: true,
      profile: true,
    },

    take: 90,
  });

  return posts.map((post) => ({
    ...post,
    images: undefined,
    profile: undefined,
    imageUrl: getUrlsFromHtml(post.content)[0],
  }));
}

const EventCard = ({ post }: { post: PagePost }) => (
  <Link
    href={`/post/${post.slug}`}
    className="block group"
    tabIndex={0}
    aria-label={`Ver detalhes do evento: ${post.title}`}
  >
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className="tiptap max-h-24 overflow-hidden text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </CardContent>

      <CardFooter>
        <time
          className="text-sm text-muted-foreground"
          dateTime={post.createdAt.toISOString()}
        >
          {new Date(post.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </time>
      </CardFooter>
    </Card>
  </Link>
);

// Página principal
export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Últimos Anúncios
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <EventCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}

// Configuração para SSG
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidar a cada 1 hora
