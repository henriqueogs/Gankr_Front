import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      const redirect =
        (location.state as { from?: { pathname: string } })?.from?.pathname ??
        '/dashboard';
      navigate(redirect, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Credenciais inválidas.');
    } finally {
      setLoading(false);
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
          {error && <span style={{ color: '#f87171' }}>{error}</span>}
          <button className="primary-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Ainda não tem conta?{' '}
          <Link className="link" to="/register">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
