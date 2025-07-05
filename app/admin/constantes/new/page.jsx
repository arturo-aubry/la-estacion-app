'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewConstante() {
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState('');           // nuevo estado para el tipo
  const router = useRouter();

  // ——— Leemos "tipo" de la URL una sola vez al montar ———
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t  = qs.get('tipo') || '';
    setTipo(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valor.trim()) {
      return setError('El nombre no puede estar vacío');
    }

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
      <h1 className="text-2xl font-bold mb-4">
        Agregar nuevo {tipo || 'ingrediente'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          value={valor}
          onChange={e => setValor(e.target.value)}
          className="border p-2 w-full"
          placeholder={`Nombre de ${tipo || 'ingrediente'}`}
        />

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </form>

      <div className="mt-4">
        <Link
          href="/admin/constantes"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Volver a ingredientes
        </Link>
      </div>
    </>
  );
}