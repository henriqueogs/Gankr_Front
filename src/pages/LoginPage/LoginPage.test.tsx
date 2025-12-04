import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "./index";

// Mock dos hooks
const mockUseAuth = jest.fn();
const mockUseLogin = jest.fn();

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../../services", () => ({
  useLogin: () => mockUseLogin(),
}));

const LoginPageWithRouter = () => (
  <BrowserRouter>
    <LoginPage />
  </BrowserRouter>
);

describe("LoginPage", () => {
  beforeEach(() => {
    // Mock padrão para useAuth
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      user: null,
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    // Mock padrão para useLogin
    mockUseLogin.mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it("should render login form", () => {
    render(<LoginPageWithRouter />);

    expect(
      screen.getByRole("heading", { name: /bem-vindo ao gankr/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should have register link", () => {
    render(<LoginPageWithRouter />);

    const registerLink = screen.getByRole("link", { name: /registre-se/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
