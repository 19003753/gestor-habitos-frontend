"use client";
import { useState } from "react";

export default function CreateHabitForm({ onSuccess }: { onSuccess?: () => void }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Usuario no autenticado.");
      return;
    }

    const nuevoHabito = { nombre, descripcion, usuario: userId };

    try {
      const res = await fetch("http://localhost:5002/habitos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoHabito),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al crear hábito");
        return;
      }

      setMensaje("Hábito creado con éxito.");
      setError("");
      setNombre("");
      setDescripcion("");

      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Error en el servidor");
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md mb-6 text-black">
      <h2 className="text-xl font-bold mb-4 text-center">Crear Nuevo Hábito</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del hábito"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={!nombre || !descripcion}
          className={`w-full py-2 rounded text-white transition-all ${
            !nombre || !descripcion
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Crear Hábito
        </button>
        {mensaje && <p className="text-green-500 text-sm text-center">{mensaje}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}