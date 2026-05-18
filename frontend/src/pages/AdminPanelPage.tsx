import Footer from "@/components/Foooter";
import Menu from "@/components/Menu";
import { createColumns, type Users } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { forumColumns, type Forums } from "@/components/forum-columns";
import { ForumDataTable } from "@/components/forum-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import {  getForums } from "../services/forums";

function AdminPanelPage() {
    const [userData, setUserData] = useState<Users[]>([]);
    const [forumData, setForumData] = useState<Forums[]>([]);

    const fetchUsers = async () => {
        try {
            const users = await getUsers();
            console.log("Fetched users:", users);
            setUserData(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchForums = async () => {
        try {
            const forums = await getForums();
            console.log("Fetched forums:", forums);
            setForumData(forums);
        } catch (error) {
            console.error("Error fetching forums:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchForums();
    }, []);

    const userColumns = createColumns(fetchUsers);




    return (
        <div className='w-full h-screen flex flex-col gap-4 p-4 bg-gray-50 overflow-hidden'> 
            <Menu />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs defaultValue="users" className="w-full flex flex-col flex-1 overflow-hidden">
                    <TabsList className="grid w-full grid-cols-2 max-w-md shrink-0">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="forums">Forums</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users" className="flex-1 overflow-hidden">
                        <DataTable columns={userColumns} data={userData} onUserUpdated={fetchUsers} />
                    </TabsContent>
                    <TabsContent value="forums" className="flex-1 overflow-hidden">
                        <ForumDataTable columns={forumColumns} data={forumData} isAdmin={true} onForumCreated={fetchForums} />
                    </TabsContent>
                </Tabs>
            </div>

            <Footer  />
        </div>
    )
}

export default AdminPanelPage;