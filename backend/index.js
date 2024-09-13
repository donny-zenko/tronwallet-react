import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import TronWeb from 'tronweb';

const tronWeb = new TronWeb({
  fullHost: 'https://api.nileex.io',
});

const app = express();

app.use(cors({
  origin: "http://localhost:5001"
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World")
})

let address = ""

app.get("/nonce", async (req, res) => {
  const nonce = generateNonce();
  res.status(200).json({ nonce })
})

app.get("/me", (req, res) => {
  res.status(200).json({ address })
})

app.post("/verify", async (req, res) => {
  const { address, message, signature } = req.body;

  try {
    const result = await tronWeb.trx.verifyMessageV2(message, signature);
      if (result === address) {
        res.status(200).json({ ok: true })
      } else {
        res.status(200).json({ ok: false })
      } 
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
})

app.post("/logout", (req, res) => {
  address = ""
  res.status(200).json({ ok: true })
})

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})