import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasourceUrl: process.env.DATABASE_URL || 'postgresql://postgres.zldxbaykxgdraxvejkdr:Btrade360@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
});
