export interface UseAddGroupMemberState {
  loading: boolean;
  error: string | null;
}

export interface UseAddGroupMemberReturn extends UseAddGroupMemberState {
  addMember: (groupId: string, nickname: string) => Promise<void>;
}