/**
 * Formats a numeric string by adding a dot as a thousands separator.
 * For example, customNumberFormat(1234567) returns '1.234.567'.
 *
 * @param {number} valueString - The numeric value as a string.
 * @returns {string} - The formatted numeric string.
 */
export const customNumberFormat = (valueString: number): string => {
    // Split the string into parts before and after the decimal point
    const parts = valueString.toString().split('.');

    // Add a dot as a thousands separator to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Join the parts back together
    return parts.join('.');
};

/**
 * Formats a nominal string by adding a dot as a thousands separator.
 * This function is useful for formatting nominal values, where the input may contain non-digit characters.
 * For example, nominalFormat('$1,234,567.89') returns '1.234.567.89'.
 *
 * @param {string} valueString - The nominal value as a string.
 * @returns {string} - The formatted nominal string.
 */
export const nominalFormat = (valueString: string): string => {
    // Remove non-digits from the input string
    const onlyNumbers = valueString.replace(/\D+/g, '');

    // Split the string into parts before and after the decimal point
    const parts = onlyNumbers.split('.');

    // Add a dot as a thousands separator to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Join the parts back together
    return parts.join('.');
};
