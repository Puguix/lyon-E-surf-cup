// surfer controller

const db = require("../models");
const Surfer = db.surfer;

// Create and Save a new surfer
exports.create = (req, res) => {
    // Valide request
    if (!req.body.firstName && !req.body.lastName) {
        res.status(400).send({
            message: "Il faut a moins un nom et un prénom!",
        });
        return;
    }
    // Create a surfer
    var surfer = new Surfer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        age: req.body.age,
        isLive: req.body.isLive,
        liveLink: req.body.liveLink,
        avatar: req.body.avatar,
        description: req.body.description,
    });
    // Save in database
    surfer
        .save(surfer)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Une erreur est survenue lors de la création du surfer.",
            });
        });
    console.log("surfer created");
};

// Retrieve all surfers from the database eventually with params
exports.findAll = (req, res) => {
    const search = req.query.search;
    var condition = search
        ? {
              $or: [
                  { lastName: { $regex: new RegExp(search) } },
                  { firstName: { $regex: new RegExp(search) } },
              ],
              $options: "i",
          }
        : {};
    Surfer.find(condition)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Une erreur est survenue en cherchant tous les surfers.",
            });
        });
};

// Find a single surfer with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Surfer.findById(id)
        .then((data) => {
            if (!data)
                res.status(400).send({
                    message: "Pas de données pour l'identifiant:" + id,
                });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "une erreur est survenue.",
            });
        });
};

// Update a surfer by the id in the request
exports.update = (req, res) => {
    if (!req.body.lastName && !req.body.firstName) {
        return res
            .status(400)
            .send({ message: "Il faut au moins un nom et un prénom !" });
    }
    const id = req.params.id;
    Surfer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Impossible de mettre à jour le surfer avec l'identifiant: ${id}. Peut être que le surfer n'a pas pu être trouvé`,
                });
            } else res.send({ message: "Le surfer a bien été mis à jour." });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    "Une erreur est survenue en mettant à jour le surfer d'identifiant:" +
                    id,
            });
        });
    console.log("surfer updated");
};

// Delete a surfer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Surfer.findByIdAndRemove(id)
        .then((data) => {
            if (!data) {
                res.status(400).send({ message: "Surfer inexistant" });
            } else res.send({ message: "Surfer supprimé" });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    "Une erreur est survenue en supprimant le surfer d'identifiant" +
                    id,
            });
        });
    console.log("surfer deleted");
};

// Delete all surfers from the database.
exports.deleteAll = (req, res) => {
    Surfer.deleteMany({})
        .then((data) => {
            res.send({
                message: `${data.deletedCount} surfers ont été supprimés!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Une erreur est survenue en supprimant tous les surfers.",
            });
        });
};

// Find all live surfers
exports.findAllLive = (req, res) => {
    Surfer.find({ isLive: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Une erreur est survenue en cherchant les surfers en live.",
            });
        });
};
