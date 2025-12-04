import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    nickname: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Não foi possível registrar. Verifique os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Crie sua conta</h1>
        <p>Monte seu squad privado no Gankr.</p>
        <form onSubmit={handleSubmit}>
          <input
            name="displayName"
            placeholder="Nome exibido"
            value={form.displayName}
            onChange={handleChange}
            required
            minLength={3}
          />
          <input
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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {error && <span style={{ color: '#f87171' }}>{error}</span>}
          <button className="primary-btn" disabled={loading}>
            {loading ? 'Criando...' : 'Registrar'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Já possui conta?{' '}
          <Link className="link" to="/login">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
