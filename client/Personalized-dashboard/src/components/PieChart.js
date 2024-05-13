import React from 'react'
import 'chart.js/auto';
import {Pie} from "react-chartjs-2";
import { useState } from 'react';

const PieChart = ({chartData}) => {

  const randomColors = chartData.map(() => '#' + (Math.random().toString(16) + '000000').substring(2, 8));

  const [details, setdetails] = useState({
    labels: chartData.map((d) => d.domain),
    datasets: [
        {
            label: "Time Tracked in seconds",
            data: chartData.map((d) => d.tracked_seconds),
            borderColor: "black",
            backgroundColor: randomColors,
            borderWidth: 2,
        }
    ]
  })  

  return (
    <Pie data={details} />
  )
}

export default PieChart