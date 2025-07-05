'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const labels = {
  vegetales: 'vegetal',
  semillas: 'semilla',
  proteinas: 'proteína',
  aderezos: 'aderezo'
};

export default function CreateConstantePage() {
  const router = useRouter();
  const { tipo } = useParams();
  const label = labels[tipo] || tipo;

  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const trimmed = nombre.trim();
    if (!trimmed) {
      setError('El nombre no puede estar vacío.');
      return;
    }

    const res = await fetch(`/api/admin/constantes/${tipo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed })
    });

    if (res.ok) {
      router.push('/admin/constantes');
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  return (
    <main className="p-8 flex justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">
          Agregar {label}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>
          )}

          <div>
            <label className="block text-gray-700 mb-1">
              Nuevo nombre:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition cursor-pointer"
            >
              Crear
            </button>
            <Link
              href="/admin/constantes"
              className="flex-1 text-center bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}