import api from "./api";

export async function getCommentsByThreadId(threadId: number) {
    const response = await api.get(`/threads/${threadId}/comments`);
    return response.data;
}

export async function createComment(threadId: number, content: string) {
    const response = await api.post('/comments', {
        thread_id: threadId,
        content: content,
    });
    return response.data;
}