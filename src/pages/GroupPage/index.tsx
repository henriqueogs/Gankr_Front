import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import {
  useGetGroupDetail,
  useAddGroupMember,
  useRemoveGroupMember,
} from "../../services";

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
    <div className="page-container">
      <div className="card">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-400">
              {group?.name ?? "Grupo"}
            </h1>
            <p className="text-dark-400 mt-1">@{group?.nickname}</p>
          </div>
          <div className="flex gap-2">
            <Link className="link" to="/dashboard">
              Voltar
            </Link>
            <button className="btn-danger" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        {loading && (
          <div className="flex items-center gap-3 text-dark-300 py-8">
            <div className="loading-spinner"></div>
            <span>Carregando grupo...</span>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {addError && <div className="error-message">{addError}</div>}
        {removeError && <div className="error-message">{removeError}</div>}

        {!loading && group && (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Membros ({group.members.length})
              </h2>
              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-row">
                    <div>
                      <strong className="text-dark-50">
                        {member.displayName}
                      </strong>
                      <p className="text-dark-400 text-sm mt-1">
                        @{member.nickname}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="chip">{member.role}</span>
                      {isAdmin && member.id !== group.ownerId && (
                        <button
                          className="btn-danger"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removingMember}
                        >
                          {removingMember ? (
                            <div className="loading-spinner w-3 h-3"></div>
                          ) : (
                            "Remover"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {isAdmin && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Adicionar membro</h2>
                <form className="form" onSubmit={handleAddMember}>
                  <input
                    className="input"
                    placeholder="nickname do jogador"
                    value={memberHandle}
                    onChange={(event) =>
                      setMemberHandle(event.target.value.toLowerCase())
                    }
                    required
                  />
                  <button className="btn-primary" disabled={addingMember}>
                    {addingMember ? (
                      <span className="flex items-center gap-2">
                        <div className="loading-spinner"></div>
                        Adicionando...
                      </span>
                    ) : (
                      "Adicionar"
                    )}
                  </button>
                </form>
              </section>
            )}
          </>
        )}

        {!loading && !group && (
          <div className="text-center py-8">
            <p className="text-dark-400 mb-4">Grupo não encontrado.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Voltar ao Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
