# No Paid Tools Without Approval

Miguel Design OS is local-first.

The repo may define workflows involving tools such as Lovable, screenshot-to-code, Onlook, v0, Bolt, OpenAI, Anthropic, Gemini, Replicate, browser automation, visual regression services, or other frontend/AI tooling.

Agents must not do any of the following unless Migi explicitly approves that exact use:

- run paid tools
- add API keys
- request model provider keys
- call external model APIs
- use hosted AI builders
- use hosted screenshot-to-code tools
- upload private screenshots to an external service
- upload source code to an external service
- deploy to cloud services
- start a paid SaaS trial
- install third-party skills or plugins that call external services

## Default Allowed Behavior

Agents may use local instruction files, local scripts, local schemas, local screenshots, local browser automation, and local validation tools when they are already available in the repo or project.

Allowed by default:

- reading `skills/*/SKILL.md`
- filling local Markdown/JSON templates
- validating local schemas
- running local scripts that do not call paid or hosted services
- capturing screenshots from a local app
- comparing screenshots locally
- generating prompts locally

## Figma Cost Safety

Figma work must use only normal Figma Plugin API operations unless Migi explicitly asks for a different paid workflow. Allowed operations are pages, frames, vectors, shapes, text, variables if available, styles, components, node metadata, and storyboard frames.

Do not use Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operations, or any feature that requires a paid seat by default.

If a requested operation requires Figma Motion, Figma Draw, Dev Mode, AI credits, Figma AI, Figma Weave, Figma Make, paid generation, or a paid seat, stop and report exactly:

`Blocked: this requires a paid or plan-gated Figma feature.`

## Approval Requirement

If an external or paid tool would be useful, the agent must stop and ask Migi first.

The request must state:

```md
Tool:
Why it helps:
What data would be sent:
Cost or account requirement:
Local/free alternative:
Exact action requested:
```

No approval means do not use it.

## Design Principle

Miguel Design OS may describe bridges to Lovable, v0, Bolt, OpenAI, Anthropic, Gemini, Replicate, Onlook, or similar tools, but those bridges are optional workflows. The default operating system must remain free, local, inspectable, and usable by Codex inside the repo.
