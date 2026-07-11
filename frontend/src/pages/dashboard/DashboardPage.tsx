import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  School,
  ShieldCheck,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../../hooks/auth/useAuth";

const roleLabels: Record<string, string> = {
  ADMIN: "Maamulaha Guud",
  STUDENT_AFFAIRS: "Arrimaha Ardayda",
  StudentAffairs: "Arrimaha Ardayda",
  CASHIER: "Qasnaji",
  Cashier: "Qasnaji",
};

const dashboardStatistics = [
  {
    title: "Tirada Ardayda",
    value: "0",
    description: "Ardayda diiwaangashan",
    icon: GraduationCap,
  },
  {
    title: "Macallimiinta",
    value: "0",
    description: "Macallimiinta shaqeeya",
    icon: UserRound,
  },
  {
    title: "Fasallada",
    value: "0",
    description: "Fasallada firfircoon",
    icon: School,
  },
  {
    title: "Lacagaha La Bixiyay",
    value: "$0",
    description: "Lacagaha bishan",
    icon: WalletCards,
  },
];

function DashboardPage() {
  const { user } = useAuth();

  const userRole = user?.role
    ? roleLabels[user.role] ?? user.role.replaceAll("_", " ")
    : "Isticmaale";

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8b2408] via-[#751d07] to-[#4f1304] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-orange-300/15 blur-2xl" />
        <div className="absolute -bottom-24 right-32 size-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-100">
              Ansaaru Dacwa Islamic School
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Soo dhawoow, {user?.fullName ?? "Isticmaale"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-50/80 sm:text-base">
              Halkaan waxaad kala socon kartaa dhammaan xogta
              ardayda, macallimiinta, fasallada iyo maamulka
              maaliyadda dugsiga.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck size={25} />
            </div>

            <div>
              <p className="text-xs font-semibold text-orange-100">
                Doorkaaga
              </p>

              <p className="mt-1 font-bold">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStatistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.title}
              className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                  <Icon size={23} />
                </div>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  <TrendingUp size={14} />
                  Active
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                {statistic.title}
              </p>

              <p className="mt-1 text-3xl font-black text-[#30201a]">
                {statistic.value}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {statistic.description}
              </p>
            </article>
          );
        })}
      </section>

      {/* Dashboard information */}
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[#30201a]">
                Dhaqdhaqaaqa Maanta
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Warbixinta guud ee howlaha maanta.
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
              <CalendarCheck size={22} />
            </div>
          </div>

          <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-[#dbc9c2] bg-[#fffaf8] p-6 text-center">
            <div>
              <CalendarCheck
                size={36}
                className="mx-auto text-[#b98b7d]"
              />

              <h3 className="mt-4 font-bold text-[#4a3028]">
                Wali xog lama helin
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Xogta imaanshaha, diiwaangelinta iyo lacagaha
                maanta waxay halkaan kasoo muuqan doonaan marka
                API-ga lagu xiro.
              </p>
            </div>
          </div>
        </article>

        {/* User information */}
        <article className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
              <UserRound size={22} />
            </div>

            <div>
              <h2 className="font-black text-[#30201a]">
                Macluumaadka Akoonka
              </h2>

              <p className="text-sm text-slate-500">
                Xogta isticmaalaha hadda jira
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-[#fff8f5] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Magaca
              </p>

              <p className="mt-2 break-words font-bold text-[#3d241b]">
                {user?.fullName ?? "Lama helin"}
              </p>
            </div>

            <div className="rounded-xl bg-[#fff8f5] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Email Address
              </p>

              <p className="mt-2 break-all font-bold text-[#3d241b]">
                {user?.emailAddress ?? "Lama helin"}
              </p>
            </div>

            <div className="rounded-xl bg-[#fff8f5] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Doorka
              </p>

              <p className="mt-2 flex items-center gap-2 font-bold text-[#3d241b]">
                <ShieldCheck
                  size={18}
                  className="text-[#8b2408]"
                />

                {userRole}
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* System status */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="flex items-center gap-4 rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p className="font-bold text-[#30201a]">
              Nidaamka
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Si sax ah ayuu u shaqaynayaa
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <BookOpen size={22} />
          </div>

          <div>
            <p className="font-bold text-[#30201a]">
              Waxbarashada
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Modules-ka waa diyaar
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
            <GraduationCap size={22} />
          </div>

          <div>
            <p className="font-bold text-[#30201a]">
              Dugsiga
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Ansaaru Dacwa Islamic School
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;