"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchHabitsThunk } from "../store/habitsSlice";
import Habits from "@/app/habits";
import CreateHabitForm from "@/app/createHabit/CreateHabitForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [nombre, setNombre] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("nombre");

    if (!token || !userName) {
      router.push("/login");
    } else {
      setNombre(userName);
      dispatch(fetchHabitsThunk());
    }

    setIsCheckingAuth(false);
  }, [dispatch, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  if (isCheckingAuth) return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-12 px-4 space-y-6">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm shadow"
      >
        Cerrar sesión
      </button>
      {nombre && (
        <h1 className="text-xl font-bold text-black">Hola, {nombre}</h1>
      )}
      <CreateHabitForm onSuccess={() => dispatch(fetchHabitsThunk())} />
      <Habits />
    </div>
  );
}