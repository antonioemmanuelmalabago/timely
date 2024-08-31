import React from 'react'
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from 'react-icons/md'
import { IoMdCompass } from 'react-icons/io'
import { FaTasks, FaTrashAlt, FaUsers } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { setOpenSidebar } from '../redux/slices/authSlice'
import clsx from 'clsx'

const linkData = [
  {
    label: 'Dashboard',
    link: 'dashboard',
    icon: <MdDashboard />,
  },
  {
    label: 'Tasks',
    link: 'tasks',
    icon: <FaTasks />,
  },
  {
    label: 'Completed',
    link: 'completed/completed',
    icon: <MdTaskAlt />,
  },
  {
    label: 'Ongoing',
    link: 'in-progress/in-progress',
    icon: <MdOutlinePendingActions />,
  },
  {
    label: 'Todo',
    link: 'todo/todo',
    icon: <MdOutlinePendingActions />,
  },
  {
    label: 'Team',
    link: 'team',
    icon: <FaUsers />,
  },
  {
    label: 'Trash',
    link: 'trashed',
    icon: <FaTrashAlt />,
  },
]

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const location = useLocation()

  const path = location.pathname.split('/')[1]

  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5)

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false))
  }

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          'w-full lg:w-4/5 flex gap-3 px-4 py-3 rounded-md items-center text-gray-500 text-md hover:bg-[#2564ed2d]',
          path === el.link.split('/')[0] ? 'bg-[#4A90E2] text-white' : ''
        )}
      >
        <span className="scale-125">{el.icon}</span>
        <span>{el.label}</span>
      </Link>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 z-30">
      <h1 className="flex gap-2 items-center">
        <p className="flex items-center px-2 py-1 bg-[#4A90E2] rounded-md ">
          <IoMdCompass className="text-white" size={25} />
          <span className="text-2xl font-bold text-white">Timely</span>
        </p>
      </h1>

      <div className="flex-1 flex flex-col gap-y-2 py-2">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <button className="w-full flex gap-3 px-4 py-3 items-center text-lg text-gray-500">
        <MdSettings />
        <span>Settings</span>
      </button>
    </div>
  )
}

export default Sidebar
