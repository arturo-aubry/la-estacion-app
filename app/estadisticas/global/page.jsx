'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';

export default function GlobalStatsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/estadisticas/global')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) {
    return <p className="p-8 text-center">Cargando estadísticas...</p>;
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>
      {/* ← Regresar */}
      <div className="text-sm text-gray-500 mb-6 mt-4">
        <a
          href="/admin"
          className="cursor-pointer hover:underline hover:text-gray-700"
          title="Panel de Administración"
        >
          ← Regresar al Panel de Administración
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Pedidos" value={stats.total} />
        <StatCard title="🍟 Tiritas/Crotones" breakdown={stats.tiritaCounts} />
        <StatCard title="🍝 Pasta" breakdown={stats.pastaCounts} />
        <StatCard title="🍅 Top 3 vegetales" list={stats.topVegetales} />
        <StatCard title="🍗 Top 3 proteínas" list={stats.topProteinas} />
        <StatCard title="🌻 Top 3 semillas" list={stats.topSemillas} />
        <StatCard title="🥫 Top 3 aderezos" list={stats.topAderezos} />
      </div>
    </main>
  );
}