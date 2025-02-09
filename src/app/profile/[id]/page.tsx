import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";

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
