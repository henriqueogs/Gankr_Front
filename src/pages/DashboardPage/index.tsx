import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useGetListGroups, useCreateGroup } from "../../services";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { groups, loading, error, refetch } = useGetListGroups();
  const {
    createGroup,
    loading: creating,
    error: createError,
  } = useCreateGroup();
  const [form, setForm] = useState({ name: "", nickname: "" });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createGroup({
        name: form.name,
        nickname: form.nickname.toLowerCase(),
      });
      setForm({ name: "", nickname: "" });
      refetch();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-400">Dashboard</h1>
            <p className="text-dark-300 mt-1">Bem-vindo, {user?.displayName}</p>
          </div>
          <button className="btn-danger" onClick={logout}>
            Sair
          </button>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Crie um novo grupo</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Nome do grupo"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              className="input"
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
            {createError && <div className="error-message">{createError}</div>}
            <button className="btn-primary" disabled={creating}>
              {creating ? (
                <span className="flex items-center gap-2">
                  <div className="loading-spinner"></div>
                  Criando...
                </span>
              ) : (
                "Criar grupo"
              )}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Meus grupos</h2>
          {loading && (
            <div className="flex items-center gap-3 text-dark-300">
              <div className="loading-spinner"></div>
              <span>Carregando...</span>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <div className="groups-grid">
            {groups.map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`}>
                <div className="group-item">
                  <div className="flex justify-between items-start mb-2">
                    <strong className="text-lg text-dark-50">
                      {group.name}
                    </strong>
                    <span className="chip">{group.membershipRole}</span>
                  </div>
                  <p className="text-dark-400 text-sm">@{group.nickname}</p>
                </div>
              </Link>
            ))}
            {!groups.length && !loading && (
              <p className="text-center text-dark-400 py-8">
                Você ainda não participa de nenhum grupo.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
