import axios from "axios";

export async function login(email: string, password: string) {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/login", {
      "email": email,
      "password": password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    
    // Check if it's a ban error (403)
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error("Twoje konto zostało zablokowane. Skontaktuj się z administratorem.");
    }
    
    // For other errors, throw the original error
    throw error;
  }
}

export async function register(email: string, password: string, username: string, date_of_birth: Date | undefined, gender: string, role_id: number = 1) {
  const response = await axios.post("http://localhost:8000/api/auth/register", {
    "username": username,
    "email": email,
    "password": password,
    "date_of_birth": date_of_birth,
    "gender": gender,
    "role_id": role_id,
  });
  return response.data;
}

export async function logout() {
  const token = sessionStorage.getItem("refreshToken");
  console.log("Logging out with token:", token);
  const response = await axios.post(
    "http://localhost:8000/api/auth/logout",
    {
      "token": JSON.parse(token || "null"),
    }
  );
  return response.data;
}