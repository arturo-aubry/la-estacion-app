'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [session, setSession] = useState({
    isLoggedIn: false,
    isAdmin: false,
    studentId: null
  });
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setSession({
          isLoggedIn: true,
          isAdmin: data.isAdmin,
          studentId: data.studentId
        });
      })
      .catch(() => {
        setSession({ isLoggedIn: false, isAdmin: false, studentId: null });
      });
  }, [pathname]);

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const linkClass = (href) => {
    const base = 'px-2 py-1 rounded';
    const active = pathname === href
      ? 'text-green-700 font-semibold'
      : 'text-gray-600 hover:text-green-700 hover:underline';
    return `${base} ${active}`;
  };

  return (
    <nav className="w-full bg-white shadow-sm z-10">
      <div className="w-full px-8 h-18 flex items-center">
        <ul className="flex items-center w-full space-x-6">
          {/* Logo */}
          <li>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/ensalada.png"
                alt="Valorador — LaEstación"
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="font-semibold text-gray-800">
                ¡Valora tu Ensalada!
              </span>
            </Link>
          </li>

          {/* Menú principal */}
          {session.isLoggedIn && (
            <>
              <li>
                <Link href="/" className={linkClass('/')}>
                  Valorar
                </Link>
              </li>
              <li>
                <Link href="/pedidos" className={linkClass('/pedidos')}>
                  Pedidos
                </Link>
              </li>
              <li>
                <Link
                  href="/estadisticas/me"
                  className={linkClass('/estadisticas/me')}
                >
                  Estadísticas
                </Link>
              </li>
            </>
          )}

          {/* Admin */}
          {session.isAdmin && (
            <li>
              <Link href="/admin" className={linkClass('/admin')}>
                Admin
              </Link>
            </li>
          )}

          {/* separador flexible */}
          <li className="flex-1" />

          {/* Usuario y Logout */}
          {session.isLoggedIn && (
            <>
              <li className="text-gray-600">¡Hola, {session.studentId}!</li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 px-2 py-1 hover:underline cursor-pointer rounded"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}