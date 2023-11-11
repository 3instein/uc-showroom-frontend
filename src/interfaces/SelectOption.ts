/**
 * Represents an option for a select dropdown.
 *
 * @interface SelectOption
 */
export interface SelectOption {
    /**
     * The display label for the option.
     * @type {string}
     */
    label: string;

    /**
     * The corresponding value for the option.
     * @type {string}
     */
    value: string;
}