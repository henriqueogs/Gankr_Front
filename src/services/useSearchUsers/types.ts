import { UserSearchResult } from "../../api/types";

export interface UseSearchUsersState {
  users: UserSearchResult[];
  loading: boolean;
  error: string | null;
}

export interface UseSearchUsersReturn extends UseSearchUsersState {
  searchByNickname: (nickname: string) => Promise<void>;
  clearResults: () => void;
}
