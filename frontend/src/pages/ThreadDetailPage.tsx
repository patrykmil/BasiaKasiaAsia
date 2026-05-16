import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import Menu from "@/components/Menu";
import Footer from "@/components/Foooter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { getThreadById } from '@/services/threads';
import AsiaImg from "../assets/img/Asia.jpg";
import { getCommentsByThreadId, createComment } from '@/services/comments';

interface Comment {
    id: number;
    username: string;
    date: string;
    avatar: string;
    content: string;
}


function ThreadDetailPage() {
    const { id, threadId } = useParams<{ id: string; threadId: string }>();
    const [newComment, setNewComment] = useState("");
    const [thread, setThread] = useState<{ id: number; title: string; description: string, author: string, date: string }>();
    const navigate = useNavigate();

    const handleFetchThread = useCallback(async () => {
        try{
            const fetchedThread = await getThreadById(Number(threadId));
            console.log("Fetched thread:", fetchedThread);
            setThread(fetchedThread);
        } catch (error) {
            toast.error(`Error fetching thread: ${error}`);
        }
    }, [threadId]);

    const handleFetchComments = useCallback(async () => {
        try {
            const fetchedComments = await getCommentsByThreadId(Number(threadId));
            console.log("Fetched comments:", fetchedComments);
            setComments(Array.isArray(fetchedComments) ? fetchedComments : []);
        } catch (error) {
            toast.error(`Error fetching comments: ${error}`);
            setComments([]);
        }
    }, [threadId]);

    useEffect(() => {
        handleFetchThread();
        handleFetchComments();
    }, [handleFetchThread, handleFetchComments]);
    
    const [comments, setComments] = useState<Comment[]>([]);

    const handlePostComment = async () => {
        if (!newComment.trim()) {
            toast.warning("Please enter a comment before posting");
            return;
        }

        try {
            await createComment(Number(threadId), newComment);
            
            // Refresh comments after posting
            await handleFetchComments();
            
            // Clear the textarea
            setNewComment("");
            
            // Show success message
            toast.success("Comment posted successfully!");
        } catch (error) {
            toast.error(`Failed to post comment: ${error}`);
        }
    };

    const handleCancel = () => {
        setNewComment("");
        toast.info("Comment cancelled");
    };

    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'>
            <Menu />
            
            <div className="container mx-auto max-w-4xl flex-1">
                {/* Thread Header */}
                <div className="mb-4">
                    <Button variant="outline" onClick={() => navigate(`/forum/${id}`)}>
                        ← Back to Threads
                    </Button>
                </div>

                {/* Main Thread Post */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
                    <h1 className="text-2xl font-bold mb-4">{thread?.title}</h1>
                    
                    <div className="flex items-start space-x-3 mb-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={AsiaImg} alt={thread?.author} />
                            <AvatarFallback>{thread?.author?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">{thread?.author}</span>
                                <span className="text-gray-500 text-sm">• {thread?.date}</span>
                            </div>
                            
                            <p className="text-gray-700 mt-3 leading-relaxed">
                                {thread?.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Comments ({comments.length})
                    </h2>
                    
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
                            <div className="flex items-start space-x-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={comment.avatar} alt={comment.username} />
                                    <AvatarFallback>{comment.username?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-semibold text-gray-900">{comment.username}</span>
                                        <span className="text-gray-500 text-sm">• {comment.date}</span>
                                    </div>
                                    
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New Comment Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold mb-3">Add a Comment</h3>
                    
                    <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="/src/assets/img/default-user.svg" alt="Your avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                            <Textarea 
                                placeholder="Write your comment..." 
                                className="min-h-[100px] mb-3 resize-none"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            
                            <div className="flex justify-end space-x-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleCancel}
                                    disabled={!newComment.trim()}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={handlePostComment}
                                    disabled={!newComment.trim()}
                                >
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ThreadDetailPage;
