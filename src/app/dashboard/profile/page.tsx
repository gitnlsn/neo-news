"use client";

import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loading } from "~/components/molecular/loading";
import { Pagination } from "~/components/pagination";
import { PrivateLayout } from "~/components/private-layout";
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
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import PageHeader from "~/components/ui/page-header";
import { SidebarTrigger } from "~/components/ui/sidebar";
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

export default function PaginatePost() {
  const router = useRouter();
  const { page, setPage, perPage, setPerPage } = useNuqsPagination();

  const profilesQuery = api.profile.paginate.useQuery({
    page,
    perPage,
  });

  const deleteProfile = api.profile.delete.useMutation();

  return (
    <PrivateLayout>
      <div className="py-4 flex flex-row gap-4 items-center">
        <SidebarTrigger />
        <PageHeader
          breadcrumbItems={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "Perfil", link: "/dashboard/profile" },
          ]}
        />
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <Typography.H3>Seus Perfis</Typography.H3>
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/profile/create")}
        >
          <PlusIcon />
          Novo perfil
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <p>Título</p>
            </TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profilesQuery.data?.profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell className="font-medium">
                <p>{profile.title}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p>
                    {dayjs(profile.createdAt).format("DD/MM/YYYY [às] HH[h]mm")}
                  </p>
                  <p>{dayjs(profile.createdAt).fromNow()}</p>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>

                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/profile/${profile.id}`)
                      }
                    >
                      Editar
                    </DropdownMenuItem>

                    <Dialog>
                      <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 disabled:opacity-50">
                        Deletar
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>
                          Tem certeza de que quer deletar o perfil?
                        </DialogTitle>
                        <DialogDescription>
                          Esta ação não pode ser desfeita.
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              onClick={() => {
                                deleteProfile.mutate(
                                  { profileId: profile.id },
                                  {
                                    onSuccess: () => {
                                      toast.success(
                                        "Perfil deletado com sucesso",
                                      );
                                      profilesQuery.refetch();
                                    },
                                    onError: () => {
                                      toast.error("Falha ao deletar perfil");
                                    },
                                  },
                                );
                              }}
                            >
                              Deletar
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          {profilesQuery.isLoading && (
            <TableRow>
              <TableCell colSpan={3}>
                <Loading size="xl" className="mx-auto" />
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>
              <Pagination
                currentPage={page}
                totalItems={profilesQuery.data?.total ?? 0}
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
