'use client';

import { useState, useEffect } from 'react';

export default function PedidoForm() {
  // Estado de opciones dinámicas
  const [opciones, setOpciones] = useState({
    vegetales: [],
    semillas: [],
    proteinas: [],
    aderezos: [],
  });
  const [loading, setLoading] = useState(true);

  // Estado del formulario con valores iniciales
  const [form, setForm] = useState({
    tiritaOCrotones: '',    // obligatorio
    pasta: 'sí',            // default 'sí'
    vegetales: [],          // 1–3
    proteinas: [],          // >=1
    semillas: [],           // 0–2
    aderezos: [],           // >=0
    calificacion: 0,        // 1–5
  });
  const [error, setError] = useState('');

  // Cargar opciones desde API al montar
  useEffect(() => {
    fetch('/api/constantes')
      .then(res => res.json())
      .then(data => setOpciones(data))
      .catch(() => setError('No se pudieron cargar los ingredientes.'))
      .finally(() => setLoading(false));
  }, []);

  // Actualiza campo simple
  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Toggle con límites para arrays
  const toggleArray = (field, value, max = Infinity) => {
    setForm(prev => {
      const has = prev[field].includes(value);
      let arr;
      if (has) {
        arr = prev[field].filter(v => v !== value);
      } else {
        if (prev[field].length >= max) return prev;
        arr = [...prev[field], value];
      }
      return { ...prev, [field]: arr };
    });
    setError('');
  };

  // Enviar formulario con validaciones
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.tiritaOCrotones) return setError('Elige tiritas o crotones.');
    if (form.vegetales.length < 1 || form.vegetales.length > 3) return setError('Selecciona entre 1 y 3 vegetales.');
    if (form.proteinas.length < 1) return setError('Selecciona al menos 1 proteína.');
    if (form.semillas.length > 2) return setError('Elige máximo 2 semillas.');
    if (form.calificacion < 1) return setError('Califica con al menos 1 estrella.');

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setError(error || 'Error al enviar la valoración.');
      } else {
        alert('✅ Valoración enviada.');
        setForm({
          tiritaOCrotones: '',
          pasta: 'sí',
          vegetales: [],
          proteinas: [],
          semillas: [],
          aderezos: [],
          calificacion: 0,
        });
      }
    } catch {
      setError('Error de red.');
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Cargando ingredientes…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
      {/* Título */}
      <h2 className="text-3xl font-bold mb-2">Valora tu ensalada</h2>
      {/* Leyenda Opciones básicas */}
      <p className="text-sm font-semibold text-gray-400 mt-6 mb-6">Opciones base</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección: Tiritas y Pasta lado a lado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tiritas/Crotones */}
          <div>
            <label className="block font-semibold mb-4">🍟 ¿Agregaste tiritas o crotones?</label>
            <select
              value={form.tiritaOCrotones}
              onChange={e => onChange('tiritaOCrotones', e.target.value)}
              className="w-full border p-2 rounded cursor-pointer"
            >
              <option value="">Elige una opción</option>
              {['tiritas', 'crotones', 'ambos', 'ninguno'].map(o => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {/* Pasta */}
          <div>
            <label className="block font-semibold mb-4">🍝 ¿Agregaste pasta?</label>
            <select
              value={form.pasta}
              onChange={e => onChange('pasta', e.target.value)}
              className="w-full border p-2 rounded cursor-pointer"
            >
              <option value="sí">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        {/* Separador */}
        <hr className="border-gray-200" />
        {/* Leyenda Ingredientes principales */}
        <p className="text-sm font-semibold text-gray-400 mb-6">Ingredientes principales</p>
        {/* Sección: Vegetales */}
        <div className="space-y-2">
          <label className="block font-semibold">
            🍅 ¿Qué vegetales escogiste?
            <span className="text-gray-500 text-sm ml-2">(elige entre 1 y 3)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {opciones.vegetales.map(opt => (
              <label key={opt.name} className="inline-flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={form.vegetales.includes(opt.name)}
                  onChange={() => toggleArray('vegetales', opt.name, 3)}
                  className="form-checkbox text-green-700 cursor-pointer"
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Sección: Proteínas */}
        <div className="space-y-2">
          <label className="block font-semibold">
            🍗 ¿Qué proteínas seleccionaste?
            <span className="text-gray-500 text-sm ml-2">(selecciona al menos 1)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opciones.proteinas.map(opt => (
              <label key={opt.name} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.proteinas.includes(opt.name)}
                  onChange={() => toggleArray('proteinas', opt.name)}
                  className="form-checkbox text-green-700 cursor-pointer"
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Separador */}
        <hr className="border-gray-200" />
        {/* Leyenda Complementos */}
        <p className="text-sm font-semibold text-gray-400 mt-6 mb-4">Complementos</p>

        {/* Sección: Semillas */}
        <div className="space-y-2">
          <label className="block font-semibold">
            🌻 ¿Qué semillas agregaste?
            <span className="text-gray-500 text-sm ml-2">(elige entre 0 y 2)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {opciones.semillas.map(opt => (
              <label key={opt.name} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.semillas.includes(opt.name)}
                  onChange={() => toggleArray('semillas', opt.name, 2)}
                  className="form-checkbox text-green-700 cursor-pointer"
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sección: Aderezos */}
        <div className="space-y-2">
          <label className="block font-semibold">🥫 ¿Añadiste algún aderezo?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {opciones.aderezos.map(opt => (
              <label key={opt.name} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.aderezos.includes(opt.name)}
                  onChange={() => toggleArray('aderezos', opt.name)}
                  className="form-checkbox text-green-700 cursor-pointer"
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Separador */}
        <hr className="border-gray-200" />
        {/* Leyenda Valoración */}
        <p className="text-sm font-semibold text-gray-400 mt-6 mb-4">Valoración</p>

        {/* Sección: Calificación */}
        <div className="space-y-2">
          <label className="block font-semibold">
            ¿Qué calificación le darías a esta ensalada?
            <span className="text-gray-500 text-sm ml-2">(1 siendo la peor y 5 la mejor)</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onChange('calificacion', n)}
                className={
                  `text-2xl ${form.calificacion >= n ? 'text-green-700' : 'text-gray-300 cursor-pointer'}`
                }
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Mostrar error aquí */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Botón de envío */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 cursor-pointer transition"
          >
            Registrar valoración
          </button>
        </div>
      </form>
    </div>
  );
}