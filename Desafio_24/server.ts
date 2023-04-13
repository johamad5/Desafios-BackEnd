
import { Req, Res, Router, WebApp } from "https://deno.land/x/denorest@v3.1/mod.ts";

const app = new WebApp();

// create router
const router = new Router();

// define the home page route
router.get("/", (_req: Req, res: Res) => {
    res.headers = {
        "Content-Type": "text/html",
    };
    res.reply = `<h1 style="background-color:${_req.url.search.substring(1)};" > Un servidor en Deno con colorcito personalizado. Usamos Denorest porque Servest no anda :( </h1>`
});

// assign router
app.set(router);

app.listen(8080);