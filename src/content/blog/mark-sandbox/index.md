---
title: Mark Sandbox
description: The first day on building mark backend, build sandbox environment.
date: 2025-05-21
tags:
  - mark
---

## Table of contents

## Background

This is my first day on building fastapi backend service for mark, after initially build the directory yesterday. As a data engineer and data scientist, I already have experience in python, but this is my very first time build a backend apps using fastai. Therefore it is challenging. Fortunately, there is AI which can accompany and guide me to build it.

## The Process I have done

### To do list

At first, I define the to do list to plan out the step to build the backend process. Here are the overall to do list that I need to do. In addition, I also have crosscheck the task that I already done today.

```md
## Mark - Backend To-Do List

### Core Architectural Shift: LLM-Powered Conversational Agent with Code Execution Tools

Mark will function as an intelligent conversational agent. It will understand user queries, engage in dialogue, and decide when to leverage its specialized tool: generating and executing Python code (e.g., for data analysis, BigQuery interaction, visualization). The goal is a seamless chat experience where code execution happens behind the scenes when necessary.

### Phase 0: Foundational Setup (Completed)

- [x] App State Database - Plain PostgreSQL with SQLModel & Alembic (Setup and initial schema)

- [x] Basic FastAPI app structure.

### Phase 1: Core Backend for LLM-Powered Agent

#### 1.0. User Authentication & Session Management (NEW)

- [x] **API Endpoints:** (DONE)

- [x] `POST /auth/signup`: Create a new user (store in `User` table using `app_state_models.py`).

- [x] `POST /auth/signin`: Authenticate user, return JWT token.

- [x] **Token-based Authentication:** (DONE)

- [x] FastAPI dependency (e.g., using `fastapi.security.OAuth2PasswordBearer`) to protect chat-related endpoints, requiring a valid JWT.

- [x] Logic to extract user identity from the token for associating chats and messages.

- [x] **Password Hashing:** Implement secure password storage (e.g., using `passlib`) and verification. (DONE - part of initial auth setup)

#### 1.0.B. Chat Lifecycle & Persistence (NEW)

- [x] **Chat Creation & Identification:** (DONE)

- [x] Logic within the main chat endpoint (or a dedicated `/chat/session` endpoint) to create a new `Chat` record (linked to the authenticated `user_id`) if no `chat_id` is provided or if a new session is explicitly requested.

- [x] The chat endpoint will need to accept an optional `chat_id` to continue existing conversations.

- [x] **Message Persistence:** (DONE)

- [x] Service/functions to save incoming user messages and Mark's responses to the `Message` table (from `app_state_models.py`), associated with the correct `chat_id`. This includes `role`, `parts` (content), `attachments`, and `query_details` as applicable.

- [x] **History Retrieval Service:** (DONE)

- [x] A service function (e.g., `get_chat_history(chat_id: UUID) -> List[Message]`) to fetch historical messages for a given `chat_id`. This will be used to provide conversation context to the LLM.

- [x] **SQLModel Integration:** Ensure all database interactions strictly use the SQLModel definitions in `app/models/app_state_models.py`. (DONE)

#### 1.1. LLM Interaction Service (The "Brain" of the Chatbot)

- [ ] **Design and implement a service to manage all LLM interactions, enabling Mark to act as a capable chatbot with tool-using abilities.**

- [ ] **Reasoning & Decision-Making Engine (Chain of Thought):** LLM analyzes the user query and **retrieved database conversation context** to:

- [ ] Determine the user's intent.

- [ ] Decide if the query can be answered directly (e.g., conversational response, general knowledge) OR if it requires using the Python code execution tool.

- [ ] If a direct answer is best, LLM generates that textual response.

- [ ] If code execution is needed, LLM identifies the steps and data required, then proceeds to generate the necessary Python code.

- [ ] **Prompt Engineering & Management for a Multi-faceted Agent:**

- [ ] System prompts defining Mark's persona, its capabilities (including tool usage), and its goal to be helpful and conversational.

- [ ] Prompts for the reasoning/decision-making step (now including how to use retrieved conversation history).

- [ ] Prompts for generating Python code for data tasks (BigQuery, transformations, plotting).

- [ ] Prompts for generating user-facing textual responses (direct answers or synthesizing information after tool use).

- [ ] **LLM Communication:** Sending requests to the LLM and processing its responses (which could be direct text, a decision to use a tool, or Python code).

- [ ] Configuration for LLM API keys and model selection (via `app.core.config`).

#### 1.2. Secure Python Code Execution Engine (Daytona-based Tool)

- [x] **Sandboxing Mechanism:** Daytona chosen and successfully integrated for sandboxing Python code execution.

- [x] **Execution Service (`CodeExecutionService`):**

- [x] Takes a Python code string and executes it in a Daytona sandbox.

- [x] Captures `stdout` and `stderr`.

- [x] Handles execution errors.

- [x] **Sandbox Environment:** Daytona image (`harbor-transient.internal.daytona.app/daytona/mark-plotly:0.0.1`) provides necessary libraries. (Ongoing maintenance/updates as needed).

#### 1.3. BigQuery Table Metadata Management (Context for LLM Reasoning & Code Gen)

- [ ] **Design Metadata Storage/Access:**

- [ ] Method: JSON files, Pydantic models, or App State DB (e.g., new `DataSourceMetadata` table in `app_state_models.py`).

- [ ] Service to load/access metadata.

- [ ] This metadata is crucial for the LLM's reasoning process (understanding what data it _can_ analyze) and for generating correct Python code for BigQuery.

#### 1.4. Main Chat API Endpoint (`/api/v1/chat`) - Orchestrator

- [ ] **Orchestration of the Conversational Flow:**

- [x] Handle user authentication (e.g., via JWT token dependency). (NEW) (DONE - as part of 1.0)

- [x] Determine chat context: new chat vs. existing chat (using `chat_id` from request body/path or creating a new `Chat` instance). (NEW) (DONE - as part of 1.0.B)

- [x] Retrieve conversation history from the database using the Chat Lifecycle service if an existing `chat_id` is provided. (NEW) (DONE - as part of 1.0.B)

- [ ] Receive user's query.

- [ ] Pass query and **retrieved database conversation context** to `LLMInteractionService`.

- [ ] `LLMInteractionService` returns its reasoned response, which could be:

- [ ] A direct textual answer: Format and return in `MarkResponse`.

- [ ] A decision to generate Python code:

- `LLMInteractionService` generates the code.

- API passes the code to `CodeExecutionService`.

- `CodeExecutionService` executes it and returns results (`stdout`, `stderr`, success).

- **(RAG for Tool Use):** API sends these execution results (and original query/context) back to `LLMInteractionService`.

- `LLMInteractionService` then generates the final, synthesized, story-driven `answer_story` based on the code's output.

- [ ] (Future) Support for multi-step tool usage if the LLM's reasoning determines it's necessary.

- [ ] Format the final `MarkResponse` (story, visualization spec, data snippets) based on the LLM's final output.

- [x] Save user message and Mark's complete response (including story, generated code if any, etc.) to the `Message` table in the database. (NEW) (DONE - as part of 1.0.B)

- [ ] Translate errors from any stage into a user-friendly `MarkResponse.answer_story` (and potentially log errors to the `Message` record or a separate error log).

#### 1.5. Initial Supported Tooling Capabilities (Python Code Generation Tasks for MVP)

- [ ] **BigQuery Interaction:**

- [ ] LLM generates Python to query BigQuery (SQL might also be LLM-generated).

- [ ] Code returns data (e.g., as CSV/JSON to `stdout`).

- [ ] **Plotly Visualization Generation:**

- [ ] LLM generates Python to create Plotly JSON specs from data (printed to `stdout` or saved for artifact retrieval).

- [ ] **(New) Data Attachment Processing:**

- [ ] User uploads file; LLM generates code to process it.

- [ ] Secure file handling required.

### Phase 2: Enhancements & Refinements

#### 2.1. Advanced LLM Reasoning & Conversational Context

- [ ] Iteratively refine prompts for more sophisticated reasoning, decision-making, code quality, RAG summarization, and security.

- [ ] Robust conversation history management to provide richer context to the LLM.

#### 2.2. Expanding Toolset & Code Generation

- [ ] More complex data transformations via Python.

- [ ] Additional Python libraries in sandbox.

- [ ] Artifact retrieval from sandbox (images, files).

#### 2.3. Security Hardening & Auditing

- [ ] Ongoing review of sandboxing and LLM interaction patterns.

- [ ] Auditing generated code and LLM decisions.

#### 2.4. User Feedback & Learning

- [ ] Mechanisms for users to provide feedback on Mark's responses and tool usage.

### Phase 3: Production Readiness

- [ ] Standard items: Enhanced Error Handling, API Security, Testing, Documentation, Scalability.
```

