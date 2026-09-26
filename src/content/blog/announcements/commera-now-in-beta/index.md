---
title: "Commera, now in beta"
description: ""
author: hussain-nagaria
tags: [Announcements, Commera]
pubDate: 2026-09-26
draft: true
---

The dots have finally started to connect now. What started as a simple custom eCommerce app for a client has now become the base for a **solid eCommerce platform** backed by ERPNext!

<figure>
  <video controls playsinline preload="metadata" poster="/media/commera-now-in-beta/commera-demo-reveal.jpg" src="/media/commera-now-in-beta/commera-demo-reveal.mp4" title="Commera demo"></video>
  <figcaption>Commera Teaser</figcaption>
</figure>

Today we are releasing [a beta version](https://github.com/bwhtech/commera/releases/tag/v16-beta.1). 

> Of course it is open source!

Documentation: https://docs.bwh.tech/commera

### The Ask

The ask from *you* right now is **feedback**! Install it, use it, try to break it, and report issues via GitHub or just email us (developers@bwh.tech).

For the **developers**, try to build your own payment gateway, theme, or shipping integration and see you can cleanly extend **Commera** via custom apps!

If you have a use case or a customer who wants to set up an online store backed by ERPNext, we are happy to help you set it up on call and answer any queries: 

### Themes

Every online store is different and needs to be unique. Instead of building few hard coded themes or variables, **we built a theming engine** powered by Jinja. You can build a custom Frappe app that brings its own theme (can extend the base theme or could be completely new!) backed by Commera's extensibility.

We will also have **Frappe Builder backed themes** before the stable release.

### Payment, Shipping & Other Integrations

We want to take on Shopify (I know, I know, long shot, but nothing worth). In order to do that, we will need a solid ecosystem (*within* the Frappe Ecosystem :exploding_head:) of integrations and apps. Hence, from Day 1 we have thought of making it easy to extend Commera via custom apps. Right now payments and shipping integrations are there own apps with the ability to add your own payment gateway and shipping integration just by extending a base class and creating a DocType!

[Documentation for BWH Payments](https://docs.bwh.tech/bwh-payments) 
[Documentation for BWH Shipping](https://docs.bwh.tech/bwh-shipping)

### Up Next

* Guest Checkout
* Frappe Builder backed themes (also bring Bob AI based storefront design!)
* Ability to add your own custom Frappe UI pages in the merchant dashboard
* Communications as a plug-n-play app (e.g. send invoices on WhatsApp)

You can check the public roadmap [here](https://github.com/orgs/bwhtech/projects/15/views/1?pane=issue&itemId=243689660&issue=bwhtech%7Ccommera%7C101)

Feel free to ask any questions or suggestions you might have.

