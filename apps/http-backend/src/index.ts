import express from "express";
import v1Router from "./router/v1/index";
import cors from 'cors';
const app = express();

app.use(cors())
app.use(express.json());
app.use("/api/v1", v1Router)

app.listen(3300, () => {
    console.log("http server is live");
})