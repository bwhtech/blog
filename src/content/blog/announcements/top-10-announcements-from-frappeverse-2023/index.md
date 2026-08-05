---
title: "Top 10 Announcements from Frappeverse 2023"
description: "New Design System, New Products, New Features, and much more!"
author: hussain-nagaria
tags: [Announcements, Frappeverse]
pubDate: 2023-09-19
image: "./frappeverse-top-10-thumbnail.png"
---

## Introduction

In this article, I present to you, my Top 10 announcements from Frappeverse 2023! You can check out the livestream recordings for [day 1](https://www.youtube.com/live/FvFq01UFDuM) and [day 2](https://www.youtube.com/live/TfEZ8Ba1RJI) while we wait for the edited videos to be out.

*New Design System, New Products, New Features, and much more!* Let's dive right in!

## 1. Espresso Design System / FrappeUI

Faris kicked off the conference by showcasing Frappe's new design system which we are calling "Espresso". Espresso is designed in collaboration with the team at Timeless Co. and implemented in FrappeUI. The goal is to have **crafted and unified UI across all Frappeverse Products**. The [FrappeUI website](https://frappeui.com) is now a live playground of Espresso components!

Here is a glimpse of the button component:

![](./espresso_glimpse.png)

Faris went on to discuss how he used [Gameplan](https://github.com/frappe/gameplan) to build FrappeUI espresso components and vice versa:

![](./gameplan.png)


## 2. Frappe Builder

This is one of the two surprise product announcements made at Frappeverse this year (of course I knew 😉):

<iframe width="100%" height="auto" style="margin-bottom: 10px; min-height: 500px;" src="https://www.youtube.com/embed/MF5CKI4MaqU?si=jTuw6-kN1AGZ3b0r" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

For the past few months [Suraj](https://www.linkedin.com/in/surajshetty3416) has been working on this and the demo is just mind blowing 🤯

Frappe Builder is Frappe's new no-code WYSIWYG website builder. It has a very intuitive UX for building responsive websites. It also has some advanced features like repeater and dynamic routes for querying and **rendering dynamic data from your Frappe site**!

Frappe Builder will be available on Frappe Cloud Marketplace starting January 1st, 2024. If you want to give it a try now, checkout its [GitHub repo](https://github.com/frappe/builder). Keep in mind that it is still in beta and there is lot more coming!

## 3. Frappe CRM

Yet another new product announcement! This was a much needed overhaul to the existing CRM module of ERPNext. FrappeCRM is a new product now!

![](./crm_home.png)

Sharique showed a demo of the current state of new FrappeCRM and also discussed what he has planned for the future. What truly amazed me was that he build this in a matter of few weeks 🏃🏼, which he attributed to the power of [Frappe Framework](https://frappeframework.com) in the backend and FrappeUI for the custom frontend.

Personally, I found the in-app phone call (powered by Twilio) and note taking flow really cool:

![](./crm_call.png)

## 4. Run Anything on FC!

![](./run_anything_on_fc_tweet.png)

The tweet says it all! Apart from announcing a slew of new features like Codespaces, BYOD, VPN, and more, Aditya ended the Frappe Cloud keynote presentation with a bang! He demoed the stacks feature that will let the users deploy arbitrary services on Frappe Cloud. Yup, Frappe Cloud will no longer be just for hosting Frappe sites now! 

In the demo video, Aditya pasted in docker compose file for Wordpress:

![](./fc_stack_compose.png)

And that't it! Frappe Cloud detected the services required to be run and created a stack. Upon deploy, containers were brought up and a new Wordpress site was up and running in a matter of seconds:

![](./fc_stack_deploy.png)

Although this is early stage for the stacks feature, but I am very excited about it and about the possibilities that this will unlock for Frappeverse. In fact, Aditya [is joining me](https://www.youtube.com/live/pEpL_cEt5R0?si=0_RYM3WOq9aBrR5C) for a #BuildWithHussain episode on this very topic.

## 5. Frappe Drive

![](./frappe_drive_dash.png)

Frappe Drive was showcased by Arjun, Product Engineer at Frappe. It is a beautiful new Frappe product for managing your files on your Frappe site. It has folder uploads, sharing, previews for a variety of file types, and much more!

That is not it, it has an **in-built document editor** for creating, editing, and sharing documents. Heck, it even has realtime collaboration:

![](./frappe_drive_docs_editor.png)

So cool!


## 6. Frappe/ERPNext V15

The next major version of ERPNext and Frappe Framework is officially landing on October 20th, 2023 with dozens of new features and improvements. Here are some notable ones:

### New Form Builder

No more manually adding column breaks to fields table, Phew 😌

![](./form_builder.png)

With V15, you can now build your DocType form visually using drag and drop. It even works with the Customize Form!

### Workflow Builder

Sharique also unveiled the cool new visual workflow builder:

![](./workflow_builder.png)

### Lower CPU & Memory Usage

Slow and steady wins the race! The Framework team has been doing small optimisations that have added upto huge improvements in terms of memory and CPU usage:

![](./improvement_ff.jpeg)

### BOM Creator

[Rohit](https://github.com/rohitwaghchaure) demoed the new multi-level BOM creator feature coming in ERPNext Version 15:

![](./bom_creator.png)

You can find the docs for Multi-level BOM Creator [here](https://docs.erpnext.com/docs/user/manual/en/bom-creator).


## 7. FrappeHR Mobile

![](./frappe_hr_mobile.png)

👏🏼👏🏼👏🏼 was the reaction when [Rucha](https://github.com/ruchamahabal) unveiled the new FrappeHR Mobile App. FrappeHR Mobile is a Progressive Web App (PWA) built with FrappeUI, VueJS and Ionic. She talked about how FrappeHR mobile's UI and UX are tailored for use in mobile phones. Essential features like Leave Management, Salary Slips, Expense Claims, Attendance, etc. are just a tap away:

![](./hr_mobile_expense_claim.png)


## 8. Revenue Sharing For Marketplace Apps

After showing off some of the new FOSS Frappe apps backed by Frappe Incubator Program, Nabin introduced **Frappe Cloud Marketplace's Revenue Sharing Program**. If you publish a FOSS app on Frappe Cloud Marketplace and it is installed on a Frappe Cloud site, you will get a piece of the Frappe Cloud hosting revenue! 

There will be some criteria based on activation and usage of the apps and the fraction will also depend on it. But this is a great news for teams/devs who want to build useful FOSS Frappe apps like [Raven](https://ravenapp.info) who no longer have to worry about monetising their apps and can focus on **getting more users by improving the quality and usefulness of the product**.

## 9. Frappe Insights Gets Shiny New Updates!

Frappe Insights was first introduced to the world in ERPNext Conference last year. It has gone through major refactors and enhancements over the past year. Here are some of the major new features Saqib presented:

* Frappe Insights now supports connecting to a PostgreSQL database and uploading CSV files
* It now has a reimagined visual query builder for building complex queries with ease
* It has a new "Script" type query which will let the user write Python scripts to query data however they want (APIs and more)
* It now has a new Notebooks features which combines the beauty of Notion documents with interactive cells nature of Jupyter notebooks! 
* Frappe Insights now has even more types of charts

One more thing he went on to present is... the new **templates** feature!

![](./insights_templates.png)

Now you can browse, import, and export pre-built Insights dashboards! This will make it very easy to share reusable dashboards (charts!) among Frappe Insights users and even other Frappe apps can have their own templates. 

## 10. New Ways To Learn Frappe Framework

Yours truly presented these 😊

### Frappe Framework Self-Training

We have revamped the Frappe Developer Certification program both in terms of content and assignments over the past few months. The assignments are now divided into 4 parts corresponding to each day of the training giving the students hands-on practice as they proceed through the training.

There is a new assignment portal on Frappe School built with FrappeUI which evaluates the submissions and gives automated (and instant!) feedback:

![](./assignment_portal.png)

This all is open for everyone now under the Frappe Framework Self-training Program:

* Training Video Recordings
* Assignment Handouts
* Submission Portal

Visit [this link](https://frappeframework.com/self-train) to get started now!

## BONUS: Miscellaneous Announcements

There were so many awesome announcements, I couldn't get away with Top 10 😅

Jannat demoed the new **Batches** feature in [FrappeLMS](https://frappelms.com/) with provision for creating cohort-based programs, collecting payments, managing students, and even creating live classes right from the LMS dashboard!

[Frappe Helpdesk](https://github.com/frappe/helpdesk) also got a completed revamp with new Espresso design. All of **customer support at Frappe has now been moved to use Frappe Helpdesk** and it is more ready than ever!

If you don't know already, Product Warranty for ERPNext is now *bundled with any $50+/mo site on Frappe Cloud*! Read more about it in [this blog post](https://frappe.io/blog/announcements/introducing-erpnext-support-for-frappe-cloud) by Michelle.

## Up Next On BWH

You are already using one of the newly announced features on buildwithhussain.dev as you read this, i.e. Articles! There is more in the works:

* Foundational Web Development Courses: Starting with a VueJS basics course and basics of backend development
* Cookbook: A collection of reference recipes for features like Server Scripts, Client Scripts and more!

## Conclusion

Needless to say, **every product presented is 100% FOSS ❤️**. It was a jam packed event and I can't wait to see where the new initiatives and products will take Frappe and the Ecosystem!

Until next time, ✌🏼
