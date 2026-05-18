import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
export type Forums = {
  id: string
  title: string
  description?: string
  creator: string
  created_at: string
}

export const forumColumns: ColumnDef<Forums>[] = [
  {
    accessorKey: "title",
    header: "Forum Title",
    cell: ({ row }) => {
      return (
        <Link 
          to={`/forum/${row.original.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {row.getValue("title")}
        </Link>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | undefined;
      return (
        <div className="max-w-md truncate">
          {description || "No description"}
        </div>
      )
    },
  },
  {
    accessorKey: "creator",
    header: "Created By",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: () => {
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit Forum</DropdownMenuItem>
            <DropdownMenuItem>Delete Forum</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
