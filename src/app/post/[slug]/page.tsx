import keywordExtractor from "keyword-extractor";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicLayout } from "~/components/layout/public-layout";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";
import { env } from "~/env";
import { db } from "~/server/db";
import dayjs from "~/utils/date/dayjs";
import { getTextDescriptionFromHtml } from "~/utils/use-cases/get-text-description-from-html";
import { getUrlsFromHtml } from "~/utils/use-cases/get-urls-from-html";
import { getVideoUrlsFromHtml } from "~/utils/use-cases/get-video-urls-from-html";

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await db.post.findMany({
    select: {
      slug: true,
    },
    where: {
      isPublished: true,
      deletedAt: null,
    },
  });

  console.log(
    "Generating static params for posts",
    JSON.stringify(
      posts.map((post) => post.slug),
      null,
      2,
    ),
  );

  return posts.map((post) => ({ slug: post.slug }));
}

export const getPost = async (props: Params) => {
  const post = await db.post.findUniqueOrThrow({
    where: {
      slug: props.slug,
    },
    include: {
      images: true,
      tags: true,
      profile: {
        include: { logo: true, user: { select: { id: true, email: true } } },
      },
    },
  });

  return post;
};

type Props = {
  params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost({ slug: params.slug });

  const fullDescription = getTextDescriptionFromHtml(post.content);

  const description = fullDescription.slice(0, 512);

  const extractedKeywords = keywordExtractor
    .extract(fullDescription, {
      language: "portuguese",
      remove_duplicates: true,
      remove_digits: true,
    })
    .slice(0, 128);

  const tagKeywords = post.tags.map((tag) => tag.name);
  const keywords = [...new Set([...tagKeywords, ...extractedKeywords])];

  return {
    title: post.title,
    description,
    keywords,
    openGraph: {
      title: post.title,
      description,
      url: `${env.APP_PUBLIC_URL}/post/${post.slug}`,
      publishedTime: post.createdAt.toISOString(),
      images: getUrlsFromHtml(post.content).map((url) => ({
        url,
        alt: post.title,
      })),
      videos: getVideoUrlsFromHtml(post.content).map((url) => ({
        url,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.images.map((image) => image.url),
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const awaitedParams = await params;
  const post = await getPost({ slug: awaitedParams.slug });

  if (!post.isPublished) {
    redirect("/");
  }

  return (
    <PublicLayout>
      <Container className="max-w-screen-lg py-10">
        <div className="flex flex-col gap-0">
          <Typography.H2>{post.title}</Typography.H2>

          <Typography.Muted>
            Publicado em {dayjs(post.createdAt).format("DD/MM/YYYY")},{" "}
            {dayjs(post.createdAt).fromNow()}, por{" "}
            <Link
              href={`/profile/${post.profile.id}`}
              className="text-blue-600"
            >
              {post.profile.title} ({post.profile.user.email})
            </Link>
          </Typography.Muted>
        </div>

        <div
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 flex flex-wrap justify-end gap-2">
          <Button asChild>
            <Link href="/login">Criar anúncio</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/complaint/post/${post.slug}`}>Reportar</Link>
          </Button>
        </div>
      </Container>
    </PublicLayout>
  );
}
