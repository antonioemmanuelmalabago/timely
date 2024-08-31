import React from 'react'
import { Popover } from '@headlessui/react'
import { getInitials } from '../utils'
import { Transition } from '@headlessui/react'

const UserInfo = ({ user }) => {
  return (
    <div className="px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="group inline-flex items-center outline-none">
              <span>{getInitials(user?.name)}</span>
            </Popover.Button>

            <Transition
              as="div"
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-100 max-w-sm -translate-x-3/4 transform px-4 sm:px-0">
                <div className="flex items-center gap-2 md:gap-4 rounded-lg shadow-lg bg-white p-4">
                  <div className="min-w-14 min-h-14 md:min-w-16 md:min-h-16 bg-[#4A90E2] rounded-full text-white flex items-center justify-center text-xl md:text-2xl">
                    <span>{getInitials(user?.name)}</span>
                  </div>

                  <div className="flex flex-col gap-y-0">
                    <p className="text-black text-base md:text-xl font-bold">
                      {user.name}
                    </p>
                    <span className="text-sm md:text-base text-gray-500">
                      {user.title}
                    </span>
                    <span className=" text-blue-500">{user.email}</span>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default UserInfo
