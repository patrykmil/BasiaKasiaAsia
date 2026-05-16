import Menu from "@/components/Menu";
import Footer from "@/components/Foooter";
import Forum from "@/components/Forum";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { createForum } from "@/services/forums";

function ForumPage() {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [forumTitle, setForumTitle] = useState("");
    const [forumDescription, setForumDescription] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);


    const handleCreateForum =  async () => {
        if (!forumTitle.trim()) {
            toast.warning("Forum title is required");
            return;
        }

        try {
            await createForum(forumTitle, forumDescription);
            toast.success("Forum created successfully!");
            
            setForumTitle("");
            setForumDescription("");
            setIsDialogOpen(false);
            
            // Trigger refresh of forums list
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            toast.error("Failed to create forum");
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'>
            <Menu />    
            <div className="bg-[url(/src/assets/img/background.svg)] flex-1 p-4">
                <Card className="w-9/10 mx-auto bg-white/95">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold mb-2">Community Forums</CardTitle>
                                <CardDescription className="text-gray-600">
                                    Browse and participate in discussions across various topics and categories.
                                </CardDescription>
                            </div>
                            {auth.role === "admin" && (
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add New Forum</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-lg">
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
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Forum key={refreshKey} />
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    )
}

export default ForumPage;