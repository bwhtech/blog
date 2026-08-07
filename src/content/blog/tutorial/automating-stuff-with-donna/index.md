---
title: "Automating the boring stuff w/ OpenClaw & ERPNext"
description: "Learn how we are automated our manual book-keeping and operational processes with an AI agent named Donna"
author: hussain-nagaria
tags: [Automations, ERPNext, OpenClaw]
pubDate: 2026-08-06
---

## About the business

We are a bunch of problem solvers providing software services in the Frappe ecosystem. We have been using ERPNext since Day 1 (because, duh?) and Shivam has been our ERPNext guy managing accounting and admin stuff.

As we grew, the book-keeping process (mostly data entry 🥲) quickly became tedious and boring. When Shivam decided to transition into Frappe development (sadly, he still hasn't been able to, ERPNext does not leave him), we hired our friend do it for us. When he left after a month, I decided to take matters in my hands.

## Started as a server script

* But who writes code by hand these days plus things change a lot
* Wanted to do more

## The Setup

OpenClaw needs a computer to run on, and given its always on nature, it made sense to host it on a cloud VM. Although [OpenClaw setup](https://docs.openclaw.ai/install) is straight-forward and wizard based I did not want to do it manually. Hence, I provisioned a VM on Hetzner (4GB RAM if curious), put my SSH keys, and fired up Claude Code to help me through it.

* Telegram (since our company group is also in TG)

## Onboarding

Once the initial setup is done, rest of the things can now be done by chatting with the agent. I onboarded Donna as if onboarding an employee:

1. Setup a dedicated email account on our Google workspace, donna@bwh.tech.  
2. A user in our ERPNext instance with necessary roles

## Training

* SOUL.md
* SOPs (about the company, point to company master etc.)
* Monitoring what it learns (push to github at night, pull locally and view in obsedian)
* Most important: EMAIL.md + skill

## First Automation

In order to run a company, we need certain subscriptions (and ad-hoc purchases) to keep things running smoothly, for example: Google Workspace (we shall replace with Frappe Suite once ready!), [Frappe Cloud](https://cloud.frappe.io), Zoom etc. 

## Tackling Piece by Piece

* Monthly Sales invoices
* Processing statements (reconciliation)

## Bringing Determinism to Probablistic Machines

If you give a certain prompt to an agent (LLM), it might not give you the same output always even if the prompt remains same, because LLMs are probabilistic machines. But we need determinism in how things should be takled: sending of sales invoice on email, creation of documents in ERPNext, etc.

## Surprise

![Email Reply by Donna](donna-email-reply.png)

## Use-case 2: Razorpay Settlements

* The Problem
* Before AI: had to manually write the integration
* Solution

> BTW, If you also want to setup your very own "Donna" for your business, we can help you out, drop me an email at hussain@bwh.tech.

## Misc

* Gameplan
* Video Planning
* Video Editing

## Conclusion & Future Ideas

* Replace with Hermes
* 
