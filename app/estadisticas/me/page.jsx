// app/estadisticas/me/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../../../components/StatCard';

export default function MyStatsPage() {
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/estadisticas/me')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setStats(data);
      });
  }, [router]);

  if (!stats) {
    return <p className="p-8 text-center">Cargando estadísticas…</p>;
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Mis estadísticas</h1>
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