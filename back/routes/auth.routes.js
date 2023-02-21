const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const db = require("../models");
const User = db.user;
const crypto = require("crypto");
const MongoStore = require("connect-mongo");

router.use(
    session({
        secret: "keyboard cat", //TODO changer en process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/LyonE-surf",
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);

router.use(passport.initialize());
router.use(passport.session());

async function createUser(nickname, password) {
    const salt = crypto.randomBytes(16);
    const hashedPassword = await new Promise((resolve, reject) =>
        crypto.pbkdf2(
            password,
            salt,
            310000,
            32,
            "sha256",
            function (err, hashedPassword) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hashedPassword);
                }
            }
        )
    );
    // Create a user
    const user = new User({
        nickname,
        password: hashedPassword.toString("hex"),
        salt: salt.toString("hex"),
    });
    // Save in database
    await user.save();

    return user;
}

function checkCredentials(user, nickname, password) {
    return new Promise((resolve) => {
        crypto.pbkdf2(
            password,
            Buffer.from(user.salt, "hex"),
            310000,
            32,
            "sha256",
            function (err, derivedKey) {
                if (err) {
                    throw err;
                }
                const usersPassword = Buffer.from(user.password, "hex");
                resolve(crypto.timingSafeEqual(usersPassword, derivedKey));
            }
        );
    });
}

// TODO: commande uniquement accessible pour un admin connecté
router.post("/register", function (req, res) {
    console.log("in user creation");

    createUser(req.body.nickname, req.body.password)
        .then(() => {
            res.status(200).send();
            console.log("User created");
        })
        .catch((err) => {
            console.log("User creation didn't worked");
            res.status(500).send({
                message:
                    err.message ||
                    "Une erreur est survenue lors de la création du compte.",
            });
        });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
    console.log(`user "${req.user.nickname}" logged in !`);
    if (req.user) res.status(200).send();
    else res.status(401).send();
});

router.post("/isLogged", (req, res) => {
    console.log(req.user);
    if (req.user) {
        console.log(`user "${req.user.nickname}" is logged !`);
        res.status(200).send();
        return true;
    } else {
        res.status(401).send();
        console.log(`Not logged ! User: ${req.user}`);
        return false;
    }
});

passport.use(
    new LocalStrategy({ usernameField: "nickname" }, async function verify(
        nickname,
        password,
        cb
    ) {
        console.log("in local strategy");
        const user = await User.findOne({ nickname: nickname });
        if (!user) {
            return cb(null, false, {
                message: "Incorrect username or password.",
            });
        }
        const isOK = await checkCredentials(user, nickname, password);
        if (isOK) {
            return cb(null, user);
        } else {
            return cb(null, false, {
                message: "Incorrect username or password.",
            });
        }
    })
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, nickname: user.nickname });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        User.findById(user.id, function (err, user) {
            cb(err, user);
        });
    });
});

module.exports = router;
