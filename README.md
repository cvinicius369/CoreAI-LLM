# CoreAI-LLM

## Description

CoreAI-LLM is a self-hosted Large Language Model (LLM) implementation designed to run on resource-constrained hardware. This project demonstrates the feasibility of deploying local AI using **Ollama** and Node.js, focusing on optimization and efficient resource management for legacy systems.

> **Status:** Running on a homemade server. Plans for hardware migration to support larger parameters models.

## Hardware Specifications

* **Processor:** AMD A4-4000 (Dual-Core)
* **Memory:** 8GB DDR3
* **Storage:** 4TB HDD
* **OS:** Debian GNU/Linux

## LLM Strategy

Currently utilizing **Llama 3.2 1B**.
Despite hardware limitations, this model was selected for its high performance-to-parameter ratio.

* **Optimization:** The project uses a **System Prompt** to constrain output length and prevent halluncinations, ensuring the CPU (A4-4000) can handle the inference within reasonable timeouts.

## Project Structure

```bash
.
├── ia-api/           # Backend root
│   ├── server.js     # Express API & Ollama integration
│   └── frontend/     # Web Interface
│       ├── chat.js   # Async chat logic
│       ├── index.html# Modern UI 
│       └── style.css # Glassmorphism design

```

## Setup & Installation

1. **Environment:** Ensure [Node.js](https://nodejs.org/) and [Ollama](https://ollama.com/) are installed.
2. **Model:** Pull the lightweight model:
```bash
ollama run llama3.2:1b

```


3. **Network:** Open port `3000` (or your custom port) on your firewall.
4. **Configuration:** * Review `server.js` to adjust `SYSTEM_PROMPT` and `MODEL`.
* Set up your `package.json` dependencies (`express`, `node-fetch`).


5. **Run:**
```bash
node server.js

```


Access via: `http://{server_ip}:3000`

## Project Image

<image src="./print1.png"></image>
