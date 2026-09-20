-- FIELD — seed content: Experiments #001–#003 and initial Findings.
-- Source of truth: FIELD research notes. Synthetic datasets are labelled as such.
-- Safe to re-run: upserts on slug.

insert into public.experiments (
  experiment_number, slug, title, subtitle, status, publication_date, short_summary,
  research_question, hypothesis, workflow, workflow_steps, research_type, methodology,
  dataset_description, sample_size, human_baseline, ai_baseline, evaluation_criteria,
  results, key_findings, failure_modes, observations, interpretations, unknowns, what_changed,
  limitations, conclusion, practical_implications, cases, related_experiments, topics, tags,
  featured, seo_title, seo_description, published_at
) values
-- ===========================================================================
-- #001
-- ===========================================================================
(
  1,
  'customer-inquiry-to-next-action',
  'Customer Inquiry → Next Action',
  'Can AI interpret an incomplete customer inquiry, identify what is missing, and prepare a sensible next step?',
  'published',
  '2026-08-15',
  'We ran 10 synthetic customer inquiries through a qualification workflow — interpret the message, identify missing information, decide the next action — and compared how a human and an AI model handled them. The inquiries were incomplete more often than not, and the next action was rarely obvious.',
  'When a customer inquiry arrives incomplete, can AI interpret it, separate what is known from what is unknown, and prepare an appropriate next action?',
  null,
  'Customer inquiry → interpretation → identify missing information → next action',
  '["Customer inquiry arrives","Interpret intent and urgency","Identify missing information","Decide the next action"]'::jsonb,
  'Exploratory workflow comparison',
  'Ten synthetic customer inquiries were written to resemble the kind of messages a small business receives. Each inquiry was read and processed twice: once by a human working intuitively, and once by an AI model instructed to interpret the message, list what was known and unknown, and propose a next action. Outputs were compared qualitatively. No timing or scoring instrument was used.',
  'Ten synthetic customer inquiries. Synthetic means the messages were written for the experiment, not collected from real customers. They were designed to vary in completeness, intent and urgency.',
  10,
  'A human read each inquiry and decided the next action the way an operator normally would: quickly and largely intuitively. The human reasoning was not written down in a standard format, which itself became an observation.',
  'The AI model was given the same inquiries and asked to interpret the request, state what information was present, state what was missing, and propose a next action. The output was reviewed by a human.',
  '[{"name":"Interpretation","description":"Did the output correctly understand what the customer was asking for?"},{"name":"Missing information","description":"Were the gaps in the inquiry identified?"},{"name":"Next action","description":"Was the proposed next step reasonable given what was and was not known?"}]'::jsonb,
  'Results are qualitative. Most inquiries were missing information needed to act. Intent and urgency varied and were not always visible from the wording. Where the AI separated known from unknown before proposing an action, the proposed action tended to be more defensible. Human handling was faster to judge but less consistent in how the judgment was expressed.',
  '["Inquiries are often incomplete; missing information is a normal condition, not an exception.","Intent and urgency can differ — a message can be urgent without high intent, or high intent without urgency.","The next action is often not obvious from the inquiry text alone.","Context changes meaning: the same sentence can call for different actions in different situations.","A price question does not necessarily mean high buying intent.","AI output was more useful when it explicitly distinguished known from unknown before acting.","Qualification can be structured into repeatable fields (request, key details, missing information, action).","Human judgment was often intuitive rather than standardized."]'::jsonb,
  '[{"code":"F-ASSUME","name":"Assumed intent","description":"Treating a price question as a purchase decision."},{"code":"F-GAP","name":"Unflagged gaps","description":"Proposing an action without stating what was still unknown."},{"code":"F-CONTEXT","name":"Context loss","description":"Reading the message literally when context suggested a different meaning."}]'::jsonb,
  '["Most of the ten inquiries lacked at least one detail needed to quote or act.","Some inquiries expressed urgency without stating what was actually required.","The human decided quickly, but the reasoning behind each decision was not consistent from case to case.","When asked to separate known from unknown, the AI produced a repeatable field structure across all ten cases."]'::jsonb,
  '["AI''s useful business role here may be standardization rather than automation: making the qualification step consistent, not removing the human from it.","Missing information appears to be as important as stated information when deciding the next action.","Human judgment and AI may differ in how they interpret the same inquiry, and neither reading was always the better one."]'::jsonb,
  '["Whether the same pattern holds with real (non-synthetic) inquiries.","Whether the AI''s next actions would actually produce better customer outcomes.","How much time, if any, the AI step saves in practice — time was not measured.","Which AI configuration or model matters; this was not a tool comparison."]'::jsonb,
  'This experiment produced the first version of the repeatable qualification structure (request, key details, missing information, action) that Experiment #002 later used as its output format.',
  '["Ten synthetic cases written by the researcher — not real customer messages.","Single human baseline; one person''s judgment.","No timing, scoring or blind evaluation.","Qualitative comparison only. Nothing here establishes a controlled result."]'::jsonb,
  'In this experiment, incomplete customer inquiries were the norm, and the most useful thing the AI did was make the missing information visible before proposing an action. That is a modest role — structured preparation, not autonomous handling — but it is a real one. Whether it generalizes beyond ten synthetic cases is an open question.',
  '["Treat missing information as a first-class part of the inquiry, not an annoyance.","If using AI in inquiry handling, ask it to state known and unknown before proposing an action.","Do not read a price question as a buying signal by default.","Keep a human in the loop for the action itself; use AI for the preparation."]'::jsonb,
  '[]'::jsonb,
  '["messy-business-information-to-structured-output","structured-information-to-next-action"]'::jsonb,
  '["customer-workflows","human-ai"]'::jsonb,
  '["qualification","inquiries","missing-information","synthetic-data"]'::jsonb,
  false,
  'Experiment #001: Customer Inquiry → Next Action | FIELD',
  'Ten synthetic customer inquiries, one workflow, a human and an AI. What happens when the inquiry is incomplete and the next step is not obvious.',
  now()
),
-- ===========================================================================
-- #002
-- ===========================================================================
(
  2,
  'messy-business-information-to-structured-output',
  'Messy Business Information → Structured Output',
  'Can AI turn unstructured business messages into usable structured output with less manual effort — and where does it fail?',
  'published',
  '2026-08-29',
  'Ten synthetic packaging and printing inquiries were converted into a structured table by a human (about 30 minutes) and by an AI model. AI output was more systematic in extraction, completeness and flagging missing information. Human judgment remained stronger on commercial context. No time-saving figure was established.',
  'Can AI transform messy, unstructured business information into useful structured output with less manual effort than doing it by hand?',
  'Small-business workflows containing messy, unstructured information may be strong candidates for AI-assisted processing when repeatable structure, identifiable fields and human verification exist. (Stated as a hypothesis, not a conclusion.)',
  'Messy business information → extract relevant information → structure → validate / identify uncertainty → usable output → human review',
  '["Messy business information","Extract relevant information","Structure into fields","Validate and identify uncertainty","Usable output","Human review"]'::jsonb,
  'Workflow comparison, human vs AI',
  'Ten synthetic inquiries were written to resemble messages a small packaging and printing supplier might receive. The human baseline was produced first: each message was read and summarized into a six-column table. The same messages were then processed by an AI model instructed to produce the same structure. The two outputs were compared against an evaluation list and a failure taxonomy defined before the comparison. The experiment was explicitly not testing software, product demand, client demand, AI tool ranking or autonomous AI.',
  'Ten synthetic customer inquiries (C001–C010) covering custom boxes, paper bags, juice packaging, food containers, flyers, shopping bags and stickers. Synthetic: written for the experiment, not collected from real customers.',
  10,
  'A human processed all ten cases in approximately 30 minutes, producing a table with the columns ID, Business/Customer, Request/Information, Key Details, Missing Info and Action Needed. Some of the human-written actions were incomplete.',
  'The AI model was given the same ten messages and the same target structure. Output was reviewed by a human for extraction errors, fabrication, missed information and formatting problems.',
  '[{"name":"Speed","description":"How long the pass took (human measured approximately; AI not measured in a controlled way)."},{"name":"Extraction accuracy","description":"Were the stated details captured correctly?"},{"name":"Fabrication / hallucination","description":"Did the output invent details not present in the message?"},{"name":"Completeness","description":"Were all relevant details and gaps captured?"},{"name":"Correction burden","description":"How much human editing did the output need?"},{"name":"Usability","description":"Could the output be acted on directly?"}]'::jsonb,
  'The AI output was systematic across all ten cases in extraction, completeness, identification of missing information and consistency of format. The human table was produced in roughly 30 minutes and contained some incomplete actions. The human remained stronger in contextual and commercial judgment — reading what a customer probably needs beyond what they wrote. Because AI time was not measured in a controlled way, no time-saving claim is made.',
  '["AI output was systematic in extraction, completeness, missing-information detection and consistency.","Human judgment remained stronger in contextual and commercial judgment.","AI''s apparent advantage in this experiment was standardization rather than superior business judgment.","AI appeared useful for extraction, standardization, uncertainty detection and action preparation.","A workflow decomposition emerged: Extract → Interpret → Identify uncertainty → Determine next action → Execute.","No exact time-saving figure was established because time was not measured in a sufficiently controlled way."]'::jsonb,
  '[{"code":"F1","name":"Extraction","description":"Missing or misreading a detail that was present in the message."},{"code":"F2","name":"Interpretation","description":"Correct extraction, wrong reading of what it means."},{"code":"F3","name":"Fabrication","description":"Inventing details the message did not contain."},{"code":"F4","name":"Overconfidence","description":"Presenting an uncertain reading as settled."},{"code":"F5","name":"Formatting","description":"Output does not fit the required structure."},{"code":"F6","name":"Prioritization","description":"Wrong emphasis on what matters in the case."},{"code":"F7","name":"Context","description":"Missing situational context a human would apply."},{"code":"F8","name":"Instruction","description":"Not following the task instructions."}]'::jsonb,
  '["The human pass took approximately 30 minutes for ten cases.","Some human-written actions were incomplete.","The AI produced the six-field structure consistently for every case.","The AI listed missing information for each case; the human did so less consistently.","Where messages implied a commercial situation (for example a customer burned by a previous supplier), the human''s reading was richer than the AI''s."]'::jsonb,
  '["The AI''s advantage looked like consistency and coverage, not better judgment.","Standardizing the extraction step may be where the value is; the decision step still benefited from a human.","Messy inputs with repeatable fields seem like a good fit for AI-assisted processing — but only with human verification."]'::jsonb,
  '["How much time AI actually saves on this task — not measured in a controlled way.","Whether accuracy holds on real, longer, less tidy messages.","Fabrication rate at scale; ten cases is too few to estimate it.","Whether a different model or prompt would change the result."]'::jsonb,
  'The output structure from Experiment #001 was used as the target format. The failure taxonomy (F1–F8) was introduced here and is intended for reuse in later experiments.',
  '["Ten synthetic cases; not real customer messages.","Single human baseline.","Time measured only approximately for the human and not in a controlled way for the AI.","Qualitative comparison; no scoring rubric was applied numerically.","Not a comparison between AI tools."]'::jsonb,
  'On these ten synthetic cases, AI was reliably systematic at extracting, structuring and flagging what was missing, and a human was better at reading the commercial situation. The reasonable reading is that AI''s value here is standardization of a messy step, with a human still doing interpretation and the final action. The hypothesis that messy, field-shaped small-business workflows are good candidates for AI assistance remains a hypothesis.',
  '["If a workflow starts with messy text and ends in a fixed set of fields, it is a candidate for AI-assisted extraction with human review.","Ask AI to list missing information explicitly; it did this more consistently than the human did.","Keep commercial interpretation with a human, especially where trust or history matter.","Do not assume a time saving until you have measured it in your own workflow."]'::jsonb,
  '[{"id":"C001","summary":"Bella Cakes — 200 custom cupcake boxes for a wedding on October 18, with logo, in Buea; asks for price and production time."},{"id":"C002","summary":"Takeaway restaurant — approximately 500 branded paper bags, next month, size undecided."},{"id":"C003","summary":"New juice business — bottles or pouches, quantity undecided, asks for advice."},{"id":"C004","summary":"Urgent: 1,000 food containers by Friday because the supplier cancelled that day."},{"id":"C005","summary":"Flyer printing price inquiry with minimal information."},{"id":"C006","summary":"Clothing brand launch December 5 — 300 shopping bags plus stickers, separate quotes requested."},{"id":"C007","summary":"Previous supplier delivered 1,200 of 2,000 boxes with poor quality; wants a new supplier, samples and prices."},{"id":"C008","summary":"Branded packaging inquiry asking for a catalogue."},{"id":"C009","summary":"Bakery using plain plastic bags wants branded packaging; sells bread, pastries and cakes; unsure about size and material."},{"id":"C010","summary":"5,000 waterproof bottle stickers, logo attached, needed before end of month; asks what information is required for a quote."}]'::jsonb,
  '["customer-inquiry-to-next-action","structured-information-to-next-action"]'::jsonb,
  '["information-processing","ai-reliability","human-ai"]'::jsonb,
  '["extraction","structured-output","failure-modes","synthetic-data","packaging"]'::jsonb,
  true,
  'Experiment #002: Messy Business Information → Structured Output | FIELD',
  'Human vs AI on turning ten messy packaging inquiries into a structured table. AI was more systematic; the human read the commercial situation better. No time-saving claim.',
  now()
),
-- ===========================================================================
-- #003
-- ===========================================================================
(
  3,
  'structured-information-to-next-action',
  'Structured Business Information → Appropriate Next Action',
  'Can AI take already-structured business information and consistently prepare an appropriate next operational action?',
  'published',
  '2026-09-12',
  'Using the ten structured cases from Experiment #002, a human and an AI each assigned a priority, a next action, a reason and something to avoid. Both converged on the same operational pattern. AI was more conservative about missing information and stronger on operational prerequisites; the human was more commercially proactive and read customer psychology.',
  'Can AI take already-structured business information and consistently prepare an appropriate next operational action?',
  'AI appears useful for preparing structured business work, while human judgment remains important where trust, context and commercial strategy affect the action. (Hypothesis, not conclusion.)',
  'Structured information → interpret current state → known/unknown → identify next action → prepare action → human review',
  '["Structured information","Interpret current state","Separate known from unknown","Identify next action","Prepare the action","Human review"]'::jsonb,
  'Decision-preparation comparison, human vs AI',
  'The ten structured cases produced in Experiment #002 were used as input. A human first filled a table with the columns ID, Situation, Priority, Next Action, Why and What to Avoid. The AI model was then given the same structured input and asked for the same fields. The two sets were compared case by case, looking at where they agreed, where priorities diverged, and what each considered before acting.',
  'The same ten synthetic cases (C001–C010) from Experiment #002, now in structured form. Synthetic dataset.',
  10,
  'The human assigned priorities of high (C004, C006, C007, C009, C010), medium (C001) and low (C002, C003, C005, C008). Next actions leaned toward sending samples, catalogues or comparison overviews to move the conversation forward, and toward reassurance where trust had been damaged (C007). See the case table for each entry.',
  'The AI assigned high priority to C004, C006, C007 and C010, medium to C001, C002, C003 and C009, and low to C005 and C008. Next actions consistently began with confirming specifications, location, deadline and capacity before any quote or commitment. See the case table for each entry.',
  '[{"name":"Convergence","description":"Did human and AI arrive at the same operational pattern?"},{"name":"Priority","description":"Where did urgency assessments differ, and why?"},{"name":"Prerequisites","description":"Did the next action account for what must be known before acting?"},{"name":"Commercial context","description":"Did the action account for trust, momentum and customer psychology?"},{"name":"Premature commitment","description":"Did either side promise or quote before it reasonably could?"}]'::jsonb,
  'Human and AI agreed on priority in seven of ten cases (C001, C004, C005, C006, C007, C008, C010); they differed in three (C002, C003, C009 — the human rated C002 and C003 low where the AI said medium, and C009 high where the AI said medium). Both consistently avoided premature quotes. The AI''s actions were more procedurally complete (specs, location, capacity); the human''s were more oriented to moving the customer forward with samples, overviews and reassurance.',
  '["Human and AI generally converged on the same operational pattern: understand the situation → identify missing information → assess urgency → choose a next action → avoid premature commitment.","AI was more conservative about missing information.","Human judgment was more commercially proactive, especially in C002, C003, C007 and C009.","AI was stronger at identifying operational prerequisites such as specs, location and capacity.","Human judgment incorporated customer psychology, trust and context, especially in C007.","AI was more cautious about priority; C009 was medium for the AI versus high for the human.","AI can function as a procedural guardrail against premature commitments.","Excessive AI caution may slow conversational momentum."]'::jsonb,
  '[{"code":"F4","name":"Overconfidence","description":"Not observed on the AI side; the AI erred toward caution rather than overcommitment."},{"code":"F6","name":"Prioritization","description":"Priority divergence in C002, C003 and C009 — AI more cautious than the human."},{"code":"F7","name":"Context","description":"AI actions underweighted trust and momentum where the human read the customer''s situation (C007, C009)."}]'::jsonb,
  '["Both sides avoided quoting or promising before specifications were confirmed.","The AI asked for more prerequisites per case than the human did.","In C007 (customer failed by a previous supplier) both sides recommended acknowledging the failure and sending samples; the human framed it explicitly as trust-building.","In C002, C003 and C009 the human moved to samples or comparison material sooner; the AI asked more questions first.","The AI''s framing of what to avoid was very consistent across cases; the human''s varied in emphasis."]'::jsonb,
  '["AI can translate structured information into a consistent next-action framework, particularly when the action depends on clearly identifiable prerequisites.","Human judgment adds commercial context not represented in the structured fields — reducing uncertainty for the customer, building trust and keeping momentum.","The AI''s caution is a feature when the risk is overcommitment, and a cost when the risk is losing the conversation.","Across #001–#003 a pattern is emerging: Interpret → Structure → Prepare action."]'::jsonb,
  '["Whether the human''s more proactive actions actually produce better commercial outcomes; no outcomes were measured.","Whether AI caution would relax with different instructions, and at what cost to reliability.","How the pattern behaves with real customers and real follow-up.","Anything about autonomous decision-making — these experiments do not test it."]'::jsonb,
  'This experiment took the structured output of Experiment #002 as its input, closing the loop from messy inquiry (#001, #002) to prepared action (#003). It also produced the first cross-experiment pattern: Interpret → Structure → Prepare action.',
  '["Same ten synthetic cases as #002; no new data.","Single human baseline.","No outcome measurement — we do not know which actions would have worked better with a real customer.","Qualitative comparison; agreement counts are descriptive, not statistical.","Does not establish autonomous decision-making."]'::jsonb,
  'AI can translate structured business information into a consistent next-action framework, particularly when the action depends on clearly identifiable prerequisites. Human judgment may add commercial context that is not represented by structured fields — especially where reducing uncertainty, building trust and maintaining momentum matter. Nothing in #001–#003 establishes autonomous decision-making; what is emerging is a preparation role.',
  '["Use AI to prepare the next action — prerequisites, questions to ask, what not to promise — and let a human decide how to send it.","Expect AI to be conservative; if momentum matters, plan to add proactive material (samples, overviews) yourself.","Where a customer has been let down before, the human read on trust mattered more than procedural completeness.","Treat priority ratings from AI as a second opinion, not a verdict."]'::jsonb,
  '[{"id":"C001","summary":"Custom cake boxes with logo branding.","human":{"priority":"Medium","action":"Clarify specs and budget.","why":"Missing information.","avoid":"Missing the deadline."},"ai":{"priority":"Medium","action":"Clarify box dimensions/type, confirm quantity, logo/design, delivery and production constraints.","avoid":"Quote or promise based only on quantity."}},
    {"id":"C002","summary":"Takeaway restaurant wants branded bags.","human":{"priority":"Low","action":"Send samples and rough pricing.","why":"Visual options help a busy owner pick a size.","avoid":"Waiting for them to figure out specs alone."},"ai":{"priority":"Medium","action":"Give relevant options/samples and ask product dimensions, bag size, location, budget.","avoid":"Selecting a size or firm quote without knowing what the bags carry."}},
    {"id":"C003","summary":"Early-stage startup looking for juice packaging.","human":{"priority":"Low","action":"Send a quick comparison overview of bottles vs pouches.","why":"New businesses may not know setup cost differences.","avoid":"Custom price quoting too early."},"ai":{"priority":"Medium","action":"Ask product, volume, quantity, launch and requirements, then compare bottle vs pouch.","avoid":"Pushing one format or a definitive quote before requirements."}},
    {"id":"C004","summary":"Food business needs 1,000 packaging units urgently after supplier failure.","human":{"priority":"High","action":"Find exact container specs and location.","why":"No time for custom work.","avoid":"Overpromising before verifying capability."},"ai":{"priority":"High","action":"Immediately confirm container specs, location and the exact Friday deadline, then check stock and supplier capacity.","avoid":"Promising before availability and logistics are confirmed."}},
    {"id":"C005","summary":"Flyer printing inquiry with zero details.","human":{"priority":"Low","action":"Reply with samples/catalogue.","why":"Standard options force them to think about what they need.","avoid":"A blank or incomplete response."},"ai":{"priority":"Low","action":"Ask for minimum specs needed for pricing.","avoid":"A misleading fixed price, or overwhelming them."}},
    {"id":"C006","summary":"300 shopping bags plus branded stickers for a launch.","human":{"priority":"High","action":"Clarify specs and logo file.","why":"Need to know what goes inside the bags to recommend fit.","avoid":"Rushing production until specs are confirmed."},"ai":{"priority":"High","action":"Confirm bag/sticker specs, logo/design files, location and production deadline, then separate options and quotes.","avoid":"Production commitment before specs."}},
    {"id":"C007","summary":"Inadequate supply and poor quality from the current supplier.","human":{"priority":"High","action":"Acknowledge the bad experience, reassure on quality controls, send physical samples.","why":"Build trust and reassurance.","avoid":"Competing primarily on price, or promising quality without evidence."},"ai":{"priority":"High","action":"Acknowledge the failure, establish specs and quality standards, arrange samples and pricing from a capable supplier.","avoid":"Competing primarily on price, or promising quality without evidence."}},
    {"id":"C008","summary":"Lead asks for a branded packaging catalogue.","human":{"priority":"Low","action":"Send catalogue plus a friendly note to get more information.","why":"Satisfies the immediate request.","avoid":"Aggressive phone chasing."},"ai":{"priority":"Low","action":"Send the relevant catalogue and ask product, packaging type, quantity, location, timeline.","avoid":"An irrelevant catalogue dump or an aggressive push."}},
    {"id":"C009","summary":"Bakery moving from plain to branded packaging.","human":{"priority":"High","action":"Send a quick showcase/sample.","why":"Helps organize their thinking and accelerates a better decision.","avoid":"Overwhelming the customer."},"ai":{"priority":"Medium","action":"Determine quantities, product sizes, formats/materials, branding, location and timeline, then recommend or sample.","avoid":"Assuming one bag format fits all products."}},
    {"id":"C010","summary":"5,000 waterproof stickers needed before end of month.","human":{"priority":"High","action":"Clarify specs and send a simple offer.","why":"Start printing immediately once requirements are clear.","avoid":"Excessive formality for every detail."},"ai":{"priority":"High","action":"Confirm dimensions, waterproof material/finish, exact deadline and location, verify capacity, then quote.","avoid":"Printing or promising before specs and capacity are confirmed."}}]'::jsonb,
  '["messy-business-information-to-structured-output","customer-inquiry-to-next-action"]'::jsonb,
  '["decision-support","human-ai","customer-workflows"]'::jsonb,
  '["next-action","decision-preparation","priority","synthetic-data"]'::jsonb,
  true,
  'Experiment #003: Structured Information → Next Action | FIELD',
  'Given structured cases, can AI prepare the right next action? Human and AI converged on the pattern; they diverged on caution, priority and commercial context.',
  now()
)
on conflict (slug) do update set
  experiment_number = excluded.experiment_number, title = excluded.title, subtitle = excluded.subtitle,
  status = excluded.status, publication_date = excluded.publication_date, short_summary = excluded.short_summary,
  research_question = excluded.research_question, hypothesis = excluded.hypothesis, workflow = excluded.workflow,
  workflow_steps = excluded.workflow_steps, research_type = excluded.research_type, methodology = excluded.methodology,
  dataset_description = excluded.dataset_description, sample_size = excluded.sample_size,
  human_baseline = excluded.human_baseline, ai_baseline = excluded.ai_baseline,
  evaluation_criteria = excluded.evaluation_criteria, results = excluded.results, key_findings = excluded.key_findings,
  failure_modes = excluded.failure_modes, observations = excluded.observations, interpretations = excluded.interpretations,
  unknowns = excluded.unknowns, what_changed = excluded.what_changed, limitations = excluded.limitations,
  conclusion = excluded.conclusion, practical_implications = excluded.practical_implications, cases = excluded.cases,
  related_experiments = excluded.related_experiments, topics = excluded.topics, tags = excluded.tags,
  featured = excluded.featured, seo_title = excluded.seo_title, seo_description = excluded.seo_description,
  published_at = coalesce(public.experiments.published_at, excluded.published_at);

