'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const tipos = [
  { key: 'vegetales', label: '🍅 Vegetal' },
  { key: 'proteinas', label: '🍗 Proteína' },
  { key: 'semillas', label: '🌻 Semilla' },
  { key: 'aderezos', label: '🥫 Aderezo' },
];

export default function IngredientesPage() {
  const [constantes, setConstantes] = useState({
    vegetales: [], semillas: [], proteinas: [], aderezos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/constantes')
      .then(res => res.json())
      .then(data => setConstantes(data))
      .catch(() => {
        alert('No se pudieron cargar los ingredientes.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Cargando ingredientes…</p>;
  }

  const renderRows = (items, label, tipo) =>
    items.map(item => (
      <tr key={`${tipo}-${item._id}`} className="hover:bg-gray-50">
        <td className="px-4 py-2">{label}</td>
        <td className="px-4 py-2">{item.name}</td>
        <td className="px-4 py-2 text-right space-x-2">
          {/* 📝 Editar */}
          <Link
            href={`/admin/constantes/${tipo}/edit/${encodeURIComponent(item.name)}`}
            className="text-green-700 text-xl hover:text-green-800"
            title="Editar ingrediente"
          >
            📝
          </Link>
          {/* 🗑️ Eliminar */}
          <button
            onClick={async () => {
              if (!confirm(`¿Eliminar ${item.name}?`)) return;
              const res = await fetch(`/api/admin/constantes/${tipo}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: item.name })
              });
              if (res.ok) {
                setConstantes(prev => ({
                  ...prev,
                  [tipo]: prev[tipo].filter(i => i.name !== item.name)
                }));
              } else {
                const { error } = await res.json();
                alert(error || 'No se pudo eliminar el ingrediente.');
              }
            }}
            className="text-red-500 cursor-pointer hover:text-red-700 text-xl"
            title="Eliminar ingrediente"
          >
            🗑️
          </button>
        </td>
      </tr>
    ));

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Ingredientes</h1>
      {/* ← Regresar */}
      <div className="text-sm text-gray-500 mb-6 mt-4">
        <a
          href="/admin"
          className="cursor-pointer hover:underline hover:text-gray-700"
          title="Panel de Administración"
        >
          ← Regresar al Panel de Administración
        </a>
      </div>
      {/* Tabla de ingredientes */}
      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Ingrediente</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.map(({ key, label }) =>
            renderRows(constantes[key], label, key)
          )}
        </tbody>
      </table>

      {/* Botón “Agregar” */}
      <div className="flex space-x-4 mt-6">
        {tipos.map(({ key, label }) => (
          <Link
            key={key}
            href={`/admin/constantes/${key}`}
            className="bg-green-700 text-white px-4 py-2 cursor-pointer rounded hover:bg-green-800 transition"
          >
            Agregar {label}
          </Link>
        ))}
      </div>

    </main>
  );
}