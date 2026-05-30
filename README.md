# Social Support Portal – AI-Assisted Government Application Wizard

A modern, multilingual government assistance portal designed to simplify the financial aid application process through guided workflows, accessibility-first design, and AI-assisted content generation.

Built as a Senior Frontend Engineering case study, this project demonstrates how complex citizen-facing services can be transformed into intuitive digital experiences while maintaining scalability, performance, and maintainability.

---

## Overview

Citizens applying for social support often struggle with lengthy forms and writing clear explanations of their circumstances.

This application addresses that challenge through:

* A guided multi-step application experience
* Real-time validation and progress tracking
* AI-assisted statement generation
* Arabic and English support with full RTL compatibility
* Automatic draft persistence
* Accessibility-focused interactions
* Mobile-first responsive design

The result is a user experience inspired by modern government digital services and citizen portals.

---

## Live Application

🔗 https://social-support-wizard-x2eh.vercel.app/

## Source Code

🔗 https://github.com/aminehamrouni24/social-support-wizard

---

# Key Capabilities

## Intelligent Application Experience

The portal guides applicants through a structured process:

### Step 1 — Personal Information

Collects identity and contact details.

### Step 2 — Family & Financial Information

Captures household and financial status.

### Step 3 — Situation Description

Allows applicants to explain their circumstances with optional AI assistance.

### Step 4 — Review & Submission

Final review before submission.

---

## AI-Assisted Citizen Support

One of the biggest barriers to successful applications is explaining personal situations clearly.

To improve accessibility and completion rates, the portal includes a contextual AI assistant that helps applicants draft:

* Financial hardship statements
* Employment circumstances
* Application justifications

Users remain in control and can:

* Accept suggestions
* Edit suggestions
* Discard suggestions

This mirrors real-world AI augmentation patterns increasingly adopted across public-sector digital services.

---

## Government-Ready User Experience

### Accessibility First

Designed with accessibility as a core requirement rather than an afterthought.

Implemented features include:

* Keyboard navigation
* ARIA support
* Semantic structure
* Screen-reader compatibility
* Accessible validation feedback

### Multilingual Experience

The portal supports:

* English
* Arabic
* Runtime language switching
* Full Right-to-Left layout support

### Resilience

Users can safely leave and return without losing progress.

Features include:

* Draft autosave
* Local persistence
* Recovery after refresh
* Unsaved change protection

---

# Technical Architecture

## Frontend Stack

| Technology      | Purpose              |
| --------------- | -------------------- |
| React 18        | UI framework         |
| TypeScript      | Type safety          |
| Vite            | Build tooling        |
| Material UI     | Design system        |
| React Hook Form | Form management      |
| Zod             | Validation           |
| React Context   | Global state         |
| React-i18next   | Internationalization |
| Axios           | API communication    |

---

## Architecture Principles

The application was designed around several engineering principles:

### Separation of Concerns

UI components, business logic, services, state management, and validation are isolated into dedicated layers.

### Scalability

The architecture supports future expansion with:

* Additional application steps
* Real backend integration
* Authentication
* Government service integrations

### Performance

Implemented optimizations include:

* Route-level code splitting
* Lazy-loaded form steps
* Memoized expensive operations
* Reduced initial bundle size

### Maintainability

The codebase prioritizes:

* Strong TypeScript contracts
* Reusable UI components
* Consistent patterns
* Predictable state management

---

# AI Integration

The application supports OpenAI-powered assistance through environment variables.

```env
VITE_OPENAI_API_KEY=your_api_key
```

If no API key is configured, the application automatically falls back to mock AI responses to ensure the experience remains functional during evaluation.

---

# Project Structure

```text
src/
├── assets/
├── components/
│   ├── ai/
│   ├── common/
│   └── layout/
├── constants/
├── context/
├── hooks/
├── i18n/
├── pages/
├── services/
├── steps/
├── types/
└── main.tsx
```

---

# Future Evolution

If this application were expanded into a production government platform, the next areas of investment would include:

* Authentication and identity verification
* Backend workflow orchestration
* Document uploads
* Case management dashboards
* Multi-agency integrations
* Audit logging
* Analytics and monitoring
* Automated testing pipelines

---

# Author

Amine Hamrouni

Senior Frontend Developer 
