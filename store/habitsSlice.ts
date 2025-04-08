import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type Habit = {
  _id: string;
  nombre: string;
  descripcion: string;
  usuario: string;
  racha: number; 
  lastupdate: string;
};

type HabitsState = {
  habits: Habit[];
};

const initialState: HabitsState = {
  habits: [],
};

//get habits list
export const fetchHabitsThunk = createAsyncThunk("habits/fetchHabits", async () => {
  const userId = localStorage.getItem("userId");
  const response = await fetch(`http://localhost:5002/habitos/${userId}`);
  return await response.json();
});

//update streak
export const updateStreakThunk = createAsyncThunk(
  "habits/updateStreak",
  async (habitId: string) => {
    const response = await fetch(`http://localhost:5002/habitos/marcar/${habitId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Error al actualizar la racha");

    return await response.json();
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    //save habits list
    builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
      state.habits = action.payload;
    });

    //save updated streak
    builder.addCase(updateStreakThunk.fulfilled, (state, action) => {
      const index = state.habits.findIndex(h => h._id === action.payload._id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    });
  },
});

export default habitsSlice.reducer;