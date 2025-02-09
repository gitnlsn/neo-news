import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";
import type { Metadata } from "next";
import { env } from "~/env";
import { getTextDescriptionFromHtml } from "~/utils/use-cases/get-text-description-from-html";
import keywordExtractor from "keyword-extractor";

interface Params {
  id: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const prisma = new PrismaClient();
  const profiles = await prisma.profile.findMany({
    select: {
      id: true,
    },
    where: {
      posts: {
        some: {
          isPublished: true,
          deletedAt: null,
        },
      },
    },
  });

  console.log(
    "Generating static params for profiles",
    JSON.stringify(
      profiles.map((profile) => profile.id),
      null,
      2,
    ),
  );

  return profiles.map((post) => ({ id: post.id }));
}

export const getProfile = async (props: Params) => {
  const prisma = new PrismaClient();

  const profile = await prisma.profile.findUniqueOrThrow({
    where: {
      id: props.id,
    },
    include: {
      logo: true,
      user: {
        select: {
          email: true,
        },
      },
      posts: {
        where: {
          isPublished: true,
          deletedAt: null,
        },
      },
    },
  });

  return profile;
};

type Props = {
  params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getProfile({ id: params.id });

  const fullDescription = getTextDescriptionFromHtml(profile.description);
  const description = fullDescription.slice(0, 512);

  const keywords = keywordExtractor
    .extract(fullDescription, {
      language: "portuguese",
      remove_duplicates: true,
      remove_digits: true,
    })
    .slice(0, 128);

  return {
    title: profile.title,
    description,
    keywords,
    openGraph: {
      title: profile.title,
      description,
      url: `${env.APP_PUBLIC_URL}/profile/${profile.id}`,
      images: profile.logo
        ? [
            {
              url: profile.logo.url,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.title,
      description,
      images: profile.logo ? [profile.logo.url] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const awaitedParams = await params;
  const profile = await getProfile({ id: awaitedParams.id });

  if (profile.posts.length === 0) {
    redirect("/");
  }

  return (
    <Container className="max-w-screen-lg py-10">
      <div className="flex flex-col gap-4">
        <Typography.H1>{profile.title}</Typography.H1>

        <Typography.Muted>E-mail: {profile.user.email}</Typography.Muted>

        {profile.logo?.url && (
          <Image
            src={profile.logo.url}
            alt={profile.title}
            width={800}
            height={800}
            className="mx-auto"
          />
        )}
      </div>

      <div
        className="tiptap"
        dangerouslySetInnerHTML={{ __html: profile.description }}
      />
    </Container>
  );
}
