import React, { useCallback, useEffect, useState } from 'react'
import { FaList } from 'react-icons/fa'
import { MdGridView } from 'react-icons/md'
import Loading from '../components/Loader'
import { useParams } from 'react-router-dom'
import Title from '../components/Title'
import Button from '../components/Button'
import { IoMdAdd } from 'react-icons/io'
import Tabs from '../components/Tabs'
import TaskTitle from '../components/TaskTitle'
import BoardView from '../components/BoardView'
import { tasks } from '../assets/data'
import Table from '../components/Table'
import AddTask from '../components/task/AddTask'
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice'

const TABS = [
  { title: 'Board View', icon: <MdGridView /> },
  { title: 'List View', icon: <FaList /> },
]

const TASK_TYPE = {
  todo: 'bg-[#A88FEA]',
  'in progress': 'bg-[#A3E4D7]',
  completed: 'bg-[#FF8A65]',
}

const Task = () => {
  const params = useParams()

  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)

  const status = params?.status || ''

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: '',
    search: '',
  })

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : 'Tasks'} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 bg-[#4A90E2] items-center text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE['in progress']}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}
      </Tabs>

      {selected === 0 ? (
        <BoardView tasks={data?.tasks} />
      ) : (
        <div className="w-full">
          <Table tasks={data?.tasks} />
        </div>
      )}

      <AddTask open={open} setOpen={setOpen} />
    </div>
  )
}

export default Task
