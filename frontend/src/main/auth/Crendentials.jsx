import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SocketContext } from '../Connected';
import Title from '../welcome/Title';
import instance from './instance';
import PasswordField from './PasswordField';
import UsernameInput from './UsernameInput';

export default () => {
    const { t } = useTranslation(["auth", "form"]);
    const socket = useContext(SocketContext);

    const { register, handleSubmit, isValid, control, formState: { isSubmitting, errors } } = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    //disable buttons
    const canSubmit = !isSubmitting && !isValid;

    //when the validation is failed on submit, translate the error and store it in a state
    const firstError = Object.entries(errors)[0];
    const error = useMemo(() => {
        if (!firstError)
            return;
        const [field, props] = firstError;
        return (t(props.type, { field: t(field), ns: "form" }));
    }, [firstError]);
    console.log(firstError);

    //after successful login or register, attempt to reconnect
    const onLogin = useCallback(
        async (data) => {
            await instance.post("/auth/login", data);
            socket.connect();
        },
        []
    );

    const onRegister = useCallback(
        async (form) => {
            await instance.post("/auth/register", form);
            socket.connect();
        },
        []
    );

    return (
        <Stack sx={{ width: "100%", height: "100vh", justifyContent: "center", alignItems: "center" }} bgcolor="grey.A200">
            <ResponsiveContainer>
                <Box component="main" sx={{ width: "100%" }}>
                    <Stack spacing={2} sx={{ p: 5 }}>
                        <Typography fontSize="2em" fontWeight={"bold"}>
                            <Title />
                        </Typography>

                        <UsernameInput
                            fieldProps={{
                                fullWidth: true,
                                label: t("username"),
                                autoFocus: true,
                            }}
                            controlProps={{
                                name: "username",
                                control: control,
                                rules: { required: true }
                            }}
                        />

                        <PasswordField
                            label={t("password")}
                            fullWidth
                            variant="standard"
                            {...register("password", { required: true, minLength: 8 })}
                        />

                        {error &&
                            <Chip
                                color="error"
                                size="small"
                                icon={<ErrorIcon />}
                                label={error}
                                sx={{
                                    height: 'auto',
                                    '& .MuiChip-label': {
                                        display: 'block',
                                        whiteSpace: 'normal',
                                    },
                                }}
                            />
                        }

                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <Button
                                disabled={!canSubmit}
                                onClick={handleSubmit(onRegister)}
                            >
                                {t("register")}
                            </Button>
                            <Button
                                variant="contained"
                                disabled={!canSubmit}
                                onClick={handleSubmit(onLogin)}
                            >
                                {t("login")}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </ResponsiveContainer>
        </Stack >
    )
}

function ResponsiveContainer({ children }) {
    const theme = useTheme();
    const isFull = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        isFull ? (
            <Box bgcolor="#FFF" sx={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", display: "flex" }}>
                {children}
            </Box>
        ) : (
            <Box sx={{ px: 5, boxSizing: "border-box", width: "100%", maxWidth: 600 }}>
                <Paper >
                    {children}
                </Paper>
            </Box>
        )
    )
}