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
    <ResponsiveContainer width={'100%'} height={500}>
      <BarChart width={150} height={40} data={data}>
        <XAxis dataKey="name" />
        <YAxis dataKey="total" />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="4 3" />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
