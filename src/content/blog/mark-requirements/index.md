---
title: Mark Product Requirements
description: Mark focus on helping business user to by getting the context of their business connecting to their spesific data source
date: 2025-04-30
tags:
  - mark
---

## Table of contents

> At first, this is what product I want to build. With the reason that I can get help from AI to build the product, it leads me to over complicate the product and forget about the most priority and the concept of MVP (Minimum Viable Product).

```md
## Overview

Mark is a Business Analyst Assistant designed to empower users by leveraging rich data from various sources to provide actionable insights and assist in decision-making. The product has three fundamental features:

1. **Connection**: Seamlessly integrates and aggregates data from various sources.
2. **Custom Command (Free Text)**: Allows users to customize the behavior of the AI assistant via free-text commands.
3. **Chat**: Facilitates brainstorming, querying, and generating reports based on the user-defined data pipeline and custom commands.

---

## 1. **Connection (Data Pipeline)**

### Objective:

- To provide a flexible and robust data pipeline that connects Mark to multiple data sources and stores the data in a centralized data warehouse.

### Data Sources:

- **Databases**:
  - MySQL, PostgreSQL, etc.
- **Marketplaces**:
  - Shopify, Shopee, etc.
- **Data Warehouses**:
  - BigQuery, Snowflakes, etc.

### Core Functionalities:

- **Data Extraction**:
  - Connect to the given data sources via APIs, connectors, or SQL queries.
  - Fetch raw data and store it in **ClickHouse**.

- **Data Transformation**:
  - Ensure data integrity and transformation between the source system and ClickHouse for proper analytical querying.

- **Data Synchronization**:
  - Automate the data syncing process at regular intervals (real-time or scheduled).

### Key Requirements:

- Secure API integrations and authentication for each data source.
- Error handling for failed data retrievals or synchronization.
- Scalability to handle large datasets from various sources.
- Ensure data consistency and availability for querying.

---

## 2. **Custom Command (Free Text)**

### Objective:

- Allow users to provide customized commands in free text to influence how Mark behaves and processes data.

### Core Functionalities:

- **Command Recognition**:
  - Parse and understand free-text commands given by the user to tailor responses.
  - Recognize various commands related to data queries, report generation, and AI behaviors.

- **Data Query Generation**:
  - Based on the custom command, the assistant should generate SQL queries or API requests to interact with the connected data sources.

- **Flexible Behavior**:
  - Adapt Mark’s behavior based on the custom command, such as defining specific parameters or adjusting AI models' response styles.

### Key Requirements:

- Retrieval augmented generation capabilities for parsing commands.
- Integration with data querying and API generation systems.
- Error handling for unrecognized commands or invalid syntax.
- Logging and tracking of commands issued by users.

---

## 3. **Chat**

### Objective:

- Provide an interactive chat interface for users to brainstorm, ask questions, and generate reports using the context gathered from both custom commands and data connections.

### Core Functionalities:

- **Context Awareness**:
  - Chatbot should leverage data context (from the connections) and custom commands to generate accurate and insightful responses.

- **Question Answering**:
  - The assistant should be able to answer user queries based on the data from the connected sources (e.g., querying sales data from a database, fetching reports from data warehouses).

- **Brainstorming**:
  - Facilitate collaborative brainstorming and ideation, with suggestions and inputs based on the available data.

- **Report Generation**:
  - Generate reports in PDF or other formats, summarizing the insights and data based on queries issued.

- **User Feedback**:
  - Collect user feedback on the quality of responses to improve chat interactions.

### Key Requirements:

- Integration with the custom command and data connection features.
- Natural language processing for effective communication.
- Context-driven responses and reporting.
- A clean, user-friendly chat interface that enables seamless communication.

---

## 4. **General Requirements**

- **Security**:
  - Ensure secure connections to all external data sources.
  - Proper authentication, authorization, and encryption for sensitive data.

- **Scalability**:
  - System should scale efficiently to handle increased data loads and user interactions.

- **Performance**:
  - Fast response times for both queries and chat interactions.

- **Documentation & Help**:
  - Provide clear documentation and user guidance for connecting data sources, issuing commands, and using the chat effectively.

### Additional Notes:

- The system should have monitoring and logging for data extraction, command execution, and user interactions.
```

# Second Product Concept

> But after I share the concept with my partner, I relize that the most priority and to do first is market validation. How we can build it as fast as possible, until it is ready to be used by the user.

From those feedback, I decide to change into this point

1. **Chat**: The most important and main feature is chat. How we can design and manage the chat process as what user need as a business analyst.

- how it can guide the user to ask the correct questions
- how it can **Go beyond the numbers**, which could give perspective recommendation for the user (not just product A is declining, but why and how to improve it).

2. **Connections**: We don't need to build it self service connection. We can just start manually connect it to the current data source by myself.

3. **Custom Command**: We don't need to build it at first. We can just build it by myself. Because the business user is not tech savvy which they want to customize. Instead, they need as best as possible to provide them with business analyst assistant. That's all.

With that in mind, this is our new requirements for Mark.

```md
## Overview

Mark is a Business Analyst Assistant designed to empower users by leveraging rich data from various sources to provide actionable insights and assist in decision-making. Mark is strong in helping the user to **Go beyond the numbers** by giving perspective recommendation for the user (For instance, not just product A is declining, but why and how to improve it).

For giving a good decision, Mark need context on the user's business. Therefore, Mark will get data from

1. **BigQuery**: Which is the data warehouse of my first user have currently.
2. **Attachment**: Which the user can upload the file and Mark will extract the data from the file.
```

# Closing

With the fact that we are an engineer, it is often will leads us to over complicate the product and forget about the priority. We need to remember that we are building the product for the user, not for ourselves. So market validation is the most important thing to do at first.
