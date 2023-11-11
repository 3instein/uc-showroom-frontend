export const customNumberFormat = (valueString: number) => {
    const parts = valueString.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
}

export const nominalFormat = (valueString: string) => {
    const onlyNumbers = valueString.replace(/\D+/g, '');  // remove non-digits
    const parts = onlyNumbers.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
}