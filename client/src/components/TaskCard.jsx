import clsx from 'clsx'
import React, { useState } from 'react'
import {
  MdKeyboardArrowDown,
  MdKeyboardDoubleArrowUp,
  MdKeyboardArrowUp,
  MdAttachFile,
} from 'react-icons/md'
import { useSelector } from 'react-redux'
import { BGS, PRIORITYSTYLES, TASK_TYPE, formatDate } from '../utils/index'
import TaskDialog from './task/TaskDialog'
import { BiMessageAltDetail } from 'react-icons/bi'
import { FaList } from 'react-icons/fa'
import UserInfo from './UserInfo'
import { IoMdAdd } from 'react-icons/io'
import AddSubTask from './task/AddSubTask'

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
}

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-4 rounded">
        <div className="w-full flex justify-between">
          <div className="flex flex-1 items-center text-sm font-medium">
            <span className="capitalize">{task?.priority}</span>
          </div>

          {user?.isAdmin && <TaskDialog task={task} />}
        </div>

        <>
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                'w-full p-2 b-2 line-clamp-3 text-white font-semibold text-3xl rounded-lg',
                TASK_TYPE[task.stage]
              )}
            >
              {task?.title}
            </div>
          </div>

          <span className="text-sm text-gray-600">
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className="w-full border-t border-gray-200 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <FaList />
              <span>{task?.subTasks?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* sub tasks */}
        {task?.subTasks.length > 0 ? (
          <>
            {task?.subTasks.slice(0, 2).map((subTask, index) => {
              if (subTask) {
                return (
                  <div
                    key={index}
                    className="flex flex-cols-2 justify-between px-2 pt-4 border-t border-gray-200"
                  >
                    <div>
                      <h5 className="text-base line-clamp-1 text-black">
                        {subTask.title}
                      </h5>
                      <span className="text-sm text-gray-600">
                        {formatDate(new Date(subTask.date))}
                      </span>
                    </div>

                    <div className="p-4 space-x-8">
                      <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                        {subTask.tag}
                      </span>
                    </div>
                  </div>
                )
              } else {
                return
              }
            })}
          </>
        ) : (
          <>
            <div className="py-4 border-t border-gray-200">
              <span className="text-gray-500 text-md">No Subtask</span>
            </div>
          </>
        )}

        <div className="w-full flex">
          <button
            onClick={() => setOpen(true)}
            disabled={user.isAdmin ? false : true}
            className="w-full flex gap-1 mt-3 items-center justify-left text-md text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoMdAdd />
            <p>Add Subtask</p>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  )
}

export default TaskCard
