"use client";

import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PrivateLayout } from "~/components/layout/private-layout";
import { Loading } from "~/components/molecular/loading";
import { Pagination } from "~/components/pagination";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import PageHeader from "~/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Typography } from "~/components/ui/typography";
import { useNuqsPagination } from "~/hooks/use-nuqs-pagination";
import { api } from "~/trpc/react";
import dayjs from "~/utils/date/dayjs";

export default function ComplaintPage() {
  const router = useRouter();
  const { page, setPage, perPage, setPerPage } = useNuqsPagination();

  const complaintsQuery = api.complaint.paginate.useQuery({
    page,
    perPage,
  });

  return (
    <PrivateLayout>
      <PageHeader
        breadcrumbItems={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Reclamações", link: "/dashboard/complaint" },
        ]}
      />

      <div className="flex flex-row items-center justify-between gap-4">
        <Typography.H3>Reclamações</Typography.H3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Título do post/perfil</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaintsQuery.data?.complaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell>
                <p className="line-clamp-6 max-w-sm w-fit">
                  {complaint.description}
                </p>
              </TableCell>
              <TableCell>
                <p>{complaint.post?.title}</p>
                <p>{complaint.profile?.title}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p>
                    {dayjs(complaint.createdAt).format(
                      "DD/MM/YYYY [às] HH[h]mm",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dayjs(complaint.createdAt).fromNow()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Abrir menu de ações"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>

                    {complaint.postId && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/post/${complaint.postId}`)
                        }
                      >
                        Ir para post
                      </DropdownMenuItem>
                    )}

                    {complaint.profileId && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/profile/${complaint.profileId}`,
                          )
                        }
                      >
                        Ir para perfil
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          {complaintsQuery.isLoading && (
            <TableRow>
              <TableCell colSpan={4}>
                <Loading size="xl" className="mx-auto" />
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={4}>
              <Pagination
                currentPage={page}
                totalItems={complaintsQuery.data?.total ?? 0}
                onPageChange={(page) => setPage(page)}
                perPage={perPage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </PrivateLayout>
  );
}
