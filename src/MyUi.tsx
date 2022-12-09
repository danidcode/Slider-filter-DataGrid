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
  const [value1, setValue1] = React.useState<number[]>([20, 37]);
  const { item, applyValue, focusElementRef, minValue, maxValue } = props;

  const minDistance = 10;
  const ratingRef: React.Ref<any> = React.useRef(null);

  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current
        .querySelector(`input[value="${Number(item.value) || ''}"]`)
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
        ref={ratingRef}
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



export default function MyUi() {

  const [maxValue, setMaxValue] = React.useState<number>(0);
  const [minValue, setMinValue] = React.useState<number>(0);
  const ratingOnlyOperators: GridFilterOperator[] = [
    {
      label: 'Above',
      value: 'above',
      getApplyFilterFn: (filterItem: GridFilterItem) => {

        if (
          !filterItem.columnField ||
          !filterItem.value ||
          !filterItem.operatorValue
        ) {
          return null;
        }

        return (params): boolean => {

          return Number(params.value) >= Number(filterItem.value[0]) && Number(params.value) <= Number(filterItem.value[1]);
        };
      },
      InputComponent: RatingInputValue,
      InputComponentProps: { type: 'number', 'minValue': minValue, 'maxValue': maxValue },
    },
  ];

  const fakeColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90
    }
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 }
  ];
  let ages: number[] = []


  rows.forEach(row => {

    if (row.age != undefined) ages.push(row.age);

  });
  const max = Math.max(...ages)
  const min = Math.min(...ages)

  React.useEffect(() => {


    setMinValue(min);
    setMaxValue(max);
  }, [rows])

  const columns = React.useMemo(
    () =>
      fakeColumns.map((col) =>
        col.field === 'age'
          ? {
            ...col,
            filterOperators: ratingOnlyOperators,
          }
          : col,
      ),
    [fakeColumns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  id: 1,
                  columnField: 'age',
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