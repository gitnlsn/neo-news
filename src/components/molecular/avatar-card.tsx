import type { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarCardProps {
  session: ReturnType<typeof useSession>["data"];
  className?: string;
}

export const AvatarCard = ({ session, className }: AvatarCardProps) => {
  if (!session || !session.user) return null;

  const getAvatarNameInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names
      .slice(0, 2)
      .map((n) => n.charAt(0))
      .join("");
    return initials.toUpperCase();
  };

  return (
    <Avatar className={className}>
      {session.user.image && <AvatarImage src={session.user.image} />}
      <AvatarFallback>
        {getAvatarNameInitials(session.user.name || "")}
      </AvatarFallback>
    </Avatar>
  );
};
