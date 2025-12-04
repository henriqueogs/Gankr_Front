import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useRegister } from "../../services";

export function RegisterPage() {
  const { register: authRegister } = useAuth();
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    nickname: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await register(form);
      // Após registro bem-sucedido, redireciona para login
      navigate("/login", {
        state: {
          message: "Conta criada com sucesso! Faça login para continuar.",
        },
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
        <p className="text-dark-300 mb-6">Monte seu squad privado no Gankr.</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            name="displayName"
            placeholder="Nome exibido"
            value={form.displayName}
            onChange={handleChange}
            required
            minLength={3}
          />
          <input
            className="input"
            name="nickname"
            placeholder="Nickname (sem espaços)"
            value={form.nickname}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                nickname: e.target.value.toLowerCase(),
              }))
            }
            required
            minLength={3}
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {error && <div className="error-message">{error}</div>}
          <button className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="loading-spinner"></div>
                Criando...
              </span>
            ) : (
              "Registrar"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-dark-300">
          Já possui conta?{" "}
          <Link className="link" to="/login">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
