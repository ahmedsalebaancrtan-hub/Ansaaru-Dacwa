import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useForgotPassword } from "../../hooks/auth/useAuthMutations";

const LOGO_PATH = "/logo.jpeg";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const forgotPasswordMutation =
    useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanedEmail = email.trim();

    if (!cleanedEmail) {
      setError("Email-ka waa required");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanedEmail,
      )
    ) {
      setError("Geli email sax ah");
      return;
    }

    setError("");

    forgotPasswordMutation.mutate(
      {
        email: cleanedEmail,
      },
      {
        onSuccess: () => {
          navigate(
            `/reset-password?email=${encodeURIComponent(
              cleanedEmail,
            )}`,
          );
        },
      },
    );
  };

  return (
    <main className="flex h-dvh items-center justify-center overflow-hidden bg-[#fff8f5] px-4 py-3">
      <section className="w-full max-w-sm overflow-hidden rounded-xl border border-[#ead8d0] bg-white shadow-sm">
        {/* School identity */}
        <header className="border-b border-[#eee1dc] bg-[#fff4f0] px-4 py-3">
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
          <div className="mb-4 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <LockKeyhole size={17} />
            </div>

            <h2 className="mt-2 text-lg font-black text-[#271814]">
              Ma illoowday Furaha?
            </h2>

            <p className="mx-auto mt-1 max-w-xs text-[10px] leading-4 text-slate-500">
              Geli email-ka akoonkaaga. Waxaan kuu
              soo diri doonaa OTP lix lambar ah.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
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
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="ahmed@gmail.com"
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  className={`h-9 w-full rounded-lg border bg-[#fff4f0] pl-9 pr-3 text-[11px] text-[#2d211d] outline-none transition placeholder:text-[#a7958e] focus:bg-white focus:ring-2 ${
                    error
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {error && (
                <p className="mt-1 text-[9px] font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                forgotPasswordMutation.isPending
              }
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[10px] font-black text-white transition hover:bg-[#701b05] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />

                  Waa la dirayaa...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Soo Dir OTP
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

          {/* Security notice */}
          <div className="mt-4 border-t border-[#eee1dc] pt-3">
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-medium text-slate-500">
              <ShieldCheck
                size={13}
                className="text-[#8b2408]"
              />

              OTP-ga waxaa loo dirayaa email-kaaga
              rasmiga ah.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;