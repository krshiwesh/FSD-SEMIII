import http from "http";
import fs from "fs";
import EventEmitter from "events";
import url from "url";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.on("exit", () => {
  console.log("Exit event triggered");
});

function sendJSON(res, obj) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/" && req.method === "GET") {

    const filePath = path.join(__dirname, "index1.html");

    fs.readFile(filePath, (err, data) => {

      if (err) {
        console.log(err);   // IMPORTANT: actual error terminal mein dikhega
        res.writeHead(500);
        res.end("Error loading HTML");
      } 
      else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }

    });

    return;
  }

  if (parsedUrl.pathname === "/greet") {

    const name = parsedUrl.query.name || "Guest";

    emitter.emit("greet", name);

    sendJSON(res, {
      message: `Hello, ${name}!`
    });

  } 
  
  else if (parsedUrl.pathname === "/exit") {

    emitter.emit("exit");

    sendJSON(res, {
      message: "Exit event triggered"
    });

  } 
  
  else if (parsedUrl.pathname === "/eventloop") {

    const order = [];

    setTimeout(() => order.push("setTimeout"), 0);

    setImmediate(() => order.push("setImmediate"));

    process.nextTick(() => order.push("nextTick"));

    setTimeout(() => {
      sendJSON(res, { order });
    }, 10);

  } 
  
  else if (parsedUrl.pathname === "/create" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {

      const { text } = JSON.parse(body);

      fs.writeFileSync("data.txt", text);

      sendJSON(res, {
        status: "File created"
      });

    });

  } 
  
  else if (parsedUrl.pathname === "/read") {

    const content = fs.existsSync("data.txt")
      ? fs.readFileSync("data.txt", "utf-8")
      : "";

    sendJSON(res, {
      content
    });

  } 
  
  else if (parsedUrl.pathname === "/update" && req.method === "PUT") {

    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {

      const { text } = JSON.parse(body);

      fs.appendFileSync("data.txt", text);

      sendJSON(res, {
        status: "File updated"
      });

    });

  } 
  
  else if (parsedUrl.pathname === "/delete" && req.method === "DELETE") {

    fs.writeFileSync("data.txt", "");

    sendJSON(res, {
      status: "File cleared"
    });

  } 
  
  else {

    res.writeHead(404);
    res.end("Not Found");

  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});