import type { PropsWithChildren } from "react";

import {
  BarChart3,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

interface AuthPageLayoutProps extends PropsWithChildren {
  heading: string;
  description: string;
}

function AuthPageLayout({
  heading,
  description,
  children,
}: AuthPageLayoutProps) {
  return (
    <main className="min-h-dvh bg-[#fffaf8] lg:grid lg:grid-cols-2">
      {/* Form section */}
      <section className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
        <div className="w-full max-w-xl">
          <div className="mb-10 flex items-center gap-3 sm:mb-12">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#8b2408] text-white sm:size-12">
              <GraduationCap size={26} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#42160c] sm:text-2xl">
                Ansaaru Dacwa Islamic School
              </h1>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Nidaamka maamulka dugsiga
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-[#211916] sm:text-4xl">
              {heading}
            </h2>

            <p className="mt-3 max-w-lg leading-7 text-slate-500">
              {description}
            </p>
          </div>

          {children}
        </div>
      </section>

      {/* Desktop information section */}
      <aside className="relative hidden min-h-dvh overflow-hidden bg-gradient-to-br from-[#9c3918] via-[#791f07] to-[#3c0e04] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-black/30 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            NIDAAMKA MAAMULKA DUGSIGAAGA
          </div>

          <h2 className="mt-10 max-w-2xl text-5xl font-bold leading-tight xl:text-6xl">
            Maamul Dugsigaaga si Casri ah
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-8 text-orange-50/75">
            Hal meel kaga maamul ardayda,
            macallimiinta, lacagaha iyo warbixinnada
            dugsiga.
          </p>
        </div>

        <div className="relative z-10 my-12 rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl bg-white/95 p-5 text-[#32130a]">
              <Users className="text-[#8b2408]" />

              <p className="mt-5 text-sm text-slate-500">
                Ardayda
              </p>

              <p className="mt-1 text-2xl font-bold">
                1,248
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-[#32130a]">
              <BarChart3 className="text-emerald-600" />

              <p className="mt-5 text-sm text-slate-500">
                Kobaca
              </p>

              <p className="mt-1 text-2xl font-bold">
                +24%
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-[#32130a]">
              <ShieldCheck className="text-[#8b2408]" />

              <p className="mt-5 text-sm text-slate-500">
                Amniga
              </p>

              <p className="mt-1 text-2xl font-bold">
                100%
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm text-orange-50/80">
          <Sparkles size={20} />
          Xogta dugsigaaga si ammaan ah u maamul.
        </div>
      </aside>
    </main>
  );
}

export default AuthPageLayout;