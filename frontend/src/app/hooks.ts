import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAuth = () => {
  const { user, token, status } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;
  const isLoading = status === "loading";

  return { user, token, isAuthenticated, isLoading };
};
