import { GroupSummary } from "../../api/types";

export interface UseGetListGroupsState {
  groups: GroupSummary[];
  loading: boolean;
  error: string | null;
}

export interface UseGetListGroupsReturn extends UseGetListGroupsState {
  refetch: () => Promise<void>;
}