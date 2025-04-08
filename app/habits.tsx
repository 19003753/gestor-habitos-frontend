"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "../store/store";
import { updateStreakThunk, fetchHabitsThunk } from "../store/habitsSlice";
import ProgressBar from "@/components/ProgressBar";

type Habit = {
  _id: string;
  nombre: string;
  descripcion: string;
  usuario: string;
  racha: number;
  lastupdate: string;
};

export default function Habits() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const habits = useSelector((state: RootState) => state.habits.habits);

  const [updatedHabits, setUpdatedHabits] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(fetchHabitsThunk());
    }
  }, [dispatch, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleMarkAsDone = async (habitId: string) => {
    try {
      const response = await dispatch(updateStreakThunk(habitId)).unwrap();

      if (response.racha !== undefined) {
        setUpdatedHabits((prev) => ({
          ...prev,
          [habitId]: "success",
        }));
      } else {
        setUpdatedHabits((prev) => ({
          ...prev,
          [habitId]: "warning",
        }));
      }

      dispatch(fetchHabitsThunk());
    } catch (error) {
      console.error("Error al actualizar el hábito");
      console.error(error);
    }
  };

  const handleDeleteHabit = async (habit: Habit) => {
    const porcentaje = ((habit.racha / 66) * 100).toFixed(2);
  
    const confirmar = window.confirm(
      `¿Estás seguro que deseas eliminar el hábito?\n\n` +
      `Nombre: ${habit.nombre}\n` +
      `Descripción: ${habit.descripcion}\n` +
      `Racha: ${habit.racha} de 66 días (${porcentaje}% completado.)\n`
    );
  
    if (!confirmar) return;
  
    try {
      const res = await fetch(`http://localhost:5002/habitos/eliminar/${habit._id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Error al eliminar el hábito");
  
      dispatch(fetchHabitsThunk());
    } catch (err) {
      console.error("Error al eliminar");
      console.error(err);
    }
  };

  if (!isClient) return null;

  return (
    <div className="w-full max-w-md p-4 bg-white text-black rounded-lg shadow-md mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Lista de Hábitos</h1>
      <ul className="space-y-4">
  {habits.length === 0 ? (
    <p className="text-gray-500 text-sm text-center">No hay hábitos por el momento.</p>
  ) : (
    habits.map((habit) => (
      <li
        className="flex justify-between items-start gap-4 p-4 bg-gray-50 rounded shadow-sm"
        key={habit._id}
      >
        {/* left */}
        <div className="flex-1 text-left">
          <span className="text-black font-semibold">{habit.nombre} </span>
          <span className="text-gray-500 text-sm">/ {habit.descripcion}</span>
          <p className="text-gray-500 text-sm">Racha: {habit.racha} de 66 días</p>
          <p className="text-gray-400 text-xs">
            Última actualización: {formatDate(habit.lastupdate)}
          </p>

          <ProgressBar progress={(habit.racha / 66) * 100} />

          {updatedHabits[habit._id] === "success" && (
            <p className="text-green-500 text-sm mt-1">
              Hábito actualizado. Nos vemos mañana!
            </p>
          )}
          {updatedHabits[habit._id] === "warning" && (
            <p className="text-yellow-500 text-sm mt-1">
              No se puede actualizar el hábito el mismo día.
            </p>
          )}
        </div>

        {/* right */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleMarkAsDone(habit._id)}
            className={`px-2 py-1 text-sm text-white rounded transition-all ${
              updatedHabits[habit._id]
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={updatedHabits[habit._id] !== undefined}
          >
            Hecho
          </button>

          <button
            onClick={() => handleDeleteHabit(habit)}
            className="px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Eliminar
          </button>
        </div>
      </li>
    ))
  )}
</ul>
    </div>
  );
}