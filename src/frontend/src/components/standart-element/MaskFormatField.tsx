import React from 'react';
import {NumberFormatValues, NumericFormat, NumericFormatProps} from "react-number-format";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const UnsignedIntegerNumericFormat = React.forwardRef<NumericFormatProps, CustomProps>(
    function UnsignedIntegerNumericFormat(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                allowNegative={false}
                allowLeadingZeros={false}
                decimalScale={0}
                valueIsNumericString
            />
        );
    },
);

export const UnsignedIntegerNumericFormatWithLimit = React.forwardRef<NumericFormatProps, CustomProps>(
    function UnsignedIntegerNumericFormat(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}

                allowNegative={false}
                allowLeadingZeros={false}
                decimalScale={0}
                valueIsNumericString
                isAllowed={(values:NumberFormatValues) => {
                    const {floatValue} = values;
                    return floatValue === undefined || floatValue >= 0 &&  floatValue <= 1440;
                }}

            />
        );
    },
);

export const MoneyNumericFormat = React.forwardRef<NumericFormatProps, CustomProps>(
    function MoneyNumericFormat(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                decimalScale={2}
                thousandSeparator={' '}
                decimalSeparator={','}
                allowNegative={false}
                allowLeadingZeros={false}
                valueIsNumericString
            />
        );
    },
);