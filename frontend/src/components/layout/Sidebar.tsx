import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Home, Plus, History, Settings, Database, Dna } from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Submit Job", href: "/submit", icon: Plus },
    { name: "Job History", href: "/history", icon: History },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <motion.div
        className={`fixed inset-0 flex z-40 md:hidden`}
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full glass">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center">
                <Dna className="h-8 w-8 text-primary-500" />
                <span className="ml-2 text-xl font-bold text-primary-500">
                  ProteinFold
                </span>
              </div>
            </div>
            <nav className="mt-8 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <item.icon
                    className="mr-4 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 glass border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <Dna className="h-8 w-8 text-primary-500" />
                <span className="ml-2 text-xl font-bold text-primary-500">
                  ProteinFold
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <button className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
