---
title: Mark Tech Stack Change
description: Decision to separate backend service from nextjs into fastapi
date: 2025-05-20
tags:
  - mark
---

## Table of contents

## Background

For context, **Mark** is a business analyst AI that helping business user to understand their business condition by using natural language, helping them diagnose problem on their business, and giving ideas on how to solve them. As a business analyst, one of the strongest point is how they tell the story about the data and visualize it.

In current tech stack that I use, which is mainly and only using [nextjs](https://nextjs.org/), I am starting to face too many problem that very hard and takes time to solve, which are:

1. I can not generate visualization at all for every query that I already generate.
2. While for the query itself, I can only show them only when manually refresh the chrome. The UI itself can not be refreshed, even when I try using `revalidatePath` or `router.refresh()`

I already spend about 6 hours to debug both problem, but I haven't found any useful solution. I strongly believe, the root cause is one of these two :

1. It could be the language itself is not very compatible with complex data processing. Or probably it still could, but it is too much complex compare to language like python which already strong on data processing.
2. I still not proficient enough in nextjs.

### Resolution

Whatever it is, I believe it is wiser to separate my backend process using [fastapi](https://fastapi.tiangolo.com/), while still using _nextjs_ for my frontend. This is what it will looks like in my current project.

```bash
.
├── backend
│   ├── alembic_app_state
│   ├── alembic.ini
│   ├── app
│   ├── credentials
│   ├── requirements.txt
│   └── todo.md
├── Dockerfile
├── frontend
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   ├── README.md
│   ├── src
│   └── tsconfig.json
└── README.md
```

### Well, why _fastapi_?

1. First of all, it is python. The language is my main considering in choosing the backend. There are other alternatives that I already familiar with, such as [nestjs](https://nestjs.com/) which will be amazing in collaborate with my nextjs apps in typescript, or [go fiber](https://gofiber.io/) which very strong on their micro services. But as my main issue is on complex data processing, I decide to go with python.
2. There are other alternatives backend web framework in python beside _fastapi_, such as [flask](https://flask.palletsprojects.com/en/stable/) and [django](https://www.djangoproject.com/). I believe, fastapi is new compare to flask and django. I already ever tried flask and django in [CS50 from Harvard University](https://pll.harvard.edu/course/cs50-introduction-computer-science). They are amazing. Flask is very lightweight and very simple to start. While django are very full battery and feature but complex. But after considering the pros and cons and reading many [comparison between them](https://www.geeksforgeeks.org/comparison-of-fastapi-with-django-and-flask/), I decide to go with fastapi because of it's fast speed and simplicity.

The next challenge is on how I will deploy full stack web framework with different language in mono repo. I strongly believe it is feasible because there are already real apps that already deployed that way. But it must be very complex compare to how I usually deploy nextjs web apps. Anyway, let's see.
