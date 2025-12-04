import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { GroupDetail, GroupMember, groupApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberHandle, setMemberHandle] = useState('');
  const [savingMember, setSavingMember] = useState(false);

  const fetchGroup = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await groupApi.getGroup(id);
      setGroup(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar o grupo ou você não tem acesso.');
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!memberHandle.trim() || !id) return;

    setSavingMember(true);
    setError(null);

    try {
      const newMember = await groupApi.addMember(id, memberHandle);
      setGroup((prev) =>
        prev ? { ...prev, members: [...prev.members, newMember] } : prev,
      );
      setMemberHandle('');
    } catch (err) {
      console.error(err);
      setError('Não foi possível adicionar o membro.');
    } finally {
      setSavingMember(false);
    }
  };

  const handleRemoveMember = async (member: GroupMember) => {
    if (!id) return;
    setError(null);
    try {
      await groupApi.removeMember(id, member.id);
      setGroup((prev) =>
        prev
          ? { ...prev, members: prev.members.filter((m) => m.id !== member.id) }
          : prev,
      );
    } catch (err) {
      console.error(err);
      setError('Não foi possível remover o membro.');
    }
  };

  const isAdmin = group?.membershipRole === 'ADMIN';

  return (
    <div className="group-container">
      <div className="card">
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1>{group?.name ?? 'Grupo'}</h1>
            <p>@{group?.nickname}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link className="link" to="/dashboard">
              Voltar
            </Link>
            <button className="danger-btn" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        {loading && <p>Carregando grupo...</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}

        {!loading && group && (
          <>
            <section style={{ marginTop: '1.5rem' }}>
              <h2>Membros ({group.members.length})</h2>
              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-row">
                    <div>
                      <strong>{member.displayName}</strong>
                      <p style={{ margin: 0, color: '#94a3b8' }}>
                        @{member.nickname}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="chip">{member.role}</span>
                      {isAdmin && member.id !== group.ownerId && (
                        <button
                          className="danger-btn"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {isAdmin && (
              <section style={{ marginTop: '2rem' }}>
                <h2>Adicionar membro</h2>
                <form onSubmit={handleAddMember}>
                  <input
                    placeholder="nickname do jogador"
                    value={memberHandle}
                    onChange={(event) =>
                      setMemberHandle(event.target.value.toLowerCase())
                    }
                    required
                  />
                  <button className="primary-btn" disabled={savingMember}>
                    {savingMember ? 'Adicionando...' : 'Adicionar'}
                  </button>
                </form>
              </section>
            )}
          </>
        )}

        {!loading && !group && (
          <button className="primary-btn" onClick={() => navigate('/dashboard')}>
            Voltar
          </button>
        )}
      </div>
    </div>
  );
}
