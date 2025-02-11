import { randomUUID } from "node:crypto";
import { env } from "~/env";
import { db } from "~/server/db";
import { FakeFactory } from "~/use-cases/utils/fake-factory";

export const seed = async () => {
  if (env.NODE_ENV === "production") {
    throw new Error("Don't run seed in production");
  }

  const fakeFactory = new FakeFactory(db);

  const users = await Promise.all([
    fakeFactory.createUser(),
    fakeFactory.createUser(),
    fakeFactory.createUser(),
  ]);

  const profiles = await Promise.all(
    users.flatMap((user) => [
      fakeFactory.createProfile({
        userId: user.id,
      }),
    ]),
  );

  const posts = await Promise.all(
    profiles.flatMap((profile) => [
      fakeFactory.createPost({
        profileId: profile.id,
      }),
      fakeFactory.createPost({
        profileId: profile.id,
        isPublished: true,
        title: `${randomUUID()} Sem imagens e videos`,
        richTextProps: {
          textCount: 3,
          imageCount: 0,
          youtubeCount: 0,
        },
      }),
      fakeFactory.createPost({
        profileId: profile.id,
        isPublished: true,
      }),
    ]),
  );

  console.log(`Created ${users.length} users`);
  console.log(`Created ${profiles.length} profiles`);
  console.log(`Created ${posts.length} posts`);
};

seed().catch(console.error);
