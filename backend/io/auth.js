import { getUser } from "./handleUser.js";

//try to get the user of this cookie or create a new one
async function Auth(socket, next) {
    try {
        //get the user of the session
        const user = getUser(socket);

        //if no user was found, exit
        if (!user)
            throw new Error("unauthorized");

        //send user to client
        socket.emit("auth", user);
        next();
    }
    catch (err) {
        return next(err);
    }
}

export default Auth;