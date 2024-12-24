const express = require("express");
const router = express.Router();

const videoRoute = require("./video.route");

const routes = [
  {
    path: "/video",
    route: videoRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
