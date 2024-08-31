import React, { useState } from 'react'
import ModalWrapper from '../../components/ModalWrapper'
import { Dialog } from '@headlessui/react'
import Textbox from '../Textbox'
import { useForm } from 'react-hook-form'
import UserList from './UserList'
import SelectList from '../SelectList'
import { BiImages } from 'react-icons/bi'
import Button from '../../components/Button'
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../../utils/firebase'
import {
  useCreateTaskMutation,
  useGetAllTaskQuery,
  useUpdateTaskMutation,
} from '../../redux/slices/api/taskApiSlice'
import { toast } from 'sonner'
import { dateFormatter } from '../../utils'

const LISTS = ['TODO', 'IN PROGRESS', 'COMPLETED']
const PRIORITY = ['HIGH', 'MEDIUM', 'NORMAL', 'LOW']

const uploadedFileURLs = []

const AddTask = ({ open, setOpen, task }) => {
  const defaultValues = {
    title: task?.title || '',
    date: dateFormatter(task?.data || new Date()),
    team: [],
    stage: '',
    priority: '',
    assets: [],
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  const [team, setTeam] = useState(task?.team || [])
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0])
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  )
  const [assets, setAssets] = useState([])
  const [uploading, setUploading] = useState(false)

  const [createTask, { isLoading }] = useCreateTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const URLs = task?.assets ? [...task.assets] : []

  const submitHandler = async (data) => {
    for (const file of assets) {
      setUploading(true)
      try {
        await uploadFile(file)
      } catch (error) {
        console.log('Error uploading file: ', error.message)
        return
      } finally {
        setUploading(false)
      }
    }

    try {
      const newData = {
        ...data,
        assets: [...URLs, ...uploadedFileURLs],
        team,
        stage,
        priority,
      }

      const result = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap()

      toast.success(result.message)

      setTimeout(() => {
        setOpen(false)
        window.location.reload()
      }, 500)
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.error)
    }
  }

  const handleSelect = (e) => {
    setAssets(e.target.files)
  }

  const uploadFile = async (file) => {
    const storage = getStorage(app)

    const name = new Date().getTime() + file.name
    const storageRef = ref(storage, name)

    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log('Uploading')
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              uploadedFileURLs.push(downloadURL)
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        }
      )
    })
  }

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-lg font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? 'Update Task' : 'Add Task'}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register('title', { required: 'Title is required' })}
              error={errors.title ? errors.title.message : ''}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register('date', {
                    required: 'Date is required!',
                  })}
                  error={errors.date ? errors.date.message : ''}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  Uploading Assets
                </span>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-[#4A90E2] px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                />
              )}

              <Button
                label="Cancel"
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  )
}

export default AddTask
