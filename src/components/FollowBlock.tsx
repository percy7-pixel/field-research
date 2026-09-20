import { EmailSignup } from "./EmailSignup";

export function FollowBlock({ location }: { location: string }) {
  return (
    <section id="follow" aria-labelledby="follow-h" className="border border-line bg-white p-6 sm:p-8 rounded-[2px]">
      <p className="eyebrow mb-2">Research updates</p>
      <h2 id="follow-h" className="text-2xl font-semibold tracking-tight">Follow the research</h2>
      <p className="mt-2 text-ink-2 max-w-prose">Get new FIELD experiments and findings when we publish them.</p>
      <div className="mt-5 max-w-md">
        <EmailSignup location={location} />
      </div>
    </section>
  );
}
