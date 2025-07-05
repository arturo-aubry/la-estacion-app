// app/admin/constantes/new/page.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NewConstante() {
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const tipo = params.get('tipo');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valor.trim()) return setError('El nombre no puede estar vacío');
    const res = await fetch(`/api/admin/constantes/${tipo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: valor.trim() })
    });
    if (res.ok) {
      router.push('/admin/constantes');
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Agregar nuevo {tipo}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {error && <p className="text-red-600">{error}</p>}
        <input
          type="text"
          value={valor}
          onChange={e => setValor(e.target.value)}
          className="border p-2 w-full"
          placeholder={`Nombre de ${tipo}`}
        />
        <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>
    </>
  );
}