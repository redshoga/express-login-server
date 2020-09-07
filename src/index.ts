import * as express from "express";
import * as bodyParser from "body-parser";
import * as expressSession from "express-session";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import * as https from "https";

// console.log(fs);
// console.log(https);

const PORT: number = 80;
// cookie側の設定
const WEB_DOMAIN: string = "be.com";
// CORS側の設定
const WEB_DOMAIN_URL: string = "https://fe.com";

const app = express();

const options = {
  key: fs.readFileSync("./server_key.pem"),
  cert: fs.readFileSync("./server_crt.pem"),
};

// extend types
declare global {
  namespace Express {
    interface Session {
      loggedIn?: boolean;
    }
  }
}

// middlewares
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.headers);

    res.header("Access-Control-Allow-Origin", WEB_DOMAIN_URL);
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept"
    );
    next();
  }
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: "hogepiyo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 1000,
      // secure: true,
      sameSite: "none",
      domain: WEB_DOMAIN,
    },
  })
);
app.use(express.static("www"));

// routes
app.get("/api/status", (req, res) => {
  if (req.session) {
    if (req.session.visitCount) req.session.visitCount += 1;
    else req.session.visitCount = 1;
  }
  res.send(
    `visitCount: ${req.session?.visitCount}, loggedIn: ${req.session?.loggedIn}`
  );
});

app.get("/api/login", (req, res) => {
  if (req.session) {
    req.session.loggedIn = true;
  }
  res.json({
    loggedIn: true,
  });
});

app.get("/api/logout", (req, res) => {
  req.session?.destroy((err) => console.error(err));
  res.json({
    loggedIn: false,
  });
});

// start
https.createServer(options, app).listen(PORT, () => {
  console.log(`The app listening on https://localhost:${PORT}`);
});