### Julius AI

The first thing I need to try is the **code generator**. To assess whether it is feasible to do or not. I strongly believe it is feasible because there is already real software which could do that. For instance, I inspire a lot from [julius.ai](https://julius.ai/). It is an AI to help data analyst working on data analysis and data manipulation.
![](@/assets/blog-assets/Pasted%20image%2020250521061007.png)
This is how they could generate python code, run it, and return the result also in the UI.
![](@/assets/blog-assets/Pasted%20image%2020250521061221.png)
So it must be feasible. But I need to try it first, to define how challenging it is and how much cost is it, whether it is cost for development and also cost for running it.

### Sandbox

Therefore, I start to research on how to do it. At first, I need to have an LLM model to generate python code based on a user need. After that I need to feed those python code into the code generator.

After I doing my research, apparently the term for separated and isolated compute to which can run service as we need is called **Sandbox**. This is what are the alternatives on achieve it, which absolutely have their own pros and cons for each.

```md
#### Common Sandboxing Techniques & Considerations:

1. **Custom Python Interpreters/Executors:**

- **How it works:** Re-implementing parts of the Python interpreter or using Abstract Syntax Tree (AST) manipulation to control execution. This allows disallowing certain imports, functions (like `open`, `eval`, `exec`), or even specific operations.

- **Pros:** Fine-grained control over what code can do. Can be implemented within the same process.

- **Cons:** Very complex to get right. "Sandboxing in Python is notoriously hard" (from Valentino Gagliardi's blog). A determined attacker might still find ways to bypass restrictions if not perfectly implemented. Might limit the capabilities of the generated code too much (e.g., if essential safe libraries are disallowed).

- **Examples:** HuggingFace `smolagents` has a `LocalPythonExecutor` that works by parsing the AST and allowing/disallowing operations. The Moveworks blog discusses a custom, slimmed-down Python interpreter.

#### 2. **Docker Containers:**

- **How it works:** Running the LLM-generated code inside an isolated Docker container. The container has its own filesystem, network stack (which can be restricted), and process space.

- **Pros:** Strong isolation at the OS level. Easier to manage dependencies (by defining them in a `Dockerfile`). Can set resource limits (CPU, memory). Well-established technology.

- **Cons:** Higher overhead (starting a container for each code execution can be slow). Requires Docker to be installed and running on the host. Managing communication between the main app and the container (passing code, data, and results) adds complexity.

- **Examples:** `llm-sandbox` library on GitHub, Azure Container Apps dynamic sessions. The Medium article by Shrish details building a FastAPI app inside Docker for sandboxing.

#### 3. **WebAssembly (WASM) / Pyodide:**

- **How it works:** Pyodide compiles Python and many popular libraries (like Pandas, NumPy) to WebAssembly. This allows Python code to run in a browser's WASM sandbox or a server-side WASM runtime.

- **Pros:** Strong sandboxing (leveraging browser sandbox technology). Can be fast if the WASM runtime is already initialized.

- **Cons:** Not all Python libraries are available or fully functional in Pyodide. Might have limitations on system-level access (e.g., direct network calls beyond `fetch`, filesystem access outside a virtual FS). Still an evolving ecosystem for server-side Python in WASM.

#### 4. **Microservices for Code Execution:**

- **How it works:** A separate service (potentially on a different machine or in a more restricted network zone) is responsible for executing the code. This is often combined with Docker or other isolation techniques for the microservice itself.

- **Pros:** Decouples code execution from the main application. Can be scaled independently. Enforces a clear boundary.

- **Cons:** Adds architectural complexity (inter-service communication, deployment, monitoring of another service).

#### 5. **RestrictedPython:**

- **How it works:** A tool that takes Python source code and verifies that it doesn't use unsafe operations, then compiles it to safe bytecode.

- **Pros:** Aims to provide a subset of Python that is safe to execute.

- **Cons:** It's not a complete sandbox on its own and is often used in conjunction with other measures. It restricts the language features available, which might be too limiting for complex code. Its security guarantees have been questioned in some contexts if not used perfectly.

#### **Key Security Principles Mentioned:**

- **Principle of Least Privilege:** The execution environment should only have the permissions absolutely necessary.

- **Resource Limits:** Impose strict limits on execution time, memory usage, CPU usage, network access, and file system access.

- **Input Validation/Sanitization (for prompts):** While the focus here is on executing the _output_ of the LLM, prompt injection is a risk that could lead to malicious code generation.

- **AST Analysis:** Parsing the code's Abstract Syntax Tree to allow/disallow specific operations or language features (as seen in `smolagents` and Moveworks' approach).

- **Dependency Control:** Carefully manage which libraries are available to the executed code. Only allow trusted and necessary libraries.

- **Ephemeral Environments:** Destroy the sandbox/container after each execution to prevent state leakage or persistent compromises.

- **Fuzz Testing:** Test the sandbox with randomly generated code to find vulnerabilities (Moveworks).

- **Monitoring and Logging:** Keep track of what code is being executed and its behavior.
```

Apparently it is challenging to do it, and very sensitives in term of security. After wondering what is the best, I remember about the [Suna](https://github.com/kortix-ai/suna) project that I previously learned. They surely also use sandbox for the agent to do it's work. Apparently, they use third party service to run the sandbox, called [Daytona](https://www.daytona.io/) which they called as _"Secure agent execution environment"_.
![](@/assets/blog-assets/Pasted%20image%2020250521062308.png)
Moreover, for the isolated sandbox environment that we are going to build, we can customized the image.
![](@/assets/blog-assets/Pasted%20image%2020250521062521.png)

## Closing

With all that consideration, in this Mark project, I decide to build the sandbox environment using Daytona. It is challenging at first, but it is working, and we don't need to think more about the security.
