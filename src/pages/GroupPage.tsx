import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import {
  useGetGroupDetail,
  useAddGroupMember,
  useRemoveGroupMember,
} from "../services";

export function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { group, loading, error, refetch } = useGetGroupDetail(id || "");
  const {
    addMember,
    loading: addingMember,
    error: addError,
  } = useAddGroupMember();
  const {
    removeMember,
    loading: removingMember,
    error: removeError,
  } = useRemoveGroupMember();
  const [memberHandle, setMemberHandle] = useState("");

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!memberHandle.trim() || !id) return;

    try {
      await addMember(id, memberHandle);
      setMemberHandle("");
      refetch(); // Refresh the group data
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!id) return;

    try {
      await removeMember(id, memberId);
      refetch(); // Refresh the group data
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const isAdmin = group?.membershipRole === "ADMIN";

  return (
    <div className="group-container">
      <div className="card">
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1>{group?.name ?? "Grupo"}</h1>
            <p>@{group?.nickname}</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link className="link" to="/dashboard">
              Voltar
            </Link>
            <button className="danger-btn" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        {loading && <p>Carregando grupo...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {addError && <p style={{ color: "#f87171" }}>{addError}</p>}
        {removeError && <p style={{ color: "#f87171" }}>{removeError}</p>}

        {!loading && group && (
          <>
            <section style={{ marginTop: "1.5rem" }}>
              <h2>Membros ({group.members.length})</h2>
              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-row">
                    <div>
                      <strong>{member.displayName}</strong>
                      <p style={{ margin: 0, color: "#94a3b8" }}>
                        @{member.nickname}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span className="chip">{member.role}</span>
                      {isAdmin && member.id !== group.ownerId && (
                        <button
                          className="danger-btn"
                          onClick={() => handleRemoveMember(member.id)}
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
              <section style={{ marginTop: "2rem" }}>
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
                  <button className="primary-btn" disabled={addingMember}>
                    {addingMember ? "Adicionando..." : "Adicionar"}
                  </button>
                </form>
              </section>
            )}
          </>
        )}

        {!loading && !group && (
          <button
            className="primary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  );
}
