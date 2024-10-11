import { AnimatePresence, motion } from "framer-motion";
import { enqueueSnackbar } from 'notistack';
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from "react-router-dom";
import { io } from 'socket.io-client';
import Loading from "../Loading";
import Crendentials from "./auth/Crendentials";
import constants from "./constants";
import Main from "./Main";
import { ModalProvider } from './Modals';
import { RoomProvider } from "./sideMenu/rooms/RoomContext";
import Transition from "./Transition";

//it needs a default value to prevent errors in developer mode
const UserContext = createContext({ user: { _id: 0, username: "name" } });
const SocketContext = createContext();
const LogoutContext = createContext();

export default () => {
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState();
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState();
    const [needsLogin, setNeedsLogin] = useState(false);
    const socket = useMemo(() => io({ autoConnect: false }), []);

    //connect to websocket and get the user
    useEffect(() => {
        try {
            socket.connect()

            function onConnect() {
                setIsConnected(true);
                //hide the auth scren after successful reconnect
                setNeedsLogin(false);
            }

            function onDisconnect() {
                setIsConnected(false);
            }

            function onError(err) {
                console.error(err);

                //go to the login screen when an error happens
                setNeedsLogin(true);

                //this error response appears when the user isnt logged in
                //it should not be displayed as an error
                if (err.message !== "unauthorized")
                    enqueueSnackbar(err.toString(), { variant: "error" });
            }

            function onUser(data) {
                setUser(data);
            }

            function onRooms(data) {
                setRooms(data);
            }

            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);
            socket.on('connect_error', onError);
            socket.once('auth', onUser);
            socket.once('load rooms', onRooms);

            return () => {
                socket.off('connect', onConnect);
                socket.off('disconnect', onDisconnect);
                socket.off('connect_error', onError)
            };
        }
        catch (err) {
            console.error(err);
            setError(err.message);
        }
    }, []);

    const logout = useCallback(() => {
        socket.disconnect();
        setNeedsLogin(true);
    }, []);

    //show error page when failed to connect
    if (error)
        return error;

    //if all good, show the page
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <SocketContext.Provider value={socket}>
                <LogoutContext.Provider value={logout}>
                    <AnimatePresence>
                        {
                            needsLogin ? (
                                //when failed to login in either the fetch or the connection, show the login form
                                <Transition key="crendentials" >
                                    <Crendentials />
                                </Transition>
                            ) : !isConnected || !rooms || !user ? (
                                //when authenticating or connecting show the loading screen
                                <FadeoutLoading key="loading" text="connecting" />
                            ) : (
                                //when everything is done, show the main page
                                <BrowserRouter key="loaded">
                                    <RoomProvider initialRooms={rooms}>
                                        <ModalProvider>
                                            <Main />
                                        </ModalProvider>
                                    </RoomProvider>
                                </BrowserRouter >
                            )
                        }
                    </AnimatePresence >
                </LogoutContext.Provider>
            </SocketContext.Provider>
        </UserContext.Provider >
    );
}
export { SocketContext, UserContext };

function FadeoutLoading({ text }) {
    const { t } = useTranslation("main");
    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: constants.animation }}
            style={{
                position: "fixed",
                zIndex: 10,
                width: "100%"
            }}
        >
            <Loading text={t(text)} />
        </motion.div>
    );
}
