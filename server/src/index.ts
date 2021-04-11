import { pin } from "./interface/pin";
import { updateFleet } from "./utils/updateFleet";
import { random } from "./utils/random";
import express from "express";
import { getName } from "./utils/fetchUserName";

const app = express();

app.set("port", process.env.PORT || 4000);
const http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
const io = require("socket.io")(http);

//  * * Create Object that contains label and first coordinates we will modify that
//  * * object to simulate movment (labels will stay to use in filtration)
//  * * latitue -90 to 90, longitude -180 to 180
//  */
const fleet: any = [];

for (let i = 0; i < 10; i++) {
  let longtitude: number = random(-180, 180);
  let latitude: number = random(-90, 90);
  const user: pin = {
    latitude,
    longtitude,
  };
  fleet.push(user);
}
io.on("connection", (socket: any) => {
  console.log("a user connected");
  //   let a = getName();

  // whenever a user connects on port 4000 via
  // a websocket, log that a user has connected
  // send our fleet to show it on map
  io.emit("fleet", fleet);

  // every 2 seconds coordinates are randomly changed in formula last coords +/- 5
  setInterval(() => {
    updateFleet(fleet);
    io.emit("fleet", fleet);
    console.log(fleet);
  }, 2000);
});

const server = http.listen(4000, () => {
  console.log("listening on *:4000");
});
