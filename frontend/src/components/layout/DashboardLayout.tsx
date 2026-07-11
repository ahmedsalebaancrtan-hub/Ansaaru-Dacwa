import {
  Bell,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  LogOut,
  Menu,
  Plus,
  School,
  Search,
  ShieldAlert,
  UserCheck,
  UserRound,
  Users,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/auth/useAuth";

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

/*
 * Sidebar navigation items.
 *
 * Constants-ka lama export-gareynayo, si file-kan uu
 * component-ka oo keliya u export-gareeyo.
 */
const navigationGroups: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: House,
      },
    ],
  },
  {
    title: "Maamulka Dugsiga",
    items: [
      {
        name: "Isticmaalayaasha",
        path: "/dashboard/users",
        icon: Users,
      },
      {
        name: "Waalidiinta",
        path: "/dashboard/parents",
        icon: UsersRound,
      },
      {
        name: "Ardayda",
        path: "/dashboard/students",
        icon: GraduationCap,
      },
      {
        name: "Fasallada",
        path: "/dashboard/classes",
        icon: School,
      },
      {
        name: "Macallimiinta",
        path: "/dashboard/teachers",
        icon: UserRound,
      },
      {
        name: "Maadooyinka",
        path: "/dashboard/subjects",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Imaanshaha",
    items: [
      {
        name: "Imaanshaha Ardayda",
        path: "/dashboard/attendance",
        icon: CalendarCheck,
      },
      {
        name: "Attendance Students",
        path: "/dashboard/attendance-students",
        icon: UserCheck,
      },
      {
        name: "Imaanshaha Macallimiinta",
        path: "/dashboard/teacher-attendance",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Waxbarashada",
    items: [
      {
        name: "Imtixaannada",
        path: "/dashboard/exams",
        icon: FileText,
      },
      {
        name: "Anshaxa",
        path: "/dashboard/discipline",
        icon: ShieldAlert,
      },
      {
        name: "Caafimaadka",
        path: "/dashboard/health",
        icon: HeartPulse,
      },
    ],
  },
  {
    title: "Maaliyadda",
    items: [
      {
        name: "Maaliyadda",
        path: "/dashboard/finance",
        icon: Landmark,
      },
      {
        name: "Lacagaha Ardayda",
        path: "/dashboard/fees",
        icon: WalletCards,
      },
      {
        name: "Lacagaha Qoysaska",
        path: "/dashboard/family-fees",
        icon: UsersRound,
      },
      {
        name: "Family Fee Students",
        path: "/dashboard/family-fee-students",
        icon: UserCheck,
      },
      {
        name: "Mushaharka",
        path: "/dashboard/salaries",
        icon: WalletCards,
      },
    ],
  },
];

/*
 * Returns the title that should appear in the dashboard header.
 */
function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard/users/create") {
    return "Samee Isticmaale Cusub";
  }

  if (pathname === "/dashboard/profile") {
    return "Profile";
  }

  const navigationItems = navigationGroups.flatMap(
    (group) => group.items,
  );

  const currentItem = navigationItems.find(
    (item) => item.path === pathname,
  );

  return currentItem?.name ?? "Dashboard";
}

/*
 * Converts backend role values into readable Somali labels.
 */
function formatRole(role?: string): string {
  const roleLabels: Record<string, string> = {
    ADMIN: "Maamulaha Guud",
    STUDENT_AFFAIRS: "Arrimaha Ardayda",
    StudentAffairs: "Arrimaha Ardayda",
    CASHIER: "Qasnaji",
    Cashier: "Qasnaji",
  };

  if (!role) {
    return "Isticmaale";
  }

  return (
    roleLabels[role] ??
    role.replaceAll("_", " ")
  );
}

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const profileMenuRef =
    useRef<HTMLDivElement | null>(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const pageTitle = getPageTitle(
    location.pathname,
  );

  const displayName =
    user?.fullName || "Isticmaale";

  const initials = useMemo(() => {
    return displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  /*
   * This effect subscribes to document click events.
   *
   * setProfileOpen is called inside the event callback,
   * not directly inside the effect body.
   */
  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const clickedElement =
        event.target as Node;

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          clickedElement,
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleNavigation = () => {
    // Close the mobile sidebar when a link is clicked.
    setSidebarOpen(false);
  };

  const handleCreateUser = () => {
    setSidebarOpen(false);
    navigate("/dashboard/users/create");
  };

  const handleProfileNavigation = () => {
    setProfileOpen(false);
    navigate("/dashboard/profile");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setSidebarOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#fff8f5]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#eadbd5] bg-white transition-transform duration-300 lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        {/* School identity */}
        <div className="flex min-h-24 items-center justify-between border-b border-[#eadbd5] px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#751d07] text-white shadow-sm">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-base font-black leading-5 text-[#42160c]">
                Ansaaru Dacwa
              </h1>

              <p className="text-sm font-bold text-[#42160c]">
                Islamic School
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Nidaamka Maamulka
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-xl p-2 text-slate-500 transition hover:bg-[#fff1ec] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-6">
            {navigationGroups.map((group) => (
              <section key={group.title}>
                <p className="mb-2 px-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={
                          item.path ===
                          "/dashboard"
                        }
                        onClick={handleNavigation}
                        className={({
                          isActive,
                        }) =>
                          [
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition",
                            isActive
                              ? "bg-[#8b2408] text-white shadow-sm shadow-orange-950/20"
                              : "text-[#695650] hover:bg-[#fff0eb] hover:text-[#7c2109]",
                          ].join(" ")
                        }
                      >
                        <Icon
                          size={19}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {item.name}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </div>

        {/* Admin-only create user action */}
        {user?.role === "ADMIN" && (
          <div className="border-t border-[#eadbd5] p-4">
            <button
              type="button"
              onClick={handleCreateUser}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#751d07] px-4 text-sm font-black text-white transition hover:bg-[#5d1605] focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              <Plus size={19} />
              Isticmaale Cusub
            </button>
          </div>
        )}
      </aside>

      {/* Header and page content */}
      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#eadbd5] bg-white/95 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Header left side */}
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-[#eadbd5] bg-white p-2.5 text-[#614d46] transition hover:bg-[#fff1ec] lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-[#8b2408]">
                  Dashboard
                </p>

                <h2 className="truncate text-base font-black text-[#2e1c17] sm:text-lg">
                  {pageTitle}
                </h2>
              </div>
            </div>

            {/* Desktop search */}
            <div className="hidden w-full max-w-xl flex-1 md:block">
              <div className="relative">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  placeholder="Raadi halkan..."
                  className="h-11 w-full rounded-xl border border-transparent bg-[#fff3ef] pl-11 pr-4 text-sm text-[#38241e] outline-none transition placeholder:text-slate-400 focus:border-[#b46a54] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Header actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-[#5e4b45] transition hover:bg-[#fff0eb]"
                aria-label="Notifications"
              >
                <Bell size={20} />

                <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              <button
                type="button"
                className="hidden rounded-xl p-2.5 text-[#5e4b45] transition hover:bg-[#fff0eb] sm:block"
                aria-label="Help"
              >
                <CircleHelp size={20} />
              </button>

              <div className="mx-1 hidden h-9 w-px bg-[#eadbd5] sm:block" />

              {/* Profile dropdown */}
              <div
                ref={profileMenuRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (current) => !current,
                    )
                  }
                  className="flex items-center gap-3 rounded-xl border border-[#eadbd5] bg-white px-2 py-2 shadow-sm transition hover:border-[#d7a99a] hover:bg-[#fff7f4] sm:px-3"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#8b2408] text-sm font-black text-white">
                    {initials || "US"}
                  </div>

                  <div className="hidden min-w-0 text-left lg:block">
                    <p className="max-w-40 truncate text-sm font-black text-[#30201a]">
                      {displayName}
                    </p>

                    <p className="max-w-40 truncate text-xs font-semibold text-slate-500">
                      {formatRole(user?.role)}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={[
                      "hidden text-slate-500 transition sm:block",
                      profileOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-72 overflow-hidden rounded-2xl border border-[#eadbd5] bg-white shadow-xl"
                  >
                    <div className="border-b border-[#f0e4df] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#8b2408] text-sm font-black text-white">
                          {initials || "US"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#30201a]">
                            {displayName}
                          </p>

                          <p className="truncate text-xs font-semibold text-slate-500">
                            {user?.emailAddress ??
                              "Email lama helin"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                        ACTIVE
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={
                          handleProfileNavigation
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-[#604c45] transition hover:bg-[#fff0eb] hover:text-[#7c2109]"
                      >
                        <UserRound size={19} />
                        Profile
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={19} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="border-t border-[#f0e4df] px-4 py-3 md:hidden">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Raadi halkan..."
                className="h-11 w-full rounded-xl bg-[#fff3ef] pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>
        </header>

        {/* Nested dashboard pages appear here */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;