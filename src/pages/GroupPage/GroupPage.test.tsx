import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { GroupPage } from "./index";

// Mock dos hooks
const mockUseAuth = jest.fn();
const mockUseGetGroupDetail = jest.fn();
const mockUseAddGroupMember = jest.fn();
const mockUseRemoveGroupMember = jest.fn();
const mockUseSearchUsers = jest.fn();

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../../services", () => ({
  useGetGroupDetail: () => mockUseGetGroupDetail(),
  useAddGroupMember: () => mockUseAddGroupMember(),
  useRemoveGroupMember: () => mockUseRemoveGroupMember(),
  useSearchUsers: () => mockUseSearchUsers(),
}));

// Mock do useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ groupId: "test-id" }),
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
  });

  it("should render group header navigation", () => {
    render(<GroupPageWithRouter />);

    expect(screen.getByRole("link", { name: /voltar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
  });

  it("should render members section", () => {
    render(<GroupPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /membros/i })
    ).toBeInTheDocument();
  });
});
