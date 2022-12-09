
import { Slider, SliderProps } from '@mui/material';
import Box from '@mui/material/Box';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import * as React from 'react';

export default function RangeInputValue(props: GridFilterInputValueProps) {
    const { item, applyValue, focusElementRef, minValue, maxValue, value1, setValue1 } = props;

    const minDistance = 10;
    const rangeRef: React.Ref<any> = React.useRef(null);

    React.useImperativeHandle(focusElementRef, () => ({
        focus: () => {
            rangeRef.current
                .focus();
        },
    }));


    const handleFilterChange: SliderProps['onChange'] = (event: Event, newValue: number | number[], activeThumb: number) => {

        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 100 - minDistance);
                setValue1([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setValue1([clamped - minDistance, clamped]);
            }
        } else {
            setValue1(newValue as number[]);
        }
        applyValue({ ...item, value: newValue });

    };

    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 68,
                pl: '20px',
            }}
        >
            <Slider
                size="small"
                ref={rangeRef}
                placeholder="Filter value"
                value={value1}
                min={minValue}
                max={maxValue}
                onChange={handleFilterChange}
            />
            <Box >
                {value1[0]} - {value1[1]}
            </Box>

        </Box>
    );
}