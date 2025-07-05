// components/StatCard.jsx
'use client';

export default function StatCard({ title, value, list, breakdown }) {
  // Comprueba si no hay datos para mostrar mensaje motivacional
  const isEmpty =
    (value !== undefined && value === 0) ||
    (Array.isArray(list) && list.length === 0) ||
    (breakdown && Object.keys(breakdown).length === 0);

  let content;
  if (value !== undefined) {
    // Caso de valor numérico: mostrar número y, si es la tarjeta de pedidos, el texto 'pedidos'
    content = (
      <>
        <p className="text-4xl font-bold">{value}</p>
        {title.toLowerCase().startsWith('pedidos') && (
          <p className="text-sm text-gray-500">pedido(s) registrado(s).</p>
        )}
      </>
    );
  } else if (Array.isArray(list)) {
    // Lista de top items
    content = isEmpty ? (
      <p className="text-gray-500 text-sm">
        Haz tu primera valoración para ver tus estadísticas. =)
      </p>
    ) : (
      <ul className="space-y-1">
        {list.map((item) => (
          <li key={item.name} className="flex justify-between">
            <span>{item.name}</span>
            <span className="font-semibold">{item.count}</span>
          </li>
        ))}
      </ul>
    );
  } else if (breakdown) {
    // Desglose de conteos
    content = isEmpty ? (
      <p className="text-gray-500 text-sm">
        Haz tu primera valoración para ver tus estadísticas. =)
      </p>
    ) : (
      <ul className="space-y-1">
        {Object.entries(breakdown).map(([key, count]) => (
          <li key={key} className="flex justify-between">
            <span className="capitalize">{key}</span>
            <span className="font-semibold">{count}</span>
          </li>
        ))}
      </ul>
    );
  } else {
    // Fallback genérico
    content = (
      <p className="text-gray-500 text-sm">
        Sin datos disponibles. =(
      </p>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {content}
    </div>
  );
}