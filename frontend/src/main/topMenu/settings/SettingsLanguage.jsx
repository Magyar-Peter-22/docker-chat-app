import TranslateIcon from '@mui/icons-material/Translate';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { lazy,useContext } from "react";
import { useTranslation } from 'react-i18next';
import { ModalContext } from '../../Modals';
const ChangeLanguage = lazy(() => import('../ChangeLanguage'));

export default () => {
    const { Show } = useContext(ModalContext);
    const { t } = useTranslation("main");
    return (
        <ListItemButton onClick={() => { Show(<ChangeLanguage />) }}>
            <ListItemIcon>
                <TranslateIcon />
            </ListItemIcon>
            <ListItemText primary={t("language")} />
        </ListItemButton>
    )
}