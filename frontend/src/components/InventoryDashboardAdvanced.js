import React, { useState, useEffect,useRef } from "react";
import { Row, Col, Card, Badge, ButtonGroup, Button, Form } from "react-bootstrap";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import { TextCenter } from "react-bootstrap-icons";
import Cookies from "js-cookie";

const labelMap = {
  Day: "Daily",
  Month: "monthly",
  Year: "Yearly",
};

/* ---------------- REGISTER ---------------- */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const InventoryDashboardAdvanced = () => {

  const divRef = useRef();
  
  const secret = Cookies.get("secretCode"); 
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("Day"); // Day/month/Year
  const [graphType, setGraphType] = useState("bar");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dashboard, setDashboard] = useState(null);

 
  /* ---------------- DATA ---------------- */
  // const inventory; 
  // [
  //   { name: "Smartphone", qty: 18, Day: 5, month: 120, Year: 1400, selling: 450, date: "2024-02-10" },
  //   { name: "Earbuds", qty: 9, Day: 7, month: 180, Year: 2100, selling: 80, date: "2024-02-12" },
  //   { name: "Charger", qty: 30, Day: 4, month: 90, Year: 1100, selling: 35, date: "2024-02-15" },
  //   { name: "Data Cable", qty: 7, Day: 6, month: 150, Year: 1800, selling: 20, date: "2024-02-18" },
  //   { name: "Smart Watch", qty: 5, Day: 2, month: 60, Year: 720, selling: 300, date: "2024-02-20" },
  //   { name: "Power Bank", qty: 14, Day: 3, month: 85, Year: 980, selling: 70, date: "2024-02-22" },
  //   { name: "Charger1", qty: 30, Day: 4, month: 90, Year: 1100, selling: 35, date: "2024-02-15" },
  //   { name: "Data Cable1", qty: 7, Day: 6, month: 150, Year: 1800, selling: 20, date: "2024-02-18" },
  //   { name: "Smart Watch1", qty: 5, Day: 2, month: 60, Year: 720, selling: 300, date: "2024-02-20" },
  //   { name: "Power Bank1", qty: 14, Day: 3, month: 85, Year: 980, selling: 70, date: "2024-02-22" },
  // ];
  
 useEffect(() => {
    // console.log(inventory);
    // initialInventoryLoad();

    divRef.current.scrollBy({
    top: 115,
    behavior: "smooth"
  });

    API.fetchDashboardData(dispatch,{userId:secret ,cycle:period}).then(res => {
        // console.log("------------"+JSON.stringify(res.payload.data.dashboard));
        setDashboard(res.payload.data.dashboard);
    }).catch(err => {
      console.log("Error:", err);
    });
  }, [period]);

  //  const initialInventoryLoad = () => {
  //   API.fetchDashboardData(dispatch,period).then(res => {
  //       console.log(res.payload.data.dashboard.itemSalesCompare);
  //       setDashboard(res.payload.data.dashbord);
  //   }).catch(err => {
  //     console.log("Error:", err);
  //   });
  // }
  /* ---------------- FILTERED INVENTORY ---------------- */
  // dashboard?.itemSalesCompare?
  const filteredInventory = dashboard?.itemSalesCompare?.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const d = new Date(i.date);
    return matchSearch && (!startDate || d >= new Date(startDate)) && (!endDate || d <= new Date(endDate));
  });

  /* ---------------- SUMMARY ---------------- */
  // const totalStock = filteredInventory?.reduce((s, i) => s + i.qty, 0);
  // const lowStock = filteredInventory?.filter((i) => i.qty < 10).length;

  /* ---------------- SELLING & PROFIT BASED ON PERIOD ---------------- */
  // const totalSelling = filteredInventory?.reduce((s, i) => s + i[period] * i.qty, 0);
  // const totalProfit = filteredInventory?.reduce((s, i) => s + (i[period] * i.qty * 0.3), 0).toFixed(2); // profit = 30% of sales
  // const totalValue = filteredInventory?.reduce((s, i) => s + i.qty * i.selling, 0); // current total value of stock
  // filteredInventory?.map((i) => {
  //     console.log("-ss---"+i.day);
  // });
