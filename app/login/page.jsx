'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('registered') === '1') {
      setJustRegistered(true);
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trim inputs
    const cleanId = studentId.trim();
    const cleanPin = pin.trim();

    // Client-side validation
    if (!/^\d{6}$/.test(cleanId)) {
      return setError('La Clave Única debe ser de 6 dígitos.');
    }
    if (!/^\d{4}$/.test(cleanPin)) {
      return setError('El NIP debe ser de 4 dígitos.');
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: cleanId, pin: cleanPin })
      });
      if (res.ok) {
        router.replace('/');
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (err) {
      console.error('Login error', err);
      setError('Error de red');
    }
  };

  return (
    <main className="flex justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
        <p className="mt-4 text-sm mb-6 text-gray-500">
          O bien,{' '}
          <Link href="/register" className="text-green-700 hover:underline">
            crea una cuenta
          </Link> para empezar.
        </p>
        <hr className="border-gray-200 mb-6" />
        {justRegistered && (
          <p className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            Tu cuenta se creó correctamente. Inicia sesión con tu Clave Única y NIP.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="mb-4 p-2 text-red-600 bg-red-100 rounded">{error}</p>}

          <div>
            <label className="block mb-1">Ingresa tu <strong>Clave Única</strong> (6 dígitos):</label>
            <input
              type="number"
              maxLength="6"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="201234"
            />
          </div>

          <div>
            <label className="block mb-1">Ingresa tu <strong>NIP</strong> (4 dígitos):</label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="1234"
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full cursor-pointer"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}