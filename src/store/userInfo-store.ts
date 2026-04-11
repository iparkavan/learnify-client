import { UserInfoProfileType } from "@/types/auth-types";
import { create } from "zustand";

// Zustand store state
interface UserState {
  user: UserInfoProfileType | null;
  setUser: (user: UserInfoProfileType) => void;
  updateStudentProfile: (
    studentProfile: UserInfoProfileType["studentProfile"],
  ) => void;
  clearUser: () => void;
}

export const useUserInfoStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateStudentProfile: (studentProfile) =>
    set((state) => ({
      user: state.user ? { ...state.user, studentProfile } : state.user,
    })),
  clearUser: () => set({ user: null }),
}));
