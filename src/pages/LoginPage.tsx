import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../services";

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
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Bem-vindo ao Gankr</h1>
        <p>Conecte-se e gerencie seu grupo gamer privado.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <span style={{ color: "#f87171" }}>{error}</span>}
          <button className="primary-btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          Ainda não tem conta?{" "}
          <Link className="link" to="/register">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
