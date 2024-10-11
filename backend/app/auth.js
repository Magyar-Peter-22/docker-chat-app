import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { Validator } from 'node-input-validator';
import { createUser, findUser, findUserRaw, userProjection } from "../mongodb/userQueries.js";
import { checkV } from "../validator.js";
import { statusError } from "./expressErrorHandler.js";
import { project } from "../mongodb/queryUtilities.js";

const bcryptSalt = 10;

const router = express.Router();

router.post("/register", async (req, res) => {
    //validate data
    const v = new Validator(
        req.body,
        {
            username: 'required|username',
            password: "required|password",
        },
    );
    await checkV(v);
    const { username, password } = req.body;

    //check if the username is available
    const existingUser = await findUser({ username })
    if (existingUser)
        statusError(400, "taken username");

    //create new user object
    const user = {
        username,
        password_hash: bcrypt.hashSync(password, bcryptSalt),
    }

    //save new user to db
    const created = await createUser(user);

    //save the user to the session
    req.session.user = created;

    res.sendStatus(200);
});

router.post("/login", async (req, res) => {
    //validate data
    const v = new Validator(
        req.body,
        {
            username: 'required|username',
            password: "required|password",
        },
    );
    await checkV(v);
    const { username, password } = req.body;

    //check if an user with this username exists
    const foundUser = await findUserRaw({ username });
    if (!foundUser)
        statusError(400, "wrong username");

    //check password
    const match = await bcrypt.compare(password, foundUser.password_hash);
    if (!match)
        statusError(400, "wrong password");

    //save the user to the session
    //remove the secrets
    req.session.user = project(userProjection,foundUser);

    res.sendStatus(200);
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

export default router;