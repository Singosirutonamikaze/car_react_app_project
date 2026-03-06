const FormName = (name: string, surname: string) => {
    if (!name && !surname) {
        return "";
    }
    return `${name} ${surname}`.trim();
};

export default FormName;