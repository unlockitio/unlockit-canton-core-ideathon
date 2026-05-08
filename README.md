# Unlockit Canton Core Iterations

This document is precisely about the iterations made following on the Canton Core Proof of concept previously delivered and which can be read at [README v1.md](./README%20v1.md).

Work actively underway since the last milestone of the Canton Core hackathon:
- Refactoring the existing Unlockit product experience to enable its integration with the hackathon core components.
- Showcasing the hackathon core project user experience for the integrated product.
- Laying the basis for specific Daml constructs, including interfaces for multiple records to be recorded in Canton supporting the overarching approach at Unlockit.

Supporting material and code:
- PDF overview: [Unlockit Trust Layer Resume 2026 v2](./unlockit/Unlockit%20Trust%20Layer%20Resume%202026%20v2.pdf)
- UI codebase: [ui](./unlockit/ui) - Open locally individual html pages
- Daml codebase: [daml](./unlockit/canton)
- Slide Deck: https://drive.google.com/file/d/1CPV-5citG0S_qgxOAJ6ySrW1pHxT4Lv3/view?usp=sharing
- Video demo (advanced mode): https://drive.google.com/file/d/1JWz0oTlnJ8nlZBSOgkdfPYVU0h-Tnjvo/view?usp=sharing 
- Video demo (realtor ux): https://docs.google.com/videos/d/1q_kUVggVh0gm1grBmVGCUwAfx3gD83XK9omAmZnJXtw/edit?usp=sharing
- Video demo (Canton Catalyst Showcase Day): https://drive.google.com/file/d/1sg5nmD4xnnwXnhBBVGIOsZTOx7CgQts0/view?usp=sharing
- Additional details: [unlockit](./unlockit) - Feel free to check other files under this folder

The experience focused on the project presented can be seen at [mockups.unlockit.io](https://mockups.unlockit.io/features/003-transactions/002-detail/transaction-detail-mockup.html?id=WF-003). User and pass: `canton-core`.

**Local Demo Proxy (Caddy)**
This repo includes a Caddy proxy config at [unlockit/Caddyfile](./unlockit/Caddyfile). It serves the UI and proxies ledger API calls to avoid CORS issues.

Run:
```bash
caddy run --config /Users/marado/Documents/Unlockit/Code/canton-core-ideathon/unlockit-canton-core-ideathon/unlockit/Caddyfile
```

Open:
```bash
http://localhost:8099/unlockit/ui/003-transactions/002-detail/transaction-detail-mockup.html?id=WF-003
```

**Walkthrough**
Use the screenshots below and follow the widget prompts to move through the experience.

**Supporting Story**
An agent supports a buyer. When there is an open buy transaction, the Realtor AI assistant initiates a chat with the agent and alerts them about relevant data.

![Assistant notification in transaction](./unlockit/screenshots/image%201.png)

When the agent opens the notification, a widget appears with insights and suggested follow ups. The documentation informing these insights is recorded on Canton as open data resources on the internet to demonstrate where the data comes from.

![Insights widget with initial follow ups](./unlockit/screenshots/image%202.png)

The Realtor AI Assistant suggests requesting more real time insights to support the buyer journey. Throughout the journey the Realtor AI Assistant helps refine the data request.

![Refined follow up inputs](./unlockit/screenshots/image%203.png)

As that refinement is sufficient to trigger a confirming action, the assistant provides an overview along with the data cost.

![Estimated cost and checkout option](./unlockit/screenshots/image%204.png)

At checkout, the user is offered different ways to settle the request, including wallet balances and delegation rights using an organization’s wallet tokens.

![Wallet selection and balances](./unlockit/screenshots/image%205.png)

After selecting the wallet and confirming payment, a summary is provided, including the split of the used tokens across stakeholder roles that provided the information used to settle the transaction.

![Settlement summary and value split](./unlockit/screenshots/image%206.png)

Finally, the user can ask the Realtor AI agent to build a branded report with all collected insights.
