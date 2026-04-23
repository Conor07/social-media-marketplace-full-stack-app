import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthUser {
  userId: string;
  username: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  token,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  { userId: string; username: string; token: string },
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post("/auth/login", { username, password });

    return res.data;
  } catch (err) {
    const error = axios.isAxiosError(err)
      ? err.response?.data?.message
      : "Login failed";

    return rejectWithValue(error || "Login failed");
  }
});

export const register = createAsyncThunk<
  { userId: string; username: string; token: string },
  LoginPayload,
  { rejectValue: string }
>("auth/register", async ({ username, password }, { rejectWithValue }) => {
  try {
    await axios.post("/auth/register", { username, password });

    const res = await axios.post("/auth/login", { username, password });

    return res.data;
  } catch (err) {
    const error = axios.isAxiosError(err)
      ? err.response?.data?.message
      : "Register failed";

    return rejectWithValue(error || "Register failed");
  }
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await axios.get("/auth/me");
      dispatch(setCredentials({ user: res.data, token }));
    } catch {
      dispatch(logout());
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;

      state.token = null;

      localStorage.removeItem("token");

      localStorage.removeItem("user");
    },
    setCredentials(state, action) {
      state.user = action.payload.user;

      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";

        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.user = {
          userId: action.payload.userId,
          username: action.payload.username,
        };

        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";

        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";

        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.user = {
          userId: action.payload.userId,
          username: action.payload.username,
        };

        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";

        state.error = (action.payload as string) || "Register failed";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
