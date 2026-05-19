import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // 👈 required for area fill
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Users",
      data: [65, 59, 80, 81, 56],
      borderColor: "blue",
      backgroundColor: "rgba(0, 123, 255, 0.3)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Sales",
      data: [28, 48, 40, 19, 86],
      borderColor: "green",
      backgroundColor: "rgba(0, 200, 83, 0.3)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Revenue",
      data: [18, 38, 60, 39, 76],
      borderColor: "red",
      backgroundColor: "rgba(255, 99, 132, 0.3)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Profit",
      data: [12, 30, 50, 70, 90],
      borderColor: "orange",
      backgroundColor: "rgba(255, 165, 0, 0.3)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Expenses",
      data: [40, 35, 60, 50, 65],
      borderColor: "purple",
      backgroundColor: "rgba(128, 0, 128, 0.3)",
      fill: true,
      tension: 0.3,
    },
  ],
};
export default function PumpGraphDetails() {
  return (
    <div className="row col-12 form-box">
         <h1 htmlFor="11q" className="mb-2 header-label">Pump Graph:</h1>
       
       <Line
            data={data}
             options={{ responsive: true}}
            style={{width:'100%', margin: "auto" }}
        />
    </div>
  );
}
