---
title: "My Journey from Django to Frappe Framework"
description: "Sharing my journey and lessons learned."
author: rahul-agrawal
tags: [Stories, Frappe Framework, Django]
pubDate: 2025-06-17
image: "/blog-media/my-journey-from-django-to-frappe-framework/frame-1-700491a7.png"
---

> _"Wait… this thing builds your admin panel automatically??"_  

> _Me, 5 months ago, staring at my screen in disbelief_ 😭


Hi, I am Rahul Agrawal "Your friendly neighbourhood coder" 😁, I spent two years in the Django world. It was my comfort. I knew its quirks, its power, and its pain. But five months ago, I stumbled upon Frappe — and honestly, I haven’t looked back.

This is a story of how I went from defining models and wiring views manually to just declaring Doctypes and letting Frappe handle the heavy lifting. Django taught me a lot. But if you’re a Django dev who’s tired of hand-coding logins, permissions, views and serializers — this one’s for you.

Let's start with a bit of context between Django and I.

## The Beginning

I first learned Django in 3rd year of my college. I was supposed to submit a project (tinker with map coordinates using PostGIS) for a company's internship, though I didn't get the internship 😅 I did learn Django.

![](/blog-media/my-journey-from-django-to-frappe-framework/create-99b46ad0.gif)

This encounter with Django made me curious and I started exploring it. I made several projects, mostly for company interviews, some for learning and others for fun. As much as I was enjoying Django, time was ticking, and before I knew it, my 4th year of engineering had ended.

After trying and learning for nearly 2 years, I only had a portfolio full of GitHub projects. But little did I know I was about to get my first programming job..

## Freelance Project: Incubator Academy


After the end of 4th year, I had this passion to be a software developer, so I just packed my bags and was ready to go to Hyderabad, where my cousin Aditya (_Bua ka beta_) lived. I had no clue what I would do there but there were some unexpected turn of events andddd....

The day I was about to leave my hometown I closed the deal for a freelance project **Incubator Academy**, an e-learning platform. The project was from Kailash Kumar, an acquaintance of Aditya (PS: Aditya is also one of my mentor who is in fact a great software developer)

Coming back to Incubator Academy, it was a platform I built in Django and React (since in this article I am focusing on Django I will only talk about frontend only when necessary, if you need any more info you can [reach out to me](mailto:rahul@buildwithhussain.com ) . )


Here are things I built for this e-learning platform:

**Portal Features:**

- YouTube video streaming with downloadable study materials
- Blog 
- Paid MCQ tests with Razorpay integration
- Previous year question papers and syllabus downloads

**Admin Features:**

- Content management for videos and materials
- Test creation (manual + Excel import)
- File uploads for syllabus and papers

With a vague list of features, I started working on the project.

**Technical Implementation**

Like every Django project I worked on, I did base setup, added a few Python packages which I thought I might need and started working on the project.

Now as previously mentioned, I or event the client didn't have a clear scope. There were no designs; I was just creating them on the fly. Nor did I have a planned DB schema. I was just going with the flow..

The way I worked was pretty simple, take a piece of say MCQ page and start by building the Django backend (models and APIs), then switch to React to build the corresponding admin pages/UI components, and finally create the portal user interface for the same feature.

![](/blog-media/my-journey-from-django-to-frappe-framework/incubator_academy_portal_images-de105f25.jpg)

With the portal and admin pages done, I started working on authentication. To start with, I had very little idea of what permission and user roles are needed, but they were not concrete. I was able to set up the authentication with Djoser but without standardised roles and permissions everything was a guess. And when you take **models** into account, each model needed its own list page, details page and basic CRUD operation from UI. This was fine for a while but soon it became a nightmare. 

Anyhow I was able to stitch them together. The pieces were a bit crooked but hey it's my first real world project 😑

![](/blog-media/my-journey-from-django-to-frappe-framework/incubator_academy_admin_pagesea3cfb-8c5e302e.jpg)


And by now I had completed almost all the parts of projects, but one crucial thing was missing, can you guess what it was?

**The Deployment (AWS)**

Though the project was almost complete, it was futile if no one else could access it. So for the last and final time I took a deep breath and started with deployment. After discussing with the client we agreed to use AWS as the hosting platform.

