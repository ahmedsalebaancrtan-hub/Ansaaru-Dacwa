import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  LoaderCircle,
  Mail,
  Send,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router";

import AuthPageLayout from "../../components/auth/AuthLayout";
import { useForgotPassword } from "../../hooks/auth/useAuthMutations";

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
      setError("Email address is required");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanedEmail,
      )
    ) {
      setError("Enter a valid email address");
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
    <AuthPageLayout
      heading="Ma illoowday Furaha?"
      description="Geli email-ka akoonkaaga. Waxaan kuu soo diri doonaa OTP lix lambar ah."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#51433e]"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={21}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="Tusaale: ahmed@gmail.com"
              autoComplete="email"
              className={`h-14 w-full rounded-xl border bg-[#fff4f0] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                error
                  ? "border-red-400 focus:ring-red-100"
                  : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
              }`}
            />
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-5 font-bold text-white transition hover:bg-[#701b05] focus:ring-4 focus:ring-orange-200 disabled:opacity-60"
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
              Waa la dirayaa...
            </>
          ) : (
            <>
              <Send size={19} />
              Soo Dir OTP
            </>
          )}
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

export default ForgotPasswordPage;