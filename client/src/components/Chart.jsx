import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart width={150} height={40} data={data}>
        <XAxis dataKey="name" />
        <YAxis dataKey="total" />
        <Tooltip />

        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="total" fill="#4A90E2" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
