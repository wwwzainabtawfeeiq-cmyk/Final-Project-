import API from "./api";

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);

  if (response.data?.token) {
    localStorage.setItem("bf_token", response.data.token);
    localStorage.setItem("token", response.data.token);

    const user = response.data.user || response.data.data || null;

    if (user) {
      localStorage.setItem("bf_user", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);

  if (response.data?.token) {
    localStorage.setItem("bf_token", response.data.token);
    localStorage.setItem("token", response.data.token);

    const user = response.data.user || response.data.data || null;

    if (user) {
      localStorage.setItem("bf_user", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("bf_token");
  localStorage.removeItem("token");
  localStorage.removeItem("bf_user");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user =
    localStorage.getItem("bf_user") ||
    localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};
