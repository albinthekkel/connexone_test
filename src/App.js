import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [time, setTime] = useState("");
  const [serverTime, setServerTime] = useState("");
  const [metrics, setMetrics] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      userAction();
      userMetrics();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  function convertEpoch(value) {
    if (!value) {
      return "";
    }
    const time = new Date(Number(value));
    if (isNaN(time.valueOf())) {
      return "";
    }
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  const userAction = async () => {
    let myDate = new Date(Math.floor(new Date().getTime()));
    setTime(String(myDate));
    const response = await fetch("http://localhost:5000/time", {
      method: "GET",
      headers: {
        authorization: "mysecrettoken",
      },
    });
    const myJson = await response.json();
    setServerTime(Date(myJson[0].properties.epoch[0].description));
  };

  const userMetrics = async () => {
    let myDate = new Date(Math.floor(new Date().getTime()));
    setTime(String(myDate));
    const response = await fetch("http://localhost:5000/metrics", {
      method: "GET",
    });
    const myMetricsJson = await response;
    console.log(myMetricsJson);
    setMetrics(myMetricsJson);
  };

  return (
    <div className="App">
      <h2>Timer / Metrics</h2>
      <div className="timer-container">
        <div className="col-lgl12 row mb-5">
          <div className="col-lg-6 rel-left">
            Current client time : {time} <br /> Current Server Time :
            {serverTime}
            {/* {() => {
              let mtempyDate = new Date(serverTime * 1000);
              document.write(
                myDate.toGMTString() + "<hr>" + myDate.toLocaleString()
              );
            }} */}
          </div>

          <div className="col-lg-6">Metrics : {metrics}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
