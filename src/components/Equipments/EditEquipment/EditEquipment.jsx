import React, { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import {
  editEquipmentsData,
  getSingleEquipmentData,
  getMarkedEquipmentData,
} from "../functions/data";

import DateEdit from "./EditComponents/DateEdit";
import EmployeeBranchIdEdit from "./EditComponents/EmployeeBranchIdEdit";
import EmployeeDeptEdit from "./EditComponents/EmployeeDeptEdit";
import EmployeeIdEdit from "./EditComponents/EmployeeIdEdit";
import EmployeeNameEdit from "./EditComponents/EmployeeNameEdit";
import EmployeePhoneEdit from "./EditComponents/EmployeePhoneEdit";
import EmployeeRankEdit from "./EditComponents/EmployeeRankEdit";
import BorrowedList from "./EditComponents/BorrowedList";
import CircularProgress from "@mui/material/CircularProgress";

import MyDocument from "../Print/MyDocument";

function EditEquipment() {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    date: "",
    employee_id: "",
    employee_name: "",
    employee_phone: "",
    employee_rank: "",
    employee_dept: "",
    branch_id: null,
  });
  const [markedData, setMarkedData] = useState([
    {
      borrow_id: 1,
      device_name: "Laptop",
      serial_number: "",
      return_status: 0,
      return_date: "",
    },
    {
      borrow_id: 2,
      device_name: "Adaptor",
      serial_number: "",
      return_status: 0,
      return_date: "",
    },
    {
      borrow_id: 3,
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
  ]);

  const getSingleData = () => {
    getSingleEquipmentData(id).then((res) => {
      setFormData((prevData) => ({
        ...prevData,
        date: res.data.data.date,
        employee_id: res.data.data.employee_id,
        employee_name: res.data.data.employee_name,
        employee_phone: res.data.data.employee_phone,
        employee_rank: res.data.data.employee_rank,
        employee_dept: res.data.data.employee_dept,
        branch_id: res.data.data.branch_id,
      }));
    });
  };
  const getMarkedData = () => {
    setIsloading(true);
    getMarkedEquipmentData(id)
      .then((res) => {
        setMarkedData(res.data.data);
        setIsloading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsloading(false);
      });
  };

  useEffect(() => {
    getSingleData();
    getMarkedData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsloading(true);
    try {
      editEquipmentsData(formData, id).then((res) => {
        console.log(res);
        if (res.status === 200) {
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Your information has been saved",
            showConfirmButton: true,
          });
        }

        navigate("/equipments");
      });
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Fail to submit data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    setIsloading(false);
  };

  const handleChange = (e) => {
    console.log("xxxxxxx", typeof formData.branch_id);

    const { name, value } = e.target;
    if (name === "branch_id") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (formattedDate) => {
    setFormData({ ...formData, date: formattedDate });
  };

  return (
    <div className="mx-16">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold my-6">แก้ไขการยืม-คืนอุปกรณ์</h1>
        <MyDocument markedData={markedData} />
      </div>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <div className="mt-20 mb-10   space-y-10 flex flex-col">
          <div className="flex items-center space-x-16 ">
            {" "}
            <DateEdit
              value={formData.date}
              onDateChange={handleDateChange}
            />{" "}
            <EmployeeIdEdit
              value={formData.employee_id}
              onChange={handleChange}
            />{" "}
            <EmployeeNameEdit
              value={formData.employee_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-16">
            {" "}
            <EmployeePhoneEdit
              value={formData.employee_phone}
              onChange={handleChange}
            />
            <EmployeeRankEdit
              value={formData.employee_rank}
              onChange={handleChange}
            />{" "}
            <EmployeeDeptEdit
              value={formData.employee_dept}
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-24">
            {" "}
            <EmployeeBranchIdEdit
              value={formData.branch_id}
              onChange={handleChange}
            />
          </div>
          <div>
            {isLoading ? (
              <div className="mx-[400px] my-[70px] h-[200px]">
                <CircularProgress />
              </div>
            ) : (
              <BorrowedList
                markedData={markedData}
                setMarkedData={setMarkedData}
                getMarkedData={getMarkedData}
                id={id}
                getSingleData={getSingleData}
                isLoading={isLoading}
                setIsloading={setIsloading}
              />
            )}
          </div>
        </div>
        <div className="space-x-6 mb-16">
          <LoadingButton
            color="primary"
            loading={isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            type="submit"
          >
            <span>บันทึก</span>
          </LoadingButton>
          <Link to="/equipments">
            <Button variant="outlined">ยกเลิก</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditEquipment;
