import type { DefaultSession } from 'next-auth';
import type { UserRole } from 'types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      role: UserRole;
    } & DefaultSession['user'];
  }
}
