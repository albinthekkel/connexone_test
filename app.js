const express = require("express");
const promMid = require("express-prometheus-middleware");
const app = express();
const PORT = process.env.PORT || 3002;
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
  let myDate = new Date(Math.floor(new Date().getTime()));
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
