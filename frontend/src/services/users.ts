import api from "./api";

export async function getUsers() {
    const response = await api.get("/users");
    return response.data;
}

export async function banUser(userId: number) {
    const response = await api.post(`/users/${userId}/ban`);
    return response.data;
}

export async function unbanUser(userId: number) {
    const response = await api.post(`/users/${userId}/unban`);
    return response.data;
}