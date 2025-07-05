// app/admin/estudiantes/create/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateStudentPage() {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin]             = useState('');
  const [isAdmin, setIsAdmin]     = useState(false);
  const [error, setError]         = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!/^\d{6}$/.test(studentId)) {
      setError('La Clave Única debe tener 6 dígitos.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError('El PIN debe tener 4 dígitos.');
      return;
    }

    try {
      const res = await fetch('/api/admin/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, pin, isAdmin })
      });
      if (res.ok) {
        router.push('/admin/estudiantes');
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch {
      setError('Error de red. Intenta de nuevo.');
    }
  };

  return (
    <main className="flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Agregar estudiante</h1>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Ingresa la <strong>Clave Única</strong> (6 dígitos):</label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              maxLength={6}
              className="border p-2 w-full rounded"
              placeholder="201234"
            />
          </div>
          <div>
            <label className="block mb-1">Ingresa un <strong>NIP</strong> (4 dígitos):</label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              maxLength={4}
              className="border p-2 w-full rounded"
              placeholder="1234"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <label>¿Es Admin?</label>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition flex-1 cursor-pointer"
            >
              Crear
            </button>
            <Link
              href="/admin/estudiantes"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition flex-1 text-center cursor-pointer"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}