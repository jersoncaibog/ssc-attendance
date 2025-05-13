import HelpIcon from "@mui/icons-material/Help";
import KeyIcon from "@mui/icons-material/Key";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useEffect, useRef, useState } from "react";

interface UserMenuProps {
  onLogout?: () => void;
}

export const UserMenu = ({ onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="grid place-items-center border border-border-dark rounded-md p-0.5 cursor-pointer hover:bg-gray-50 text-gray-500 hover:text-gray-600 transition-colors hover:border-gray-600 focus:ring-2 focus:ring-zinc-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PersonOutlineOutlinedIcon />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 pt-1 bg-white border border-border-dark rounded-md shadow-lg z-10 min-w-[16rem]">
          {/* Admin Accounts */}
          <button
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-normal rounded-md"
            onClick={() => {
              console.log("Admin Accounts clicked");
              setIsOpen(false);
            }}
          >
            <KeyIcon sx={{ fontSize: "1rem" }} />
            <span>Admin Accounts</span>
          </button>

          {/* Help */}
          <button
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-normal rounded-md"
            onClick={() => {
              console.log("Help clicked");
              setIsOpen(false);
            }}
          >
            <HelpIcon sx={{ fontSize: "1rem" }} />
            <span>Help</span>
          </button>

          {/* Divider */}
          <div className="border-t border-border-dark mt-1" />

          {/* Logout */}
          <button
            className="w-full flex items-center gap-2 px-5 py-2 my-1 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 font-normal rounded-md"
            onClick={() => {
              onLogout?.();
              setIsOpen(false);
            }}
          >
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};
