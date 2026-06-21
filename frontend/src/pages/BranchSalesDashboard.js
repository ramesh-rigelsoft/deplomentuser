import React, { useState, useEffect,useRef } from "react";
import { Row, Col, Card, Badge, ButtonGroup, Button, Form } from "react-bootstrap";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar"
import Header from "../components/Header";
import PageHeader from "./PageHeader";

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

const BranchSalesDashboard = () => {

  const divRef = useRef();
  
  const secret = Cookies.get("secretCode"); 
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("Day"); // Day/month/Year
  const [graphType, setGraphType] = useState("bar");
  const [office, setOffice] = useState("all");
  const [search, setSearch] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dashboard, setDashboard] = useState(null);
 
  useEffect(() => {
    // scrollUp();
    fetchData(secret ,period,startDate,endDate,search);
  }, [period]);

  // useEffect(() => {
  //   scrollUp();
  // }, [graphType]);
 
  // const scrollUp=()=>{
  //      if (divRef.current) {
  //       divRef.current.scrollTo({
  //         top: 242,
  //         behavior: "smooth",
  //       });
  //     }
  // };
  const searchFilter=()=>{
    if(startDate!==null&&endDate!==null){
    //  scrollUp();
     setPeriod("Period");
     fetchData(secret,period,startDate,endDate,search);
    }else{
      fail("Select the filter");
    }
  };

  const clearFilter=()=>{
    //  scrollUp();
    setEndDate(null);
    setStartDate(null);
    setSearch(null);
    setPeriod("Day");
  };

  const fetchData=(secret ,period,startDate,endDate,search)=>{
    API.fetchDashboardData(dispatch,{userId:secret ,cycle:period,startDate:startDate,endDate:endDate,searchKeyWords:search}).then(res => {
        // console.log("------------"+JSON.stringify(res.payload.data.dashboard));
        setDashboard(res.payload.data.dashboard);
    }).catch(err => {
      console.log("Error:", err);
    });
  }

  /* ---------------- FILTERED INVENTORY ---------------- */
  // dashboard?.itemSalesCompare?
  const filteredInventory = dashboard?.itemSalesCompare?.filter((i) => {
    let searchValue=false;
    if(search!==null){
        searchValue=i.name?.toLowerCase().includes(search.toLowerCase());
    }else{
        searchValue=true;
    }

    // const matchSearch = i.name?.toLowerCase().includes(search.toLowerCase());
    // console.log(i.name+"----"+search+"----------"+matchSearch+"-------"+JSON.stringify(i));
    // const d = new Date(i.date);
    return searchValue;//&&(!startDate || d >= new Date(startDate)) && (!endDate || d <= new Date(endDate));
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

  const filterPeriod=(cycle)=>{
    console.log((cycle!=="Period"),cycle);
    return (cycle!=="Period"?(cycle.includes(period)):true)
  }
  /* ---------------- BAR CHART ---------------- */
  const barData = {
    labels: filteredInventory?.filter((i)=>filterPeriod(i.cycle)).map((i) => i.name),
    datasets: [
      {
        label: `Current ${period} Sales`,
        data: filteredInventory?.filter((i)=>filterPeriod(i.cycle)).map((i) =>i.cycle!=="Period"?(i.cycle.includes("Day")?i.day:(i.cycle.includes("Month")?i.month:i.year)):i.selectedFilter),
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
      {
        label: `Previous ${period} Sales`,
        data: filteredInventory?.filter((i)=>filterPeriod(i.cycle)).map((i) =>i.cycle!=="Period"?(i.cycle.includes("Day")?i.previousDay:(i.cycle.includes("Month")?i.previousMonth:i.previousYear)):i.previousSelectedFilter),
        backgroundColor: "#a855f7",
        borderRadius: 6,
      },
      {
        label: "Current Stock",
        data: filteredInventory?.filter((i)=>filterPeriod(i.cycle)).map((i) => i.qty),
        backgroundColor: "#10b981",
        borderRadius: 6,
      },
    ],
  };

  /* ---------------- LINE / AREA CHART ---------------- */
  const lineData = {
    labels: filteredInventory?.map((i) => i.name),
    datasets: [
      {
        label: `Current ${period} Sales`,
        data: filteredInventory?.map((i) => i[period]),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: `Previous ${period} Sales`,
        data: filteredInventory?.map((i) => Math.round(i[period] * 0.85)),
        borderColor: "#a855f7",
        backgroundColor: "rgba(168,85,247,0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Current Stock",
        data: filteredInventory?.map((i) => i.qty),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

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
    borderRadius: "5px",
    padding: "15px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    textAlign: "left",
    fontSize: 12 
  };

  return (
    <div className="mt-10px">
       <Header
        title="Branch Mangement"
        subTitle="Manage everything in one place"
        dashboard = "2"
      />
      
    <div ref={divRef} className="page scrollable-div-d">
      <PageHeader pageName="Dashboard" />
      {/* HEADER */}
      {/* <div
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
      </div> */}
      <div className="d-flex flex-column flex-md-row gap-3 my-2">
        {/* PERIOD */}
        <div className="d-flex justify-content-center mb-3 mb-md-0">
          <ButtonGroup>
            {["Day", "Month", "Year"].map((p) => (
              <Button
                key={p}
                variant={period === p ? "primary" : "outline-primary"}
                onClick={() => {
                  setPeriod(p);
                  setStartDate(null);
                  setEndDate(null);
                  setSearch(null);
                }}
              >
                {(labelMap[p]).toUpperCase()}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* GRAPH TYPE */}
        <div className="d-flex justify-content-center">
          <Form.Select
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
            className="w-auto"
          >
            <option value="bar">📊 Bar Chart</option>
            <option value="line">📈 Area Line Chart</option>
          </Form.Select>
        </div>
        <div className="d-flex justify-content-center">
          <Form.Select
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            className="w-auto"
          >
            <option value="bar">All</option>
            <option value="line">Office_01</option>
          </Form.Select>
        </div>
      </div>

{/* <div className="d-flex">
      <div className="d-flex justify-content-center mb-3">
        <ButtonGroup>
          {["Day", "Month", "Year"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "primary" : "outline-primary"}
              onClick={() => {setPeriod(p);setStartDate(null);setEndDate(null);setSearch(null)}}
            >
              {(labelMap[p]).toUpperCase()}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="d-flex justify-content-center" style={cardStyle}>
        <Form.Select
          value={graphType}
          onChange={(e) => setGraphType(e.target.value)}
        >
          <option value="bar">📊 Bar Chart</option>
          <option value="line">📈 Area Line Chart</option>
        </Form.Select>
      </div>
</div> */}

      {/* SEARCH + DATE */}
   <Row className="align-items-end g-2 py-1">
  {/* Search */}
  <Col md={3}>
    <Form.Control
      placeholder="🔍 Search category, product, service..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="shadow-sm"
    />
  </Col>

  {/* Start Date */}
  <Col md={3}>
    <DatePicker
      className="form-control shadow-sm"
      locale={enUS}
      popperPlacement="bottom-start"
      dateFormat="yyyy-MM-dd"
      placeholderText="📅 Start date (from)"
      selected={startDate}
      onChange={(date) => setStartDate(date)}
    />
  </Col>

  {/* End Date */}
  <Col md={3}>
    <DatePicker
      className="form-control shadow-sm"
      locale={enUS}
      popperPlacement="bottom-start"
      dateFormat="yyyy-MM-dd"
      placeholderText="📅 End date (to)"
      selected={endDate}
      onChange={(date) => setEndDate(date)}
    />
  </Col>

  {/* Buttons */}
  <Col md={3}>
    <div className="d-flex gap-1">
      <Button
        onClick={searchFilter}
        className="w-50"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #4dabf7)",
          border: "none"
        }}
      >
        🚀 Search
      </Button>

      <Button
        onClick={clearFilter}
        className="w-50"
        style={{
          background: "linear-gradient(135deg, #adb5bd, #6c757d)",
          border: "none",
          color: "#fff"
        }}
      >
        🧹 Clear
      </Button>
    </div>
  </Col>

</Row>

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
          <Card style={{ ...cardStyle, height: 360 }}>
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
          <Card style={{ ...cardStyle, height: 360 }}>
            <Doughnut options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
            }} 
            data={donutData} />
          </Card>
        </Col>
      </Row>
    </div>
    </div>
  );
};

export default BranchSalesDashboard;
