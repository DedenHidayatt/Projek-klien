// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Inisialisasi server
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// File JSON untuk menyimpan pesan
const dataFilePath = path.join(__dirname, "data", "messages.json");

// Fungsi untuk membaca pesan dari file JSON
function readMessages() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Fungsi untuk menyimpan pesan ke file JSON
function saveMessages(messages) {
  fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), "utf-8");
}

// Route untuk mendapatkan pesan
app.get("/api/messages", (req, res) => {
  const messages = readMessages();
  res.json(messages);
});

// Route untuk mengirim pesan
app.post("/api/messages", (req, res) => {
  const { username, message } = req.body;

  // Validasi input
  if (!username || !message || message.length > 300) {
    return res
      .status(400)
      .json({ error: "Pesan tidak valid atau terlalu panjang." });
  }

  const messages = readMessages();

  // Batasi jumlah pesan maksimal 50
  if (messages.length >= 50) {
    messages.shift(); // Hapus pesan paling awal jika sudah mencapai batas
  }

  // Tambahkan pesan baru
  messages.push({ username, message, timestamp: new Date() });
  saveMessages(messages);

  res.status(201).json({ message: "Pesan berhasil dikirim!" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
