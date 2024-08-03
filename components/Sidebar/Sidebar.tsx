// components/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "dashboard", href: "/" },
  { name: "users", href: "/users" },
  { name: "events", href: "/events" },
  { name: "prayerRequest", href: "/prayerRequest" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/assets/digisailor logo 1.png" // Replace with the actual path to your logo
          alt="Logo"
          width={150} // Adjust the width as needed
          height={50} // Adjust the height as needed
        />
      </div>

      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.href}
                className={`block p-2 rounded ${
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
