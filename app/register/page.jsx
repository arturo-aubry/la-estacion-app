// app/register/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin]             = useState('');
  const [error, setError]         = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Recortar espacios en ambos campos
    const cleanId  = studentId.trim();
    const cleanPin = pin.trim();

    console.log('→ handleSubmit disparado', { cleanId, cleanPin });

    // 2) Validaciones en el cliente
    if (!/^\d{6}$/.test(cleanId)) {
      console.log('Clave Única inválida');
      return setError('La Clave Única debe ser de 6 dígitos.');
    }
    if (!/^\d{4}$/.test(cleanPin)) {
      console.log('PIN inválido');
      return setError('El NIP debe ser de 4 dígitos.');
    }

    try {
      // 3) Llamada al endpoint de registro
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: cleanId, pin: cleanPin })
      });
      console.log('→ respuesta del servidor', res.status);

      // 4) Manejo de la respuesta
       if (res.ok) {
+      router.replace('/login?registered=1');
      } else {
        const { error } = await res.json();
        console.log('→ error del servidor', error);
        setError(error);
      }
    } catch (err) {
      console.error('→ excepción en fetch', err);
      setError('Error de red.');
    }
  };

  return (
    <main className="flex justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-4">Regístrate</h1>
      <p className="mt-4 text-sm mb-6 text-gray-500">
          O bien,{' '}
          <Link href="/login" className="text-green-700 hover:underline">
            inicia sesión
          </Link> si ya tienes una cuenta.
      </p>
      <hr className="border-gray-200 mb-6" />
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error}</p>}
        <div>
          <label className="block mb-1">Ingresa tu <strong>Clave Única</strong> (6 dígitos):</label>
          <input
            type="text" 
            maxLength="6"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="201234"
          />
        </div>
        <div>
          <label className="block mb-1">Ingresa un <strong>NIP</strong> (4 dígitos):</label>
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
          Registrarse
        </button>
      </form>
      </div>
    </main>
  );
}