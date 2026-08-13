import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
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
} from "react-router-dom";

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

const LOGO_PATH = "/logo.jpeg";

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
        "Magacu waa inuu ugu yaraan yahay 3 xaraf";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.emailaddress.trim(),
      )
    ) {
      newErrors.emailaddress =
        "Geli email sax ah";
    }

    if (!form.role) {
      newErrors.role =
        "Dooro doorka shaqada";
    }

    if (form.password.length < 8) {
      newErrors.password =
        "Password-ku waa inuu ugu yaraan yahay 8 xaraf";
    }

    if (
      form.confirmPassword !==
      form.password
    ) {
      newErrors.confirmPassword =
        "Labada password isku mid ma aha";
    }

    if (!form.acceptTerms) {
      newErrors.acceptTerms =
        "Aqbal shuruudaha nidaamka";
    }

    return newErrors;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    if (!form.role) {
      return;
    }

    const request: RegisterRequest = {
      fullname: form.fullname.trim(),
      emailaddress:
        form.emailaddress.trim(),
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

  const inputClass = (
    hasError: boolean,
  ) =>
    [
      "h-8.5 w-full rounded-md border bg-[#fff5f1]",
      "text-[10px] text-[#2d211d] outline-none transition",
      "placeholder:text-[#a7958e]",
      "focus:bg-white focus:ring-2",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100",
    ].join(" ");

  return (
    <main className="grid h-dvh overflow-hidden bg-[#fffaf8] lg:grid-cols-[42%_58%]">
      {/* Register form */}
      <section className="flex h-full items-center justify-center overflow-hidden px-4 py-2 lg:px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <header className="mb-2.5 flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#eadbd5] bg-white p-0.5 shadow-sm">
              <img
                src={LOGO_PATH}
                alt="Ansaaru Dacwa Islamic School"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[11px] font-black text-[#42160c]">
                Ansaaru Dacwa Islamic School
              </h1>

              <p className="text-[8px] text-slate-500">
                Nidaamka maamulka dugsiga
              </p>
            </div>
          </header>

          {/* Heading */}
          <div className="mb-2.5">
            <h2 className="text-base font-black text-[#211916]">
              Samee Akoon Cusub
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-500">
              Geli macluumaadkaaga si aad
              akoon cusub u samaysato.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-2"
            noValidate
          >
            {/* Full name */}
            <div>
              <label
                htmlFor="fullname"
                className="mb-0.5 block text-[9px] font-bold text-[#51433e]"
              >
                Magaca Buuxa
              </label>

              <div className="relative">
                <UserRound
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                  placeholder="Magacaaga oo buuxa"
                  autoComplete="name"
                  aria-invalid={Boolean(
                    errors.fullname,
                  )}
                  className={`${inputClass(
                    Boolean(errors.fullname),
                  )} pl-8 pr-2.5`}
                />
              </div>

              {errors.fullname && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.fullname}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="emailaddress"
                className="mb-0.5 block text-[9px] font-bold text-[#51433e]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                  placeholder="tusaale@gmail.com"
                  autoComplete="email"
                  aria-invalid={Boolean(
                    errors.emailaddress,
                  )}
                  className={`${inputClass(
                    Boolean(
                      errors.emailaddress,
                    ),
                  )} pl-8 pr-2.5`}
                />
              </div>

              {errors.emailaddress && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.emailaddress}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-0.5 block text-[9px] font-bold text-[#51433e]"
              >
                Doorka Shaqada
              </label>

              <div className="relative">
                <School
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                  aria-invalid={Boolean(
                    errors.role,
                  )}
                  className={`${inputClass(
                    Boolean(errors.role),
                  )} appearance-none pl-8 pr-2.5`}
                >
                  <option value="">
                    Dooro doorka shaqada
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
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-0.5 block text-[9px] font-bold text-[#51433e]"
              >
                Furaha Sirta ah
              </label>

              <div className="relative">
                <LockKeyhole
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                  className={`${inputClass(
                    Boolean(errors.password),
                  )} pl-8 pr-8`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#88736c]"
                  aria-label={
                    showPassword
                      ? "Qari furaha"
                      : "Muuji furaha"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={13} />
                  ) : (
                    <Eye size={13} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-0.5 block text-[9px] font-bold text-[#51433e]"
              >
                Hubi Furaha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                  className={`${inputClass(
                    Boolean(
                      errors.confirmPassword,
                    ),
                  )} pl-8 pr-2.5`}
                />
              </div>

              {errors.confirmPassword && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex cursor-pointer items-start gap-1.5 text-[8px] leading-3 text-[#5e514c]">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(event) =>
                    updateField(
                      "acceptTerms",
                      event.target.checked,
                    )
                  }
                  className="mt-0.5 size-3 shrink-0 rounded border-[#d7c2ba] accent-[#8b2408]"
                />

                <span>
                  Waxaan aqbalay{" "}
                  <button
                    type="button"
                    className="font-black text-[#7c2a13] hover:underline"
                  >
                    shuruudaha
                  </button>{" "}
                  nidaamka.
                </span>
              </label>

              {errors.acceptTerms && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                registerMutation.isPending
              }
              className="flex h-8.5 w-full items-center justify-center gap-1 rounded-md bg-gradient-to-r from-[#a43b18] to-[#7b2109] px-3 text-[9px] font-black text-white shadow-sm transition hover:from-[#8c2e10] hover:to-[#651805] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                  Akoonka waa la samaynayaa...
                </>
              ) : (
                <>
                  Diiwaangeli Akoonka
                  <ArrowRight size={13} />
                </>
              )}
            </button>

            <p className="text-center text-[8px] text-slate-500">
              Horey akoon ma u lahayd?{" "}
              <Link
                to="/login"
                className="font-black text-[#7c2a13] hover:underline"
              >
                Soo gal
              </Link>
            </p>
          </form>
        </div>
      </section>

      {/* Information panel */}
      <aside className="relative hidden h-full overflow-hidden bg-gradient-to-br from-[#8f2c0e] via-[#691a05] to-[#300b03] p-6 text-white lg:flex lg:items-center lg:justify-center">
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="absolute -bottom-28 -left-20 size-72 rounded-full bg-black/30 blur-3xl" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/25 bg-white p-1 shadow-sm">
              <img
                src={LOGO_PATH}
                alt="Ansaaru Dacwa logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-orange-100/75">
                Nidaamka Maamulka
              </p>

              <h2 className="text-xs font-black">
                Ansaaru Dacwa
              </h2>
            </div>
          </div>

          <h3 className="mt-4 text-xl font-black leading-tight">
            Maamul dugsigaaga si casri ah
          </h3>

          <p className="mt-1.5 max-w-xs text-[9px] leading-4 text-orange-50/70">
            Hal meel kaga maamul ardayda,
            shaqaalaha iyo maaliyadda dugsiga.
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/10 p-2">
              <UsersRound size={14} />

              <div>
                <p className="text-[9px] font-black">
                  Maamulka Ardayda
                </p>

                <p className="text-[8px] text-orange-50/65">
                  Maamul xogta ardayda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/10 p-2">
              <WalletCards size={14} />

              <div>
                <p className="text-[9px] font-black">
                  Maaliyadda
                </p>

                <p className="text-[8px] text-orange-50/65">
                  La soco lacagaha dugsiga
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-md border border-white/15 bg-black/15 p-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />

              <div>
                <p className="text-[9px] font-black">
                  Xogtaadu waa ammaan
                </p>

                <p className="text-[8px] text-orange-50/65">
                  Nidaam amni casri ah.
                </p>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              {[
                "Maamulka ardayda",
                "Warbixinno degdeg ah",
                "Maamulka lacagaha",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-1.5 text-[8px] text-orange-50/80"
                >
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check size={8} />
                  </span>

                  {feature}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-[8px] text-orange-50/55">
            © 2026 Ansaaru Dacwa Islamic School
          </p>
        </div>
      </aside>
    </main>
  );
}

export default RegisterPage;