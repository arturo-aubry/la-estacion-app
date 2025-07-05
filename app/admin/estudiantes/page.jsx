'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '../../../lib/formatDate';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/estudiantes')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setError('No se pudieron cargar los estudiantes.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Cargando estudiantes…</p>;
  }

  if (error) {
    return (
      <p className="p-8 text-center bg-red-100 text-red-600 rounded">
        {error}
      </p>
    );
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Estudiantes</h1>

      {/* ← Regresar */}
      <div className="text-sm text-gray-500 mb-6 mt-4">
        <span
          onClick={() => router.back()}
          className="cursor-pointer hover:underline hover:text-gray-700"
        >
          ← Regresar a la página anterior
        </span>
      </div>

      {/* Tabla */}
      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Clave Única</th>
            <th className="px-4 py-2 text-left">¿Es Admin?</th>
            <th className="px-4 py-2 text-left">Fecha de creación</th>
            <th className="px-4 py-2 text-left">Último inicio de sesión</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.studentId} className="hover:bg-gray-50">
              {/* Student ID */}
              <td className="px-4 py-2 font-medium">{s.studentId}</td>

              {/* Toggle Admin */}
              <td className="px-4 py-2">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.isAdmin}
                    onChange={async () => {
                      const nuevoEstado = !s.isAdmin;
                      await fetch(`/api/admin/estudiantes/${s.studentId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isAdmin: nuevoEstado })
                      });
                      setStudents(prev =>
                        prev.map(x =>
                          x.studentId === s.studentId
                            ? { ...x, isAdmin: nuevoEstado }
                            : x
                        )
                      );
                    }}
                    className="form-checkbox h-5 w-5 text-green-600 transition"
                  />
                  <span className={s.isAdmin ? 'text-green-700' : 'text-gray-400'}>
                    {s.isAdmin ? 'Admin' : 'Usuario'}
                  </span>
                </label>
              </td>

              {/* Created at */}
              <td className="px-4 py-2">
                {s.createdAt ? formatDate(s.createdAt) : '—'}
              </td>

              {/* Last login */}
              <td className="px-4 py-2">
                {s.lastLogin ? formatDate(s.lastLogin) : '—'}
              </td>

              {/* Acciones */}
              <td className="px-4 py-2 text-right space-x-3">
                {/* Editar */}
                <Link
                  href={`/admin/estudiantes/${s.studentId}`}
                  className="text-xl hover:text-green-800"
                  title="Editar estudiante"
                >
                  ✏️
                </Link>

                {/* Eliminar */}
                <button
                  onClick={async () => {
                    if (!confirm(`¿Eliminar estudiante ${s.studentId}?`)) return;
                    const res = await fetch(`/api/admin/estudiantes/${s.studentId}`, {
                      method: 'DELETE'
                    });
                    if (res.ok) {
                      setStudents(prev =>
                        prev.filter(x => x.studentId !== s.studentId)
                      );
                    } else {
                      alert('No se pudo eliminar el estudiante.');
                    }
                  }}
                  className="text-xl hover:text-red-700 cursor-pointer"
                  title="Eliminar estudiante"
                >
                  🗑️
                </button>

                {/* Ver pedidos */}
                <Link
                  href={`/admin/estudiantes/${s.studentId}/pedidos`}
                  className="text-xl hover:text-blue-600"
                  title="Ver pedidos del estudiante"
                >
                  🥗
                </Link>

                {/* Ver estadísticas */}
                <Link
                  href={`/admin/estudiantes/${s.studentId}/estadisticas`}
                  className="text-xl hover:text-indigo-600"
                  title="Ver estadísticas del estudiante"
                >
                  📊
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Agregar estudiante */}
      <div className="mt-6">
        <Link
          href="/admin/estudiantes/create"
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded transition"
        >
          Agregar estudiante
        </Link>
      </div>
    </main>
  );
}