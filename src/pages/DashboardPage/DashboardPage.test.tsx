import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "./index";

// Mock dos hooks
const mockUseAuth = jest.fn();
const mockUseGetListGroups = jest.fn();
const mockUseCreateGroup = jest.fn();
const mockUseSearchUsers = jest.fn();

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../../services", () => ({
  useGetListGroups: () => mockUseGetListGroups(),
  useCreateGroup: () => mockUseCreateGroup(),
  useSearchUsers: () => mockUseSearchUsers(),
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

const DashboardPageWithRouter = () => (
  <BrowserRouter>
    <DashboardPage />
  </BrowserRouter>
);

describe("DashboardPage", () => {
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

    // Mock padrão para useGetListGroups
    mockUseGetListGroups.mockReturnValue({
      groups: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    // Mock padrão para useCreateGroup
    mockUseCreateGroup.mockReturnValue({
      createGroup: jest.fn(),
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

  it("should render dashboard header", () => {
    render(<DashboardPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /test user/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/painel principal/i)).toBeInTheDocument();
  });

  it("should render create group form", () => {
    render(<DashboardPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /crie um novo grupo/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome do grupo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("@nickname")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /criar grupo/i })
    ).toBeInTheDocument();
  });

  it("should render groups section", () => {
    render(<DashboardPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /meus grupos/i })
    ).toBeInTheDocument();
  });
});
