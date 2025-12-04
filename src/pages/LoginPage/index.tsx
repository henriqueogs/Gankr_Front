import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useLogin } from "../../services";

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
    <div className="page-container">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Gankr</h1>
        <p className="text-dark-300 mb-6">
          Conecte-se e gerencie seu grupo gamer privado.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="loading-spinner"></div>
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-dark-300">
          Ainda não tem conta?{" "}
          <Link className="link" to="/register">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
