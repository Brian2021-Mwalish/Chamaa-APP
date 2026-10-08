# Chama Group Savings Platform

Chama is a responsive web platform for managing organized group savings in Kenya. The completed system will provide member onboarding and verification, plan enrollment, group formation, contribution tracking, rotating payouts, M-Pesa payments, wallet and ledger history, group communication, member services, and a role-controlled administration portal.

> **Implementation note:** This document specifies the complete target system. The repository now includes the React frontend and a minimal Django backend foundation with a phone-based user model and account administration. OTP delivery, the remaining domain apps, payments, production authorization, and deployment still need to be implemented.

## Contents

- [Project summary](#project-summary)
- [Goals and users](#goals-and-users)
- [Complete system capabilities](#complete-system-capabilities)
- [Savings plans and product rules](#savings-plans-and-product-rules)
- [Technology](#technology)
- [System architecture](#system-architecture)
- [Project structure](#project-structure)
- [System data model](#system-data-model)
- [API outline](#api-outline)
- [End-to-end workflows](#end-to-end-workflows)
- [Project deliverables](#project-deliverables)
- [Local frontend setup](#local-frontend-setup)
- [Django backend setup](#django-backend-setup)
- [Configuration](#configuration)
- [Security, privacy, and financial safeguards](#security-privacy-and-financial-safeguards)
- [Testing and acceptance criteria](#testing-and-acceptance-criteria)
- [Deployment and operations](#deployment-and-operations)
- [Delivery timeline](#delivery-timeline)
- [Project budget](#project-budget)
- [Risks, assumptions, and exclusions](#risks-assumptions-and-exclusions)
- [Recommended next steps](#recommended-next-steps)

## Project summary

| Item | Description |
| --- | --- |
| Working name | Chama Group Savings Platform |
| Product type | Responsive member web application, Django REST API, and administration portal |
| Intended users | Chama members, operations/admin staff, and prospective business partners |
| Primary market | Kenya; currency displayed is Kenyan shillings (KES/KSh) |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Python, Django, Django REST Framework, PostgreSQL |
| Payments | M-Pesa Daraja API, subject to provider onboarding and approval |
| Total project budget | **KSh 103,000** |
| Estimated delivery period | **8 weeks** from approved requirements and access to required third-party services |

The system digitizes the lifecycle of a five-member rotating savings group. Members select an approved contribution tier, complete verification and membership, are assigned to a compatible group, make recurring contributions, see the payout schedule, and receive status updates. Administrators oversee identity reviews, groups, transactions, support requests, and audit history. Product settings and financial records are managed server-side so member balances and schedules are consistent across devices.

## Goals and users

### Goals

- Make member onboarding and group participation understandable on mobile and desktop.
- Make contribution status, group membership, and payout order visible to members.
- Give administrators tools to review member applications, manage assignments, and monitor payments.
- Provide secure payment processing and an auditable transaction history through the backend.

### User roles

- **Member:** registers, submits verification information, selects a plan, joins a group, views contributions and payout status, and uses member services.
- **Administrator:** reviews verification, manages members and group assignments, monitors payment status, and reviews platform activity.
- **Business partner applicant:** submits details for a proposed member-facing partnership.

## Complete system capabilities

### Member application

- **Account access:** phone-number registration and sign-in, OTP delivery and verification, session management, logout, and account recovery. A member sees only their own records and groups.
- **Profile and verification:** profile details, KYC submission, private identity/income document upload, review status, and requests to correct or resubmit documents.
- **Membership and plans:** view current plan terms, compare contribution tiers, accept terms, pay the approved one-time fee, and see membership status.
- **Group onboarding:** wait for matching, view assigned group and members, see the cycle start date and payout position, and access group rules.
- **Contributions:** view amount due, due date, payment status, payment receipt/reference, reminders, and a history of each cycle's contributions.
- **Payouts:** view payout order, expected amount and status, any deductions disclosed in the terms, and payout transaction reference after settlement.
- **Wallet and records:** see a server-calculated available balance, deposits, contributions, fees, payouts, repayments, and downloadable or shareable receipts where approved.
- **Group communication:** read and send group messages, see system notices, and receive reminders and payment/payout notifications.
- **Member services:** set personal savings goals and submit enquiries or service requests. Overdraft/credit features are disabled until product terms, eligibility, legal approval, and operational controls are approved.
- **Support and privacy:** view help/contact channels, notification preferences, and applicable account/data requests.

### Administration portal

- Role-based staff sign-in and permission-controlled access.
- Dashboard for member counts, pending KYC, group formation, contribution collection, payout status, and operational exceptions.
- KYC review queue with secure document access, approve/reject/request-correction actions, and recorded reviewer decisions.
- Member search and account status controls with reason capture and audit logging.
- Group creation/assignment, membership management, cycle configuration, and payout-order visibility.
- Payment monitoring, failed/pending callback review, reconciliation, and carefully permissioned financial adjustments with audit records.
- Payout preparation and approval workflow, with separation of duties where feasible.
- Group message/system announcement tools and operational notifications.
- Activity/audit log with filters for actor, action, member/group, and time period.
- Reports/export of approved operational data with access controls and privacy-conscious field selection.

### Platform services

- Versioned REST API, relational persistence, background processing for scheduled reminders and retries, and private document storage.
- M-Pesa payment initiation and callback processing, idempotent transaction handling, reconciliation, and sandbox-to-production configuration separation.
- Email/SMS/push provider integration for OTPs and notifications, selected and priced during implementation.
- Centralized application logs, health checks, error monitoring, automated backups, and recovery procedures.
- Responsive, keyboard-accessible interface with loading, empty, validation, success, and failure states.

## Savings plans and product rules

The initial plan values below are the proposed starting terms. The business owner must approve final terms before they are configured as active plans:

| Plan | Monthly contribution per member | Displayed payout | Group size | Cycle |
| --- | ---: | ---: | ---: | ---: |
| Starter | KSh 2,000 | KSh 10,000 | 5 members | 5 months |
| Standard | KSh 5,000 | KSh 25,000 | 5 members | 5 months |
| Premium | KSh 10,000 | KSh 50,000 | 5 members | 5 months |

The initial UI also displays a one-time membership fee of **KSh 500**. These are proposed product figures, not a statement of legal terms, interest, guaranteed returns, or an active financial offer. Configure plan terms in the backend and version them. Confirm fees, dates, payout mechanics, missed-payment/default handling, refunds, disputes, and member agreement before accepting real money. Do not advertise a savings return or enable credit unless separately approved.

## Technology

### Frontend

- React 18 and TypeScript
- Vite 5 for development and production builds
- Tailwind CSS 3 for styling
- Lucide React for icons
- ESLint and TypeScript compiler for static checks

The target architecture uses Django as the backend and PostgreSQL as the primary database. Frontend API requests must go through the Django REST API; the browser must not connect directly to the database or payment provider.

### Backend and integrations

- Python 3.12 or a currently supported Python release
- Django and Django REST Framework
- PostgreSQL
- Token-based API authentication with short-lived access tokens and refresh-token rotation (implementation choice to be confirmed)
- M-Pesa Daraja API integration, initially using the sandbox
- A task queue such as Celery with Redis only if asynchronous jobs are required for the agreed MVP

Pin exact versions and record them in lockfiles/requirements files when the backend repository is created.

## System architecture

The completed system is designed as a React web client communicating with a Django REST API. PostgreSQL is the authoritative store for users, group activity, payments, and ledger entries. External payment, OTP, and file-storage services are accessed only by the backend.

```text
React + TypeScript browser app
	| HTTPS / JSON REST API
	v
Django + Django REST Framework
	|             |                 |
	v             v                 v
   PostgreSQL     M-Pesa Daraja     File storage
		    callbacks       (private KYC files)
	|
	+---- background jobs / notifications (optional queue)
```

Suggested Django apps/modules:

- `accounts`: member and administrator identities, OTP lifecycle, sessions/tokens, profile.
- `kyc`: verification submissions, private document metadata, review decisions.
- `plans`: contribution plans and versioned product terms.
- `groups`: group formation, membership, cycle, payout order, contribution obligations.
- `payments`: payment intents, verified provider callbacks, ledger entries, reconciliation.
- `wallet`: balances derived from ledger entries, deposits, payouts, adjustments, repayments.
- `services`: savings goals, overdraft requests, partnership applications; activate only agreed services.
- `messaging`: group messages and system events; optional live delivery/notifications.
- `admin`/Django admin: staff-only operations and audit events.

Use database transactions and idempotency for payment callbacks and payout operations. Keep business rules on the server; the browser should display server-authoritative balances, statuses, and schedules.

## Project structure

The following is the recommended combined repository layout for the complete system. Exact filenames may change during implementation, but frontend and backend responsibilities should remain separated.

```text
chama-platform/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml                 # Local PostgreSQL/Redis and optional services
├── docs/
│   ├── requirements.md
│   ├── api.md
│   ├── data-model.md
│   ├── deployment.md
│   ├── operations-runbook.md
│   └── security-and-privacy.md
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── app/                       # App entry, routing, providers, route guards
│       ├── api/                       # Typed API client and request/error handling
│       ├── assets/
│       ├── components/                # Shared layout, form, table, dialog components
│       ├── features/
│       │   ├── auth/
│       │   ├── onboarding/
│       │   ├── kyc/
│       │   ├── plans/
│       │   ├── groups/
│       │   ├── contributions/
│       │   ├── payouts/
│       │   ├── wallet/
│       │   ├── chat/
│       │   ├── services/
│       │   ├── profile/
│       │   └── admin/
│       ├── hooks/
│       ├── pages/                     # Route-level screens
│       ├── types/
│       ├── utils/
│       └── main.tsx
├── backend/
│   ├── manage.py
│   ├── pyproject.toml                 # Or requirements files; choose one dependency workflow
│   ├── .env.example
│   ├── config/
│   │   ├── settings/                  # base, local, test, production
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/                  # User model, OTP, auth, permissions
│   │   ├── kyc/                       # Submissions, private documents, review workflow
│   │   ├── plans/                     # Versioned plan/product terms
│   │   ├── groups/                    # Group assignment, membership, cycles, payout order
│   │   ├── contributions/             # Amount due, due dates, contribution status
│   │   ├── payments/                  # Daraja client, callbacks, payment state/reconciliation
│   │   ├── wallet/                    # Ledger, balance queries, receipts
│   │   ├── payouts/                   # Approval, disbursement, payout records
│   │   ├── messaging/                 # Group messages and system notices
│   │   ├── notifications/             # SMS/email delivery and scheduled reminders
│   │   ├── services/                  # Savings goals, approved credit, partnerships
│   │   ├── audit/                     # Immutable staff/system audit events
│   │   └── reporting/                 # Permission-controlled operational reports
│   └── tests/                         # Cross-app/API integration tests
├── infra/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── deployment/                    # Environment-specific deployment configuration
└── .github/
	└── workflows/                    # Lint, typecheck, tests, build and deployment checks
```

Each Django app should keep models, serializers, views/API endpoints, URLs, permissions, services/business rules, tasks, migrations, and tests close to the feature they own. Do not put financial rules in React components or expose provider credentials to the frontend.

## System data model

The final schema must follow approved requirements. A practical initial domain model is:

| Entity | Purpose and key fields |
| --- | --- |
| `User` | Phone number (unique), name, password/auth identifiers, active status, timestamps |
| `OTPChallenge` | Hashed/derived challenge reference, expiry, attempt count, consumed state; never persist a reusable plaintext OTP |
| `KYCSubmission` | User, status, submitted/reviewed timestamps, reviewer, decision reason |
| `KYCDocument` | Submission, private object-storage key, document type, upload metadata, checksum, retention/deletion state |
| `Plan` | Name, contribution amount, group size, cycle rules, effective dates, active flag |
| `SavingsGroup` | Plan/version, status, cycle start/end, group identifier |
| `GroupMembership` | Group, user, join/leave state, payout position, membership dates |
| `Contribution` | Member, group, cycle, amount due, due date, payment status |
| `Payment` | Provider, unique provider reference, amount, purpose, state, idempotency key, timestamps |
| `LedgerEntry` | Immutable credit/debit record, account, currency, source reference, balance-affecting amount |
| `Payout` | Group, recipient, cycle, amount, status, payment reference, approval/reconciliation data |
| `CreditRequest` | Applicant, amount, fee/terms version, status, decision and repayment records |
| `Message` | Group, author/system actor, body, timestamp, moderation/deletion metadata |
| `AuditEvent` | Actor, action, target, timestamp, request context, before/after metadata where appropriate |

Money values should use integer minor units or fixed-precision decimal fields, never binary floating-point. Validate currency, amounts, ownership, and state transitions server-side. Define retention periods and access controls for identity documents before collecting real KYC data.

## API outline

Use a versioned base path, for example `/api/v1/`. Exact payload schemas and status codes should be agreed during requirements and API design.

| Method and endpoint | Purpose |
| --- | --- |
| `POST /auth/otp/request` | Request an OTP for a phone number, subject to throttling and abuse controls |
| `POST /auth/otp/verify` | Verify a one-time challenge and issue authenticated credentials |
| `POST /auth/logout` | Revoke the current refresh/session token |
| `GET /me` / `PATCH /me` | Read/update the authenticated member profile |
| `POST /kyc/submissions` | Submit KYC metadata and document upload references |
| `GET /kyc/submissions/current` | Read the member's current verification status |
| `GET /plans` | List active plans and terms |
| `POST /memberships` | Create/activate a membership after the applicable payment is confirmed |
| `GET /groups/current` | Read current group, members, and cycle state |
| `GET /groups/current/contributions` | Read contribution obligations and paid status |
| `GET /groups/current/payout-schedule` | Read the authoritative payout order and statuses |
| `GET /wallet` / `GET /wallet/transactions` | Read wallet summary and paginated ledger activity |
| `POST /payments/mpesa/stk-push` | Initiate an authorized M-Pesa payment request |
| `POST /webhooks/mpesa` | Receive and validate provider callbacks; idempotently record outcomes |
| `GET /groups/current/messages` / `POST /groups/current/messages` | Read/post messages for an authorized group member |
| `POST /credit-requests` | Submit an overdraft request, if that product is approved |
| `POST /partnership-applications` | Submit a business partnership enquiry |
| `/admin/...` | Staff-only KYC, member, group, payment, and audit operations |

Every endpoint must enforce authentication where appropriate, object-level authorization, input validation, pagination, consistent error responses, and audit requirements. M-Pesa callbacks must not be treated as proof of payment without verification and reconciliation against provider references and amounts.

## End-to-end workflows

### Member registration and group joining

1. A member enters a phone number and requests an OTP.
2. The OTP provider delivers a short-lived code; the backend limits retries and validates the code before creating an authenticated session.
3. The member completes their profile and submits the required identity/income information through an encrypted connection. Documents are stored privately.
4. The member selects an available plan, reviews its versioned terms, and pays any approved membership fee.
5. An administrator reviews the KYC submission. The member can see pending, approved, rejected, or correction-requested status and next steps.
6. Once all joining conditions are satisfied, the group service assigns the member to a group with compatible plan terms and an available place. The system records membership and payout order.
7. The member sees group members, cycle dates, rules, first contribution due, and notices in the portal.

### Contribution and payout cycle

1. The backend creates each member's contribution obligation for the cycle and schedules reminders.
2. The member initiates an M-Pesa payment. The backend records a pending payment and sends the request using server-held Daraja credentials.
3. The backend processes provider callbacks idempotently, verifies expected amount/reference, updates payment state, and posts the corresponding ledger entry only once.
4. Group and admin views show confirmed collection progress. Failed, late, reversed, or unmatched transactions are visible for follow-up and reconciliation.
5. Once payout conditions are met, an authorized operator reviews/approves the payout according to configured policy. The system initiates the disbursement, records provider outcome, and updates the ledger and recipient status.
6. Members receive a notice and can view the receipt/reference and the next cycle's contribution obligation.

### Administration and exception handling

1. Staff sign in with a staff role and only see actions their permissions allow.
2. Staff review KYC, member status, group readiness, payment exceptions, or payout requests from the relevant queue.
3. High-impact decisions require a reason; financial adjustments and payout actions are recorded in the audit trail and, where possible, require a second approver.
4. Staff can search the audit/payment history to resolve a member enquiry and record the resolution without changing immutable transaction history.

### Optional services

Personal savings goals, overdrafts/credit, and business partnerships require separate product requirements. The MVP may provide the relevant enquiry/request screens, but must not disburse credit or promise returns until terms, eligibility, funding, reconciliation, risk controls, and applicable approvals are agreed.

## Project deliverables

The project is complete when the following deliverables are handed over and the agreed acceptance tests pass:

- **Requirements and product rules:** approved member/admin workflows; plan, fee, contribution, payout, missed-payment, refund, and dispute rules; role/permission matrix; MVP scope and acceptance criteria.
- **Frontend application:** responsive member portal and administration interface, connected to the API, with validation, loading/empty/error/success states, accessibility checks, and no production demo shortcuts.
- **Django REST backend:** versioned API, authentication/authorization, validation, business services, database migrations, Django admin/operations functions, and documented API contract.
- **Database and storage:** PostgreSQL schema and migrations for accounts, KYC, plans, groups, cycles, contributions, payment records, ledger, payouts, messages, notifications, and audit events; private document storage configuration.
- **Payment integration:** M-Pesa Daraja sandbox initiation and callback handling, idempotency, transaction status handling, reconciliation procedures, and a documented production-credential activation checklist.
- **Notifications and background jobs:** configured OTP and agreed member notifications, scheduled contribution reminders, retry/failure handling, and delivery logs without secret or excessive personal data.
- **Administration workflows:** KYC review, member/group management, payment/payout monitoring, exception handling, activity/audit log, and approved operational reports.
- **Quality assurance:** automated backend unit/API tests, frontend type/lint/build checks, integration tests for critical flows, payment callback edge cases, and an acceptance/UAT report.
- **Deployment package:** separate development/staging/production configuration, build/deployment instructions, HTTPS and secret configuration, database backup/recovery notes, health checks, and rollback procedure.
- **Documentation and handover:** source code, setup guide, API and data model docs, operations runbook, environment-variable reference, known limitations, and a walkthrough for the product/operations owner.

Third-party services (OTP/SMS, M-Pesa production access, hosting, and private file storage) require accounts and credentials owned by the project owner. The development team should not retain production secrets after handover.

## Local frontend setup

### Prerequisites

- Node.js 18 or newer (use a currently supported LTS release).
- npm.
- Git, if cloning the repository.

### Install and run

From the `frontend/` directory in the target repository (the current workspace keeps the Vite app at the `chamaa-main/` project root until it is moved into the combined layout):

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Available commands

```bash
npm run dev        # Start the Vite development server
npm run build      # Create a production frontend bundle in dist/
npm run preview    # Preview the production bundle locally
npm run lint       # Run ESLint
npm run typecheck  # Run the TypeScript application type check
```

## Django backend setup

The target backend lives in `backend/`. With the required Python environment and PostgreSQL available, the developer workflow will be:

- Python 3.12 (or the version selected for the implementation).
- PostgreSQL for application data.
- A private object store for KYC files; local development may use a non-public local storage backend.
- Django and Django REST Framework dependencies pinned in the project's selected dependency/lockfile format.
- A sandbox M-Pesa Daraja account for integration testing.

The current backend includes only the `accounts` app. It uses SQLite by default for local development; set `DATABASE_URL` to use PostgreSQL. OTP delivery and public registration are intentionally not enabled yet.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
python manage.py test
```

On Windows PowerShell, activate the environment with `.venv\\Scripts\\Activate.ps1` instead. The account profile endpoint is `GET/PATCH /api/v1/accounts/me/` and requires an authenticated Django session. User creation and staff management are available through Django Admin at `/admin/`.

Do not commit credentials. Production must use a production-grade WSGI/ASGI deployment, not Django's development server.

## Configuration

The frontend currently requires no API environment variables. When connected to Django, configure at least:

| Variable | Purpose | Handling |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Public base URL for the Django API | May be included in frontend builds; contains no secret |
| `DJANGO_SECRET_KEY` | Django signing/cryptographic secret | Server secret; never expose to browser or commit |
| `DJANGO_DEBUG` | Enables/disables debug mode | Must be false in production |
| `DATABASE_URL` | PostgreSQL connection | Store in deployment secret manager |
| `ALLOWED_HOSTS` | Valid Django hostnames | Restrict to deployed hostnames |
| `CORS_ALLOWED_ORIGINS` | Approved browser origins | Restrict to the deployed frontend origins |
| `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` | Daraja credentials | Secret manager only; separate sandbox and production |
| `MPESA_SHORTCODE` / `MPESA_PASSKEY` | Daraja payment configuration | Secret manager only |
| `MPESA_CALLBACK_URL` | HTTPS provider callback endpoint | Must be reachable, authenticated/validated, and monitored |
| `PRIVATE_MEDIA_STORAGE_*` | Private KYC file storage configuration | Secret manager; do not make KYC objects public |

Provide a checked-in `.env.example` containing placeholders only when these settings are implemented.

## Security, privacy, and financial safeguards

- Replace the demo OTP and phone-number admin shortcut with real, rate-limited authentication, staff roles, and server-side authorization.
- Use HTTPS everywhere; protect cookies/tokens against theft and define token expiration, revocation, and rotation behavior.
- Apply least privilege, object-level permissions, CSRF protections where cookie authentication is used, secure headers, input validation, and rate limits.
- Store identity documents in private storage, restrict access, encrypt data in transit and at rest, log access, and establish retention/deletion rules.
- Never store M-Pesa secrets in frontend code. Validate callbacks, provider references, amounts, and transaction state; make handlers idempotent and reconcile settlements.
- Maintain an immutable financial ledger. Calculate balances from validated server-side transactions and use database locking/transactions for concurrent financial operations.
- Audit privileged actions such as KYC decisions, group changes, payment adjustments, and payouts. Avoid logging OTPs, secrets, full document contents, or unnecessary personal data.
- Back up and test restoration of the database; monitor failed logins, callback failures, unusual payment events, and application errors.
- Review applicable Kenyan data protection, consumer protection, payment-service, savings/credit, tax, and record-keeping requirements with qualified legal/compliance and payment-provider advisors before processing personal documents or real funds. This README is not legal advice.

## Testing and acceptance criteria

### Frontend checks

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Run these checks for frontend changes. Backend and integration tests are also required before release.

### System acceptance criteria

- A member can authenticate through the approved OTP provider, and protected data cannot be read or changed by another member.
- KYC submissions and review decisions persist, enforce file type/size rules, and use private document storage.
- Plan terms are served by the backend and versioned so existing groups retain the terms they joined under.
- Group membership, contribution due amounts, payout order, and cycle status are server-authoritative and validated against agreed rules.
- Payment initiation and callbacks are tested against M-Pesa sandbox cases, including duplicate, delayed, invalid, and failed callbacks.
- The ledger records each financial event once; displayed balances match ledger entries and reconciliation results.
- Admin operations require staff authorization and produce audit events.
- Member and staff workflows in [End-to-end workflows](#end-to-end-workflows) function against persisted backend data, including exception and recovery states.
- Automated tests cover models/business rules, API permissions, payment state transitions, frontend API errors/loading states, and major member workflows.
- Responsive layouts and keyboard-accessible workflows are checked on supported mobile and desktop browsers.
- Backup, restore, logging, deployment, rollback, and incident contacts are documented before production release.

## Deployment and operations

Recommended initial deployment topology:

- Host the built React app on a static hosting/CDN service.
- Run Django behind HTTPS on a managed application service or hardened VM/container platform.
- Use managed PostgreSQL with automated backups and tested restoration.
- Store KYC files in a private, encrypted object-storage bucket with access logging and lifecycle rules.
- Configure a stable HTTPS M-Pesa callback endpoint, monitoring, alerting, and transaction reconciliation.
- Separate local, test, staging, and production settings, databases, payment credentials, and user data.
- Deploy database migrations with a rollback/recovery plan and keep application, dependency, and infrastructure updates maintained.

Hosting, domain, SMS/OTP, M-Pesa/provider charges, storage, monitoring, and ongoing support are recurring or usage-based costs. They are not included in the one-time development estimate below unless separately agreed.

## Delivery timeline

Estimated duration: **8 weeks**. Timing assumes timely product decisions, access to provider sandbox credentials, and a small delivery team. Week ranges may overlap where parallel work is feasible.

| Week | Work | Deliverable / checkpoint |
| --- | --- | --- |
| 1 | Requirements confirmation, financial rules, user stories, architecture, API and data design | Approved MVP scope, acceptance criteria, screen/API map, risk list |
| 2 | Django project foundation, PostgreSQL configuration, environments, account/auth foundation, CI/test baseline | Running backend skeleton, initial schema and API conventions |
| 3 | Member/profile, plan, KYC submission and private-file workflow | Member onboarding APIs and admin review path |
| 4 | Group formation, membership, contribution obligations, cycle and payout scheduling | Tested group and savings-cycle rules |
| 5 | Wallet ledger and M-Pesa sandbox initiation/callback handling | Payment sandbox flow, idempotency and reconciliation tests |
| 6 | Admin workflows, audit events, notifications and agreed service-request flows | Operations features and notification behavior |
| 7 | Connect React screens to API, error/loading states, integration, security and regression testing | Integrated staging candidate and test report |
| 8 | User acceptance testing, defect fixes, production-readiness review, deployment and handover | Approved MVP release, runbook, technical handover |

Third-party onboarding, delayed compliance decisions, payment-provider approval, scope changes, or unavailable credentials may extend this schedule. Production payment activation should happen only after sandbox/UAT sign-off and operational approval.

## Project budget

**Total one-time development budget: KSh 103,000.** The following is a proposed allocation for the MVP scope in this document; it is an estimate for planning and should be converted into an agreed quotation and payment milestones before work begins.

| Work package | Allocation (KSh) |
| --- | ---: |
| Requirements, user flows, and technical/API design | 8,000 |
| Frontend cleanup and Django API integration | 12,000 |
| Django foundation, authentication, and member/KYC APIs | 16,000 |
| Group, contribution, payout, wallet, and ledger business logic | 18,000 |
| M-Pesa Daraja sandbox integration and callback handling | 15,000 |
| Admin operations, audit events, and notifications | 10,000 |
| QA, integration testing, security review, and defect fixes | 10,000 |
| Deployment setup, documentation, and handover | 6,000 |
| Contingency reserve, subject to approval | 8,000 |
| **Total** | **103,000** |

### Budget assumptions and exclusions

- Amounts are in Kenyan shillings and represent a proposed development allocation, not a vendor quote or promise of a particular delivery outcome.
- Contingency is reserved for approved in-scope uncertainty; it is not an automatic additional fee.
- The estimate assumes one MVP web application, the current frontend as the starting point, one M-Pesa integration in sandbox, and the workflows described above.
- Production M-Pesa credentials/approval, SMS/OTP charges, payment transaction charges, hosting, domain registration, managed database/storage, backups, monitoring, email/SMS services, and ongoing maintenance are excluded as recurring or third-party costs.
- Legal, compliance, licensing, financial audits, penetration testing by an independent provider, and major redesigns or new features are excluded unless expressly included in a signed scope.
- Any product terms affecting member funds, returns, lending, fees, payout guarantees, or default recovery require separate approval and may change cost and schedule.

## Risks, assumptions, and exclusions

- The current code is a UI prototype; backend behavior, integrations, test coverage, and deployment infrastructure are not present yet.
- The proposed savings and credit products may require regulatory, legal, payment-provider, and consumer-protection review before they can operate with real funds.
- Group formation, payout ordering, missed contributions, credit coverage, recovery, refunds, cancellations, and dispute handling need explicit business rules before implementation.
- OTP delivery depends on a selected provider, approved sender/configuration, and operating costs.
- KYC requires an approved document policy, secure retention process, role-based review access, and a lawful basis for collection and processing.
- The listed plan contributions and payouts assume five members contributing one amount per cycle; confirm fees, timing, and edge cases before treating this as a binding product model.
- No native Android/iOS application, automated lending decision engine, production financial guarantee, or external compliance certification is included in the proposed MVP.

## Recommended next steps

1. Confirm the complete-system scope, plan terms, group/payout rules, fees, and edge-case policies with the business owner.
2. Confirm applicable Kenyan legal/compliance obligations and the payment/OTP providers to use.
3. Approve the KSh 103,000 allocation, exclusions, delivery owner, and acceptance criteria.
4. Obtain sandbox credentials and decide hosting, database, private-file storage, and deployment environments.
5. Create the Django backend, API contract, and integration tests before connecting the frontend to real member or payment data.
6. Remove all demo authentication shortcuts and seeded financial claims before any public or production release.
