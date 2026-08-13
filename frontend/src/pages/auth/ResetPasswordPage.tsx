import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useResetPassword } from "../../hooks/auth/useAuthMutations";

interface ResetForm {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const LOGO_PATH = "/logo.jpeg";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetPasswordMutation =
    useResetPassword();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState<ResetForm>({
    email: searchParams.get("email") ?? "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] =
    useState<ResetErrors>({});

  const updateField = (
    field: keyof ResetForm,
    value: string,
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

  const validateForm = (): ResetErrors => {
    const newErrors: ResetErrors = {};

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      newErrors.email = "Geli email sax ah";
    }

    if (!/^\d{6}$/.test(form.otp)) {
      newErrors.otp =
        "OTP-gu waa inuu noqdaa 6 lambar";
    }

    if (form.newPassword.length < 6) {
      newErrors.newPassword =
        "Password-ku waa inuu ugu yaraan yahay 6 xaraf";
    }

    if (
      form.confirmPassword !==
      form.newPassword
    ) {
      newErrors.confirmPassword =
        "Labada password isku mid ma aha";
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

    resetPasswordMutation.mutate(
      {
        email: form.email.trim(),
        otp: form.otp,
        new_password: form.newPassword,
      },
      {
        onSuccess: () => {
          navigate("/login", {
            replace: true,
          });
        },
      },
    );
  };

  const inputClass = (
    hasError: boolean,
  ) =>
    [
      "h-9 w-full rounded-lg border bg-[#fff4f0]",
      "text-[11px] text-[#2d211d] outline-none transition",
      "placeholder:text-[#a7958e]",
      "focus:bg-white focus:ring-2",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100",
    ].join(" ");

  return (
    <main className="flex h-dvh items-center justify-center overflow-hidden bg-[#fff8f5] px-4 py-3">
      <section className="w-full max-w-lg overflow-hidden rounded-xl border border-[#ead8d0] bg-white shadow-sm">
        {/* School identity */}
        <header className="border-b border-[#eee1dc] bg-[#fff4f0] px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#eadbd5] bg-white p-1 shadow-sm">
              <img
                src={LOGO_PATH}
                alt="Ansaaru Dacwa Islamic School"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-black text-[#42160c]">
                Ansaaru Dacwa Islamic School
              </h1>

              <p className="mt-0.5 text-[9px] font-medium text-slate-500">
                Nidaamka maamulka dugsiga
              </p>
            </div>
          </div>
        </header>

        <div className="p-4">
          {/* Heading */}
          <div className="mb-3 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <KeyRound size={17} />
            </div>

            <h2 className="mt-2 text-lg font-black text-[#271814]">
              Samee Fure Cusub
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-[10px] leading-4 text-slate-500">
              Geli OTP-ga email-kaaga lagu soo
              diray iyo furahaaga cusub.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-2.5"
            noValidate
          >
            {/* Email and OTP */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-1 block text-[10px] font-bold text-[#51433e]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
                  />

                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="ahmed@gmail.com"
                    autoComplete="email"
                    aria-invalid={Boolean(
                      errors.email,
                    )}
                    className={`${inputClass(
                      Boolean(errors.email),
                    )} pl-9 pr-3`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-0.5 text-[9px] font-medium text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="mb-1 block text-[10px] font-bold text-[#51433e]"
                >
                  OTP Code
                </label>

                <div className="relative">
                  <KeyRound
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
                  />

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.otp}
                    onChange={(event) => {
                      const numbersOnly =
                        event.target.value.replace(
                          /\D/g,
                          "",
                        );

                      updateField(
                        "otp",
                        numbersOnly,
                      );
                    }}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    aria-invalid={Boolean(
                      errors.otp,
                    )}
                    className={`${inputClass(
                      Boolean(errors.otp),
                    )} pl-9 pr-3 tracking-[0.25em]`}
                  />
                </div>

                {errors.otp && (
                  <p className="mt-0.5 text-[9px] font-medium text-red-600">
                    {errors.otp}
                  </p>
                )}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1 block text-[10px] font-bold text-[#51433e]"
                >
                  Furaha Cusub
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
                  />

                  <input
                    id="new-password"
                    name="newPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.newPassword}
                    onChange={(event) =>
                      updateField(
                        "newPassword",
                        event.target.value,
                      )
                    }
                    placeholder="Ugu yaraan 6 xaraf"
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      errors.newPassword,
                    )}
                    className={`${inputClass(
                      Boolean(
                        errors.newPassword,
                      ),
                    )} pl-9 pr-9`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (currentValue) =>
                          !currentValue,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88736c] transition hover:text-[#6d210d]"
                    aria-label={
                      showPassword
                        ? "Qari furaha"
                        : "Muuji furaha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>

                {errors.newPassword && (
                  <p className="mt-0.5 text-[9px] font-medium text-red-600">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-[10px] font-bold text-[#51433e]"
                >
                  Hubi Furaha
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
                  />

                  <input
                    id="confirm-password"
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
                    )} pl-9 pr-3`}
                  />
                </div>

                {errors.confirmPassword && (
                  <p className="mt-0.5 text-[9px] font-medium text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Security notice */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={13}
                  className="mt-0.5 shrink-0 text-blue-700"
                />

                <p className="text-[9px] leading-4 text-blue-700">
                  OTP-ga waa inuu noqdaa lix lambar,
                  furaha cusubna si ammaan ah u kaydi.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                resetPasswordMutation.isPending
              }
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[10px] font-black text-white transition hover:bg-[#701b05] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />

                  Waa la cusboonaysiinayaa...
                </>
              ) : (
                <>
                  <KeyRound size={14} />
                  Cusboonaysii Furaha
                </>
              )}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#7c2a13] transition hover:underline"
            >
              <ArrowLeft size={13} />
              Ku noqo Login
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ResetPasswordPage;