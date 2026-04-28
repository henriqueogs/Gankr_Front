import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import { useRegister } from "../../services";

const fieldClass =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/80 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition";

export function RegisterPage() {
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    nickname: "",
  });

  const normalizeNickname = (value: string) =>
    value.replace(/@/g, "").toLowerCase();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await register({ ...form, nickname: normalizeNickname(form.nickname) });
      navigate("/login", {
        state: {
          message: "Conta criada com sucesso! Faça login para continuar.",
        },
      });
    } catch {
      // handled by hook
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-midnight-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.35),transparent_45%)]" />
      <div className="relative w-full max-w-2xl rounded-shell border border-midnight-800/80 bg-midnight-900/70 p-8 shadow-glow backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.45em] text-slate-500">
            Crie sua conta
          </p>
          <h1 className="text-3xl font-bold text-white">Monte seu squad</h1>
          <p className="text-sm text-slate-400">Gankr é para grupos fechados.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className={fieldClass}
            name="displayName"
            placeholder="Nome exibido"
            value={form.displayName}
            onChange={handleChange}
            required
            minLength={3}
          />
          <input
            className={fieldClass}
            name="nickname"
            placeholder="@nickname"
            value={form.nickname}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                nickname: normalizeNickname(event.target.value),
              }))
            }
            required
            minLength={3}
          />
          <input
            className={fieldClass}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className={fieldClass}
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <PrimaryButton
            className="md:col-span-2"
            type="submit"
            loading={loading}
          >
            Registrar
          </PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Já possui conta?{" "}
          <Link className="font-semibold text-indigo-300" to="/login">
            Entre aqui
          </Link>
        </p>
        <SecondaryButton
          type="button"
          className="mt-4 w-full justify-center"
          onClick={() => navigate("/login")}
        >
          Ir para login
        </SecondaryButton>
      </div>
    </div>
  );
}
