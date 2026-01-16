import { StudentProfile, UserInfoProfileType } from "@/types/auth-types";
import { UserInfoType } from "@/types/user-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand store state
interface UserState {
  user: UserInfoProfileType | null;
  setUser: (user: UserInfoProfileType) => void;
  updateStudentProfile: (
    studentProfile: UserInfoProfileType["studentProfile"]
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
