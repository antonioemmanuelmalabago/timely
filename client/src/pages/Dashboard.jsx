import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { FaNewspaper } from 'react-icons/fa'
import { FaArrowsToDot } from 'react-icons/fa6'
import { LuClipboardEdit } from 'react-icons/lu'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md'
import Chart from '../components/Chart'
import Loading from '../components/Loader'
import UserInfo from '../components/UserInfo'
import { useGetDashboardStatsQuery } from '../redux/slices/api/taskApiSlice'
import { BGS, PRIORITYSTYLES, TASK_TYPE, getInitials } from '../utils'
import ContributionChart from '../components/ContributionChart'

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    normal: <MdKeyboardArrowDown />,
  }

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <h4 className="text-lg mb-2 text-gray-600 font-semibold">Recent Tasks</h4>
      <tr className="text-black text-left text-sm">
        <th className="p-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Team</th>
        <th className="text-center py-2 hidden md:block">Created At</th>
      </tr>
    </thead>
  )

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="w-[63%] md:w-[55%] p-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx('w-4 h-4 rounded-full', TASK_TYPE[task.stage])}
          />

          <p className="text-base text-black">{task.title}</p>
        </div>
      </td>

      <td className="w-[20%] md:w-[15%] py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx('text-lg', PRIORITYSTYLES[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>

      <td className="w-[20%] md:w-[10%] py-2">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 hidden md:block">
        <p className="w-full text-base text-center align-middle text-gray-600">
          {moment(task?.date).fromNow()}
        </p>
      </td>
    </tr>
  )

  return (
    <>
      <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <h4 className="text-lg mb-2 text-gray-600 font-semibold">Team Members</h4>
      <tr className="text-black text-left text-sm">
        <th className="p-2">Full Name</th>
        <th className="py-2">Status</th>
        <th className="py-2 text-center">Created At</th>
      </tr>
    </thead>
  )

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200  text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-[#4A90E2]">
            <span className="text-center">{getInitials(user?.name)}</span>
          </div>

          <div>
            <p className="text-sm">{user.name}</p>
            <span className="text-xs text-black">{user?.role}</span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            'w-fit px-2 py-1 rounded-full text-sm text-white',
            user?.isActive ? 'bg-[#A88FEA]' : 'bg-[#FF8A65]'
          )}
        >
          {user?.isActive ? 'Active' : 'Disabled'}
        </p>
      </td>
      <td className="py-2 text-sm text-center">
        {moment(user?.createdAt).fromNow()}
      </td>
    </tr>
  )

  return (
    <div className="w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded">
      <table className="w-full mb-5">
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery()

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    )
  }

  const totals = data?.tasks
  const { lastMonthTasks, totalTasks } = data?.lastMonthTasks
  const contributors = data?.contributors.slice(0, 3)

  const stats = [
    {
      _id: '1',
      label: 'Total Tasks',
      total: data?.totalTasks || 0,
      lastMonthTotal: totalTasks || 0,
      icon: <FaNewspaper />,
      bg: 'bg-[#4A90E2]',
    },
    {
      _id: '2',
      label: 'Completed',
      total: totals['completed'] || 0,
      lastMonthTotal: lastMonthTasks['completed'] || 0,
      icon: <FaNewspaper />,
      bg: 'bg-[#FF8A65]',
    },
    {
      _id: '3',
      label: 'Ongoing',
      total: totals['in progress'] || 0,
      lastMonthTotal: lastMonthTasks['in progress'] || 0,
      icon: <LuClipboardEdit />,
      bg: 'bg-[#A3E4D7]',
    },
    {
      _id: '4',
      label: 'Todo',
      total: totals['todo'] || 0,
      lastMonthTotal: lastMonthTasks['todo'] || 0,
      icon: <FaArrowsToDot />,
      bg: 'bg-[#A88FEA]',
    },
  ]

  const Card = ({ icon, bg, label, count, lastMonthCount }) => {
    return (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold">{count}</span>
          <span className="text-sm text-gray-400">{`${lastMonthCount} last month`}</span>
        </div>

        <div
          className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center text-white',
            bg
          )}
        >
          {icon}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map(({ label, total, lastMonthTotal, icon, bg }, index) => (
          <Card
            key={index}
            icon={icon}
            bg={bg}
            label={label}
            count={total}
            lastMonthCount={lastMonthTotal}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5">
        <div className="w-full bg-white mt-4 md:my-10 p-4 rounded shadow-sm">
          <h4 className="text-lg mb-5 text-gray-600 font-semibold">
            Priority Chart
          </h4>
          <Chart data={data?.graphData} />
        </div>

        <div className="w-full bg-white mt-4 md:my-10 p-4 rounded shadow-sm">
          <h4 className="text-lg mb-5 text-gray-600 font-semibold">
            Top Contributors
          </h4>
          <ContributionChart data={contributors} />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-5 pt-5 md:pt-0">
        {/* left */}
        <TaskTable tasks={data?.lastTenTask} />

        {/* right */}
        <UserTable users={data?.users} />
      </div>
    </div>
  )
}

export default Dashboard
