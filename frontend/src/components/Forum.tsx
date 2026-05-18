import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link } from "react-router-dom"
import { getForums } from "@/services/forums";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Forum(){
    const [forums, setForums] = useState<Array<{id: string; title: string; creator: string; created_at: string;}>>([]);

    const handleFetchForums = async () => {
        try {
        const data = await getForums();
            setForums(data);
        } catch (error) {
            toast.error(`Error fetching forums: ${error}`);
        }
    };

    useEffect(() => {
        handleFetchForums();
    }, []);

    return (
        <div>
            <Table className="w-9/10 mx-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {forums.map((forum) => (
                        <TableRow key={forum.id} className="hover:bg-gray-50 cursor-pointer">
                            <TableCell>
                                <Link
                                    to={`/forum/${forum.id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                    {forum.title}
                                </Link>
                            </TableCell>
                            <TableCell>{forum.creator}</TableCell>
                            <TableCell>{new Date(forum.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Forum;