'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = useParams(); // studentId
  const [student, setStudent] = useState(null);
  const [pin, setPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // 2.1) Al montar, carga los datos del estudiante
  useEffect(() => {
    fetch(`/api/admin/estudiantes/${id}`)
      .then(res => res.json())
      .then(data => {
        setStudent(data);
        setIsAdmin(data.isAdmin);
      })
      .catch(() => setError('No se pudo agregar al estudiante.'));
  }, [id]);

  // 2.2) Manejador de envío
  const handleSubmit = async e => {
    e.preventDefault();
    const body = {};
    if (pin) {
      if (!/^\d{4}$/.test(pin)) {
        setError('El NIP debe ser de 4 dígitos.');
        return;
      }
      body.pin = pin;
    }
    body.isAdmin = isAdmin;

    const res = await fetch(`/api/admin/estudiantes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      router.push('/admin/estudiantes');
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  if (!student) {
    return <p className="p-8 text-center">Cargando…</p>;
  }

  return (
    <main className="flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">
          Editar estudiante
        </h1>
        {error && <p className="mb-4 p-2 text-red-600 bg-red-100 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Clave Única, solo lectura */}
          <div>
            <label className="block mb-1"><strong>Clave Única</strong> (6 dígitos):</label>
            <input
              type="text"
              value={student.studentId}
              readOnly
              className="border p-2 w-full rounded bg-gray-100"
            />
          </div>

          {/* Nuevo PIN */}
          <div>
            <label className="block mb-1">Nuevo <strong>NIP</strong> (opcional):</label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              maxLength={4}
              className="border p-2 w-full rounded"
              placeholder="1234"
            />
          </div>

          {/* Toggle Admin */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <label>¿Es Admin?</label>
          </div>

          {/* Botones */}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition flex-1 cursor-pointer"
            >
              Guardar
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