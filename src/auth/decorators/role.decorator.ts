import { SetMetadata } from '@nestjs/common';
import type { Role as UserRole } from 'generated/prisma/enums';

export const ROLE_KEY = 'roles';
export const Role = (...roles: UserRole[]) => SetMetadata(ROLE_KEY, roles);
