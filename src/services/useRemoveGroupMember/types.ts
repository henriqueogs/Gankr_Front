export interface UseRemoveGroupMemberState {
  loading: boolean;
  error: string | null;
}

export interface UseRemoveGroupMemberReturn extends UseRemoveGroupMemberState {
  removeMember: (groupId: string, userId: string) => Promise<void>;
}