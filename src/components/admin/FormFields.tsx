"use client";
import Link from "next/link";
import type { ActionState } from "@/app/(admin)/admin/actions";

/* Shared admin form primitives — same visual language as ExperimentForm. */

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
export function Text({ id, def, hint, label, required, type = "text" }: { id: string; def?: string | number | null; hint?: string; label: string; required?: boolean; type?: string }) {
  return <Field id={id} label={label} hint={hint}><input id={id} name={id} type={type} defaultValue={def ?? ""} required={required} className="input" /></Field>;
}
export function Area({ id, def, hint, label, rows = 5, mono = false }: { id: string; def?: string | null; hint?: string; label: string; rows?: number; mono?: boolean }) {
  return <Field id={id} label={label} hint={hint}><textarea id={id} name={id} defaultValue={def ?? ""} rows={rows} className={`input ${mono ? "font-mono text-xs" : ""}`} /></Field>;
}
export function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card p-5 sm:p-6">
      <legend className="eyebrow px-1">{title}</legend>
      <div className="mt-3 grid gap-5">{children}</div>
    </fieldset>
  );
}

export function StatusPanel({
  status, pending, isEdit, notice, errorNotice, state, previewHref, publicHref, saveLabel = "Save",
}: {
  status?: string; pending: boolean; isEdit: boolean; notice?: string; errorNotice?: string; state: ActionState;
  previewHref?: string; publicHref?: string; saveLabel?: string;
}) {
  return (
    <aside className="lg:sticky lg:top-4 card p-4 space-y-3">
      <p className="eyebrow">Status</p>
      <p><span className={`tag ${status === "published" ? "tag-accent" : ""}`}>{status ?? "new draft"}</span></p>
      {(notice || (state.ok && state.message)) && <p role="status" className="text-sm text-ok">{state.message ?? notice}</p>}
      {(errorNotice || (!state.ok && state.message)) && (
        <div role="alert" className="text-sm text-bad">
          <p>{state.message ?? errorNotice}</p>
          {state.errors && <ul className="mt-1 list-disc pl-4 space-y-0.5 text-xs">{state.errors.map((er, i) => <li key={i}>{er}</li>)}</ul>}
        </div>
      )}
      <div className="grid gap-2">
        <button name="intent" value="save" className="btn btn-primary justify-center" disabled={pending}>{pending ? "Working…" : isEdit ? saveLabel : "Save Draft"}</button>
        <button name="intent" value="validate" className="btn btn-ghost justify-center" disabled={pending}>Validate</button>
        {status === "published"
          ? <button name="intent" value="unpublish" className="btn btn-ghost justify-center" disabled={pending}>Unpublish</button>
          : <button name="intent" value="publish" className="btn btn-ghost justify-center" disabled={pending}>Publish</button>}
        {isEdit && previewHref && <Link href={previewHref} className="btn btn-ghost justify-center">Preview</Link>}
        {isEdit && status === "published" && publicHref && <Link href={publicHref} className="text-center text-xs underline underline-offset-4">View public page ↗</Link>}
      </div>
    </aside>
  );
}
