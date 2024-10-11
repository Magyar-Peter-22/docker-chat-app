import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Title from '../welcome/Title';
import instance from './instance';
import { useContext } from 'react';
import { SocketContext } from '../Connected';

export default () => {
    const { t } = useTranslation("main");
    const socket = useContext(SocketContext);

    const { register, handleSubmit, isValid, formState: { isSubmitting } } = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    //disable buttons
    const canSubmit = !isSubmitting && !isValid;

    //after successful login or register, attempt to reconnect
    const onLogin = handleSubmit(async (data) => {
        await instance.post("/auth/login", data);
        socket.connect();
    });

    const onRegister = handleSubmit(async (form) => {
        await instance.post("/auth/register", form);
        socket.connect();
    });

    return (
        <Stack sx={{ width: "100%", height: "100vh", justifyContent: "center", alignItems: "center" }} bgcolor="grey.A200">
            <Paper component={"main"}>
                <Stack spacing={2} sx={{ p: 5 }}>
                    <Typography fontSize="2em" fontWeight={"bold"}>
                        <Title />
                    </Typography>

                    <TextField
                        slotProps={{
                            input: {
                                readOnly: false,
                                maxLength:30
                            },
                        }}
                        placeholder={t("username")}
                        fullWidth
                        autoComplete='username'
                        multiline
                        variant="standard"
                        autoFocus={true}
                        {...register("username")}
                    />

                    <TextField
                        slotProps={{
                            input: {
                                readOnly: false,
                                maxLength:30,
                                minLength:8
                            },
                        }}
                        placeholder={t("password")}
                        fullWidth
                        autoComplete='password'
                        multiline
                        variant="standard"
                        {...register("password")}
                    />

                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Button disabled={!canSubmit} onClick={onRegister}>{t("register")}</Button>
                        <Button variant="contained" disabled={!canSubmit} onClick={onLogin}>{t("login")}</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack >
    )
}