import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "Patient_name", headerName: "Patient Name", width: 150 },
  { field: "department", headerName: "Department", width: 150 },
  { field: "age", headerName: "Age", type: "number", width: 100 },
];

const rows = [
  {
    id: 1,
    name: "Dr. Smith",
    Patient_name: "John Doe",
    department: "Cardiology",
    age: 45,
  },
  {
    id: 2,
    name: "Dr. Brown",
    Patient_name: "Jane Roe",
    department: "Neurology",
    age: 52,
  },
  {
    id: 3,
    name: "Dr. Taylor",
    Patient_name: "Alice Johnson",
    department: "Oncology",
    age: 39,
  },
  {
    id: 4,
    name: "Dr. Wilson",
    Patient_name: "Bob Lee",
    department: "Orthopedics",
    age: 50,
  },
  {
    id: 5,
    name: "Dr. Lee",
    Patient_name: "Charlie Kim",
    department: "Pediatrics",
    age: 41,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