With a simple architecture in mind, I spun an EBS (Elastic Beanstalk) instance, hooked it to S3 and Amazon RDBMS, routed domain via Route53 (could have used OpenSSL ) for SSL certificate and the site was live!

🚀🚀🚀🚀🚀

**That night, for the first time in months, I slept peacefully..**


Looking back here is a quick take,

_On paper, this tech stack looked solid. Django REST + React + AWS deployment — a perfectly reasonable architecture for a modern web application. But as I dove deeper into the implementation, I started noticing patterns that would later impact my development experience._

_What seemed like straightforward integrations on day one became increasingly complex as the project grew. Each new feature meant not just writing business logic, but rebuilding the same infrastructure pieces over and over. It wasn't until months later, working on my next project at Atwin, that I realized just how much time I was spending on repetitive tasks instead of actual problem-solving._

## Startup Life: Atwin

After completing my freelance project and updating my resume, I started job hunting.

![](/blog-media/my-journey-from-django-to-frappe-framework/screenshot-2025-06-17-at-12-31-16-am-36dee3ed.png)

Soon, I joined a startup named  **[Atwin](https://atwin.app)** (Django + HTML + JQuery), it was a cloud-based sports management platform.

I joined the team as a software developer and that’s when things got real. Within a few months, I became the sole developer at Atwin. For close to a year there were only 3 people: Lalit Narayan Sharma (Founder), Kartikeya (Manual Tester) and I. While at Atwin, I ended up building some pretty cool stuff.

**Initial Experience**

One of the earliest tasks I can remember that was assigned to me was to build a cart where users can add multiple courses and pay for them in one go.

![](/blog-media/my-journey-from-django-to-frappe-framework/add-to-cart-arrow-737a0019.png)

Initially, I would get a detailed description of tasks in a github issue containing all the information about what was the end goal, any functions I can use or reference along with a schema design.

So, I started working, created a **model**, then came the views and added urls, rerouted a few paths and our app had a fully functional cart (well it was not as easy as you might think: you have to account for coupons/discounts, check if seats are still available for each course etc.. you get the gist)

As time went by, I got hang of the system, its core files, and specially code which you were supposed to ignore (lot of tech debt 😬). But no matter how hard we tried we could not make the ends meet and one by one people were let go, soon I was the only developer in the team.

**Solo Developer Experience**

At that time I didn't think much about it. In fact, I would work day and night to see our app reach success.

I started pushing features like crazy, revamped the complete frontend, replaced **Firebase** login with **AllAuth** and **MSG91** ,implemented notifications, added reports, integrated multiple payment gateways and progress tracking, added payment tracking, academy store management … and a lot more.

![](/blog-media/my-journey-from-django-to-frappe-framework/atwin_old_vs_newv2-160ed9aa.jpg)

Though I was completely immersed in development, I could feel some resistance. The more I worked, the more friction I felt. I had this feeling of redundancy. Each time a new feature was added I had to recreate the admin list page, details page, allow admin to edit and add new data, set access/role permissions and what not.

## What Hurt the Most in Django

Let me start by pointing out basics...

**Authentication**: Every Django project starts the same way - you spend your first week just getting login to work properly. JWT parsing, refresh token logic, session management... it's 2025, why am I still writing this? Now you are authenticated, good.

Let's start working with data.

**CRUD**: Every model needs redundant things: list page, detail page, add/edit forms, delete confirmation. I was just copying-pasting models, tweaking templates, and adding URLs. Rinse and repeat... It was so bad I started dreaming in Django templates. Literally. I'd wake up thinking about `{% for object in object_list %}` loops.

Well maybe you could use the default admin panel to do **CRUD** operations rightttt.. (sorry to break your illusion, you cannot)

![](/blog-media/my-journey-from-django-to-frappe-framework/django-admin-pannel-2c2d967f.png)

**Admin Panel**: Take a look at Django's admin. It looks impressive in tutorials, but try showing it to actual business users. The interface is confusing, try adding a filter to it. I might have cried at least 2 times, it is so bare-bones that you're better of building your own admin panel.

But heyy at least you can use **DRF**'s Rest API to get data from models... 👀

**API Serialization**: Welcome to Django REST Framework - where every field needs explicit declaration, nested relationships become nested headaches, and you'll spend hours debugging why your serializer is returning `id` instead of your foreign key data. Create a serializer, then a viewset, then wire up permissions, if you ever need a field level permission my condolences. What could have been `User.objects.all().json()` is now a **Circus**.

Just a quick question.. What process can you introduce to your app so it does not have to execute the same function again and again? Or let's say you want to send email to 100s of people. How would you do that? One thing which I remember implementing is Caching & Background Jobs.

**Caching and Background Jobs**: Implementing them is not easy, you need Redis, cache invalidation logic, and Celery for background tasks. Suddenly your simple Django app needs three different services to be setup and wired just to send an email asynchronously.

Even then, this was manageable but do you know what hurt me the most....

**Deployment**: Remember that "peaceful sleep" I mentioned after deploying Incubator Academy? Well, that peace lasted exactly until the first time something broke in production. Django on AWS isn't just about spinning up an **EBS** instance - it's about configuring **Nginx**, setting up **Gunicorn**, managing static files with **S3**, handling database migrations without downtime, and praying..

> _"Why does deployment feel more complex than writing the app itself?"_

You think this is all? No, try adding backups, or migrate model's field in production. Django may be modular but it is not plug-n-play. I was subconsciously looking for a better alternative. But more than the friction, I felt tired. Somewhere deep down, I knew something had to change.

But sometimes life has a way of forcing change when you're _too comfortable_ to make it yourself.

## When It All Fell Apart

Things were going smoothly, I was learning, having fun but during one of the daily stand up meetings, **Lalit** said:

> _"Rahul, we will be freezing development at Atwin"_

Just like that I was laid off from Atwin.

![](/blog-media/my-journey-from-django-to-frappe-framework/screenshot-2025-06-17-at-10-37-06-am-1ab85c27.png)


One day I was pushing features, the next I was staring at my terminal wondering what came next.

It wasn’t the first time things didn’t go my way — but this one hit harder. I’d poured everything into that product. Still, maybe... just maybe, this was the start of something big.

## The Turning Point: Enter Frappe

After being laid off, I started job hunting. While having a conversation with my cousin Akash, he mentioned a familiar name, **Hussain**.

I first connected with **Hussain Nagaria** in 2nd year of my college, for internship at Frappe (created [Library Management App](https://github.com/Rl0007/library-management) in Flask). I reconnected with him. We met and discussed about his vision, my growth and most importantly **Frappe**. He urged me to learn **Frappe** Framework, and since I had nothing to lose I agreed.

This was my first real exposure to Frappe, and my first impression was:

> “Where the hell are the options in this Doctype Builder?” 😩

It felt restrictive. My instinct was to go to the code and just build what I needed. I thought:

> “Why is there so much hype about this? Isn’t writing raw Python faster?”

But things started changing quickly.

## BWH Studios

My interests started to change, as I began adapting to **Frappe**. Hussain offered me to join **BWH Studios**. Honestly, I was a bit hesitant at first but it turned out to be one of the best decisions of my life. We took up a project to create a custom e-commerce portal integrated with **ERPNext**.

Now I was about to start my development journey once again, but this time something was different.

**Development with Frappe**

Do you remember the feeling of drinking a mildly cold glass of water after playing for hours in scorching heat. This experience was just like that.

**Frappe Desk**

![](/blog-media/my-journey-from-django-to-frappe-framework/frappe_desk-aa7283dc.png)


Frappe's admin panel commonly known as **Desk** it is one of the most customisable yet powerful admin interfaces you can ever have. Now compare this with **Django**'s admin panel 😬. The authentication which usually took days were built-in in Frappe, even role permissions for certain models, let alone field level permission. Everything is already baked into the system.

The CRUD, finally for the first time I was free from all the redundancy, you just create a doctype and it automatically creates its views, list page, details page and add/edit functionality. (PS: for sake of simplicity, consider Doctype as an automatically generated .json file which defines models, views and templates)

For me this was enough to be in love with **Frappe** but this was not all. Compare Frappe's REST API's with Django, you have all the data from your database just an endpoint away. Want to get data from a table just use `/api/v2/document/doc_name` for **CRUD** operations, it even supports filters.

What's more crazy is consider this function

```python
def get_sales_data():
	return frappe.db.get_list('Sales Order', fields=["name", "customer"])
```

Suppose I want to access it in frontend you can just add @frappe.whitelist() decorator to your Python function:

```python
@frappe.whitelist()
def get_sales_data():
	return frappe.db.get_list('Sales Order', fields=["name", "customer"])
```

and suddenly you can make an API call from the Admin Interface:

```js
frappe.call('your_app.path.to.get_sales_data')
```

or any client that can talk HTTP:

```js
/api/v2/method/your_app.path.to.get_sales_data
```

If you want to allow access from anywhere without authentication just add `allow_guest = True` to your decorator call.

There are lots and lots of such features, be it hooking into any part of your document life cycle, to adding custom scripts, whether you want caching or schedule background jobs for your app, Frappe is so vast yet unique you might not find anything like it.

This is not all, it has [Frappe Cloud Marketplace](https://frappecloud.com/marketplace/search) where you can find open-source custom apps built by others and as the saying goes:

> _Fix it, Fork it, F*ck off_

Do whatever you want with your app, nobody cares (MIT liscensed), this makes Frappe a framework which is batteries-included and apps built on Frappe, truly plug-n-play. I personally created an app that gives you the ability to add a BNPL service Tabby. You can add this to any Frappe instance and it just works.

Now coming to deployment: you can either self-host or deploy it on Frappe Cloud for a seamless experience. Or you can self-host the cloud platform itself ([Frappe Press](https://github.com/frappe/press)). I don't know of any other framework or company that gives this much freedom.

The above mentioned is a small portion of what I felt Frappe if capable of. There is so much much more to explore, I am still learning new things everyday.

With just a single project all the frustration seems to fade, all the resistance seems to ease, and all the friction is disappearing.

## Final Thoughts

The more I work with Frappe, the more I realize how much time I was spending on repetitive tasks in Django. Don't get me wrong — Django taught me to be a better developer but the difference is like **HTML Vs React**. Like when you work with HTML you think in terms of **divs** but with **React** you think in terms of **React components**. Similarly there's something liberating about focusing on business logic instead of wiring up authentication systems for the hundredth time.

Remember that quote from the beginning? "Wait… this thing builds your admin panel automatically??" That disbelief has turned into daily appreciation. Every time I need to add a new feature, I'm still amazed at how much Frappe handles for me.

So yeah, that’s my journey — from a Django Developer at a startup to a Frappe Developer building Frappe apps.

Not saying I’ll never write another `urls.py` file again…

But if you see me reaching for `bench new-app` instead of `django-admin startproject`, now you know why. 😄

---

## Advice to Fellow Django Devs

Thinking about trying Frappe?

**Do it**, but take it slow.

- Go to [Frappe School](https://school.frappe.io) and enroll in [Full-stack App Development With Frappe Framework ](https://school.frappe.io/lms/courses/frappe-developer-certification)
- Start with a hobby project.
- Don’t try to master everything at once.
- Expect some frustration (especially with docs).
- The dev experience will feel *weird* at first — but then kind of addictive.
- Once you get used to the speed… it’s hard to go back.

## Honest Warnings

- The docs are not comprehensive — you’ll spend a lot of time reading source code.
- The CI/linter setup is strict — you *will* fight it (and probably lose).
- Custom changes should *always* be done in your own app — hacking core files is forbidden (for good reason).
- And debugging sometimes feels like archaeology.

## 🙋 FAQs

**1. Is Frappe better than Django?**

In my opinion, Yes. Till date I have not found anything that could have been better in Django, except the documentation.

**2. Can I use Django and Frappe together?**

Not directly, but you can integrate them via APIs. Frappe apps are self-contained and can talk to Django services.

**3. Is Frappe suitable for large-scale apps?**

Absolutely. ERPNext is built on Frappe and runs on thousands of production sites globally.

**4. Can I customize the frontend in Frappe?**  

Yes. Use custom scripts, templates, or even create custom frontend with Vue/React if you prefer.

**5. How steep is the learning curve from Django to Frappe?**  

Steeper at first — because Frappe does so much for you. But once you get the hang of DocTypes, you'll move 10x faster.


Got questions about the switch? Drop a DM ([Linkedin](https://linkedin.com/in/rl0007)) or write an [e-mail ](mailto:rahul@buildwithhussain.com) — I will be more than happy to help.

So yeah that's pretty much It.. let's meet in another blog..

Till then **Study Hard** 🚀🚀🚀
