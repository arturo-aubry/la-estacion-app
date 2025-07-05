'use client';

import { formatDate } from '@/lib/formatDate';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AllPedidosPage() {
  const [pedidos, setPedidos] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/pedidos/me')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then(data => setPedidos(Array.isArray(data) ? data : []));
  }, [router]);

  if (pedidos === null) {
    return (
      <main className="w-full p-8">
        <p className="text-center py-12">Cargando tus pedidos…</p>
      </main>
    );
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13V3"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              No has hecho ningún pedido. =(
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pedidos.map(p => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
            >
              <span className="text-lg font-bold text-gray-700 mb-2">
                Pedido #{p.orderId}
              </span>
              <div className="space-y-3">
                <p className="text-gray-500 text-sm">{formatDate(p.createdAt)}</p>
                <p><strong>🍝 Pasta:</strong> {p.pasta === 'sí' ? 'con pasta.' : 'sin pasta.'}</p>
                <p><strong>🍟 Tiritas/Crotones:</strong> con {p.tiritaOCrotones}.</p>
                <p><strong>🍅 Vegetales:</strong> {p.vegetales.join(', ')}</p>
                <p><strong>🍗 Proteínas:</strong> {p.proteinas.join(', ')}</p>
                <p><strong>🌻 Semillas:</strong> {p.semillas.join(', ')}</p>
                <p><strong>🥫 Aderezos:</strong> {p.aderezos.join(', ')}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p><strong>⭐️ Valoración: </strong>
                  <span className="text-green-700 text-xl">
                    {Array(p.calificacion).fill().map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </span></p>
                <button
                  onClick={async () => {
                    if (!confirm(`¿Quieres eliminar el pedido ${p.orderId}?`)) return;

                    try {
                      const res = await fetch(`/api/pedidos/${p._id}`, { method: 'DELETE' });
                      if (res.ok) {
                        // status 204 ➔ true ➔ quitamos del array local
                        setPedidos(prev => prev.filter(x => x._id !== p._id));
                      } else {
                        // aquí res.ok es false: lee el JSON (si lo hay) o muestra mensaje genérico
                        let err;
                        try {
                          const json = await res.json();
                          err = json.error;
                        } catch {
                          err = 'No se pudo eliminar el pedido.';
                        }
                        alert(err);
                      }
                    } catch {
                      alert('Error de red, intenta de nuevo.');
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                  title="Eliminar pedido"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
