import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { banUser, unbanUser } from "@/services/users"
import { toast } from "sonner"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  user_id: number
  username: string
  email: string
  date_of_birth?: string
  gender: "male" | "female" | "other"
  role: "admin" | "user"
  is_banned: boolean
}

export const createColumns = (onUserUpdated?: () => void): ColumnDef<Users>[] => [

  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "is_banned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.getValue("is_banned") as boolean;
      return (
        <span className={isBanned ? "text-red-600 font-semibold" : "text-green-600"}>
          {isBanned ? "Banned" : "Active"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
 
      const handleBanToggle = async () => {
        try {
          if (user.is_banned) {
            await unbanUser(user.user_id);
            toast.success(`User ${user.username} has been unbanned`);
          } else {
            await banUser(user.user_id);
            toast.success(`User ${user.username} has been banned`);
          }
          // Trigger data refresh
          if (onUserUpdated) {
            onUserUpdated();
          }
        } catch (error) {
          toast.error(`Failed to ${user.is_banned ? 'unban' : 'ban'} user: ${error}`);
        }
      };

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
            <DropdownMenuItem onClick={handleBanToggle}>
              {user.is_banned ? "Unban User" : "Ban User"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

// Default columns export for backward compatibility
export const columns = createColumns();