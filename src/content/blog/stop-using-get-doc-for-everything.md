---
title: "Stop using get_doc for everything!"
description: "Well, there are other methods too 😉"
author: hussain-nagaria
tags: ["Tips & Tricks", Frappe Framework]
pubDate: 2023-09-26
image: "/blog-media/stop-using-get-doc-for-everything/su_get_doc_everything_meta-5103174d.png"
---

## Introduction

Given the work I have been doing the past few months, I read a lot more code than I write. This article is about everyone's favourite Frappe Python API method: the `get_doc` and patterns of using `get_doc` I have seen most when reading custom app code. In this article, I want to discuss why probably you are over/mis-using `get_doc` leading to inefficient Frappe code and what to do instead.

## Getting Field Values

Observe the below code:

```py
def get_airline_website(airplane_name):
 airplane = frappe.get_doc("Airplane", airplane_name)
 airline = frappe.get_doc("Airline", airplane.airline)
 return airline.website_link
```

Now, go through the below Jinja code snippet:

![](/blog-media/stop-using-get-doc-for-everything/jinja-with-get-doc-bc296699.jpeg)

I have copied this from a Print template in Production use.

So, you might ask what am I trying to point out here. In both the above code snippets, `get_doc` is being used to get a value of just a field of the document.

## Why Not `get_doc` For This?

When you use `frappe.get_doc`, it fetches a lot of data for the document including all the fields (1 query) and child table rows (1 query for each child table).

So, basically when you do `get_doc` for just getting the values of 1 or 2 fields, a lot of unnecessary data is being fetched. This becomes worse as the number of child table in a doctype increases. Now imagine `get_doc` in a loop like it was in the jinja snippet above 😱

## The Right Way

You are better off with using `frappe.db.get_value` in case you just want values of a few fields of a particular document:

```py
customer_name = frappe.db.get_value("Sales Invoice", si_name, "customer_name")
```

The above line will only fetch the `customer_name` field using a single database call. You can even get multiple fields using this method by passing a list of field names:

```py
airline_details = frappe.db.get_value(
 "Airline", "IndiGo", 
 ["name", "website_link"], 
 as_dict=True
)

# {"name": "IndiGo", "website_link": "https://goindigo.com"}
```

If you don't pass `as_dict` as `True`, this method will return a tuple instead of a dict.

## But I Want Child Table Rows

If you want to get child table rows without using `get_doc` and in a single database call, you need to know how a child table is linked to its parent. Consider this **Ride** document:

![](/blog-media/stop-using-get-doc-for-everything/ride_form_view-b7b2b660.png)

It has a table field called `items` and is linked to `Ride Trip Item` DocType. If we open up mariadb console and peek into the `Ride Trip Item` table:

![Screenshot](/blog-media/stop-using-get-doc-for-everything/child_table-7a2dad5d.png)

As you can see, it has a few fields which link it to its parent, specially the `parent` field which is the name of the parent document. Now, we can use this information to get child table rows for a given document using `get_all` method:

```py
items = frappe.get_all(
  "Ride Trip Item", 
  fields=["source", "destination"], 
  filters={
    "parent": "RIDE-09-2023-0003", "parenttype": "Ride"
  },
  order_by="idx"
)

# [{'source': 'Airport', 'destination': 'Mall'},
#  {'source': 'Office', 'destination': 'Airport'}]
```

You can even omit the `parenttype` filter if you know this child table is only used with one DocType. Notice the `order_by="idx"` part, this will return the rows in the order in which the items are in the child table.

## It Is Not Just About Getting Values

Again, observe the below code snippet:

![Screenshot](/blog-media/stop-using-get-doc-for-everything/db_update_get_doc-e773e363.jpg)

Basically, the developer of the above custom app is setting a field to `1` based on some condition. The above code uses `get_doc` to get the full document, *uses nothing* that the `get_doc` fetched, sets the value and calls `db_update` to update it in database. This all could have been done in a single line using `set_value` like this:

```py
frappe.db.set_value("Sales Invoice", i.sales_invoice, "gate_pass", 1)
```

Look how clean the code becomes! And efficient too (single database call)!

## When `get_doc` Is Inevitable

### Calling Methods

One of the inevitable use case of `get_doc` is to call a DocType method:

```py
class Employee(Document):
 def get_ytd_salary(self):
  ...

emp = frappe.get_doc("Employee", "EMP-001")
print(emp.get_ytd_salary())
```

### Permissions & Validations

Keep in mind that `db.get_value`/`db.set_value` methods don't apply permissions while `doc.save()` method does. If you want user permissions to be applied, then you have to use `get_doc`.

One more thing to note here is that, `db.set_value` method will by pass any validations that you might have in your controller code. If you want some validations to be run for your DocType, then you will need to do `get_doc` or `get_cached_doc` (see next section), set the value on the object and call `save` (which runs the validations).

## `get_cached_doc`

Even when `get_doc` is inevitable, you can many times use `get_cached_doc`, which is similar to `get_doc` but will look up the cache before hitting the database. It will cache it after the first call. This can be quite handy if you are using a document in multiple functions during a request.  

For instance, in this particular [PR](https://github.com/frappe/erpnext/pull/33577) on ERPNext repository, Rohit just replaced a `get_doc` with `get_cached_doc` and got ~45% faster API.

## Conclusion

One of the reasons of `get_doc` being overused in my opinion is that it is the first Python API method covered in tutorials and developers sometimes look no further since `get_doc` can do everything. But knowing about other ORM methods like `get_value`, `set_value`, `get_all` etc. can help you write much more efficient and clean code.

Until next time ✌🏼
