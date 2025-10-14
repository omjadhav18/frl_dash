import Cookies from "js-cookie";
import { create } from "zustand";

// ------------------ Types ------------------

export interface UserData {
  user_id: string | null;
  username: string | null;
  [key: string]: any; // allow extra fields if backend adds more
}

interface AuthState {
  allUserData: UserData | null;
  loading: boolean;

  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
  getUser: () => UserData;
}

// ------------------ Store ------------------

const useAuthStore = create<AuthState>((set, get) => ({
  allUserData: JSON.parse(Cookies.get("userData") || "null"),
  loading: false,

  setUser: (user: UserData | null) => {
    if (user) {
      Cookies.set("userData", JSON.stringify(user), { expires: 7 });
    } else {
      Cookies.remove("userData");
    }
    set({ allUserData: user });
  },

  setLoading: (loading: boolean) => set({ loading }),

  isLoggedIn: () => get().allUserData !== null,

  getUser: () => ({
    user_id: get().allUserData?.user_id ?? null,
    username: get().allUserData?.username ?? null,
  }),
}));

export { useAuthStore };
