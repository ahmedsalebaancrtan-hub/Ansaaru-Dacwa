import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  School,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router";

import { useRegister } from "../../hooks/auth/useRegister";

import type {
  RegisterRequest,
  UserRole,
} from "../../types/Auth/auth.types";

type RegisterRole = UserRole | "";

interface RegisterForm {
  fullname: string;
  emailaddress: string;
  role: RegisterRole;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterErrors {
  fullname?: string;
  emailaddress?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

const initialForm: RegisterForm = {
  fullname: "",
  emailaddress: "",
  role: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const roleOptions: Array<{
  value: UserRole;
  label: string;
}> = [
  {
    value: "ADMIN",
    label: "Maamulaha Guud",
  },
  {
    value: "STUDENT_AFFAIRS",
    label: "Arrimaha Ardayda",
  },
  {
    value: "CASHIER",
    label: "Qasnaji",
  },
];

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [form, setForm] =
    useState<RegisterForm>(initialForm);

  const [errors, setErrors] =
    useState<RegisterErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  // Updates one form field and removes its previous error.
  const updateField = <
    Field extends keyof RegisterForm,
  >(
    field: Field,
    value: RegisterForm[Field],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const validateForm = (): RegisterErrors => {
    const newErrors: RegisterErrors = {};

    if (form.fullname.trim().length < 3) {
      newErrors.fullname =
        "Magaca buuxa waa inuu ugu yaraan yahay 3 xaraf";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.emailaddress.trim(),
      )
    ) {
      newErrors.emailaddress =
        "Fadlan geli email sax ah";
    }

    if (!form.role) {
      newErrors.role =
        "Fadlan dooro doorka shaqada";
    }

    if (form.password.length < 8) {
      newErrors.password =
        "Furaha sirta ah waa inuu ugu yaraan yahay 8 xaraf";
    }

    if (
      form.confirmPassword !== form.password
    ) {
      newErrors.confirmPassword =
        "Labada fure isku mid ma aha";
    }

    if (!form.acceptTerms) {
      newErrors.acceptTerms =
        "Waa inaad aqbashaa shuruudaha nidaamka";
    }

    return newErrors;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    // TypeScript now knows that a role has been selected.
    if (!form.role) {
      return;
    }

    const request: RegisterRequest = {
      fullname: form.fullname.trim(),
      emailaddress: form.emailaddress.trim(),
      password: form.password,
      role: form.role,
    };

    registerMutation.mutate(request, {
      onSuccess: () => {
        setForm(initialForm);

        navigate("/dashboard", {
          replace: true,
        });
      },
    });
  };

  return (
    <main className="min-h-dvh bg-[#fffaf8] lg:grid lg:grid-cols-[44%_56%]">
      {/* Registration form */}
      <section className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
        <div className="w-full max-w-xl">
          <header className="mb-8 flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#8b2408] text-white shadow-lg shadow-orange-950/15">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#42160c] sm:text-xl">
                Ansaaru Dacwa Islamic School
              </h1>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Nidaamka maamulka dugsiga
              </p>
            </div>
          </header>

          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-[#211916] sm:text-4xl">
              Samee Akoon Cusub
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Ku soo biir nidaamka maamulka dugsiga oo
              si fudud u maamul howlahaaga.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            {/* Full name */}
            <div>
              <label
                htmlFor="fullname"
                className="mb-2 block text-sm font-semibold text-[#51433e]"
              >
                Magaca Buuxa
              </label>

              <div className="relative">
                <UserRound
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={form.fullname}
                  onChange={(event) =>
                    updateField(
                      "fullname",
                      event.target.value,
                    )
                  }
                  placeholder="Geli magacaaga oo saddexan"
                  autoComplete="name"
                  aria-invalid={Boolean(
                    errors.fullname,
                  )}
                  className={`h-14 w-full rounded-xl border bg-[#fff5f1] pl-12 pr-4 text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-4 ${
                    errors.fullname
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.fullname && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.fullname}
                </p>
              )}
            </div>

            {/* Email address */}
            <div>
              <label
                htmlFor="emailaddress"
                className="mb-2 block text-sm font-semibold text-[#51433e]"
              >
                Email-ka Rasmiga ah
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="emailaddress"
                  name="emailaddress"
                  type="email"
                  value={form.emailaddress}
                  onChange={(event) =>
                    updateField(
                      "emailaddress",
                      event.target.value,
                    )
                  }
                  placeholder="tusaale@dugsi.com"
                  autoComplete="email"
                  aria-invalid={Boolean(
                    errors.emailaddress,
                  )}
                  className={`h-14 w-full rounded-xl border bg-[#fff5f1] pl-12 pr-4 text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-4 ${
                    errors.emailaddress
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.emailaddress && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailaddress}
                </p>
              )}
            </div>

            {/* User role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-[#51433e]"
              >
                Doorka Shaqada
              </label>

              <div className="relative">
                <School
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={(event) =>
                    updateField(
                      "role",
                      event.target
                        .value as RegisterRole,
                    )
                  }
                  aria-invalid={Boolean(errors.role)}
                  className={`h-14 w-full appearance-none rounded-xl border bg-[#fff5f1] pl-12 pr-10 text-[#2d211d] outline-none transition focus:bg-white focus:ring-4 ${
                    errors.role
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                >
                  <option value="">
                    Dooro doorkaaga shaqo
                  </option>

                  {roleOptions.map((role) => (
                    <option
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {errors.role && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Password fields */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#51433e]"
                >
                  Furaha Sirta ah
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                      updateField(
                        "password",
                        event.target.value,
                      )
                    }
                    placeholder="Ugu yaraan 8 xaraf"
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      errors.password,
                    )}
                    className={`h-14 w-full rounded-xl border bg-[#fff5f1] pl-12 pr-12 text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-4 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#88736c] transition hover:text-[#6d210d]"
                    aria-label={
                      showPassword
                        ? "Qari furaha"
                        : "Muuji furaha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#51433e]"
                >
                  Hubi Furaha Sirta ah
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value,
                      )
                    }
                    placeholder="Ku celi furaha"
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      errors.confirmPassword,
                    )}
                    className={`h-14 w-full rounded-xl border bg-[#fff5f1] pl-12 pr-4 text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-4 ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                    }`}
                  />
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and conditions */}
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#5e514c]">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(event) =>
                    updateField(
                      "acceptTerms",
                      event.target.checked,
                    )
                  }
                  className="mt-1 size-5 shrink-0 rounded border-[#d7c2ba] accent-[#8b2408]"
                />

                <span>
                  Waxaan aqbalay{" "}
                  <button
                    type="button"
                    className="font-semibold text-[#7c2a13] hover:underline"
                  >
                    shuruudaha
                  </button>{" "}
                  iyo qawaaniinta isticmaalka nidaamka.
                </span>
              </label>

              {errors.acceptTerms && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a43b18] to-[#7b2109] px-6 font-bold text-white shadow-lg shadow-orange-950/15 transition hover:from-[#8c2e10] hover:to-[#651805] focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />

                  Akoonka waa la samaynayaa...
                </>
              ) : (
                <>
                  Diiwaangeli Akoonka
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Horey ma u lahayd akoon?{" "}
              <Link
                to="/login"
                className="font-bold text-[#7c2a13] transition hover:underline"
              >
                Soo gal halkan
              </Link>
            </p>
          </form>
        </div>
      </section>

      {/* Information panel displayed on large screens */}
      <aside className="relative hidden min-h-dvh overflow-hidden bg-gradient-to-br from-[#8f2c0e] via-[#691a05] to-[#300b03] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-40 -top-40 size-[30rem] rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-44 -left-40 size-[28rem] rounded-full bg-black/30 blur-3xl" />

        <div className="relative z-10">
          <p className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            DIYAAR GAROW MUSTAQBALKA
          </p>

          <h2 className="mt-10 max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl">
            Maamul Dugsigaaga si Casri ah
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-orange-50/75">
            Nidaam awood badan oo kuu fududaynaya
            maamulka ardayda, shaqaalaha, lacagaha iyo
            warbixinnada dugsiga.
          </p>
        </div>

        <div className="relative z-10 my-12 rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl bg-white/95 p-5 text-[#35150c]">
              <UsersRound className="text-[#8b2408]" />

              <p className="mt-5 text-sm text-slate-500">
                Ardayda
              </p>

              <p className="mt-1 text-2xl font-bold">
                1,248
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-[#35150c]">
              <BarChart3 className="text-emerald-600" />

              <p className="mt-5 text-sm text-slate-500">
                Kobaca
              </p>

              <p className="mt-1 text-2xl font-bold">
                +24%
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-5 text-[#35150c]">
              <WalletCards className="text-[#8b2408]" />

              <p className="mt-5 text-sm text-slate-500">
                Lacagaha
              </p>

              <p className="mt-1 text-2xl font-bold">
                98.2%
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/15 bg-[#351108]/70 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="font-bold">
                  Xogtaadu waa ammaan
                </p>

                <p className="mt-1 text-sm text-orange-50/65">
                  Nidaamka waxaa lagu ilaaliyaa amni
                  casri ah.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Maamulka ardayda iyo shaqaalaha",
                "Warbixinno degdeg ah",
                "Maamulka lacagaha dugsiga",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-orange-50/85"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check size={14} />
                  </span>

                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-orange-50/70">
          Waxaa isticmaala maamulayaal iyo shaqaale
          waxbarasho.
        </p>
      </aside>
    </main>
  );
}

export default RegisterPage;
