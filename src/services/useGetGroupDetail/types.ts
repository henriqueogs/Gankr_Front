import { GroupDetail } from "../../api/types";

export interface UseGetGroupDetailState {
  group: GroupDetail | null;
  loading: boolean;
  error: string | null;
}

export interface UseGetGroupDetailReturn extends UseGetGroupDetailState {
  refetch: () => Promise<void>;
}