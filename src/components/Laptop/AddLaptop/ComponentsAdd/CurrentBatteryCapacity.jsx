import { TextField } from "@mui/material";
import React from "react";

function CurrentBatteryCapacity() {
  return (
    <div className="relative">
      <h1 className="font-semibold text-sm  absolute -top-6 left-1">
        Current Battery Capacity
      </h1>
      <TextField id="standard-basic" variant="outlined" sx={{ width: 260 }} />
    </div>
  );
}

export default CurrentBatteryCapacity;
