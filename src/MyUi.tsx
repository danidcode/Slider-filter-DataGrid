import * as React from 'react';
import Box from '@mui/material/Box';
import Rating, { RatingProps } from '@mui/material/Rating';
import {
  GridFilterInputValueProps,
  DataGrid,
  GridFilterItem,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { Slider, SliderProps } from '@mui/material';

function RatingInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;
  console.log(Number(item.value));

  const ratingRef: React.Ref<any> = React.useRef(null);
  // React.useImperativeHandle(focusElementRef, () => ({
  //   focus: () => {
  //     ratingRef.current
  //       .querySelector(`input[value="${Number(item.value) || ''}"]`)
  //       .focus();
  //   },
  // }));


  const handleFilterChange: SliderProps['onChange'] = (event: Event, newValue: number | number[]) => {
    applyValue({ ...item, value: newValue });

  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <Slider
        size="small"
        placeholder="Filter value"
        valueLabelDisplay="auto"
        // value={Number(item.value)}
        defaultValue={70}
        onChange={handleFilterChange}
      />
      {/* <Rating
        // name="custom-rating-filter-operator"
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        ref={ratingRef}
      /> */}
    </Box>
  );
}

const ratingOnlyOperators: GridFilterOperator[] = [
  {
    label: 'Above',
    value: 'above',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      console.log(filterItem);

      if (
        !filterItem.columnField ||
        !filterItem.value ||
        !filterItem.operatorValue
      ) {
        return null;
      }

      return (params): boolean => {
        return Number(params.value) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: 'number' },
  },
];

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function MyUi() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) =>
        col.field === 'rating'
          ? {
            ...col,
            filterOperators: ratingOnlyOperators,
          }
          : col,
      ),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [
                {
                  id: 1,
                  columnField: 'rating',
                  value: '3',
                  operatorValue: 'above',
                },
              ],
            },
          },
        }}
      />
    </div>
  );
}