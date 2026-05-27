import type { Role } from 'generated/prisma/enums';

export type AuthUser = {
  id: number;
  username: string;
  role: Role;
};
