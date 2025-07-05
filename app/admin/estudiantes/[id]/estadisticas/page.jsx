'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatCard from '../../../../../components/StatCard';

export default function StudentStatsPage() {
  const { id: studentId } = useParams();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/estadisticas/${studentId}`)
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
  }, [studentId, router]);

  if (!stats) {
    return <p className="p-8 text-center">Cargando estadísticas…</p>;
  }

  return (
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Estadísticas de {studentId}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Pedidos" value={stats.total} unit="pedidos" />
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