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
} from "react-router-dom";

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

    if (form.password.length < 8) {
      newErrors.password =
        "Password-ku waa inuu ugu yaraan yahay 8 xaraf";
    }

    if (
      form.confirmPassword !== form.password
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

    const request: CreateUserRequest = {
      fullname: form.fullname.trim(),
      emailaddress:
        form.emailaddress.trim(),
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

  const inputClass = (
    hasError: boolean,
  ) =>
    [
      "h-9 w-full rounded-lg border bg-[#fffaf0]",
      "text-[11px] text-[#2d211d] outline-none transition",
      "placeholder:text-[#a7958e]",
      "focus:bg-white focus:ring-2",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100",
    ].join(" ");

  return (
    <div className="h-[calc(100dvh-8rem)] overflow-hidden bg-[#fff8f5] md:h-[calc(100dvh-6rem)]">
      <div className="mx-auto flex h-full max-w-4xl flex-col">
        {/* Page heading */}
        <header className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/dashboard"
              className="mb-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#7c2a13] transition hover:underline"
            >
              <ArrowLeft size={13} />
              Dashboard
            </Link>

            <h1 className="text-lg font-black text-[#271814] sm:text-xl">
              Samee Akoon Cusub
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Samee akoon shaqaale cusub oo
              door u qoondee.
            </p>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#8b2408] text-white shadow-sm">
            <UserPlus size={18} />
          </div>
        </header>

        {/* Form card */}
        <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#ead8d0] bg-white shadow-sm">
          <div className="flex h-full flex-col">
            {/* Card heading */}
            <div className="flex shrink-0 items-center gap-2 border-b border-[#eee1dc] bg-[#fff4f0] px-4 py-2.5">
              <ShieldCheck
                size={16}
                className="text-[#8b2408]"
              />

              <p className="text-[11px] font-black text-[#432219]">
                Macluumaadka Akoonka
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col justify-between p-4"
              noValidate
            >
              <div className="space-y-3">
                {/* Name and email */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullname"
                      className="mb-1 block text-[10px] font-bold text-[#51433e]"
                    >
                      Magaca Buuxa
                    </label>

                    <div className="relative">
                      <UserRound
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
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
                        placeholder="Geli magaca oo buuxa"
                        autoComplete="name"
                        aria-invalid={Boolean(
                          errors.fullname,
                        )}
                        className={`${inputClass(
                          Boolean(errors.fullname),
                        )} pl-9 pr-3`}
                      />
                    </div>

                    {errors.fullname && (
                      <p className="mt-0.5 text-[9px] font-medium text-red-600">
                        {errors.fullname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="user-email"
                      className="mb-1 block text-[10px] font-bold text-[#51433e]"
                    >
                      Email-ka Rasmiga ah
                    </label>

                    <div className="relative">
                      <Mail
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
                      />

                      <input
                        id="user-email"
                        name="emailaddress"
                        type="email"
                        value={form.emailaddress}
                        onChange={(event) =>
                          updateField(
                            "emailaddress",
                            event.target.value,
                          )
                        }
                        placeholder="user@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(
                          errors.emailaddress,
                        )}
                        className={`${inputClass(
                          Boolean(
                            errors.emailaddress,
                          ),
                        )} pl-9 pr-3`}
                      />
                    </div>

                    {errors.emailaddress && (
                      <p className="mt-0.5 text-[9px] font-medium text-red-600">
                        {errors.emailaddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-1 block text-[10px] font-bold text-[#51433e]"
                  >
                    Doorka Shaqada
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={(event) =>
                      updateField(
                        "role",
                        event.target
                          .value as UserRole,
                      )
                    }
                    className={`${inputClass(
                      false,
                    )} appearance-none px-3`}
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

                {/* Passwords */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="create-password"
                      className="mb-1 block text-[10px] font-bold text-[#51433e]"
                    >
                      Furaha Sirta ah
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99847c]"
                      />

                      <input
                        id="create-password"
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

                    {errors.password && (
                      <p className="mt-0.5 text-[9px] font-medium text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-create-password"
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
                        id="confirm-create-password"
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

                {/* Account information */}
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck
                      size={14}
                      className="mt-0.5 shrink-0 text-blue-700"
                    />

                    <p className="text-[9px] leading-4 text-blue-700">
                      Isticmaaluhu wuxuu nidaamka ku
                      geli doonaa email-ka iyo
                      password-ka aad u samayso.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex shrink-0 flex-col-reverse gap-2 border-t border-[#eee1dc] pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="h-9 rounded-lg border border-[#d9c6be] px-4 text-[10px] font-bold text-[#5c453d] transition hover:bg-[#fff4f0]"
                >
                  Ka Noqo
                </button>

                <button
                  type="submit"
                  disabled={
                    createUserMutation.isPending
                  }
                  className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-5 text-[10px] font-black text-white transition hover:bg-[#701b05] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createUserMutation.isPending ? (
                    <LoaderCircle
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <UserPlus size={15} />
                  )}

                  {createUserMutation.isPending
                    ? "Waa la samaynayaa..."
                    : "Diiwaangeli Akoonka"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CreateUserPage;