'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/gacha', label: 'Gacha' },
    { href: '/collection', label: 'Collection' },
    { href: '/settings', label: 'Settings' }
  ];

  return (
    <nav className="bg-[#57564F] text-[#F8F3CE] shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold tracking-wide">
            Uma Musume Gacha
          </Link>
          
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 font-medium ${
                  pathname === item.href
                    ? 'text-[#F8F3CE] border-b-2 border-[#F8F3CE] pb-1'
                    : 'text-[#F8F3CE]/80 hover:text-[#F8F3CE]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
