import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { Suspense, useCallback, useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../Connected";
import SettingsLanguage from './settings/SettingsLanguage';
import SettingsLogout from './settings/SettingsLogout';
import SettingsUsername from './settings/SettingsUsername';
import User from "/src/main/User";

export default () => {
    const { user } = useContext(UserContext);
    const { t } = useTranslation("main");

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <>
            <Tooltip title={t("settings")}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-label="open settings"
                    aria-controls={open ? 'settings' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <User username={user.username} />
                </IconButton>
            </Tooltip>

            <Suspense>
                <Popover
                    anchorEl={anchorEl}
                    id="settings"
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <List
                        subheader={
                            <ListSubheader
                                component="div"
                                onClick={(e) => { e.preventDefault() }}
                            >
                                {t("welcome", { username: user.username })}
                            </ListSubheader>
                        }>

                        <Divider />

                        <div onClick={handleClose}>
                            <SettingsUsername />
                            <SettingsLanguage />
                            <SettingsLogout />
                        </div>
                    </List>
                </Popover>
            </Suspense>
        </>
    );
}
