import { TextField } from "@mui/material";
import React from "react";

function SerialNumberEdit({ value, onChange }) {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="relative">
      <h1 className="font-semibold text-sm  absolute -top-6 left-1">
      หมายเลขเครื่อง
      </h1>
      <TextField
        id="standard-basic"
        variant="outlined"
        size="small"
        value={value}
        onChange={handleChange}
        name="serial_number"
      />
    </div>
  );
}

export default SerialNumberEdit;
