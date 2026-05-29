import type { Role } from '@prisma/client';

export type AuthUser = {
  id: number;
  username: string;
  role: Role;
};
