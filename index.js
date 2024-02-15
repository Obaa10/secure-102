import App from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: `./dev.env` });

const port = process.env.PORT || 3000;
const myApp = new App();
myApp.initializeApp(port);
