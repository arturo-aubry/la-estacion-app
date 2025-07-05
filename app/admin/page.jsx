// app/admin/page.jsx
'use client';

import Head from 'next/head';
import Link from 'next/link';

const sections = [
  {
    title: '🍅 Ingredientes',
    href: '/admin/constantes',
    description: 'Agregar, editar o eliminar vegetales, proteínas, semillas y aderezos.',
  },
  {
    title: '👩‍🎓 Estudiantes',
    href: '/admin/estudiantes',
    description: 'Ver, crear o administrar cuentas de estudiantes.',
  },
  {
    title: '🥗 Pedidos',
    href: '/admin/pedidos',
    description: 'Revisar todos los pedidos realizados por estudiantes.',
  },
  {
    title: '📊 Estadísticas',
    href: '/estadisticas/global',
    description: 'Gráficas y métricas globales de pedidos.',
  },
];

export default function AdminDashboard() {
  return (
    <>
    <main className="w-full px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((sec) => (
          <Link
            key={sec.href}
            href={sec.href}
            className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
            <p className="text-gray-600">{sec.description}</p>
          </Link>
        ))}
      </div>
    </main>
    </>
  );
}