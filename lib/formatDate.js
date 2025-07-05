// lib/formatDate.js
export function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate(); // día sin cero a la izquierda
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours24 = date.getHours();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${day} de ${month} de ${year}, ${hours12}:${minutes} ${period}`;
}