import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useGetListGroups, useCreateGroup } from "../services";

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
    <div className="dashboard-container">
      <div className="card">
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo, {user?.displayName}</p>
          </div>
          <button className="danger-btn" onClick={logout}>
            Sair
          </button>
        </header>

        <section style={{ marginTop: "2rem" }}>
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
              {creating ? "Criando..." : "Criar grupo"}
            </button>
          </form>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <h2>Meus grupos</h2>
          {loading && <p>Carregando...</p>}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {createError && <p style={{ color: "#f87171" }}>{createError}</p>}
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
