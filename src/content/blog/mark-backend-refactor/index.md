---
title: Mark Backend Refactor
description: Refactor backend from based on file type into modular
date: 2025-05-23
tags:
  - mark
---

## Background

### Issue in Current Project Structure

Currently I am in progress on building my backend fastapi project for Mark. But the more I write code, the more I have difficulties in manage the files. This is my current project structure.

```shell
.
├── alembic
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions
├── alembic.ini
├── app
│   ├── __init__.py
│   ├── api
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── chat.py
│   │   └── deps.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── exceptions.py
│   │   └── security.py
│   ├── data
│   │   └── bigquery_metadata.json
│   ├── db.py
│   ├── main.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── app_state_models.py
│   │   ├── auth_models.py
│   │   ├── bigquery_metadata.py
│   │   └── chat.py
│   ├── sandbox
│   │   └── docker
│   └── services
│       ├── __init__.py
│       ├── bigquery_client.py
│       ├── bigquery_metadata_service.py
│       ├── chat_service.py
│       ├── code_execution_service.py
│       └── llm_interaction_service.py
├── Dockerfile
├── requirements.txt
├── src
│   ├── __pycache__
│   ├── auth
│   │   └── __pycache__
│   ├── chat
│   │   ├── __pycache__
│   │   └── sandbox
│   ├── data_sources
│   │   └── __pycache__
│   └── users
│       └── __pycache__
└── todo.md
```

Therefore I am wondering, is there any other alternatives on manage the file? It is not the current project structure is not working. But I don't want to refactor the project only when it is already in production with already many code.

### The Ideal Project Structure

Furthermore, I have an experience working with [nestjs](https://nestjs.com/). It is an opinionated nodejs backend framework. I love how it manage their project in modular system. This is the example of the project structure from one of my other project.

```shell
.
├── drizzle
│   ├── 0000_eager_sersi.sql
│   ├── 0001_burly_king_bedlam.sql
│   ├── meta
│   │   ├── _journal.json
│   │   ├── 0000_snapshot.json
│   │   └── 0001_snapshot.json
│   ├── relations.ts
│   └── schema.ts
├── drizzle.config.ts
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── checklists
│   │   ├── checklists.controller.spec.ts
│   │   ├── checklists.controller.ts
│   │   ├── checklists.module.ts
│   │   ├── checklists.service.spec.ts
│   │   ├── checklists.service.ts
│   │   ├── dto
│   │   └── schema.ts
│   ├── company-goals
│   │   ├── company-goals.controller.spec.ts
│   │   ├── company-goals.controller.ts
│   │   ├── company-goals.module.ts
│   │   ├── company-goals.service.spec.ts
│   │   ├── company-goals.service.ts
│   │   ├── dto
│   │   └── schema.ts
│   ├── database
│   │   ├── database-connections.ts
│   │   └── database.module.ts
│   ├── goals
│   │   ├── dto
│   │   ├── goals.controller.spec.ts
│   │   ├── goals.controller.ts
│   │   ├── goals.module.ts
│   │   ├── goals.service.spec.ts
│   │   ├── goals.service.ts
│   │   └── schema.ts
│   ├── main.ts
│   ├── tasks
│   │   ├── dto
│   │   ├── schema.ts
│   │   ├── tasks.controller.spec.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.module.ts
│   │   ├── tasks.service.spec.ts
│   │   └── tasks.service.ts
│   ├── users
│   │   ├── dto
│   │   ├── schema.ts
│   │   ├── users.controller.spec.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   └── users.service.ts
│   └── variables
│       ├── dto
│       ├── schema.ts
│       ├── variables.controller.spec.ts
│       ├── variables.controller.ts
│       ├── variables.module.ts
│       ├── variables.service.spec.ts
│       └── variables.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

It will be amazing if fastapi could be modular just like what I ever did in nestjs.

## Solution

### Modular Fastapi

With that in mind, I start to looking for it. What are the alternatives on manage fastapi project? After looking for about 15 minutes, I stunned when [I read that it could](https://medium.com/@amirm.lavasani/how-to-structure-your-fastapi-projects-0219a6600a8f)!

Moreover, [the creator of the fastapi itself](https://github.com/zhanymkanov), made this repository, and I am very amaze with that. it even more than I expected. They could provide me not only the guidance of [the best practice on the project structure](https://github.com/zhanymkanov/fastapi-best-practices#1-project-structure-consistent--predictable), but also the [template](https://github.com/zhanymkanov/fastapi_production_template) on doing that.

This is the example of the project structure.

```shell
fastapi-project
├── alembic/
├── src
│   ├── auth
│   │   ├── router.py
│   │   ├── schemas.py  # pydantic models
│   │   ├── models.py  # db models
│   │   ├── dependencies.py
│   │   ├── config.py  # local configs
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   ├── service.py
│   │   └── utils.py
│   ├── aws
│   │   ├── client.py  # client model for external service communication
│   │   ├── schemas.py
│   │   ├── config.py
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   └── utils.py
│   └── posts
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── dependencies.py
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   ├── service.py
│   │   └── utils.py
│   ├── config.py  # global configs
│   ├── models.py  # global models
│   ├── exceptions.py  # global exceptions
│   ├── pagination.py  # global module e.g. pagination
│   ├── database.py  # db connection related stuff
│   └── main.py
├── tests/
│   ├── auth
│   ├── aws
│   └── posts
├── templates/
│   └── index.html
├── requirements
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── .env
├── .gitignore
├── logging.ini
└── alembic.ini
```

## Closing

From this point, this day I start to refactoring my code into modular system. Hopefully it could be a scalable project structure.
