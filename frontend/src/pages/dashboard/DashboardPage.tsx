import {
  GraduationCap,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";


const roleLabels = {
  ADMIN: "Maamulaha Guud",
  STUDENT_AFFAIRS: "Arrimaha Ardayda",
  CASHIER: "Qasnaji",
};

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <main className="min-h-screen bg-[#fff8f5] p-6 sm:p-10">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#ead9d2] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#852309] text-white">
            <GraduationCap size={27} />
          </div>

          <div>
            <h1 className="font-bold text-[#37140b]">
              Ansaaru Dacwa Islamic School
            </h1>

            <p className="text-sm text-slate-500">
              School Management System
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-700 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Ka bax
        </button>
      </header>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="rounded-3xl border border-[#ead9d2] bg-white p-8 shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-100 text-[#852309]">
            <UserRound size={29} />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-[#271814]">
            Soo dhawoow, {user?.fullName}
          </h2>

          <p className="mt-2 text-slate-500">
            Login-ka iyo protected route-ku si sax ah
            ayay u shaqeeyeen.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#fff5f1] p-5">
              <p className="text-sm text-slate-500">
                Email address
              </p>

              <p className="mt-2 font-semibold text-[#3d241b]">
                {user?.emailAddress}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff5f1] p-5">
              <p className="text-sm text-slate-500">
                Doorka
              </p>

              <p className="mt-2 flex items-center gap-2 font-semibold text-[#3d241b]">
                <ShieldCheck size={18} />
                {user ? roleLabels[user.role] : ""}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;