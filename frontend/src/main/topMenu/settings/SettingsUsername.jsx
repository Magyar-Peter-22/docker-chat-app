import EditIcon from '@mui/icons-material/Edit';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { lazy,useContext } from "react";
import { useTranslation } from 'react-i18next';
import { ModalContext } from '../../Modals';
const ChangeUsername = lazy(() => import('../ChangeUsername'));

export default () => {
    const { Show } = useContext(ModalContext);
    const { t } = useTranslation("main");
    return (
        <ListItemButton onClick={() => { Show(<ChangeUsername />) }}>
            <ListItemIcon>
                <EditIcon />
            </ListItemIcon>
            <ListItemText primary={t("change username")} />
        </ListItemButton>
    )
}