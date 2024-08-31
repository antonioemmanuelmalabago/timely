import React from 'react'
import ModalWrapper from '../ModalWrapper'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import Textbox from '../Textbox'
import Button from '../Button'
import { useCreateSubTaskMutation } from '../../redux/slices/api/taskApiSlice'
import { toast } from 'sonner'

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [createSubTask] = useCreateSubTaskMutation()

  const handleOnSubmit = async (data) => {
    try {
      const res = await createSubTask({ data, id }).unwrap()

      toast.success(res.message)

      setTimeout(() => {
        setOpen(false)
        window.location.reload()
      }, 500)
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-lg font-bold leading-6 text-gray-900 mb-4"
          >
            Add Subtask
          </Dialog.Title>
          <div className="mr-2 flex flex-col gap-6">
            <Textbox
              placeholder="Sub-Task Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register('title', {
                required: 'Title is required!',
              })}
              error={errors.title ? errors.title.message : ''}
            />

            <div className="flex items-center gap-4">
              <Textbox
                placeholder="Date"
                type="date"
                label="Task Date"
                className="w-full rounded"
                register={register('date', {
                  required: 'Date is required!',
                })}
                error={errors.date ? errors.date.message : ''}
              />
              <Textbox
                placeholder="Tag"
                type="tag"
                label="Tag"
                className="w-full rounded"
                register={register('tag', {
                  required: 'Tag is required!',
                })}
                error={errors.tag ? errors.tag.message : ''}
              />
            </div>
          </div>

          <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
            <Button
              type="submit"
              className="bg-[#4A90E2] text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
              label="Add Task"
            />

            <Button
              type="button"
              className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  )
}

export default AddSubTask
