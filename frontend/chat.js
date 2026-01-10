const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("message");

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  addMessage("Você: " + message, "user");
  input.value = "";
  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.textContent = "Só um momento, estou processando...";
  chat.appendChild(thinking);
  chat.scrollTop = chat.scrollHeight;
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    chat.removeChild(thinking);
    addMessage("Assistente: " + (data.reply || "Sem resposta."), "bot");
  } catch (err) {
    chat.removeChild(thinking);
    addMessage("Erro ao conectar com o servidor.", "bot");
  }
});


