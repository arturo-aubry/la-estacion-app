'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/formatDate';

export default function StudentPedidosPage() {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/estudiantes/${id}/pedidos`)
      .then(res => res.json())
      .then(data => setPedidos(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async (pedidoId) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    await fetch(`/api/pedidos/${pedidoId}`, { method: 'DELETE' });
    setPedidos(prev => prev.filter(p => p._id !== pedidoId));
  };

  if (loading) {
    return <p className="p-8 text-center">Cargando pedidos de {id}…</p>;
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Pedidos de {id}
      </h1>
      {/* ← Regresar */}
      <div className="text-sm text-gray-500 mb-6 mt-4">
        <a
          href="/admin/estudiantes"
          className="cursor-pointer hover:underline hover:text-gray-700"
          title="Estudiantes"
        >
          ← Regresar a Estudiantes
        </a>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center">Orden</th>
            <th className="px-4 py-2 text-center">Fecha</th>
            <th className="px-4 py-2 text-center">Tiritas/Crotones</th>
            <th className="px-4 py-2 text-center">Pasta</th>
            <th className="px-4 py-2 text-center">Proteínas</th>
            <th className="px-4 py-2 text-center">Vegetales</th>
            <th className="px-4 py-2 text-center">Semillas</th>
            <th className="px-4 py-2 text-center">Aderezos</th>
            <th className="px-4 py-2 text-center">Calificación</th>
            <th className="px-4 py-2 text-center">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-center">{p.orderId}</td>
              <td className="px-4 py-2 text-center">{formatDate(p.createdAt)}</td>
              <td className="px-4 py-2 text-center">{p.tiritaOCrotones || '—'}</td>
              <td className="px-4 py-2 text-center">{p.pasta ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2">
                {Array.isArray(p.proteinas) ? p.proteinas.join(', ') : p.proteinas || 'Ninguna'}
              </td>
              <td className="px-4 py-2">
                {Array.isArray(p.vegetales) ? p.vegetales.join(', ') : p.vegetales || 'Ninguna'}
              </td>
              <td className="px-4 py-2">
                {Array.isArray(p.semillas) ? p.semillas.join(', ') : p.semillas || 'Ninguna'}
              </td>
              <td className="px-4 py-2">
                {Array.isArray(p.aderezos) ? p.aderezos.join(', ') : p.aderezos || 'Ninguna'}
              </td>
              <td className="px-4 py-2 text-center">
                <span className="text-green-700">
                  {'★'.repeat(p.calificacion || 0)}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-lg cursor-pointer text-center"
                >🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}