"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

    try {
        const res = await fetch("http://localhost:5002/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
        setError(data.message || "Error al registrar");
        return;
    }
    
        setSuccess("Usuario registrado correctamente!");
        localStorage.setItem("nombre", data.user.name);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("token", data.token);
        setTimeout(() => {
        router.push("/");
        }, 1500);

    } catch (err) {
    setError("Error del servidor");
    console.error("Error:", err);
    }
};

    return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-black">
        <h1 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
            />
        <input
            type="text"
            name="lastname"
            placeholder="Apellido"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
        />
        <input
            type="email"
            name="email"
            placeholder="Correo"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
        />
        <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
        />
        <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
        />
        {form.confirmPassword && form.password !== form.confirmPassword && (
        <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
        )}
        <button
            type="submit"
            disabled={
                !form.name ||
                !form.lastname ||
                !form.email ||
                !form.password ||
                !form.confirmPassword ||
                form.password !== form.confirmPassword
            }
        className={`w-full py-2 rounded text-white transition-all ${
            !form.name ||
            !form.lastname ||
            !form.email ||
            !form.password ||
            !form.confirmPassword ||
            form.password !== form.confirmPassword
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        >
        Registrarse
        </button>    

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        </form>
        <p className="text-center text-sm mt-4">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-500 underline">
            Iniciar sesión
            </a>
        </p>
        </div>
    </div>
    );
}