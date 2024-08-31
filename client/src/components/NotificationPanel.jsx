import { Popover, Transition } from '@headlessui/react'
import moment from 'moment'
import { Fragment, useState } from 'react'
import { BiSolidMessageRounded } from 'react-icons/bi'
import { HiBellAlert } from 'react-icons/hi2'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { Link } from 'react-router-dom'
import {
  useGetNotificationsQuery,
  useMarkNotifAsReadMutation,
} from '../redux/slices/api/userApiSlice'
import ViewNotification from './ViewNotification'
import { LuDot } from 'react-icons/lu'

const data = [
  {
    _id: '65c5bbf3787832cf99f28e6d',
    team: [
      '65c2204daa62f32ffd103cc',
      '65c27a0e18c0a1b75aad5cad',
      '65c30b966e39681a13def0b5',
    ],
    text: 'New task has been assigned to you and 2 others. The task priority is set a normal priority, so check and act accordingly. The task date is Thu Feb 29 2024. Thank you!!!',
    task: null,
    notiType: 'alert',
    isRead: [],
    createdAt: '2024-02-09T05:45:23.353Z',
    updatedAt: '2024-02-09T05:45:23.353Z',
    __v: 0,
  },
  {
    _id: '65c5bbf3787832cf99f28e6d',
    team: [
      '65c2204daa62f32ffd103cc',
      '65c27a0e18c0a1b75aad5cad',
      '65c30b966e39681a13def0b5',
    ],
    text: 'New task has been assigned to you and 2 others. The task priority is set a normal priority, so check and act accordingly. The task date is Thu Feb 29 2024. Thank you!!!',
    task: null,
    notiType: 'message',
    isRead: [],
    createdAt: '2024-02-09T05:45:23.353Z',
    updatedAt: '2024-02-09T05:45:23.353Z',
    __v: 0,
  },
]

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
}

const NotificationPanel = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const { data, refetch } = useGetNotificationsQuery()
  const [markAsRead] = useMarkNotifAsReadMutation()

  const readHandler = async (type, id) => {
    await markAsRead({ type, id }).unwrap()

    refetch()
  }

  const viewHandler = async (el) => {
    setSelected(el)
    readHandler('one', el._id)
    setOpen(true)
  }

  const callsToAction = [
    { name: 'Cancel', href: '#', icon: '' },
    {
      name: 'Mark All Read',
      href: '#',
      icon: '',
      onClick: () => readHandler('all', ''),
    },
  ]

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-11 h-11 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-4xl" />
            {data?.length > 0 && (
              <span className="absolute top-0 left-6 text-sm text-white font-semibold w-5 h-5 rounded-full bg-red-600">
                {data?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              data?.length > 0 && (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-md bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {data?.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className="group relative flex gap-x-4 rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="h-10 w-10 p-3 flex items-center justify-center rounded-full bg-gray-200 group-hover:bg-white">
                          {ICONS[item.notifType]}
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => viewHandler(item)}
                        >
                          <div className="flex items-center font-semibold text-gray-500 capitalize">
                            <p> {item.notiType}</p>
                            <span className=" text-xs font-normal normal-case">
                              {item.task.title}
                            </span>
                            {<LuDot />}
                            <span className=" text-xs font-normal normal-case">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="line-clamp-1 mt-1 text-sm text-gray-700">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 divide-x bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className="flex items-center justify-center py-2.5 font-semibold text-blue-500 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>

      <ViewNotification open={open} setOpen={setOpen} el={selected} />
    </>
  )
}

export default NotificationPanel
