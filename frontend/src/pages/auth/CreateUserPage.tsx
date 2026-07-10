import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router";

import { useCreateUser } from "../../hooks/auth/useAuthMutations";

import type {
  CreateUserRequest,
  UserRole,
} from "../../types/Auth/auth.types";

interface CreateUserForm {
  fullname: string;
  emailaddress: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullname?: string;
  emailaddress?: string;
  password?: string;
  confirmPassword?: string;
}

const initialForm: CreateUserForm = {
  fullname: "",
  emailaddress: "",
  role: "STUDENT_AFFAIRS",
  password: "",
  confirmPassword: "",
};

function CreateUserPage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const [form, setForm] =
    useState<CreateUserForm>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  const updateField = <
    Field extends keyof CreateUserForm,
  >(
    field: Field,
    value: CreateUserForm[Field],
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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (form.fullname.trim().length < 3) {
      newErrors.fullname =
        "Full name must be at least 3 characters";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.emailaddress.trim(),
      )
    ) {
      newErrors.emailaddress =
        "Enter a valid email address";
    }

    if (form.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (
      form.confirmPassword !== form.password
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

    const request: CreateUserRequest = {
      fullname: form.fullname.trim(),
      emailaddress: form.emailaddress.trim(),
      password: form.password,
      role: form.role,
    };

    createUserMutation.mutate(request, {
      onSuccess: () => {
        setForm(initialForm);
        setErrors({});
      },
    });
  };

  return (
    <main className="min-h-dvh bg-[#fff8f5] px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#7c2a13] hover:underline"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-[#271814] sm:text-3xl">
              Samee Akoon Cusub
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Samee akoon shaqaale cusub oo geli
              doorka uu nidaamka ku leeyahay.
            </p>
          </div>

          <div className="flex size-12 items-center justify-center rounded-xl bg-[#8b2408] text-white">
            <UserPlus size={25} />
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#ead8d0] bg-white shadow-sm">
          <div className="border-b border-[#eee1dc] bg-[#fff4f0] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={21}
                className="text-[#8b2408]"
              />

              <p className="font-semibold text-[#432219]">
                Macluumaadka Akoonka
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-5 sm:p-8"
            noValidate
          >
            <div className="grid gap-6 md:grid-cols-2">
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
                    value={form.fullname}
                    onChange={(event) =>
                      updateField(
                        "fullname",
                        event.target.value,
                      )
                    }
                    placeholder="Geli magaca oo saddexan"
                    className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fffaf0] pl-12 pr-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {errors.fullname && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.fullname}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="user-email"
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
                    id="user-email"
                    type="email"
                    value={form.emailaddress}
                    onChange={(event) =>
                      updateField(
                        "emailaddress",
                        event.target.value,
                      )
                    }
                    placeholder="user@example.com"
                    className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fffaf0] pl-12 pr-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {errors.emailaddress && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.emailaddress}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-[#51433e]"
              >
                Doorka Shaqada
              </label>

              <select
                id="role"
                value={form.role}
                onChange={(event) =>
                  updateField(
                    "role",
                    event.target.value as UserRole,
                  )
                }
                className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fffaf0] px-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="ADMIN">
                  Maamulaha Guud
                </option>

                <option value="STUDENT_AFFAIRS">
                  Arrimaha Ardayda
                </option>

                <option value="CASHIER">
                  Qasnaji
                </option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="create-password"
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
                    id="create-password"
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
                    className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fffaf0] pl-12 pr-12 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
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

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-create-password"
                  className="mb-2 block text-sm font-semibold text-[#51433e]"
                >
                  Hubi Furaha Sirta ah
                </label>

                <input
                  id="confirm-create-password"
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
                  className="h-14 w-full rounded-xl border border-[#dfcbc4] bg-[#fffaf0] px-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#eee1dc] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="h-12 rounded-xl border border-[#d9c6be] px-6 font-semibold text-[#5c453d] transition hover:bg-[#fff4f0]"
              >
                Ka Noqo
              </button>

              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-7 font-bold text-white transition hover:bg-[#701b05] focus:ring-4 focus:ring-orange-200 disabled:opacity-60"
              >
                {createUserMutation.isPending ? (
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                ) : (
                  <UserPlus size={20} />
                )}

                Diiwaangeli Akoonka
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateUserPage;