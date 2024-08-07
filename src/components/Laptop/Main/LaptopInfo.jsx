import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import clsx from "clsx";
import { DataGrid } from "@mui/x-data-grid";
import { FaEye } from "react-icons/fa";
import SetModal from "../Modal/SetModal";
import { getLabtopsData } from "../functions/data";
import Swal from "sweetalert2";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

export default function LaptopInfo() {
  const [allDataAll, setAlldataAll] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [borrowedItems, setBorrowedItems] = useState([null]);

  const navigate = useNavigate();

  async function getDataAll() {
    try {
      getLabtopsData().then((response) => {
        setAlldataAll(response.data.data);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getDataAll();

    getBorrowedInfo();
  }, []);

  const getBorrowedInfo = async () => {
    try {
      const laptopResponse = await axios.get(
        "http://192.168.0.145:8080/api/borrows"
      );
      console.log("laptopResponse", laptopResponse.data.data);
      setBorrowedItems(laptopResponse.data.data);
    } catch (error) {
      console.error("Error fetching laptop information:", error);
      // Handle error or show an alert here
    }
  };
  console.log("borrowedItems", borrowedItems);
  const handleImageClick = (imageURL) => {
    setSelectedImage(imageURL);
    // แสดง modal ที่นี่
  };

  async function Delete(e, id, serialNumber) {
    e.preventDefault();
    console.log("id", id);
    const hasLaptopBorrowed = borrowedItems.find(
      (item) => item.laptop_id === id
    );
    console.log("hasLaptopBorrowed", hasLaptopBorrowed);
    if (hasLaptopBorrowed) {
      Swal.fire({
        title: "กรุณาลบข้อมูลที่ถูกยืมก่อน",
        icon: "error",
      });
    } else {
      const API_URL = import.meta.env.VITE_API_BASE_PORT;
      Swal.fire({
        title: `Cofirm to delete this item (S/N:${serialNumber} ) ?`,
        icon: "question",
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          axios
            .delete(`${API_URL}/laptops/${id}`)
            .then((res) => {
              console.log(res);
              Swal.fire({
                title: "Deleted Successfully",
                icon: "success",
              });
              getDataAll();
            })
            .catch((res) => {
              Swal.fire({
                title: "Unable to delete",
                icon: "error",
              });
            });
        }
      });
    }
  }

  const handleEdit = (e, id) => {
    e.preventDefault();
    navigate(`/editlaptop/${id}`);
  };

  const columns = [
    { field: "id", headerName: "ลำดับ", width: 100 },
    {
      field: "serial_number",
      headerName: "หมายเลขเครื่อง",
      width: 140,
      editable: false,
    },
    {
      field: "created_at",
      headerName: "วันที่ทดสอบ",
      width: 110,
      editable: false,
      valueGetter: (params) => {
        // ใช้ `substring` กับค่าจากแถว (`row`) ของคอลัมน์ `date`
        const dateValue = params;
        return dateValue ? dateValue.substring(0, 10) : ""; // ใช้ substring และตรวจสอบว่าค่าของ date ไม่ใช่ undefined หรือ null
      },
    },
    {
      field: "picture",
      headerName: "รูปภาพ",
      width: 80,

      editable: false,
      renderCell: (params) => {
        return (
          <>
            <FaEye
              className="mt-4 text-yellow-400 cursor-pointer"
              onClick={() =>
                handleImageClick(
                  `http://192.168.0.145:8080/uploads/${params.value}`
                )
              }
            />
          </>
        );
      },
    },
    {
      field: "brand",
      headerName: "ยี่ห้อ",
      width: 140,
      editable: false,
    },
    {
      field: "warrantyexpirationdate",
      headerName: "วันหมดประกัน",
      width: 140,
      editable: false,
    },
    {
      field: "fullbatterycapacity",
      headerName: "ความจุแบตเต็ม",
      width: 140,
      editable: false,
    },

    {
      field: "currentbatterycapacity",
      headerName: "ความจุแบตปัจุบัน",
      width: 140,
      editable: false,
    },
    {
      field: "diskperformance",
      headerName: "ประสิทธิภาพดิสก์",
      width: 140,
      editable: false,
    },
    {
      field: "spec",
      headerName: "สเปคเครื่อง",
      width: 180,
      editable: false,
    },

    {
      field: "status",
      headerName: "สถานะการใช้งาน",
      width: 140,
      editable: false,
    },

    {
      field: "action",
      headerName: "Action",
      width: 80,
      filterable: false,
      renderCell: (params) => {
        return (
          <div className="flex space-x-2 my-4">
            <Link href="#">
              <RiEdit2Line
                size={18}
                className="text-sky-400"
                onClick={(e) => handleEdit(e, params.id)}
              />
            </Link>
            {/* <Link href="#">
              <RiDeleteBin6Line
                className="text-red-400"
                size={18}
                onClick={(e) => Delete(e, params.id, params.row.serial_number)}
              />
            </Link> */}
          </div>
        );
      },
    },
  ];
  return (
    <div className="">
      <h1 className="text-2xl font-bold mt-6 mb-12">ข้อมูลโน้ตบุ้คทั้งหมด</h1>
      <div className="my-6">
        <Link to="/addlaptop">
          {" "}
          <Button variant="contained" startIcon={<AddIcon />}>
            เพิ่มข้อมูลโน้ตบุ้ค
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center mt-[10%]">
          <CircularProgress />
        </div>
      ) : (
        <Box
          sx={{
            height: 550,
            width: "100%",
            // "& .active": {
            //   backgroundColor: "#ffde59",
            //   color: "#1a3e72",
            //   fontWeight: "600",
            // },
            // "& .inactive": {
            //   backgroundColor: "rgb(239 68 68)",
            //   color: "black",
            //   fontWeight: "600",
            // },
          }}
        >
          <DataGrid
            rows={allDataAll}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 100,
                },
              },
            }}
            rowHeight={50}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            localeText={{ noRowsLabel: "No Information..." }}
            slots={
              ({
                loadingOverlay: LinearProgress,
              },
              { noRowsOverlay: CustomNoRowsOverlay })
            }
            loading={isLoading}
          />
        </Box>
      )}
      <SetModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
}

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Infomation.</Box>
    </StyledGridOverlay>
  );
}
