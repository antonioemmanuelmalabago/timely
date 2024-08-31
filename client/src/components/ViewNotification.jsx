import React from 'react'
import ModalWrapper from './ModalWrapper'
import { Dialog } from '@headlessui/react'
import Button from './Button'

const ViewNotification = ({ open, setOpen, el }) => {
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className=" w-full flex flex-col gap-2 items-center justify-center">
          <Dialog.Title as="h3" className="font-semibold text-lg">
            {el?.task?.title}
          </Dialog.Title>

          <p className="text-start mt-1 text-sm text-gray-500">{el?.text}</p>

          <div className="flex mt-2 w-1/4 bg-gray-50 items-end">
            <Button
              type="button"
              className="w-full py-2.5 text-sm font-semibold text-blue-500 hover:bg-gray-100"
              onClick={() => setOpen(false)}
              label="Close"
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}

export default ViewNotification
