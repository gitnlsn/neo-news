"use client";

import { LinkIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import Link from "next/link";
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
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import PageHeader from "~/components/ui/page-header";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Typography } from "~/components/ui/typography";
import { env } from "~/env";
import { useNuqsPagination } from "~/hooks/use-nuqs-pagination";
import { api } from "~/trpc/react";
import dayjs from "~/utils/date/dayjs";

export default function PaginatePost() {
  const router = useRouter();
  const { page, setPage, perPage, setPerPage } = useNuqsPagination();

  const postsQuery = api.post.paginate.useQuery({
    page,
    perPage,
  });

  const deletePost = api.post.delete.useMutation();

  const togglePublishStatus = api.post.togglePublishStatus.useMutation();

  return (
    <PrivateLayout>
      <PageHeader
        breadcrumbItems={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Posts", link: "/dashboard/post" },
        ]}
      />

      <div className="flex flex-row gap-4 items-center justify-between">
        <Typography.H3>Meus posts</Typography.H3>
        <Button size="sm" onClick={() => router.push("/dashboard/post/create")}>
          <PlusIcon />
          Novo post
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <p>Título</p>
              <p>(perfil)</p>
            </TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead>Publicado</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {postsQuery.data?.posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <p>{post.title}</p>
                <p>({post.profile.title})</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p>
                    {dayjs(post.createdAt).format("DD/MM/YYYY [às] HH[h]mm")}
                  </p>
                  <p>{dayjs(post.createdAt).fromNow()}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2 items-center">
                  <Switch
                    checked={post.isPublished}
                    onCheckedChange={() => {
                      togglePublishStatus.mutate(
                        { postId: post.id },
                        {
                          onSuccess: (data) => {
                            toast.success(
                              data.isPublished
                                ? "Publicação foi publicada com sucesso"
                                : "Publicação foi removida com sucesso",
                            );
                            postsQuery.refetch();
                          },
                          onError: (error) => {
                            toast.error(error.message);
                          },
                        },
                      );
                    }}
                  />
                  {post.isPublished && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/post/${post.slug}`,
                              );
                              toast.success("Link copiado para clipboard");
                            }}
                          >
                            <LinkIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Abrir em nova aba</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
                      onClick={() => router.push(`/dashboard/post/${post.id}`)}
                    >
                      Editar
                    </DropdownMenuItem>

                    <Dialog>
                      <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 disabled:opacity-50">
                        Deletar
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>
                          Tem certeza de que quer deletar o post?
                        </DialogTitle>
                        <DialogDescription>
                          Esta ação não pode ser desfeita.
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              onClick={() => {
                                deletePost.mutate(
                                  { postId: post.id },
                                  {
                                    onSuccess: () => {
                                      toast.success(
                                        "Post deletado com sucesso",
                                      );
                                      postsQuery.refetch();
                                    },
                                    onError: () => {
                                      toast.error("Falha ao deletar post");
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
          {postsQuery.isLoading && (
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
                totalItems={postsQuery.data?.total ?? 0}
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
