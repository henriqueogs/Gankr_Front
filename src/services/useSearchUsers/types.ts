import { AuthenticatedUser } from "../../api/types";

export interface UseSearchUsersState {
  users: AuthenticatedUser[];
  loading: boolean;
  error: string | null;
}

export interface UseSearchUsersReturn extends UseSearchUsersState {
  searchByNickname: (nickname: string) => Promise<void>;
  clearResults: () => void;
}