import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import { useAuth } from "../../hooks/useAuth";
import { useLogin } from "../../services";

const inputStyle =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/80 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition";

export function LoginPage() {
  const { setUserSession } = useAuth();
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await login({ email, password });
      setUserSession(response.token, response.user);

      const redirect =
        (location.state as { from?: { pathname: string } })?.from?.pathname ??
        "/dashboard";
      navigate(redirect, { replace: true });
    } catch {
      // handled by hook
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-midnight-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,58,183,0.35),transparent_45%)]" />
      <div className="relative w-full max-w-md rounded-shell border border-midnight-800/80 bg-midnight-900/70 p-8 shadow-glow backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.45em] text-slate-500">
            Bem-vindo ao
          </p>
          <h1 className="text-3xl font-bold text-white">Gankr</h1>
          <p className="text-sm text-slate-400">
            Conecte-se e lidere seu squad privado.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className={inputStyle}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <PrimaryButton type="submit" loading={loading}>
            Entrar
          </PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem conta?{" "}
          <Link className="font-semibold text-indigo-300" to="/register">
            Registre-se
          </Link>
        </p>
        <SecondaryButton
          type="button"
          className="mt-4 w-full justify-center"
          onClick={() => navigate("/register")}
        >
          Criar conta
        </SecondaryButton>
      </div>
    </div>
  );
}
