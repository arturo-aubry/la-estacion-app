'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/formatDate';

export default function PedidosGlobalesPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Al montar, carga todos los pedidos
  useEffect(() => {
    fetch('/api/admin/pedidos')
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Cargando pedidos…</p>;
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Pedidos globales</h1>

      {/* ← Regresar */}
      <div className="text-sm text-gray-500 mb-6 mt-4">
        <span
          onClick={() => router.back()}
          className="cursor-pointer hover:underline hover:text-gray-700"
        >
          ← Regresar a la página anterior
        </span>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Orden</th>
            <th className="px-4 py-2 text-left">Estudiante</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Pasta</th>
            <th className="px-4 py-2 text-left">Tiritas/Crotones</th>
            <th className="px-4 py-2 text-left">Proteínas</th>
            <th className="px-4 py-2 text-left">Vegetales</th>
            <th className="px-4 py-2 text-left">Semillas</th>
            <th className="px-4 py-2 text-left">Aderezos</th>
            <th className="px-4 py-2 text-left">Calificación</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              {/* Número de orden */}
              <td className="px-4 py-2 font-semibold">{p.orderId}</td>

              {/* Estudiante */}
              <td className="px-4 py-2">{p.studentId}</td>

              {/* Fecha */}
              <td className="px-4 py-2">{formatDate(p.createdAt)}</td>

              {/* Pasta */}
              <td className="px-4 py-2 text-center">
                {p.pasta === 'sí' ? 'Sí' : 'No'}
              </td>

              {/* Tiritas/Crotones */}
              <td className="px-4 py-2 text-center capitalize">
                {p.tiritaOCrotones || '—'}
              </td>

              {/* Proteínas */}
              <td className="px-4 py-2">
                {(Array.isArray(p.proteinas) ? p.proteinas : [p.proteina])
                  .filter(Boolean)
                  .join(', ')}
              </td>

              {/* Vegetales */}
              <td className="px-4 py-2">
                {Array.isArray(p.vegetales) ? p.vegetales.join(', ') : ''}
              </td>

              {/* Semillas */}
              <td className="px-4 py-2">
                {Array.isArray(p.semillas) ? p.semillas.join(', ') : ''}
              </td>

              {/* Aderezos */}
              <td className="px-4 py-2">
                {Array.isArray(p.aderezos) ? p.aderezos.join(', ') : ''}
              </td>

              {/* Calificación */}
              <td className="px-4 py-2 text-green-600 text-center">
                {Array(p.calificacion)
                  .fill()
                  .map((_, i) => (
                    <span key={i}>★</span>
                  ))}
              </td>

              {/* Botón eliminar */}
              <td className="px-4 py-2 text-center">
                <button
                  onClick={async () => {
                    if (!confirm(`¿Eliminar pedido #${p.orderId}?`)) return;
                    try {
                      const res = await fetch(`/api/admin/pedidos/${p._id}`, {
                        method: 'DELETE',
                      });
                      if (res.ok) {
                        // 2) quitamos el pedido de la lista local
                        setPedidos(prev =>
                          prev.filter(x => x._id !== p._id)
                        );
                      } else {
                        let errMsg = 'No se pudo eliminar el pedido.';
                        try {
                          const { error } = await res.json();
                          errMsg = error || errMsg;
                        } catch { }
                        alert(errMsg);
                      }
                    } catch {
                      alert('Error de red, intenta de nuevo.');
                    }
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
                  title="Eliminar pedido"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          {pedidos.length === 0 && (
            <tr>
              <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                No hay pedidos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}