// day.includes("day")
  /* ---------------- BAR CHART ---------------- */
  const barData = {
    labels: filteredInventory?.filter((i)=>i.cycle.includes(period)).map((i) => i.name),
    datasets: [
      {
        label: `Current ${period} Sales`,
        data: filteredInventory?.filter((i)=>i.cycle.includes(period)).map((i) =>i.cycle.includes("Day")?i.day:(i.cycle.includes("Month")?i.month:i.year)),
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
      {
        label: `Previous ${period} Sales`,
        data: filteredInventory?.filter((i)=>i.cycle.includes(period)).map((i) => i.cycle.includes("Day")?i.previousDay:(i.cycle.includes("Month")?i.previousMonth:i.previousYear)),
        backgroundColor: "#a855f7",
        borderRadius: 6,
      },
      {
        label: "Current Stock",
        data: filteredInventory?.filter((i)=>i.cycle.includes(period)).map((i) => i.qty),
        backgroundColor: "#10b981",
        borderRadius: 6,
      },
    ],
  };

  /* ---------------- LINE / AREA CHART ---------------- */
  // const lineData = {
  //   labels: filteredInventory?.map((i) => i.name),
  //   datasets: [
  //     {
  //       label: `Current ${period} Sales`,
  //       data: filteredInventory?.map((i) => i[period]),
  //       borderColor: "#2563eb",
  //       backgroundColor: "rgba(37,99,235,0.3)",
  //       fill: true,
  //       tension: 0.4,
  //       pointRadius: 4,
  //     },
  //     {
  //       label: `Previous ${period} Sales`,
  //       data: filteredInventory?.map((i) => Math.round(i[period] * 0.85)),
  //       borderColor: "#a855f7",
  //       backgroundColor: "rgba(168,85,247,0.3)",
  //       fill: true,
  //       tension: 0.4,
  //       pointRadius: 4,
  //     },
  //     {
  //       label: "Current Stock",
  //       data: filteredInventory?.map((i) => i.qty),
  //       borderColor: "#10b981",
  //       backgroundColor: "rgba(16,185,129,0.3)",
  //       fill: true,
  //       tension: 0.4,
  //       pointRadius: 2,
  //     },
  //   ],
  // };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: graphType === "bar" ? "📊 Sales Comparison" : "📈 Sales Area Trend",
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  /* ---------------- DONUT ---------------- */
  const donutData = {
    labels: ["Low Stock", "Good Stock"],
    datasets: [
      {
        label: "Product Stock Status",
        data: [dashboard?.lowStock, filteredInventory?.length - dashboard?.lowStock],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderColor: "#fff",
        borderWidth: 2,
        cutout: "70%",
      },
    ],
  };

  const cardStyle = {
    borderRadius: "6px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    textAlign: "left",
    fontSize: 12 
  };

  return (
    <div ref={divRef} className="container my-4 scrollable-div">
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(90deg,#1D4ED8,#4338CA)",
          color: "#fff",
          padding: "12px",
          borderRadius: "6px",
          textAlign: "center",
          fontSize: "22px",
          fontWeight: 600,
          marginBottom: "24px",
        }}
      >
        📊 Inventory Sales Dashboard
      </div>

      {/* PERIOD */}
      <div className="d-flex justify-content-center mb-3">
        <ButtonGroup>
          {["Day", "Month", "Year"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "primary" : "outline-primary"}
              onClick={() => setPeriod(p)}
            >
              {(labelMap[p]).toUpperCase()}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* GRAPH TYPE */}
      {/* <div className="d-flex justify-content-center mb-4">
        <Form.Select
          style={{ width: 220 }}
          value={graphType}
          onChange={(e) => setGraphType(e.target.value)}
        >
          <option value="bar">📊 Bar Chart</option>
          <option value="line">📈 Area Line Chart</option>
        </Form.Select>
      </div> */}

      {/* SEARCH + DATE */}
      {/* <Row className="g-2 mb-4">
        <Col md={4}>
          <Form.Control placeholder="Search product..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col md={4}>
          <label>Start Date</label>
          <DatePicker 
            style={{ width: "100% !important" }}
            locale={enUS} 
            popperPlacement="bottom-start"
            dateFormat="yyyy-MM-dd"
            placeholderText="yyyy-mm-dd"
            selected={startDate} 
            onChange={(selectedDate) =>setStartDate(selectedDate)}
          />
        </Col>
        <Col md={4}>
          <label className="gap-2">End Date</label>
          <DatePicker 
            style={{ width: "100% !important" }}
            locale={enUS} 
            popperPlacement="bottom-start"
            dateFormat="yyyy-MM-dd"
            placeholderText="yyyy-mm-dd"
            selected={endDate} 
            onChange={(selectedDate) =>setEndDate(selectedDate)}
          />
        </Col>
      </Row> */}

      {/* SUMMARY */console.log("pppppppp-----"+dashboard)}
      <Row className="g-3 mb-4">
        <Col md={2}><Card style={cardStyle}><h6>Total Stock</h6><span>{dashboard?.totalStock}</span></Card></Col>
        <Col md={2}><Card style={cardStyle}><h6>Total Value</h6><span>{formatINR(dashboard?.totalValue)}</span></Card></Col>
        <Col md={2}><Card style={cardStyle}><h6>Expense</h6><span>{formatINR(dashboard?.totalExpense)}</span></Card></Col>
        <Col md={2}><Card style={cardStyle}><h6>Sold</h6><span>{formatINR(dashboard?.totalSalesAmount)}</span></Card></Col>
        <Col md={2}><Card style={cardStyle}><h6>Profit</h6><span style={{color: dashboard?.profit >=0 ? "green" : "red"}}>{formatINR(dashboard?.profit)}</span></Card></Col>
        <Col md={2}><Card style={cardStyle}><h6>Low Stock</h6><span><Badge bg="danger">{dashboard?.lowStock}</Badge></span></Card></Col>
      </Row>

      {/* CHARTS */}
      <Row className="g-4">
        <Col md={8}>
          <Card style={{ ...cardStyle, height: 400 }}>
            <div style={{ width: "100%", height: "100%" }}>
              {graphType === "bar" ? (
                <Bar data={barData} options={chartOptions} />
              ) : (
                <Line data={lineData} options={chartOptions} />
              )}
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ ...cardStyle, height: 400 }}>
            <Doughnut data={donutData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryDashboardAdvanced;
