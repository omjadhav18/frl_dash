import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

// ------------------ Types ------------------

interface LoginResponse {
  access: string;
  refresh: string;
}

interface RegisterResponse {
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

interface DecodedToken {
  exp: number;
  user_id?: number;
  [key: string]: any; // allow extra JWT fields
}

// ------------------ Toast ------------------

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// ------------------ Auth Functions ------------------

export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const { data, status } = await axios.post<LoginResponse>("accounts/login/", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.access, data.refresh);

      Toast.fire({
        icon: "success",
        title: "Login Successful",
      });
    }

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.detail || "Invalid email or password",
    };
  }
};

export const register = async (
  email: string,
  full_name: string,
  password: string
): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const { data } = await axios.post<RegisterResponse>("accounts/admin/register/", {
      email,
      full_name,
      password,
    });

    // Auto-login after registration
    await login(email, password);

    Toast.fire({
      icon: "success",
      title: "Account Created Successfully",
    });

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

export const logout = (): void => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().setUser(null);

  Toast.fire({
    icon: "info",
    title: "Logged out successfully",
  });
};

export const setUser = async (): Promise<void> => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return;
  }

  if (isAccessTokenExpired(accessToken)) {
    try {
      const response = await getRefreshToken();
      setAuthUser(response.access, response.refresh);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

export const setAuthUser = (
  access_token: string,
  refresh_token: string
): void => {
  Cookies.set("access_token", access_token, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });

  Cookies.set("refresh_token", refresh_token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });

  const user: DecodedToken | null = jwtDecode<DecodedToken>(access_token) ?? null;

  if (user) {
    useAuthStore.getState().setUser(user);
  }

  useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async (): Promise<LoginResponse> => {
  const refresh_token = Cookies.get("refresh_token");

  if (!refresh_token) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post<LoginResponse>("refresh/", {
    refresh: refresh_token,
  });

  return response.data;
};

export const isAccessTokenExpired = (accessToken: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(accessToken);
    return decodedToken.exp < Date.now() / 1000; // exp is in seconds
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
