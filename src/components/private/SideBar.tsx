import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Users,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

const SideBar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & priorities",
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

  return (
    <div
      className={`h-[calc(100vh-57px)] border-r border-gray-800/50 flex flex-col transition-all duration-300 shrink-0 bg-[#0E131C] ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-hidden">
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
              {/* Active Indicator */}
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
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.name}</span>
                    {item.badge && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#242833] text-xs text-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 border border-gray-700/60 shadow-xl">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">
                    {item.description}
                  </div>
                  {item.badge && (
                    <div className="text-red-400 text-[11px] mt-1">
                      {item.badge}
                    </div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800/50 space-y-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all duration-200 group relative mt-2"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronsLeft className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
