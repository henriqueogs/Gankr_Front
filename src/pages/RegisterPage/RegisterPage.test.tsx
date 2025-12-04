import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RegisterPage } from "./index";

// Mock dos hooks
const mockUseAuth = jest.fn();
const mockUseRegister = jest.fn();

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../../services", () => ({
  useRegister: () => mockUseRegister(),
}));

const RegisterPageWithRouter = () => (
  <BrowserRouter>
    <RegisterPage />
  </BrowserRouter>
);

describe("RegisterPage", () => {
  beforeEach(() => {
    // Mock padrão para useAuth
    mockUseAuth.mockReturnValue({
      register: jest.fn(),
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    // Mock padrão para useRegister
    mockUseRegister.mockReturnValue({
      register: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it("should render register form", () => {
    render(<RegisterPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /crie sua conta/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome exibido")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nickname (sem espaços)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrar/i })
    ).toBeInTheDocument();
  });

  it("should have login link", () => {
    render(<RegisterPageWithRouter />);

    const loginLink = screen.getByRole("link", { name: /entre aqui/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
