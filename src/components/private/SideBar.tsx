import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  TableProperties,
} from "lucide-react";
import { useState, useEffect } from "react";

const SideBar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return true;
    }
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMobile]);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & priorities",
    },
    {
      name: "Courses",
      path: "/courses",
      icon: TableProperties,
      description: "Manage Courses",
    },
    {
      name: "Assessments",
      path: "/assessments",
      icon: Target,
      description: "Take skill tests",
      badge: "2 pending",
    },
    {
      name: "Skill Gaps",
      path: "/skill-gaps",
      icon: AlertTriangle,
      description: "Your identified gaps",
    },
    {
      name: "Action Plans",
      path: "/action-plans",
      icon: BookOpen,
      description: "Learning roadmaps",
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleToggle = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-2 left-4 right-4 z-50">
        <div className="bg-[#0E131C]/95 backdrop-blur-lg border border-gray-800/50 rounded-2xl shadow-2xl">
          <nav className="flex items-center justify-around py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 relative min-w-0 flex-1"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active ? "text-[#028CC0]" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-[8px] font-medium truncate max-w-full ${
                      active ? "text-[#028CC0]" : "text-gray-400"
                    }`}
                  >
                    {item.name}
                  </span>
                  {active && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#028CC0] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-[calc(100vh-57px)] border-r border-gray-800/50 flex flex-col transition-all duration-300 shrink-0 bg-[#0E131C] ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <nav className="flex-1 px-3 py-4 sm:py-6 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-[#028CC0]/10 text-[#028CC0]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#028CC0] rounded-r-full" />
              )}

              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  active
                    ? "text-[#028CC0]"
                    : "text-gray-400 group-hover:text-gray-200"
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#242833] text-xs text-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 border border-gray-700/60 shadow-xl">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800/50">
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all duration-200 group relative"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
