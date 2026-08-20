-- ====================================================================
-- SUPABASE SECURITY ADVISOR FIX: public.rls_auto_enable()
-- ====================================================================

-- Fix Warning 1 & 2: Prevent unauthenticated (anon) and authenticated (users)
-- from calling this SECURITY DEFINER function via REST API /rest/v1/rpc/

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- Ensure only privileged backend admins (service_role and postgres) can execute it
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role, postgres;
