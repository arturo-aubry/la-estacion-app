// app/api/admin/constantes/[tipo]/route.js
import connectToDatabase from '../../../../../lib/db';
import {
  Vegetal,
  Semilla,
  Proteina,
  Aderezo
} from '../../../../../lib/models/Constantes';

const modelMap = {
  vegetales: Vegetal,
  semillas:  Semilla,
  proteinas: Proteina,
  aderezos:  Aderezo
};

// Eliminar
export async function DELETE(request, { params }) {
  const { tipo } = params;
  const { name } = await request.json();
  const Model = modelMap[tipo];
  if (!Model) {
    return new Response(JSON.stringify({ error: 'Tipo inválido' }), { status: 400 });
  }
  await connectToDatabase();
  await Model.deleteOne({ name });
  return new Response(null, { status: 204 });
}

// Crear
export async function POST(request, { params }) {
  const { tipo } = params;
  const { name } = await request.json();
  const Model = modelMap[tipo];
  if (!Model) {
    return new Response(JSON.stringify({ error: 'Tipo inválido' }), { status: 400 });
  }
  if (!name?.trim()) {
    return new Response(JSON.stringify({ error: 'El nombre del ingrediente no puede estar vacío.' }), { status: 400 });
  }
  await connectToDatabase();
  const exists = await Model.exists({ name });
  if (exists) {
    return new Response(JSON.stringify({ error: 'Ya existe ese ingrediente.' }), { status: 409 });
  }
  await Model.create({ name });
  return new Response(null, { status: 201 });
}

// Actualizar
export async function PUT(request, { params }) {
  const { tipo }  = params;
  const { antiguo, nuevo } = await request.json();
  const Model = modelMap[tipo];
  if (!Model) {
    return new Response(JSON.stringify({ error: 'Tipo inválido' }), { status: 400 });
  }
  if (!nuevo?.trim()) {
    return new Response(JSON.stringify({ error: 'El nuevo nombre no puede estar vacío.' }), { status: 400 });
  }
  await connectToDatabase();
  const exists = await Model.exists({ name: nuevo });
  if (exists) {
    return new Response(JSON.stringify({ error: 'Ya existe un ingrediente con ese nombre.' }), { status: 409 });
  }
  const result = await Model.updateOne({ name: antiguo }, { name: nuevo });
  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: 'No se encontró el ingrediente a editar.' }), { status: 404 });
  }
  return new Response(null, { status: 204 });
}