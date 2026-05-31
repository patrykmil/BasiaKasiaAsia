import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);

    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error(
        "Twoje konto zostało zablokowane. Skontaktuj się z administratorem.",
      );
    }

    throw error;
  }
}

export async function register(
  email: string,
  password: string,
  username: string,
  date_of_birth: Date | undefined,
  gender: string,
  role_id: number = 1,
) {
  try {
    const response = await axios.post(`${apiBaseUrl}/api/auth/register`, {
      username: username,
      email: email,
      password: password,
      date_of_birth: date_of_birth,
      gender: gender,
      role_id: role_id,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export async function logout() {
  const token = sessionStorage.getItem("refreshToken");
  const response = await axios.post(`${apiBaseUrl}/api/auth/logout`, {
    token: JSON.parse(token || "null"),
  });
  return response.data;
}
