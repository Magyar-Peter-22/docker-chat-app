import CleanInput from "../topMenu/CleanInput"

export default ({fieldProps,controlProps}) => {
    return (
        <CleanInput
            fieldProps={{
                autoComplete: 'username',
                inputProps: { maxLength: 30 },
                variant: "standard",
                ...fieldProps
            }}
            controlProps={controlProps}
        />
    )
}