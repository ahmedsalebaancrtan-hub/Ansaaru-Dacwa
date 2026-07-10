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
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import AuthPageLayout from "../../components/auth/AuthLayout";
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

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!/^\d{6}$/.test(form.otp)) {
      newErrors.otp =
        "OTP must contain exactly 6 numbers";
    }

    if (form.newPassword.length < 6) {
      newErrors.newPassword =
        "Password must be at least 6 characters";
    }

    if (
      form.confirmPassword !== form.newPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
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

  return (
    <AuthPageLayout
      heading="Samee Fure Cusub"
      description="Geli OTP-ga email-kaaga lagu soo diray iyo furahaaga cusub."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        <div>
          <label
            htmlFor="reset-email"
            className="mb-2 block text-sm font-semibold text-[#51433e]"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
            />

            <input
              id="reset-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value,
                )
              }
              className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fff4f0] pl-12 pr-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="otp"
            className="mb-2 block text-sm font-semibold text-[#51433e]"
          >
            OTP Code
          </label>

          <div className="relative">
            <KeyRound
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
            />

            <input
              id="otp"
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

                updateField("otp", numbersOnly);
              }}
              placeholder="000000"
              className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fff4f0] pl-12 pr-4 tracking-[0.35em] outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {errors.otp && (
            <p className="mt-2 text-sm text-red-600">
              {errors.otp}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-semibold text-[#51433e]"
            >
              Furaha Cusub
            </label>

            <div className="relative">
              <LockKeyhole
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
              />

              <input
                id="new-password"
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
                className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fff4f0] pl-12 pr-12 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#88736c]"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-semibold text-[#51433e]"
            >
              Hubi Furaha
            </label>

            <input
              id="confirm-password"
              type={
                showPassword ? "text" : "password"
              }
              value={form.confirmPassword}
              onChange={(event) =>
                updateField(
                  "confirmPassword",
                  event.target.value,
                )
              }
              className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fff4f0] px-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#8b2408] font-bold text-white transition hover:bg-[#701b05] focus:ring-4 focus:ring-orange-200 disabled:opacity-60"
        >
          {resetPasswordMutation.isPending && (
            <LoaderCircle
              size={20}
              className="animate-spin"
            />
          )}

          Cusboonaysii Furaha
        </button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-[#7c2a13] hover:underline"
        >
          <ArrowLeft size={17} />
          Ku noqo Login
        </Link>
      </form>
    </AuthPageLayout>
  );
}

export default ResetPasswordPage;