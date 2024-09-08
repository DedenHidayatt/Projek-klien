// Mengambil elemen form dan kontainer pesan
const messageForm = document.getElementById("message-form");
const messagesContainer = document.getElementById("messages-container");

// Fungsi untuk menambahkan pesan ke halaman
function addMessageToPage(username, text) {
  const messageCard = document.createElement("div");
  messageCard.classList.add("message-card");
  messageCard.innerHTML = `
        <p class="message-username">${username}</p>
        <p class="message-text">${text}</p>
    `;
  messagesContainer.appendChild(messageCard);
}

// Fungsi untuk mengambil pesan dari server
async function fetchMessages() {
  const response = await fetch("/api/messages");
  const messages = await response.json();
  messagesContainer.innerHTML = ""; // Kosongkan container sebelum menambah pesan baru
  messages.forEach(({ username, message }) => {
    addMessageToPage(username, message);
  });
}

// Event listener untuk form pengiriman pesan
messageForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("message").value.trim();

  if (username && message) {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, message }),
      });

      if (response.ok) {
        addMessageToPage(username, message);
        messageForm.reset();
      } else {
        alert("Gagal mengirim pesan, periksa input Anda.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim pesan.");
    }
  } else {
    alert("Isi nama dan pesan Anda.");
  }
});

// Memuat pesan saat halaman dibuka
fetchMessages();
