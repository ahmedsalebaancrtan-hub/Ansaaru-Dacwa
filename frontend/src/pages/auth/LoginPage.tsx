import {
  useState,
  type FormEvent,
} from "react";

import {
  BookOpenCheck,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useLogin } from "../../hooks/auth/useLogin";

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

const LOGO_PATH = "/logo.jpeg";

function validateForm(form: LoginForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.emailaddress.trim()) {
    errors.emailaddress =
      "Email-ka waa required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.emailaddress,
    )
  ) {
    errors.emailaddress =
      "Geli email sax ah";
  }

  if (!form.password) {
    errors.password =
      "Password-ku waa required";
  } else if (form.password.length < 8) {
    errors.password =
      "Password-ku waa inuu ugu yaraan yahay 8 xaraf";
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

    const validationErrors =
      validateForm(form);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate({
      credentials: {
        emailaddress:
          form.emailaddress.trim(),
        password: form.password,
      },

      remember: form.remember,
    });
  };

  return (
    <main className="grid h-dvh overflow-hidden bg-[#fffaf8] lg:grid-cols-2">
      {/* Login section */}
      <section className="flex h-full items-center justify-center overflow-hidden px-4 py-3 sm:px-6 lg:px-10">
        <div className="w-full max-w-sm">
          {/* School identity */}
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#eadbd5] bg-white p-1 shadow-sm">
              <img
                src={LOGO_PATH}
                alt="Ansaaru Dacwa Islamic School logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black text-[#42160c]">
                Ansaaru Dacwa Islamic School
              </h1>

              <p className="mt-0.5 text-[9px] font-medium text-slate-500">
                Nidaamka maamulka dugsiga
              </p>
            </div>
          </div>

          {/* Welcome heading */}
          <div className="mb-4">
            <h2 className="text-xl font-black tracking-tight text-[#201916]">
              Soo Dhawoow
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Geli macluumaadkaaga si aad
              nidaamka u gasho.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
            noValidate
          >
            {/* Email */}
            <div>
              <label
                htmlFor="emailaddress"
                className="mb-1 block text-[10px] font-bold text-[#51433e]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b857d]"
                />

                <input
                  id="emailaddress"
                  name="emailaddress"
                  type="email"
                  value={form.emailaddress}
                  onChange={(event) =>
                    updateEmail(
                      event.target.value,
                    )
                  }
                  placeholder="ahmed@gmail.com"
                  autoComplete="email"
                  aria-invalid={Boolean(
                    errors.emailaddress,
                  )}
                  className={`h-9 w-full rounded-lg border bg-[#fff4f0] pl-9 pr-3 text-[11px] text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-2 ${
                    errors.emailaddress
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#9b3215] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.emailaddress && (
                <p className="mt-1 text-[9px] font-medium text-red-600">
                  {errors.emailaddress}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-[10px] font-bold text-[#51433e]"
                >
                  Furaha Sirta ah
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[9px] font-bold text-[#7c2a13] transition hover:underline"
                >
                  Ma illoowday?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b857d]"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={(event) =>
                    updatePassword(
                      event.target.value,
                    )
                  }
                  placeholder="Geli furahaaga"
                  autoComplete="current-password"
                  aria-invalid={Boolean(
                    errors.password,
                  )}
                  className={`h-9 w-full rounded-lg border bg-[#fff4f0] pl-9 pr-10 text-[11px] text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-2 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#9b3215] focus:ring-orange-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87736c] transition hover:text-[#6d210d]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-[9px] font-medium text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex w-fit cursor-pointer items-center gap-1.5 text-[10px] font-medium text-[#5e514c]">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    remember:
                      event.target.checked,
                  }))
                }
                className="size-3.5 rounded border-[#d7c2ba] accent-[#8b2408]"
              />

              Xasuuso akoonkayga
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loginMutation.isPending
              }
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#087faa] px-4 text-[11px] font-black text-white shadow-sm transition hover:bg-[#066f96] focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loginMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />

                  Waa lagu gelinayaa...
                </>
              ) : (
                "Soo Gal Nidaamka"
              )}
            </button>

            {/* Register link */}
            <p className="text-center text-[9px] text-slate-500">
              Akoon ma lihid?{" "}
              <Link
                to="/register"
                className="font-black text-[#7c2a13] hover:underline"
              >
                Samee akoon cusub
              </Link>
            </p>
          </form>

          {/* Security */}
          <div className="mt-4 border-t border-[#eaded9] pt-3">
            <div className="flex items-center justify-between gap-2 text-[9px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck
                  size={13}
                  className="text-[#74240e]"
                />

                Xogtaadu waa ammaan
              </span>

              <span className="flex items-center gap-1">
                <LockKeyhole
                  size={12}
                  className="text-[#74240e]"
                />

                SSL encrypted
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right information section */}
      <section className="relative hidden h-full overflow-hidden bg-gradient-to-br from-[#9c3a19] via-[#7c2308] to-[#3e1005] p-7 text-white lg:flex lg:items-center lg:justify-center xl:p-10">
        <div className="absolute -right-28 -top-28 size-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-black/25 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/25 bg-white p-1 shadow-md">
              <img
                src={LOGO_PATH}
                alt="Ansaaru Dacwa logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-orange-100/75">
                Nidaamka Maamulka
              </p>

              <h2 className="mt-0.5 text-sm font-black">
                Ansaaru Dacwa
              </h2>
            </div>
          </div>

          <h3 className="mt-6 text-2xl font-black leading-tight tracking-tight">
            Maamul dugsigaaga si fudud oo
            casri ah
          </h3>

          <p className="mt-2 max-w-sm text-[11px] leading-5 text-orange-50/75">
            Hal meel kaga maamul ardayda,
            fasallada, macallimiinta iyo
            maaliyadda dugsiga.
          </p>

          {/* Features */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 p-2.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <UsersRound size={15} />
              </div>

              <div>
                <p className="text-[11px] font-black">
                  Maamulka Ardayda
                </p>

                <p className="mt-0.5 text-[9px] text-orange-50/65">
                  Diiwaangelin iyo xog
                  dhammeystiran
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 p-2.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <BookOpenCheck size={15} />
              </div>

              <div>
                <p className="text-[11px] font-black">
                  Fasallada iyo Waxbarashada
                </p>

                <p className="mt-0.5 text-[9px] text-orange-50/65">
                  La socod fudud oo nidaamsan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 p-2.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <WalletCards size={15} />
              </div>

              <div>
                <p className="text-[11px] font-black">
                  Maaliyadda Dugsiga
                </p>

                <p className="mt-0.5 text-[9px] text-orange-50/65">
                  Lacagaha iyo warbixinnada
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[9px] text-orange-50/55">
            © 2026 Ansaaru Dacwa Islamic School
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;