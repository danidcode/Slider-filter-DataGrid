import * as React from 'react';
import {
  DataGrid,
  GridFilterItem,
  GridFilterOperator,
} from '@mui/x-data-grid';
import RangeInputValue from './RangeInputValue';

export default function Table() {

  const [maxValue, setMaxValue] = React.useState<number>(0);
  const [minValue, setMinValue] = React.useState<number>(0);
  const [sliderValue, setSliderValue] = React.useState<number[]>([minValue || 0, maxValue || 0]);
  const rangeOnlyOperators: GridFilterOperator[] = [
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
      InputComponent: RangeInputValue,
      InputComponentProps: { type: 'number', 'minValue': minValue, 'maxValue': maxValue, 'sliderValue': sliderValue, 'setSliderValue': setSliderValue },
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
    setSliderValue([min, max])
  }, [])

  const columns = React.useMemo(
    () =>
      fakeColumns.map((col) =>
        col.field === 'age'
          ? {
            ...col,
            filterOperators: rangeOnlyOperators,
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