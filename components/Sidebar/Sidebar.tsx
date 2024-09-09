"use client";
 
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoHome } from "react-icons/io5";
import {
  FaUsers,
  FaVideo,
  FaBell,
  FaPray,
  FaQuoteLeft,
  FaDonate,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiSolidChurch } from "react-icons/bi";
import { BsCalendarEventFill } from "react-icons/bs";
import { GiTemplarShield } from "react-icons/gi";
import { MdSubscriptions } from "react-icons/md";
import { HiSpeakerphone } from "react-icons/hi";
import LogoutPopup from "../../components/logoutpopup/logout";
 
 
const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: IoHome },
  { name: "Users", href: "/users", icon: FaUsers },
  { name: "Events", href: "/events", icon: BsCalendarEventFill },
  { name: "Media", href: "/media", icon: FaVideo },
  // { name: "Notification", href: "/notification", icon: FaBell },
  { name: "Announcement", href: "/announcement", icon: HiSpeakerphone  },
  { name: "Prayer Request", href: "/prayerRequest", icon: FaPray },
  { name: "Daily Quote", href: "/dailyquote", icon: FaQuoteLeft },
  // { name: "Auction", href: "", icon: TfiAnnouncement },
  // { name: "Donation", href: "/donation", icon: FaDonate },
  { name: "About", href: "/about", icon: BiSolidChurch  },
  // { name: "Subscription", href: "", icon: MdSubscriptions },
  // { name: "Ministries", href: "/videos", icon: GiTemplarShield },
];
 
const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
 
  const toggleSidebar = () => setIsOpen(!isOpen);
  // function deleteToken()
 
  const showLogoutPopup = () => setIsLogoutPopupVisible(true);
  const hideLogoutPopup = () => setIsLogoutPopupVisible(false);
    const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); 
    window.location.href="/"
  };
 
  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-gray-100 p-4 flex justify-between items-center shadow-md">
        <Image
          src="/assets/digisailor logo 1.png"
          alt="Logo"
          width={150}
          height={50}
        />
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
 
      <aside
        className={`fixed top-0 left-0 z-10 w-full md:w-64 bg-gray-100 h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow-lg`}
      >
        <div className="flex flex-col h-full p-4 pt-20 md:pt-4 overflow-auto sidebar-scroll">
          {/* Logo (hidden on mobile as it's in the header) */}
          <div className="mb-8 hidden md:block">
            <Image
              src="/assets/digisailor logo 1.png"
              alt="Logo"
              width={150}
              height={50}
            />
          </div>
 
          <nav className="flex-grow">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                      pathname === item.href
                        ? "bg-[#23D81E] text-black"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 text-lg" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
 
          {/* Logout button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={showLogoutPopup}
              className="flex items-center w-full p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
 
      <LogoutPopup
        isOpen={isLogoutPopupVisible}
        onClose={hideLogoutPopup}
        onLogout={confirmLogout}
      />
    </>
  );
};
 
export default Sidebar;