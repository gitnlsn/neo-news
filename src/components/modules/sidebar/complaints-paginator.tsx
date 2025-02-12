import type React from "react";
import { Icons } from "~/components/icons";
import { Loading } from "~/components/molecular/loading";
import { Pagination } from "~/components/pagination";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { Typography } from "~/components/ui/typography";
import { useNuqsPagination } from "~/hooks/use-nuqs-pagination";
import { api } from "~/trpc/react";
import dayjs from "~/utils/date/dayjs";

interface ComplaintsPaginatorProps {
  profileId?: string;
  postId?: string;
}

export const ComplaintsPaginator: React.FC<ComplaintsPaginatorProps> = ({
  profileId,
  postId,
}) => {
  const { page, setPage, perPage, setPerPage } = useNuqsPagination();

  const complaintsPaginator = api.complaint.paginate.useQuery(
    {
      profileId,
      postId,

      page,
      perPage: 10,
    },
    { enabled: !!profileId || !!postId },
  );

  if (complaintsPaginator.isLoading) {
    return <Loading size="xl" className="mx-auto" />;
  }

  if (complaintsPaginator.data === undefined) {
    return null;
  }

  return (
    <Container className="gap-2 px-0  ">
      {complaintsPaginator.data.complaints.length === 0 && (
        <Typography.P>Nenhuma reclamação encontrada</Typography.P>
      )}

      {complaintsPaginator.data.complaints.map((complaint) => (
        <Card key={complaint.id}>
          <CardHeader className="p-2">
            <CardDescription>{complaint.description}</CardDescription>
          </CardHeader>

          <CardFooter className="p-2 text-muted-foreground flex flex-wrap gap-1 items-start text-xs">
            <p>{dayjs(complaint.createdAt).format("DD/MM/YYYY HH:mm")}</p>
            <p>{dayjs(complaint.createdAt).fromNow()}</p>
          </CardFooter>
        </Card>
      ))}

      {complaintsPaginator.data.complaints.length > 0 && (
        <Pagination
          totalItems={complaintsPaginator.data.total}
          currentPage={page}
          perPage={10}
          onPageChange={setPage}
        />
      )}
    </Container>
  );
};
