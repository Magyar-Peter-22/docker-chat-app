import LogoutIcon from '@mui/icons-material/Logout';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../auth/instance';
import { LogoutContext } from '../../Connected';

export default () => {
    const { t } = useTranslation("main");
    const logout = useContext(LogoutContext);

    const handleLogout = useCallback(async () => {
        await instance.get("/auth/logout");
        logout();
    }, []);

    return (
        <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t("logout")} />
        </ListItemButton>
    )
}