## Walkover match outcome

This branch (`feature/walkover-outcome`) adds the **Walkover** match outcome. The full write-up
(how scoring works, design, schema, assumptions, testing, next steps) is in the backend README:
[khelclub_v0_backend/README.md](https://github.com/2005lakshya/khelclub_v0_backend/blob/feature/walkover-outcome/README.md).

Frontend changes in short:

- `src/components/matchOutcome/`: the only place that knows about outcomes. It has helpers that read the
  `outcome` object the API returns, an `OutcomeTag` chip, and a `DeclareOutcomeDialog`. Outcome types
  come from `GET /match-outcomes`, so a new backend outcome (e.g. forfeit) needs no frontend change.
- Referee match screen (`src/screen/referee/match/Match.js`): **Declare Walkover** from the
  *Match Not Started* dialog or the action bar. A decided match shows "X won by walkover" instead of scores.
- Fixture cards, knockout brackets, pool fixtures and match tables show **W/O**, a **Walkover** tag, and
  the winner highlighted.

Install with `npm install --legacy-peer-deps` (an old peer dependency in the bracket library), then `npm run dev`.
On `localhost` the app uses the backend at `http://localhost:5001`.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
