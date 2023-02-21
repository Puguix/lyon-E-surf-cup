// Routes for handling all CRUD operations for surfers

module.exports = (app) => {
    const surfers = require("../controllers/surfer.controller.js");
    var router = require("express").Router();

    // Create a new surfer
    router.post("/create", surfers.create);

    // Retrieve all surfers
    router.get("/admin", surfers.findAll);
    router.get("/home", surfers.findAll);

    // Retrieve all live surfers
    router.get("/home", surfers.findAllLive);
    router.get("/admin", surfers.findAllLive);

    // Retrieve a single surfer with id
    router.get("/admin/:id", surfers.findOne);

    // Update a surfer with id
    router.put("/edit/:id", surfers.update);

    // Delete a surfer with id
    router.delete("/admin/:id", surfers.delete);

    // Delete all surfers surfer
    router.delete("/admin", surfers.deleteAll);

    app.use("/", router);
};
