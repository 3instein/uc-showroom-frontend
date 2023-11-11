import { FC, ChangeEvent } from 'react';
import { nominalFormat } from '../../functions/general';
/**
 * Props for the VehicleForm component.
 *
 * @interface VehicleFormProps
 */
interface VehicleFormProps {
    /**
     * The formik instance to handle form state.
     * @type {any}
     */
    formik: any;

    /**
     * The type of the vehicle, e.g., 'Mobil', 'Truck', or 'Motor'.
     * @type {'Mobil' | 'Truck' | 'Motor'}
     */
    type: 'Mobil' | 'Truck' | 'Motor';
}

/**
 * A form component for capturing vehicle details such as model, year, seats, manufacturer, and price.
 *
 * @component
 * @param {VehicleFormProps} props - The props for the VehicleForm component.
 * @returns {JSX.Element}
 */

const VehicleForm: FC<VehicleFormProps> = ({ formik, type }) => {
    /**
     * Handles the change event for the price input field and formats the value.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleNominalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedValue = nominalFormat(e.target.value);
        formik.setFieldValue('price', formattedValue);
    };
    return (
        <>
            {/* Model */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text font-bold">Model</span>
                </label>
                <input
                    type="text"
                    placeholder={`Model ${type}`}
                    className={`input input-bordered w-full max-w-xs ${formik.touched.model && formik.errors.model ? 'input-error' : ''}`}
                    {...formik.getFieldProps('model')}
                />
                {formik.touched.model && formik.errors.model && (
                    <label className="label pt-1">
                        <span className="label-text text-xs text-red-600">{formik.errors.model}</span>
                    </label>
                )}
            </div>
            {/* Year */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text font-bold">Tahun</span>
                </label>
                <input
                    type="text"
                    placeholder={`Tahun ${type}`}
                    className={`input input-bordered w-full max-w-xs ${formik.touched.year && formik.errors.year ? 'input-error' : ''}`}
                    {...formik.getFieldProps('year')}
                    onInput={(event) => {
                        // Replace non-digits
                        event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                    maxLength={4}
                />
                {formik.touched.year && formik.errors.year && (
                    <label className="label pt-1">
                        <span className="label-text text-xs text-red-600">{formik.errors.year}</span>
                    </label>
                )}
            </div>
            {/* Seats */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text font-bold">Jumlah Penumpang</span>
                </label>
                <input
                    type="text"
                    placeholder="Jumlah Penumpang"
                    className={`input input-bordered w-full max-w-xs ${formik.touched.seats && formik.errors.seats ? 'input-error' : ''}`}
                    {...formik.getFieldProps('seats')}
                    onInput={(event) => {
                        // Replace non-digits
                        event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                    maxLength={2}
                />
                {formik.touched.seats && formik.errors.seats && (
                    <label className="label pt-1">
                        <span className="label-text text-xs text-red-600">{formik.errors.seats}</span>
                    </label>
                )}
            </div>
            {/* Manufacturer */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text font-bold">Manufaktur</span>
                </label>
                <input
                    type="text"
                    placeholder="Nama Manufaktur"
                    className={`input input-bordered w-full max-w-xs ${formik.touched.manufacturer && formik.errors.manufacturer ? 'input-error' : ''}`}
                    {...formik.getFieldProps('manufacturer')}
                />
                {formik.touched.manufacturer && formik.errors.manufacturer && (
                    <label className="label pt-1">
                        <span className="label-text text-xs text-red-600">{formik.errors.manufacturer}</span>
                    </label>
                )}
            </div>
            {/* Price */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text font-bold">Harga</span>
                </label>
                <input
                    type="text"
                    placeholder="100.000.000"
                    className={`input input-bordered w-full max-w-xs ${formik.touched.price && formik.errors.price ? 'input-error' : ''}`}
                    value={formik.values.price}
                    onChange={handleNominalChange}
                    onBlur={formik.handleBlur}
                    onInput={(event) => {
                        // Replace non-digits
                        event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                    maxLength={12}
                />
                {formik.touched.price && formik.errors.price && (
                    <label className="label pt-1">
                        <span className="label-text text-xs text-red-600">{formik.errors.price}</span>
                    </label>
                )}
            </div>
        </>
    );
}

export { VehicleForm }