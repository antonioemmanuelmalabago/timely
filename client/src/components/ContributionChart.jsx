import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const ContributionChart = ({ data }) => {
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart width={150} height={40} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="todo" stackId="a" fill="#A88FEA" />
        <Bar dataKey="in progress" stackId="a" fill="#A3E4D7" />
        <Bar dataKey="completed" stackId="a" fill="#FF8A65" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ContributionChart
