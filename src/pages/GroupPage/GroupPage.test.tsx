import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GroupPage } from "./index";

// Mock dos hooks
const mockUseAuth = jest.fn();
const mockUseGetGroupDetail = jest.fn();
const mockUseAddGroupMember = jest.fn();
const mockUseRemoveGroupMember = jest.fn();
const mockUseSearchUsers = jest.fn();
const mockUseChampionships = jest.fn();
const mockUseGroupStats = jest.fn();
const mockUseGroupPosts = jest.fn();

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../../services", () => ({
  useGetGroupDetail: () => mockUseGetGroupDetail(),
  useAddGroupMember: () => mockUseAddGroupMember(),
  useRemoveGroupMember: () => mockUseRemoveGroupMember(),
  useSearchUsers: () => mockUseSearchUsers(),
  useChampionships: () => mockUseChampionships(),
  useGroupStats: () => mockUseGroupStats(),
}));

jest.mock("../../services/useGroupPosts", () => ({
  useGroupPosts: () => mockUseGroupPosts(),
}));

jest.mock("../../services/useNotifications", () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    markRead: jest.fn(),
    respondFriendRequest: jest.fn(),
    refetch: jest.fn(),
  }),
}));

jest.mock("../../api/client", () => ({
  socialApi: {
    getGroupRequests: jest.fn().mockResolvedValue([]),
    respondGroupRequest: jest.fn().mockResolvedValue({}),
  },
}));

// Mock do useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "test-id" }),
}));

const GroupPageWithRouter = ({ groupId = "test-id" } = {}) => (
  <MemoryRouter initialEntries={[`/groups/${groupId}`]}>
    <GroupPage />
  </MemoryRouter>
);

describe("GroupPage", () => {
  beforeEach(() => {
    // Mock padrão para useAuth
    mockUseAuth.mockReturnValue({
      user: {
        id: "1",
        displayName: "Test User",
        email: "test@test.com",
        nickname: "test",
      },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    // Mock padrão para useGetGroupDetail
    mockUseGetGroupDetail.mockReturnValue({
      group: {
        id: "test-id",
        name: "Test Group",
        nickname: "test-group",
        ownerId: "owner-id",
        membershipRole: "MEMBER",
        members: [],
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    // Mock padrão para useAddGroupMember
    mockUseAddGroupMember.mockReturnValue({
      addMember: jest.fn(),
      loading: false,
      error: null,
    });

    // Mock padrão para useRemoveGroupMember
    mockUseRemoveGroupMember.mockReturnValue({
      removeMember: jest.fn(),
      loading: false,
      error: null,
    });

    // Mock padrão para useSearchUsers
    mockUseSearchUsers.mockReturnValue({
      searchUsers: jest.fn(),
      users: [],
      loading: false,
      error: null,
    });

    mockUseChampionships.mockReturnValue({
      championships: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseGroupStats.mockReturnValue({
      stats: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseGroupPosts.mockReturnValue({
      posts: [],
      loading: false,
      error: null,
      createPost: jest.fn(),
      deletePost: jest.fn(),
      refetch: jest.fn(),
    });
  });

  it("should render group header navigation", async () => {
    render(<GroupPageWithRouter />);

    expect(
      await screen.findByRole("button", { name: /voltar/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /atualizar/i }).length).toBeGreaterThan(0);
  });

  it("should render members section", () => {
    render(<GroupPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /membros/i })
    ).toBeInTheDocument();
  });
});
