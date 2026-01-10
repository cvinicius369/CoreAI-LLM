// Importaões que foram necessarias para o meu projeto
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2:1b";
const SYSTEM_PROMPT = ` No meu caso eu coloquei um prompt proprio pro meu segmento de CFTV, IA, Software Engineer `;
let busy = false;

async function warmup() {
  try {
    await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: "ping" }],
        stream: false
      })
    });
    console.log("[!] Modelo aquecido com sucesso");
  } catch { console.log("[!] Warm-up falhou"); }
}
app.post("/chat", async (req, res) => {
  if (busy) {
    return res.status(429).json({
      reply: "O assistente está ocupado. Tente novamente em instantes."
    });
  }
  const userMessage = req.body?.message;
  if (!userMessage || userMessage.length > 500) { return res.status(400).json({ reply: "Mensagem inválida." }); }
  busy = true;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        options: { num_predict:120, num_thread:2 },
        stream: false
      })
    });

    const data = await response.json();
    const reply = data?.message?.content || "Não consegui gerar uma resposta agora.";
    res.json({ reply });

  } catch (err) {
    console.error("Erro no /chat:", err.name);

    if (err.name === "AbortError") {
      res.json({ reply: "Estou iniciando agora. Tente novamente em alguns segundos." });
    } else {
      res.json({
        reply: "No momento o assistente está indisponível."
      });
    }
  } finally {
    clearTimeout(timeout);
    busy = false;
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});
app.listen(3000, "0.0.0.0", () => {
  console.log("[!] API IA rodando em http://0.0.0.0:3000");
  warmup();
});
