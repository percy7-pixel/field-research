import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const reason = typeof sp.reason === "string" ? sp.reason : "";
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  return (
    <div className="max-w-sm mx-auto py-12">
      <p className="eyebrow mb-2">FIELD Admin</p>
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      {reason === "not-admin" && <p role="alert" className="mt-3 text-sm text-bad">Your account is signed in but is not listed in the admins table. See docs/SETUP.md.</p>}
      {reason === "unconfigured" && <p role="alert" className="mt-3 text-sm text-bad">Supabase environment variables are not configured.</p>}
      <div className="mt-6"><LoginForm next={next} /></div>
    </div>
  );
}
