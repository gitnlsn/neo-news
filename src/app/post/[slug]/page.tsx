import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";
import dayjs from "~/utils/date/dayjs";
import type { Metadata } from "next";
import { env } from "~/env";
import { getTextDescriptionFromHtml } from "~/utils/use-cases/get-text-description-from-html";
import keywordExtractor from "keyword-extractor";
import { getVideoUrlsFromHtml } from "~/utils/use-cases/get-video-urls-from-html";

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
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
  const prisma = new PrismaClient();

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      slug: props.slug,
    },
    include: {
      images: true,
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

  const keywords = keywordExtractor
    .extract(fullDescription, {
      language: "portuguese",
      remove_duplicates: true,
      remove_digits: true,
    })
    .slice(0, 128);

  return {
    title: post.title,
    description,
    keywords,
    openGraph: {
      title: post.title,
      description,
      url: `${env.APP_PUBLIC_URL}/post/${post.slug}`,
      publishedTime: post.createdAt.toISOString(),
      images: post.images.map((image) => ({
        url: image.url,
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
    <Container className="max-w-screen-lg py-10">
      <div className="flex flex-col gap-0">
        <Typography.H2>{post.title}</Typography.H2>

        <Typography.Muted>
          Publicado em {dayjs(post.createdAt).format("DD/MM/YYYY")},{" "}
          {dayjs(post.createdAt).fromNow()}, por{" "}
          <Link href={`/profile/${post.profile.id}`} className="text-blue-600">
            {post.profile.title} ({post.profile.user.email})
          </Link>
        </Typography.Muted>
      </div>

      <div
        className="tiptap"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Container>
  );
}
