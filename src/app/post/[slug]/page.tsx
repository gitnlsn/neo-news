import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Container } from "~/components/ui/container";
import { Separator } from "~/components/ui/separator";
import { Typography } from "~/components/ui/typography";
import dayjs from "~/utils/date/dayjs";

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

export default async function Page({ params }: { params: Promise<Params> }) {
  const foo = await params;
  const post = await getPost({ slug: foo.slug });

  if (!post.isPublished) {
    redirect("/");
  }

  return (
    <Container className="max-w-screen-lg py-10">
      <div className="flex flex-col gap-0">
        <Typography.H2>{post.title}</Typography.H2>

        <Typography.Muted>
          Publicado em {dayjs(post.createdAt).format("DD/MM/YYYY")},{" "}
          {dayjs(post.createdAt).fromNow()}
        </Typography.Muted>
      </div>

      <div
        className="tiptap"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Separator />

      <div className="flex flex-col gap-0">
        <Typography.H3>Publicado por: {post.profile.title}</Typography.H3>

        <Typography.Muted>{post.profile.user.email}</Typography.Muted>

        {post.profile.logo?.url && (
          <Image
            src={post.profile.logo.url}
            alt={post.profile.title}
            width={800}
            height={800}
            className="mx-auto"
          />
        )}
      </div>

      <div
        className="tiptap"
        dangerouslySetInnerHTML={{ __html: post.profile.description }}
      />
    </Container>
  );
}
