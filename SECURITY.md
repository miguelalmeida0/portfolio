# Security

Report vulnerabilities privately using [the maintainer contact page](https://miguelalmeida.xyz/#contact). Do not publish private employer information, candidate data, credentials or exploitable payloads in public issues.

## Public-portfolio boundaries

- This is a public showcase. No provider secret or private API key should appear in `static/`, client-side bundles, Git history, screenshots, examples or environment templates.
- The Second Voice demo must distinguish locally prepared output from actual live responses. Never route owner-funded model calls through an unrestricted portfolio endpoint.
- Employer work is described using public-safe facts. Do not commit proprietary F24 source, internal tickets or confidential analytics.
- Treat PDF CVs and downloadable assets as public. Review personal data and link destinations before release.
- Rotate and revoke an accidentally exposed key; removing it from the current commit does not invalidate earlier copies.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for production boundaries. Build or static checks do not replace a manual deployed-route and exposed-asset review.
