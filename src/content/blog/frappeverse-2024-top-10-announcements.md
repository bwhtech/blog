---
title: "Frappeverse 2024: Top 10 Announcements!"
description: "Amazing new products, existing products got more powerful, and more!"
author: hussain-nagaria
tags: [Announcements, Frappeverse]
pubDate: 2024-10-22
image: "/blog-media/frappeverse-2024-top-10-announcements/fv-2024-top-10-6583e582.jpg"
---

*"I felt like a kid in a toy store..."*, wrote one community member sharing his experience from Frappeverse 2024. And I think this is what a lot of us felt too.

## Where is ERPNext v16??

Before we start with the top 10 announcements, let me get this question out of the way: *When are Frappe/ERPNext Version 16 going to be released?* The short answer: *next year*.

Now the long answer. In Nabin’s talk, he explained why we had stopped adding any significant new features to ERPNext since last year. Because for the first time, **the community wanted stability**, instead of more features. Improving the code quality was also something that happened along the way. 

### Lots of Performance Improvements

Here is an interesting case-study from [Kyosk’s](https://www.kyosk.app/) (a big B2C brand from Kenya) scalability issues he shared that caught my eyes:

![Slide displaying scale of Kiyosk's ERPNext instance](/blog-media/frappeverse-2024-top-10-announcements/kiyosh-slide-937d2b7e.png)

From timing out after 30 minutes to taking less than 2 minutes 🫡 

Not just stability, but with **~250 performance fixes**, the team has done an awesome job in terms of scalability as well! Next time someone asks you about how much data “scale” ERPNext can handle, show them the above slide 😉

Now let’s start with my favourite announcement of the event.

## 1. Frappe Studio

Rucha demoed a whole new product she has been working on the side, or as she framed it, has been moonlighting. This was just *mind-blowing*. When I say amazing, I mean, A-M-A-Z-I-N-G! Frappe Studio was one of the two products that was kept a surprise until the last minute (of-course I already knew 😆).

Frappe Studio = Frappe Framework + FrappeUI components + A composition tool like Frappe Builder

![Screenshot of Frappe Studio](/blog-media/frappeverse-2024-top-10-announcements/studio-demo-4b185aa4.png)

Frappe Studio will enable building apps, right from the UI, with a lot more flexibility when it comes to **crafting custom User Interfaces**. With the power of DocType/Models already present in Framework, I think this will be a *game changer for no-code/low-code development*!

Hats-off to Rucha, she built a demo-able version in 1.5 months! You can check out her full demo [here](https://www.youtube.com/live/1D-6BmEx-dE?si=uKCncBcd7dpdPfgm&t=8156). The source-code will be made public soon and stable Studio v1 is coming early 2025.

> Fun fact: Rucha was my mentor when I was in ERPNext (HR) team.

## 2. Raven Updates

The Commit Company team showcased a lot of new features and enhancements they have added to the [Raven chat](https://ravenchat.ai) app. They are trying to leverage and integrate Raven with other Frappe apps like Frappe HR to make it even more powerful. For example, you can now link to any document in your Frappe site in the chat and it will show a nice interactive embed. Then you can even print and run workflow actions right from that chat message:

![Raven Doc embed screenshot](/blog-media/frappeverse-2024-top-10-announcements/raven-workflow-978923f0.webp)


Pretty cool, right? Wait till you hear about the bots. Raven now has a full-fletched AI bot builder:

![Screenshot showing Raven bots preview](/blog-media/frappeverse-2024-top-10-announcements/raven-build-bots-376e45bb.png)

Here are a few example bots they showed:

* Send a picture of a business card and it automatically creates a lead in Frappe CRM.
* Send a PDF invoice and the bot automatically creates a Purchase Invoice in ERPNext.
* Now this one was my favourite: send pictures of invoices in a thread and it creates an expense claim in Frappe HR with those!

With the Frappe ecosystem being so vast, the possibilities are endless here. He joined me on BWH to build a bot live, check out the video [here](https://youtube.com/live/kbAqj4qcgwA).

## 3. Frappe Lending Framework

Deepesh unveiled Frappe Lending last year, which is a full-fledged Lending or **Loan Management System**, built on top of ERPNext. He has been working with a big NBFC from India for the past year, where Frappe Lending is already being used with **64K active loan accounts**!

He calls it the Lending Framework because of its flexibility in being used for a variety of Loan management use cases. He took us through a typical loan management flow and demoed how Frappe Lending handles everything smoothly:

![Flow chart of a typical loan cycle](/blog-media/frappeverse-2024-top-10-announcements/lending-flow-chart-30dccfe6.png)

It has a lot of other features like:

* Co-lending
* Branch Mergers/Split
* Suspense Accounting
* Loan Waivers 
* ... and more!

He is planning to release v1 very soon. If you want to see him implement Frappe Lending live, drop an email to hussain@frappe.io and I *will* get him on the show!

## 4. Frappe Mail

If you have signed up for this website, you might have already received an email via Frappe Mail. Frappe Mail is an independent HTTP-based email service/stack. Here is a an architectural overview of Frappe Mail works:

![Diagram of Frappe Mail architecture](/blog-media/frappeverse-2024-top-10-announcements/frappe-mail-arc-fc47ae7d.png)

[Sagar](https://www.linkedin.com/in/sagar-sharma-970360214/) open-sourced Frappe Mail repositories on stage (two, because see above diagram):  [mail app](https://github.com/frappe/mail) and [mail agent](https://github.com/frappe/mail_agent). With this, you can setup your email service provider! But I think we will also have a Gmail like service in the coming year.

## 5. Frappe Insights 3.0

Yup, Saqib did it again: he revamped the whole thing for a v3! He started by explaining the challenges faced by us (at Frappe) while using v2:

![Slide of Frappe Insights v2 challenges](/blog-media/frappeverse-2024-top-10-announcements/insights-challenges-62f91024.png)

To solve the above, Insights now has a whole new “Workbook” experience:

![Screenshot of Insights v3 Workbook feature](/blog-media/frappeverse-2024-top-10-announcements/insights-workbook-0308efb5.png)

Querying in Insights is now backed by the powerful [ibis](https://ibis-project.org/) data frame library, which made it easier (and with less code!) to build layered operations. Adding new data source connectors (for example, DuckDB is now supported in Insights) is also easier because of Ibis. If you want to contribute a connector check out [Insights on GitHub](https://github.com/frappe/insights).

Insights v3 also brings more new features like the much requested comprehensive permission management system:

![Screenshot of Insights v3 Granular Permissions feature](/blog-media/frappeverse-2024-top-10-announcements/insights-permissions-be5f6246.png)

## 6. Frappe Builder Updates & The Figma Plugin!

Frappe Builder, the star of last year’s Frappeverse, got some major updates this time:

![Slide showing new feature summary for Frappe Builder](/blog-media/frappeverse-2024-top-10-announcements/builder-features-b6e5c4f8.png)

Suraj has been busy adding features like Protected pages, dedicated Settings Page with global configuration, site-level script/styles, and more. But there are a few noticeable ones that I will talk a bit more about.

### Grid Support

Frappe Builder now has first-class support for Grid layouts:

![Screenshot showing bento grid with Frappe Builder](/blog-media/frappeverse-2024-top-10-announcements/builder-grid-b38bab32.png)
This will make it easy to create layouts like bento-grids, photo galleries, and more. 

### Block Templates

![Screenshot of Frappe Builder's block templates](/blog-media/frappeverse-2024-top-10-announcements/builder-blocks-a72e8b55.png)

Now we are talking! Frappe Builder now has beautifully crafted block templates like hero sections, testimonials, headers, footers, and more. This will make it easier for us to **create good looking web pages with minimal efforts**. Just drag-n-drop blocks and start editing.

### Figma Plugin

Suraj took us by surprise when he showed the experimental Design to Builder Figma plugin. Using this Figma plugin, you can convert your existing Figma designs to real web pages in a few clicks!

<iframe width="100%" height="500" src="https://www.youtube.com/embed/Rab5pQjRq8s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Builder is transforming into a website building power house, more power to you, Suraj 🚀

## 7. Frappe Slides

New product wave didn’t stop at Studio or Mail, Gursheen surprised everyone when she revealed that the tool she was using for her presentation, was built by herself, and introduced **Frappe Slides**:

![Sneak peek of Frappe Slides](/blog-media/frappeverse-2024-top-10-announcements/slides-demo-b81ee120.png)

Frappe Slides is Frappe’s own presentation builder. I can see this being used for all the presentations at the next Frappeverse. Again, this was built in 30 days, Frappe magic ✨

## 8. Community Products

It was exciting to see that the community has also started building non-trivial products:

* The Tridots Tech team launched bunch of new products (all 100% open source) like Go1 Accounts, Go1 Vendor Portal, Go1 Customer Portal, and more! You can check out their Github to explore more [here](https://github.com/TridotsTech).
* The Frappe Healthcare app is (again) taken over by Earthians team and they have renamed it to “Marley”. You can read their announcement post [here](https://discuss.frappe.io/t/introducing-new-health-app-marley/128757).
* The Aerele team demoed how they ended up building a [PWA builder](https://github.com/aerele/pwa-builder) and [Chat-bot builder](https://github.com/aerele/chatbot) while working on recurring client needs.
* Resilient Tech, the team behind the popular India Compliance app also came on stage to showcase what they have been upto. They took over the customer support of India Compliance at Frappe and according to them, it has made way for a lot of feedback and improvements in the app.

## 8. Frappe Learning & Frappe CRM Updates

### Frappe Learning (p.k.a. LMS)

Jannat took the stage to showcase the progress she has made in making a world-class Learning Management System: Frappe Learning. She has re-written Learning’s frontend using VueJS and FrappeUI, which has led to a better DX and is helping her ship new features faster.

Frappe Learning is now even more feature rich with customisable sidebar, badges, notifications, and more! End-to-end student evaluation and certification flows are also now backed right into the Learning app’s crafted UI:

![Frappe Learning Screenshot](/blog-media/frappeverse-2024-top-10-announcements/learning-evals-ss-bdf8adcb.png)

She ended her talk by introducing a much requested Frappe [Payments app integration](https://github.com/frappe/lms/pull/1035) with Frappe Learning!

### Frappe CRM

The community was so excited when Sharique demoed a POC of Frappe CRM at last year’s Frappeverse! He has continued to build upon that foundation over the past year along with the feedback from our internal Sales team. He had even joined me to officially release v1 of Frappe CRM live in April this year.

In this time period, Frappe CRM went from 1 (Frappe) -> 500+ users! Sharique showed us how the CRM has matured with more **sophisticated list view, a brand new Kanban view, WhatsApp integation, and of course, the PWA**:

![Frappe CRM PWA Screenshot](/blog-media/frappeverse-2024-top-10-announcements/crm-pwa-1d58d54c.png)

One interesting approach he is taking is to bring desk like customisations to Frappe CRM frontend. For example, now you can add and arrange fields right from Frappe CRM without going back to the desk. He has even implemented a subset of client scripting for adding custom actions to CRM:

![Frappe CRM scripting Screenshot](/blog-media/frappeverse-2024-top-10-announcements/crm-script-30fc48b6.png)

You can try out these features live on [this demo site](https://frappecrm-demo.frappe.cloud/api/method/crm.api.demo.login). Cool stuff.

## 9. Frappe Drive & Frappe Helpdesk Updates

### Frappe Drive

A very early MVP version of Frappe Drive was introduced last year. But this year, substantial progress has been made in terms of depth of features. For example, the share feature of drive is quite powerful now with features like:

* Organisation or user group based sharing
* Auto-invalidation of file access
* Granular downloading and comment access

Arjun also discussed the enhancements made to the in-built document editor (“Frappe Writer”). Major features he demoed included document versioning, annotations, and better real-time collaboration:

![Frappe Drive's document editor Screenshot](/blog-media/frappeverse-2024-top-10-announcements/drive-writer-c2dbd682.png)

### Frappe Helpdesk

Ritvik Sardana, the 4th owner of Frappe Helpdesk (lol), showcased how the Helpdesk app has evolved with better (and more customisable) UI, dedicated settings page for easy configuration, improved knowledge base, and a shiny new PWA!

The most notable addition to Helpdesk is the revamped customer portal (the side of Helpdesk that end-users see):

![Frappe Helpdesk's Customer Portal Revamp Screenshot](/blog-media/frappeverse-2024-top-10-announcements/hd-customer-portal-78e2619e.png)

If you are dealing with customer support, now you know what to implement 😆


## 10. BWH 2.0

In my talk this year, I took the audience through the journey of #BuildWithHussain and how it has enabled me to start traveling the world. I shared some travel stories from my trips to Kenya, Tanzania, and Dubai.

After the success of the in-person Frappe Framework Bootcamp in Dubai, we are taking it to more cities around the world:

* Framework bootcamp in [Riyadh, KSA (November, 2024)](https://frappe.school/lms/batches/details/CLS-00464)
* Dubai (again) led by Jannat Patel (January, 2025)
* Free Frappeverse Crash Course in Germany (February, 2025)
* Cochin, Kerala (April, 2025)

If you want to host an in-person bootcamp at your city, feel free to hit me up, and let’s collaborate!

### Next up on BWH

I have been missing from action for the past couple of months, here is what I have been upto:


<iframe width="100%" height="500" src="https://www.youtube.com/embed/PKm16ZKCokU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## BONUS: Non-announcements

Here are some interesting notes from Frappeverse that are not “announcements” per se, but are things I feel you should know about:

* Products now have shiny new websites (frappe.io/products).
* Frappe Cloud
	* Uptime went from **98% -> 99.9%** 🤯 and it has 10K+ sites! Well done Aditya and team!
	* New $5/mo plan in multiple regions.
	* Faster, more reliable builds, thanks to Alan.
* Frappe HR has some solid enhancements like Roaster Manager, PWA is now multi-lingual, and it has a new attendance dashboard page. Also, **India Payroll and US Payroll apps are coming!**
* Around the world in 80-minutes by the business team was quite nice with partner interviews from each region.


## Conclusion

Looks like I have a lot of new things to create content on 😅. But it will be fun! Hope you enjoyed this article, catch ya later.
