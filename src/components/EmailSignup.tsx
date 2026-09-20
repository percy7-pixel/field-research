"use client";
import { useActionState, useEffect, useId, useRef } from "react";
import { subscribeAction, type SubscribeState } from "@/app/actions/subscribe";
import { track } from "@/lib/analytics";

const initial: SubscribeState = { status: "idle" };

export function EmailSignup({ location, compact = false }: { location: string; compact?: boolean }) {
  const [state, action, pending] = useActionState(subscribeAction, initial);
  const id = useId();
  const mountedAt = useRef<number>(0);
  useEffect(() => { mountedAt.current = Date.now(); }, []);
  const tsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === "success") track("email_signup", { signup_location: location });
  }, [state.status, location]);

  if (state.status === "success") {
    return (
      <p role="status" className="text-sm text-ok border border-ok/30 bg-white px-3 py-2 rounded-[2px]">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} onSubmit={() => { if (tsRef.current) tsRef.current.value = String(mountedAt.current); }} noValidate className={compact ? "space-y-2" : "space-y-3"}>
      <div className={compact ? "flex flex-col gap-2" : "flex flex-col sm:flex-row gap-2"}>
        <label htmlFor={id} className="sr-only">Email address</label>
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="input"
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={state.status === "error" ? `${id}-err` : undefined}
        />
        {/* Honeypot — hidden from humans, filled by bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-web`}>Website</label>
          <input id={`${id}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="location" value={location} />
        <input ref={tsRef} type="hidden" name="ts" defaultValue="" />
        <button type="submit" className="btn btn-primary justify-center whitespace-nowrap" disabled={pending}>
          {pending ? "Sending…" : "Follow Research"}
        </button>
      </div>
      {state.status === "error" ? (
        <p id={`${id}-err`} role="alert" className="text-sm text-bad">{state.message}</p>
      ) : (
        !compact && <p className="text-xs text-ink-3">Email only. No lead magnet. Unsubscribe any time.</p>
      )}
    </form>
  );
}
