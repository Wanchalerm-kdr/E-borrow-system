import { TextField } from "@mui/material";
import React from "react";

function CurrentBatteryCapacityEdit({ value, onChange }) {
  const handleChange = (e) => {
    onChange(e);
  };
  return (
    <div className="relative">
      <h1 className="font-semibold text-sm  absolute -top-6 left-1">
      ความจุแบตปัจุบัน
      </h1>
      <TextField
        id="standard-basic"
        variant="outlined"
        size="small"
        value={value}
        name="currentbatterycapacity"
        onChange={handleChange}
      />
    </div>
  );
}

export default CurrentBatteryCapacityEdit;
