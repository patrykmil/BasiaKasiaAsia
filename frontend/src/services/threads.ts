import api from "./api";

export async function createThread(forumId: number, title: string, description: string) {
    const response = await api.post(`/threads`, { title: title, description: description, forum_id: forumId });
    return response.data;
}

export async function getThreadById(threadId: number) {
    const response = await api.get(`/threads/${threadId}`);
    return response.data;
}