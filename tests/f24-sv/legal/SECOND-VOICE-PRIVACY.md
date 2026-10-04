# Second Voice: privacy policy

**Last updated:** [DATE]

Second Voice is an independent writing tool by Miguel Almeida. You submit a draft, choose a voice, and receive a rewrite. Because you are trusting it with your own writing, this policy explains exactly what happens to that writing.

## 1. Who is responsible

Miguel Almeida, [Street and number], [Postcode] Berlin, Germany. Email: [EMAIL ADDRESS]. Full details: [LINK TO IMPRESSUM].

## 2. The short version

- You sign in with GitHub. There is no anonymous generation.
- Your drafts and rewrites are private by default. A rewrite only becomes public if you explicitly share it, and you can make it private again.
- To create a rewrite, your draft is sent to an AI provider.
- Operational logs record things like request IDs, timings and hashes, not the full text of your writing [confirm this matches the implementation].
- No advertising, no tracking cookies, no selling of data.

## 3. Signing in with GitHub

When you sign in, GitHub (GitHub, Inc., USA) confirms your identity and sends Second Voice your **[GitHub user ID, username, avatar URL, and email if the scope requests it]** [list exactly what the OAuth scopes return].
- **Purpose:** creating and securing your account, and enforcing usage limits per account.
- **Legal basis:** Art. 6(1)(b) GDPR (providing the service you signed up for).
- **Cookies:** Second Voice sets strictly necessary, HttpOnly cookies for the sign-in flow (PKCE verifier) and your session. They are needed to provide the service, so no consent is required (§ 25(2) no. 2 TDDDG). You can end a session at any time by logging out, which revokes it.
- **Third country:** GitHub is based in the US. The transfer relies on the EU-US Data Privacy Framework (GitHub is certified [confirm]) or the EU Standard Contractual Clauses.

## 4. Your writing

**What is stored:** your drafts, the selected voice and strength, the rewrites produced, and their share status.
- **Where:** in a database hosted by **Supabase** ([Supabase Inc.]; data region: **[REGION, e.g. EU (Frankfurt)]**) [confirm], acting as processor under a data processing agreement.
- **Legal basis:** Art. 6(1)(b) GDPR.
- **How long:** until you delete it or delete your account. [Or: NUMBER days after last use.] [Choose and implement one.]

**Generation:** to create a rewrite, your draft and chosen settings are sent to **[AI PROVIDER, e.g. Groq, Inc., USA]**, which returns the rewritten text.
- Each request is limited to one model call.
- Requests are not retried automatically.
- **Provider terms:** the provider [does not use API inputs to train models and retains them for at most NUMBER days] [confirm against the provider's current terms].
- **Third country:** [EU-US Data Privacy Framework / Standard Contractual Clauses, as applicable].

**Sharing:** a rewrite becomes public only when you choose "Share", and only that rewrite. Anyone with the link can then read it. You can make it private again, which disables the link. [Confirm what a shared page shows: the rewrite only, or also the original draft.]

## 5. Usage limits and abuse prevention

To keep a free, resource-limited service available, Second Voice stores usage counters per account and globally: lifetime, daily and per-minute counts, and active operations. It also stores operation identifiers, so a repeated request does not trigger a second generation.
- **Legal basis:** Art. 6(1)(f) GDPR. The legitimate interest is preventing abuse and controlling costs.
- **Storage:** [NUMBER days / for the life of the account].

## 6. Quality and debugging data

To debug and improve rewrites, Second Voice records operational data:
- request identifiers;
- provider and model;
- response times;
- whether output passed validation;
- feedback you give;
- **hashes** of rewrites instead of the full text, where that is enough.

- **Legal basis:** Art. 6(1)(f) GDPR. The legitimate interest is keeping the service working and improving output quality.
- **Storage:** [NUMBER days].

## 7. Hosting

The app is hosted by **[HOSTING PROVIDER, name, address]**, which processes technical request data (IP address, time, requested URL, browser) to deliver the app. Logs are kept for [NUMBER days]. Legal basis: Art. 6(1)(f) GDPR.

## 8. Your rights

You can request access, correction, deletion, restriction or a portable copy of your data, and you can object to processing based on legitimate interests (GDPR Articles 15 to 18, 20 and 21).
- **Deleting your data:** [describe how, e.g. "Delete account" in settings, or email [EMAIL ADDRESS]]. Deletion covers your account, drafts, rewrites and shares. [Confirm that backups expire within NUMBER days.]
- **Complaints:** you may complain to a supervisory authority. Responsible here: Berliner Beauftragte für Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin, www.datenschutz-berlin.de.

## 9. Changes

When this policy changes in a way that matters, the date above changes. Significant changes are announced in the app.
