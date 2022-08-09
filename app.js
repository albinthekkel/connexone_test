const express = require("express");
const promMid = require("express-prometheus-middleware");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const whitelist = ["http://localhost:5000", "http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  promMid({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
  })
);

app.get("/", (req, res) => {
  res.send("Landing message: Connexone test");
});

app.get("/time", (req, res) => {
  let myDate = new Date(new Date().getTime());

  let tm = [
    {
      headers: req.headers.authorization,
      properties: {
        epoch: [
          {
            description: myDate,
            type: "number",
          },
        ],
      },
      required: ["epoch"],
      type: "object",
    },
  ];
  if (req.headers.authorization !== "mysecrettoken")
    res.status(403).send("not found");
  else res.status(200).send(tm);
});

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
