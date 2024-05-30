import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

export default function BorrowedList({
  markedData,
  getMarkedData,
  id,
  getSingleData,
}) {
  const [newItems, setNewItems] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [inputs, setInputs] = useState([
    // {
    //   device_name: "",
    //   serial_number: "",
    //   return_status: false,
    //   borrow_id: Number(id),
    // },
  ]);
  const [returnedDate, setReturnedDate] = useState("");
  const [editId, setEditID] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [returnStatus, setReturnStatus] = useState(null);

  useEffect(() => {
    const getCurrentDate = () => {
      const date = new Date();
      const yy = String(date.getFullYear()).slice(0); // Last two digits of year
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yy}-${mm}-${dd}`;
    };
    setReturnedDate(getCurrentDate());
    setCurrentDate(getCurrentDate());
  }, []);

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        device_name: "",
        serial_number: "",
        return_status: false,
        borrow_id: Number(id),
      },
    ]);
  };

  const handleRemoveInput = (index) => {
    const updatedInputs = inputs.filter((_, idx) => idx !== index);
    setInputs(updatedInputs);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    console.log("", value);
    let updatedInputs;
    if (name === "device_name" && value === "อื่นๆ") {
      // ถ้าเลือก "อื่นๆ" ให้สร้างฟิลด์ใหม่ที่ให้กรอกข้อความ
      updatedInputs = inputs.map((input, idx) =>
        idx === index ? { ...input, [name]: value } : input
      );
    } else {
      updatedInputs = inputs.map((input, idx) =>
        idx === index ? { ...input, [name]: value } : input
      );
    }
    setInputs(updatedInputs);
  };

  const validatedInputs = inputs.map((input) => {
    return {
      ...input,
      serial_number:
        input.serial_number.trim() === "" ? "???" : input.serial_number,
      device_name: input.device_name.trim() === "" ? "???" : input.device_name,
    };
  });
  console.log("validatedInputs", validatedInputs);

  // เพิ่มช่องใหม่ 1 ช่อง
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.145:8080/api/borrowdevicearrays",
        validatedInputs
      );
      console.log(response.data);
      setNewItems([...newItems, ...inputs]);
      // Clear inputs after submitting
      setInputs([
        {
          device_name: "",
          serial_number: "",
          return_status: false,
          borrow_id: id,
        },
      ]);
      setInputs([]);
      getMarkedData();
      getSingleData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // เพิ่มช่องใหม่ 4 ช่อง default
  const getDefaultMarkedData = async () => {
    const defaultData = [
      {
        borrow_id: id,
        device_name: "Laptop",
        serial_number: "",
        return_status: 0,
        return_date: "",
      },
      {
        borrow_id: id,
        device_name: "Adaptor",
        serial_number: "",
        return_status: 0,
        return_date: "",
      },
      {
        borrow_id: id,
        device_name: "Mouse",
        serial_number: "",
        return_status: 0,
        return_date: "",
      },
      {
        borrow_id: id,
        device_name: "Bag",
        serial_number: "",
        return_status: 0,
        return_date: "",
      },
    ];

    try {
      const response = await axios.post(
        "http://192.168.0.145:8080/api/borrowdevicearrays",
        defaultData
      );
      console.log("ddefautl", response.data.data);
      setNewItems([...newItems, ...defaultData]);
      getMarkedData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const returnedSubmit = async (e, item) => {
    const { device_name, serial_number, return_date, id } = item;

    let submissionData = {};
    // กรณีต้องการเปลี่ยนเป็นคืนแล้ว
    if (item.return_status === 0) {
      submissionData = {
        device_name,
        serial_number,
        return_status: 1,
        return_date: currentDate,
        id,
      };
    } else if (item.return_status === 1) {
      // กรณีต้องการเปลี่ยนเป็นยังไม่คืน
      submissionData = {
        device_name,
        serial_number,
        return_status: 0,
        return_date: "",
        id,
      };
    }

    console.log("submissionData", submissionData);

    try {
      Swal.fire({
        title: `ยืนยันการคืนของ (${device_name}, SN-${serial_number})
          ใช่หรือไม่ ?`,
        icon: "question",
        showCancelButton: true,
      })
        .then(async (res) => {
          if (res.isConfirmed) {
            const response = await axios.put(
              `http://192.168.0.145:8080/api/borrowdevices/${id}`,
              submissionData
            );
            console.log(response.data);
            await getMarkedData();
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Unable to delete",
            icon: "error",
          });
        });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const editBorrowedDevices = async (e, item) => {
    const { id, device_name, return_status, serial_number } = item;
    // Prepare the submit data
    const submitData = {
      id: id,
      serial_number: serialNumber || serial_number,
      device_name: deviceName || device_name,
      return_status: return_status,
      return_date: returnedDate,
    };

    console.log("submitData", submitData);

    try {
      const response = await axios.put(
        `http://192.168.0.145:8080/api/borrowdevicearrays`,
        [submitData]
      );
      console.log(response.data);
      await getSingleData();
      await getMarkedData();

      setIsEditing(false);
      // Clear inputs after submitting
      setInputs([]);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEditClick = async (e, itemId, serialNumber) => {
    e.preventDefault();
    console.log("itemId:", itemId); // Log ค่า itemId
    setIsEditing((prevIsEditing) => !prevIsEditing);
    setEditID(itemId);
  };

  // จัดการ datePickter
  const handleChange = (value) => {
    const year = value.$y;
    const month = String(value.$M + 1).padStart(2, "0");
    const day = String(value.$D).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setReturnedDate(formattedDate);
  };

  console.log("markedData", markedData);
  return (
    <div>
      {markedData.length === 0 && (
        <Button onClick={getDefaultMarkedData}>Add</Button>
      )}
      <h1 className="font-bold">รายการที่ยืม</h1>
      {markedData.map((item, idx) => {
        return (
          <div key={idx} className="flex items-center space-x-8">
            <div>
              {editId === item.id && isEditing ? (
                <>
                  <span>1.</span>
                  <TextField
                    id="standard-basic"
                    variant="outlined"
                    size="small"
                    name="device_name"
                    // value={serialNumber}
                    defaultValue={item.device_name}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span>{idx + 1}.</span> <p>{item.device_name}</p>
                </>
              )}
            </div>
            <div className="">
              {editId === item.id && isEditing ? (
                <TextField
                  id="standard-basic"
                  variant="outlined"
                  size="small"
                  name="serial_number"
                  defaultValue={item.serial_number}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              ) : (
                <span>{item.serial_number}</span>
              )}
            </div>
            <div className="flex items-center">
              <Button
                onClick={(e) => returnedSubmit(e, item)}
                disabled={
                  editId === item.id && isEditing
                  // item.return_status === 1 || (editId === item.id && isEditing)
                }
              >
                {item.return_status === 0 ? (
                  <p className="text-red-500">ยังไม่คืน</p>
                ) : (
                  <p className="text-green-500">คืนแล้ว</p>
                )}
              </Button>

              <p>{item.return_date}</p>

              {editId === item.id && isEditing ? (
                <>
                  <Button onClick={(e) => editBorrowedDevices(e, item)}>
                    บันทึก
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>ยกเลิก</Button>
                </>
              ) : (
                <Button
                  onClick={(e) => {
                    handleEditClick(e, item.id, item.serial_number);
                  }}
                >
                  แก้ไข
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <div className="my-4">
        <h2 className="font-bold">เพิ่มใหม่</h2>
        {inputs.map((input, idx) => {
          console.log("input device_name", input.device_name);

          return (
            <div key={idx} className="flex items-center space-x-8 my-2">
              <FormControl sx={{ width: 180 }}>
                <InputLabel id="demo-simple-select-label">Others</InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  label="Others"
                  name="device_name"
                  id={`device_name-${idx}`}
                  onChange={(e) => handleInputChange(idx, e)}
                >
                  {" "}
                  <MenuItem disabled>Select...</MenuItem>
                  <MenuItem value="เปลี่ยน Laptop">เปลี่ยน Laptop</MenuItem>
                  <MenuItem value="เปลี่ยน Adaptor">เปลี่ยน Adaptor</MenuItem>
                  <MenuItem value="เปลี่ยน Mouse">เปลี่ยน Mouse</MenuItem>
                  <MenuItem value="เปลี่ยน กระเป๋า">เปลี่ยน กระเป๋า</MenuItem>
                  <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
                </Select>
              </FormControl>

              {input.device_name !== "เปลี่ยน Laptop" &&
                input.device_name !== "เปลี่ยน Adaptor" &&
                input.device_name !== "เปลี่ยน Mouse" &&
                input.device_name !== "เปลี่ยน กระเป๋า" &&
                input.device_name !== "" && (
                  <TextField
                    id={`other_device-${idx}`}
                    variant="outlined"
                    size="small"
                    name="device_name"
                    label="อื่นๆ"
                    onChange={(e) => handleInputChange(idx, e)}
                  />
                )}
              <TextField
                id={`serial_number-${idx}`}
                variant="outlined"
                size="small"
                name="serial_number"
                label="Serial Number"
                value={input.serial_number}
                onChange={(e) => handleInputChange(idx, e)}
              />
              <Button onClick={() => handleRemoveInput(idx)}>ลบ</Button>
            </div>
          );
        })}
        <Button onClick={handleAddInput}>เพิ่ม</Button>
        <Button onClick={handleSubmit}>ส่ง</Button>
      </div>
    </div>
  );
}
