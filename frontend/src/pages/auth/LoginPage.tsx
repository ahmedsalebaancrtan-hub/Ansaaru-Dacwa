import {
  useState,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import { useLogin } from "../../hooks/auth/useLogin";
import { Link } from "react-router";

interface LoginForm {
  emailaddress: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  emailaddress?: string;
  password?: string;
}

const initialForm: LoginForm = {
  emailaddress: "",
  password: "",
  remember: false,
};

function validateForm(form: LoginForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.emailaddress.trim()) {
    errors.emailaddress = "Email address is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.emailaddress,
    )
  ) {
    errors.emailaddress =
      "Enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 8) {
    errors.password =
      "Password must be at least 8 characters";
  }

  return errors;
}

function LoginPage() {
  const loginMutation = useLogin();

  const [form, setForm] =
    useState<LoginForm>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  const updateEmail = (value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      emailaddress: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      emailaddress: undefined,
    }));
  };

  const updatePassword = (value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      password: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate({
      credentials: {
        emailaddress: form.emailaddress.trim(),
        password: form.password,
      },

      remember: form.remember,
    });
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] lg:grid lg:grid-cols-2">
      {/* Login form section */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="w-full max-w-xl">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#8b2408] text-white shadow-lg shadow-orange-950/15">
              <GraduationCap size={27} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#42160c] sm:text-2xl">
                Ansaaru Dacwa Islamic School
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Nidaamka maamulka dugsiga
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#201916] sm:text-4xl">
              Soo Dhawoow Mudane
            </h2>

            <p className="mt-3 text-base text-slate-500">
              Fadlan geli macluumaadkaaga si aad u
              gasho nidaamka.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label
                htmlFor="emailaddress"
                className="mb-2 block text-sm font-semibold text-[#51433e]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9b857d]"
                  size={21}
                />

                <input
                  id="emailaddress"
                  name="emailaddress"
                  type="email"
                  value={form.emailaddress}
                  onChange={(event) =>
                    updateEmail(event.target.value)
                  }
                  placeholder="Tusaale: ahmed@gmail.com"
                  autoComplete="email"
                  aria-invalid={Boolean(
                    errors.emailaddress,
                  )}
                  className={`h-15 w-full rounded-xl border bg-[#fff4f0] pl-12 pr-4 text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-4 ${
                    errors.emailaddress
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#9b3215] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.emailaddress && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailaddress}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#51433e]"
                >
                  Furaha Sirta ah
                </label>

               <Link
  to="/forgot-password"
  className="text-sm font-semibold text-[#7c2a13] transition hover:underline"
>
  Ma illoowday Furaha?
</Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9b857d]"
                  size={21}
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={form.password}
                  onChange={(event) =>
                    updatePassword(event.target.value)
                  }
                  placeholder="Geli furahaaga"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className={`h-15 w-full rounded-xl border bg-[#fff4f0] pl-12 pr-14 text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-4 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#9b3215] focus:ring-orange-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) => !currentValue,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#87736c] transition hover:text-[#6d210d]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-[#5e514c]">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    remember: event.target.checked,
                  }))
                }
                className="size-5 rounded border-[#d7c2ba] accent-[#8b2408]"
              />

              Xasuuso akoonkayga
            </label>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex h-15 w-full items-center justify-center gap-2 rounded-xl bg-[#087faa] px-6 font-bold text-white shadow-lg shadow-cyan-900/15 transition hover:bg-[#066f96] focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loginMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={21}
                    className="animate-spin"
                  />
                  Waa lagu gelinayaa...
                </>
              ) : (
                "Soo Gal Nidaamka"
              )}
            </button>
          </form>

          <div className="mt-12 border-t border-[#eaded9] pt-7">
            <div className="flex flex-wrap items-center justify-between gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className="text-[#74240e]"
                />
                Xogtaadu waa ammaan
              </span>

              <span className="flex items-center gap-2">
                <LockKeyhole
                  size={17}
                  className="text-[#74240e]"
                />
                SSL encrypted
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative information panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#9c3a19] via-[#7c2308] to-[#3e1005] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-40 -top-40 size-96 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-black/25 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold tracking-wide backdrop-blur-md">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            NIDAAMKA MAAMULKA DUGSIGAAGA
          </div>

          <h2 className="mt-10 max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Mustaqbalka Waxbarashada Maanta Halkaan Ka
            Bilow
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-orange-50/80">
            Si fudud u maamul ardayda, macallimiinta,
            lacagaha iyo dhammaan howlaha dugsiga.
          </p>
        </div>

        <div className="relative z-10 my-12 rounded-[2rem] border border-white/20 bg-black/20 p-6 shadow-2xl backdrop-blur-md">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/95 p-5 text-[#35150c]">
              <Users
                size={27}
                className="text-[#8b2408]"
              />

              <p className="mt-5 text-sm text-slate-500">
                Ardayda
              </p>

              <p className="mt-1 text-2xl font-bold">
                1,248
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-[#35150c]">
              <TrendingUp
                size={27}
                className="text-emerald-600"
              />

              <p className="mt-5 text-sm text-slate-500">
                Kobaca
              </p>

              <p className="mt-1 text-2xl font-bold">
                +24%
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-[#35150c]">
              <WalletCards
                size={27}
                className="text-[#8b2408]"
              />

              <p className="mt-5 text-sm text-slate-500">
                Lacagaha
              </p>

              <p className="mt-1 text-2xl font-bold">
                98.2%
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/15 bg-[#082631]/85 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-100/70">
                  Warbixinta maanta
                </p>

                <p className="mt-2 text-xl font-semibold">
                  Howlaha dugsiga
                </p>
              </div>

              <IdCard className="text-cyan-300" />
            </div>

            <div className="mt-8 grid grid-cols-7 items-end gap-3">
              {[35, 55, 42, 72, 88, 66, 80].map(
                (height, index) => (
                  <div
                    key={index}
                    className="rounded-t-md bg-cyan-300/70"
                    style={{
                      height: `${height}px`,
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {["AM", "HN", "YS"].map((initials) => (
              <div
                key={initials}
                className="flex size-10 items-center justify-center rounded-full border-2 border-[#7c2308] bg-orange-100 text-xs font-bold text-[#6d210d]"
              >
                {initials}
              </div>
            ))}
          </div>

          <p className="text-sm text-orange-50/80">
            Waxaa ku kalsoon in ka badan 500 oo maamule
            dugsi.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;