-- ===========================================================================
-- Findings
-- ===========================================================================
insert into public.findings (slug, title, summary, body, source_experiment, evidence, topic, date, tags, related_findings, status, published_at)
values
(
  'standardization-not-judgment',
  'AI''s Apparent Advantage May Be Standardization, Not Judgment',
  'In Experiment #002, the AI''s edge over the human was consistency and coverage — not a better read of the business situation.',
  'When ten messy packaging inquiries were converted into a six-field table, the AI produced the structure consistently for every case, listed missing information every time, and did not skip fields. The human, working in about 30 minutes, left some actions incomplete.

But where a message implied a commercial situation — a customer burned by a previous supplier, a new business that does not yet know what it needs — the human''s reading was richer.

The interpretation we draw is narrow: on this task, AI''s apparent advantage was standardization rather than superior business judgment. That suggests a role — make the messy step consistent — rather than a replacement.

This is an observation from ten synthetic cases and one human baseline. It is not a claim about all businesses or all workflows.',
  (select id from public.experiments where slug = 'messy-business-information-to-structured-output'),
  '["AI produced the six-field structure consistently across all ten cases.","AI listed missing information for each case; the human did so less consistently.","Some human-written actions were incomplete.","Human reading of commercial context (e.g. C007) was richer than the AI''s."]'::jsonb,
  'information-processing', '2026-08-29',
  '["standardization","judgment","extraction"]'::jsonb,
  '["prepare-not-decide","missing-information-is-the-problem"]'::jsonb,
  'published', now()
),
(
  'prepare-not-decide',
  'AI Can Prepare the Next Action Without Being the Decision-Maker',
  'In Experiment #003, AI consistently turned structured cases into a next-action framework — prerequisites, questions, what not to promise — while the human still supplied the commercial call.',
  'Given the same ten structured cases, human and AI converged on one operational pattern: understand the situation, identify what is missing, assess urgency, choose a next action, avoid premature commitment.

Within that pattern the AI was reliably good at the procedural part — confirm specs, location, deadline and capacity before quoting. It functioned as a guardrail against overcommitment.

What it did not supply was the commercial move: send samples now to keep a busy owner engaged, lead with reassurance for a customer let down by their last supplier. Those came from the human.

The finding is that AI can prepare the action. Nothing in this experiment tests, or supports, AI making the decision autonomously.',
  (select id from public.experiments where slug = 'structured-information-to-next-action'),
  '["Human and AI converged on the same operational pattern across ten cases.","AI was stronger at identifying operational prerequisites (specs, location, capacity).","Human judgment was more commercially proactive in C002, C003, C007 and C009.","Neither side quoted or promised before specifications were confirmed."]'::jsonb,
  'decision-support', '2026-09-12',
  '["next-action","decision-preparation"]'::jsonb,
  '["standardization-not-judgment","caution-and-momentum"]'::jsonb,
  'published', now()
),
(
  'missing-information-is-the-problem',
  'Missing Information Is Part of the Business Problem',
  'In Experiment #001, most inquiries were incomplete, and the useful step was making the gaps visible before acting.',
  'Of ten synthetic customer inquiries, most lacked at least one detail needed to act. Intent and urgency were not always visible from the wording, and a price question did not reliably mean the customer was ready to buy.

The human decided quickly and intuitively; the reasoning was not consistent from case to case. When the AI was asked to separate what was known from what was unknown before proposing an action, the resulting actions were more defensible and the structure repeated cleanly across cases.

The reading we take is that missing information is not noise around the inquiry — it is part of the inquiry. Handling it explicitly is the work.

Ten synthetic cases, one human, no timing. An observation, not a law.',
  (select id from public.experiments where slug = 'customer-inquiry-to-next-action'),
  '["Most of the ten inquiries lacked at least one detail needed to quote or act.","A price question did not reliably indicate high buying intent.","AI output was more useful when it distinguished known from unknown before proposing an action.","Human reasoning was intuitive and not standardized across cases."]'::jsonb,
  'customer-workflows', '2026-08-15',
  '["missing-information","qualification"]'::jsonb,
  '["standardization-not-judgment"]'::jsonb,
  'published', now()
),
(
  'caution-and-momentum',
  'AI Caution Can Be Useful — Until It Slows the Conversation',
  'In Experiment #003, the AI''s conservatism protected against premature commitments, but in several cases the human chose to move the customer forward sooner.',
  'The AI in Experiment #003 asked for more prerequisites per case than the human did, and rated three cases (C002, C003, C009) less urgent than the human. It never proposed quoting or promising before specifications were confirmed.

That is valuable when the risk is overcommitment — a food business that needs 1,000 containers by Friday should not be promised anything before stock is checked.

It is a cost when the risk is losing the conversation. For a busy takeaway owner or a first-time juice founder, the human''s instinct was to send samples or a simple comparison now and let the material do the questioning.

The observation is that AI caution is a setting, not a virtue: useful as a guardrail, potentially slow as a default. We did not measure outcomes, so we cannot say which approach converts better.',
  (select id from public.experiments where slug = 'structured-information-to-next-action'),
  '["AI was more conservative about missing information.","AI rated C009 medium where the human rated it high; similar divergence in C002 and C003.","AI functioned as a procedural guardrail against premature commitments.","Human judgment was more commercially proactive in C002, C003, C007 and C009."]'::jsonb,
  'human-ai', '2026-09-12',
  '["caution","momentum","priority"]'::jsonb,
  '["prepare-not-decide"]'::jsonb,
  'published', now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, body = excluded.body, source_experiment = excluded.source_experiment,
  evidence = excluded.evidence, topic = excluded.topic, date = excluded.date, tags = excluded.tags,
  related_findings = excluded.related_findings, status = excluded.status,
  published_at = coalesce(public.findings.published_at, excluded.published_at);
