# 🎯 Hooks Organizados como Services

Esta pasta contém hooks customizados organizados como services, onde cada funcionalidade da API tem seu próprio hook com estado e lógica encapsulados.

## 📁 Estrutura

```
services/
├── index.ts                     # Barrel exports
├── useGetListGroups/
│   └── index.tsx               # Hook para listar grupos
├── useCreateGroup/
│   └── index.tsx               # Hook para criar grupos
├── useGetGroupDetail/
│   └── index.tsx               # Hook para detalhes do grupo
├── useAddGroupMember/
│   └── index.tsx               # Hook para adicionar membros
├── useRemoveGroupMember/
│   └── index.tsx               # Hook para remover membros
├── useLogin/
│   └── index.tsx               # Hook para login
├── useRegister/
│   └── index.tsx               # Hook para registro
└── useSearchUsers/
    └── index.tsx               # Hook para buscar usuários
```

## 🔧 Padrão dos Hooks

Cada hook segue o padrão:

```tsx
interface UseXxxState {
  loading: boolean;
  error: string | null;
  // ... outros estados específicos
}

interface UseXxxReturn extends UseXxxState {
  // ... métodos específicos
}

export const useXxx = (): UseXxxReturn => {
  // Implementação do hook
};
```

## 📋 Benefícios

- **Encapsulamento**: Cada hook gerencia seu próprio estado
- **Reutilização**: Hooks podem ser usados em múltiplos componentes
- **Testabilidade**: Fácil de testar isoladamente
- **Manutenibilidade**: Mudanças na API afetam apenas um local
- **TypeScript**: Tipagem forte em todas as operações

## 🚀 Uso

```tsx
import { useGetListGroups, useCreateGroup } from '../services';

function MyComponent() {
  const { groups, loading, error, refetch } = useGetListGroups();
  const { createGroup, loading: creating } = useCreateGroup();
  
  // Use os hooks normalmente
}
```