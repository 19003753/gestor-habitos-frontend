import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  id: string | null;
  name: string;
  lastname: string;
  email: string;
  token: string | null;
};

const initialState: UserState = {
  id: null,
  name: "",
  lastname: "",
  email: "",
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, name, lastname, email, token } = action.payload;
      state.id = id;
      state.name = name;
      state.lastname = lastname;
      state.email = email;
      state.token = token;
    },
    logoutUser(state) {
      state.id = null;
      state.name = "";
      state.lastname = "";
      state.email = "";
      state.token = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;