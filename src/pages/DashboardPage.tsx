import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { GroupSummary, groupApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', nickname: '' });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await groupApi.listGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar seus grupos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setError(null);

    try {
      await groupApi.createGroup({
        name: form.name,
        nickname: form.nickname.toLowerCase(),
      });
      setForm({ name: '', nickname: '' });
      fetchGroups();
    } catch (err) {
      console.error(err);
      setError('Erro ao criar grupo. Verifique se o nickname já existe.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="card">
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo, {user?.displayName}</p>
          </div>
          <button className="danger-btn" onClick={logout}>
            Sair
          </button>
        </header>

        <section style={{ marginTop: '2rem' }}>
          <h2>Crie um novo grupo</h2>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Nome do grupo"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              placeholder="@nickname"
              value={form.nickname}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  nickname: event.target.value.toLowerCase(),
                }))
              }
              required
            />
            <button className="primary-btn" disabled={creating}>
              {creating ? 'Criando...' : 'Criar grupo'}
            </button>
          </form>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Meus grupos</h2>
          {loading && <p>Carregando...</p>}
          {error && <p style={{ color: '#f87171' }}>{error}</p>}
          <div className="groups-grid">
            {groups.map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`}>
                <div className="group-item">
                  <strong>{group.name}</strong>
                  <p>@{group.nickname}</p>
                  <span className="chip">{group.membershipRole}</span>
                </div>
              </Link>
            ))}
            {!groups.length && !loading && (
              <p>Você ainda não participa de nenhum grupo.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
