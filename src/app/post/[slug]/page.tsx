import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
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
