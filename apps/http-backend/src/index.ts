import express from "express";
import v1Router from "./router/v1/index";
const app = express();


app.get("/api/v1", v1Router)

app.listen(3000, () => {
    console.log("http server is live");
})