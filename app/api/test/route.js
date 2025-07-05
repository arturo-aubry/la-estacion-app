// app/api/test/route.js
import connectToDatabase from '../../../lib/db';

export async function GET(request) {
  try {
    console.log('🔍 MONGODB_URI =', process.env.MONGODB_URI);
    await connectToDatabase();
    return new Response(JSON.stringify({ message: '✅ DB conectada' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}