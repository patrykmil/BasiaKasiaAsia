import api from "./api";

export async function getForums() {
    const response = await api.get("/forums");
    return response.data;
}

export async function getForumsById(forumId: number) {
    const response = await api.get(`/forums/${forumId}`);
    return response.data;
}

export async function getThreadsByForumId(forumId: number) {
    const response = await api.get(`/forums/${forumId}/threads`);
    return response.data;
}

export async function createForum(title: string, description: string) {
    const response = await api.post("/forums", { title, description });
    return response.data;
}