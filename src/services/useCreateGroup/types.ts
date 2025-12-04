export interface UseCreateGroupPayload {
  name: string;
  nickname: string;
}

export interface UseCreateGroupState {
  loading: boolean;
  error: string | null;
}

export interface UseCreateGroupReturn extends UseCreateGroupState {
  createGroup: (payload: UseCreateGroupPayload) => Promise<void>;
}