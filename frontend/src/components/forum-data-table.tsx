import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createForum } from "@/services/forums";

interface ForumDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isAdmin?: boolean;
  onForumCreated?: () => void;
}

export function ForumDataTable<TData, TValue>({
  columns,
  data,
  isAdmin = false,
  onForumCreated,
}: ForumDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [forumTitle, setForumTitle] = useState("");
  const [forumDescription, setForumDescription] = useState("");

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      columnFilters,
    },
  });

  const handleCreateForum = async () => {
    try {
      if (!forumTitle.trim()) {
        toast.warning("Forum title is required");
        return;
      }

      // Here you would call the API to create a new forum
      console.log("Creating forum:", { title: forumTitle, description: forumDescription });

      await createForum(forumTitle, forumDescription);

      toast.success("Forum created successfully!");
      
      // Reset form and close dialog
      setForumTitle("");
      setForumDescription("");
      setIsDialogOpen(false);
      
      // Trigger refresh
      if (onForumCreated) {
        onForumCreated();
      }
    } catch (error) {
      toast.error(`Error creating forum: ${error}`);
    }
  };

  return (
    <div className="rounded-md border px-2 bg-white">
      <div className="flex items-center py-4 px-2">
        <Input
          placeholder="Filter forums..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto">Add New Forum</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Forum</CardTitle>
                  <CardDescription>
                    Add a new forum category for discussions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forum-title">Forum Title</Label>
                    <Input
                      id="forum-title"
                      placeholder="Enter forum title"
                      value={forumTitle}
                      onChange={(e) => setForumTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="forum-description">Description</Label>
                    <Textarea
                      id="forum-description"
                      placeholder="Enter forum description"
                      value={forumDescription}
                      onChange={(e) => setForumDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateForum}>
                    Create Forum
                  </Button>
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No forums found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
