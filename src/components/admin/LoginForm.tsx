"use client";
import { useActionState } from "react";
import { signInAction, type ActionState } from "@/app/(admin)/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signInAction, { ok: true } as ActionState);
  return (
    <form action={action} className="space-y-4 card p-6">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      {!state.ok && state.message && <p role="alert" className="text-sm text-bad">{state.message}</p>}
      <button className="btn btn-primary w-full justify-center" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
