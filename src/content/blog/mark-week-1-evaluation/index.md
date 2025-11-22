---
title: Mark Week 1 Evaluation
description: Learning the importance of planning and mvp to build a product
date: 2025-05-25
tags:
  - mark
---

## Background

First of all, I am very grateful that I can have this much time to work on Mark. I have been working on this project for 1 week, literally every day, and I have learned a lot.

The goals on the first week are simple. Generate visualization from the data that the AI already got from the data warehouse. At first, I surely try on the nextjs app that I already finished on the last week. But it failed. From that point, I believed that I need to **seperate the backend using fastapi (python)**. Those decision that guide me to all my works on this week.

## The Story

### What did I do in this week?

#### 1. I learned about fastapi

I am coming from data engineer background, therefore I already proficience in python. But I never use fastapi before. I have to learn it from scratch. I learn about how they work, how to manage the directory structure, and so on. In addition, I also learn about the ORM inside python backend, which is alembic.

#### 2. Develop backend

After learning the basic of fastapi, I start to develop the backend. I start with the simple one, which is the data warehouse connection. I use the python library called `sqlalchemy` to connect to the data warehouse. I also use the `alembic` to manage the database schema. I also use the `pydantic` to validate the data.

#### 3. Refactor backend into modular

But then, the more I develop the backend, the more I have difficulties in manage the project structure. I ever learned about [nestjs](https://nestjs.com/) before, and I think it is a good idea to use the same structure. When I research more about that, [fastapi also could be structured into modular](https://github.com/zhanymkanov/fastapi-best-practices#1-project-structure-consistent--predictable). Therefore I decide to refactor it.

#### 4. Found Pydantic AI library

After that, I already finished the backend. I build the authentication, the data warehouse connection, and the data warehouse schema. I also already tested the chat endpoint. But then, the next challenge is how to make the LLM answer into streaming (generate the result word by word, instead directly return all the text in batch), and apparently it is very very complex. Because I have to work with redis which I also never work with it before.

Then I found [Pydantic AI](https://github.com/pydantic-ai/pydantic-ai) library. It is a library that can help me to build the streaming endpoint. It is very easy to use. I can just use the `PydanticAI` class to create the LLM model, and then use the `stream` method to generate the streaming result. So I decide to **refactor my code again** to work with that library. It still need to use redis, but it is easier to work with, compare to develop the code form scratch all by my own.

#### 5. Found Suna and decide to use it

But even after try to use Pydantic AI, it still very difficult, especially when I have to connect it with the frontend. I already getting use to have backend and frontend in the same project using nextjs. Therefore, when I have to connect those separated project, it is very difficult and prone to error (because there is no type checking that I can usually use in nextjs).

Therefore I am wondering, what about using [suna](https://github.com/kortix-ai/suna) as the skeleton of my project, then develop and adjust my code to work with it? So **I restart my project from scratch again**, literally.

### Result

With all those struggles, what are the result that I have? Almost **nothing**. I always restart my work everytime I face some difficulties, hoping that with the new approach, I can solve the problem. But in the end, nothing works. Nothing is easy. Nothing could be fast. Nothing could be done in a day.

### Decision

With all those struggles, I have to make a decision. After having discuss and brainstorm with my team (which is also AI), it is better to stick with my previous approach, which is using nextjs. Because

1. I already done all the works to build chatbot. Because it already have their [AI SDK](https://ai-sdk.dev/docs/introduction) and even [project template](https://github.com/vercel/ai-chatbot).
2. I already very very much familiar with the nextjs in building the apps.
3. I already done the work! I finished the authentication, the ai chatbot using streaming, the RAG process into bigquery, query generation, and so on.

So it is better to stick with it. Only when I face more complex need, that is the time when I need to have separate python backend, but **only on that part**, not all the parts.

## Lessons Learned

1. **Planning is very important**. I have to plan my work very well. I have to know what I want to achieve, and then I have to plan how to achieve it. So I can anticipate any failure that I might face without need to literally doing it.
2. **Depend on AI is not enough**. With current strength in AI to help coding, it is still important to have a strong understanding and assestment on the decision that I made.
3. **Be aware of over-engineering**. It is true that ideally I can move all the backend into fastapi. But really I don't have to. I just need to separate it, only at the part that I need to.
