import Notif from '../models/notification.js'
import Task from '../models/task.js'
import User from '../models/user.js'

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user

    const { title, team, stage, date, priority, assets } = req.body

    let text = 'New task has been assigned to you'
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others`
    }

    text =
      text +
      `. The task priority is set to ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!`

    const activity = {
      type: 'assigned',
      activity: text,
      by: userId,
    }

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: activity,
    })

    await Notif.create({
      team,
      text,
      task: task._id,
    })

    res
      .status(200)
      .json({ status: true, message: 'Task created successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)

    const newTask = await Task.create({
      ...task,
      title: 'Copy of ' + task.title,
    })

    newTask.team = task.team
    newTask.subTasks = task.subTasks
    newTask.assets = task.assets
    newTask.priority = task.priority
    newTask.stage = task.stage

    await newTask.save()

    let text = 'New task has been assigned to you'
    if (task.team.length > 1) {
      text = text + `and ${task.team.length - 1} others.`
    }

    text =
      text +
      `The task priority is set to ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!`

    await Notif.create({
      team: task.team,
      text,
      task: newTask._id,
    })

    res
      .status(200)
      .json({ status: true, message: 'Task duplicated successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.user
    const { type, activity } = req.body

    const task = await Task.findById(id)

    const data = {
      type,
      activity,
      by: userId,
    }

    task.activities.push(data)

    await task.save()

    res
      .status(200)
      .json({ status: true, message: 'Activity posted successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: 'team',
            select: 'name role title email',
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: 'team',
            select: 'name role title email',
          })
          .sort({ _id: -1 })

    const users = await User.find({ isActive: true })
      .select('name title role isAdmin isActive createdAt')
      .limit(10)
      .sort({ _id: -1 })

    // Group tasks by stage and calculate count
    const groupTasks = allTasks.reduce((result, task) => {
      const stage = task.stage

      if (!result[stage]) {
        result[stage] = 1
      } else {
        result[stage] += 1
      }

      return result
    }, {})

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task

        result[priority] = (result[priority] || 0) + 1

        return result
      }, {})
    ).map(([name, total]) => ({ name, total }))

    // Fetch no. of contributions per user
    const userContributions = allTasks.reduce((result, task) => {
      const { stage, team } = task

      team.forEach((member) => {
        const name = member.name

        // Find or create entry for user
        let user = result.find((user) => user.name === name)
        if (!user) {
          user = { name, todo: 0, 'in progress': 0, completed: 0 }
          result.push(user)
        }

        // Increase count for each priority
        switch (stage) {
          case 'todo':
            user.todo += 1
            break
          case 'in progress':
            user['in progress'] += 1
            break
          case 'completed':
            user.completed += 1
            break
          default:
            break
        }
      })

      // Sort users based on no. of completed tasks
      result.sort(function (a, b) {
        if (a.completed === b.completed) {
          if (a['in progress'] === b['in progress']) {
            return b.todo - a.todo
          } else {
            return b['in progress'] - a['in progress']
          }
        } else {
          return b.completed - a.completed
        }
      })

      return result
    }, [])

    // Calculate total tasks
    const totalTasks = allTasks.length
    const lastTenTask = allTasks?.slice(0, 10)

    // Calculate total tasks of previous month
    const groupLastMonthTasks = allTasks.reduce(
      (result, task) => {
        const stage = task.stage
        const taskDate = new Date(task.date)
        const now = new Date()

        // First day of previous month
        const startOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        )

        // Last day of the previous month
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

        if (taskDate >= startOfLastMonth && taskDate <= endOfLastMonth) {
          if (!result.lastMonthTasks[stage]) {
            result.lastMonthTasks[stage] = 1
          } else {
            result.lastMonthTasks[stage] += 1
          }

          result.totalTasks += 1
        }

        return result
      },
      { lastMonthTasks: {}, totalTasks: 0 }
    )

    const summary = {
      totalTasks,
      lastTenTask,
      users: isAdmin ? users : [],
      tasks: groupTasks,
      lastMonthTasks: groupLastMonthTasks,
      graphData: groupData,
      contributors: userContributions,
    }

    res.status(200).json({
      status: true,
      ...summary,
      message: 'Dashboard updated successfully',
    })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query
    const { userId, isAdmin } = req.user

    let query = {
      isTrashed: isTrashed ? true : false,
    }

    if (isAdmin) {
      query.team = { $all: [userId] }
    }

    if (stage) {
      query.stage = stage
    }

    let queryResult = Task.find(query)
      .populate({ path: 'team', select: 'name title email' })
      .sort({ _id: -1 })

    const tasks = await queryResult

    res.status(200).json({ status: true, tasks })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const getTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)
      .populate({
        path: 'team',
        select: 'name title role email',
      })
      .populate({ path: 'activities.by', select: 'name' })

    res.status(200).json({
      status: true,
      task,
    })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body
    const { id } = req.params

    const newSubtask = {
      title,
      date,
      tag,
    }

    const task = await Task.findById(id)

    task.subTasks.push(newSubtask)

    await task.save()

    res
      .status(200)
      .json({ status: true, message: 'Subtask added successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { title, date, team, stage, priority, assets } = req.body
    const { id } = req.params

    const task = await Task.findById(id)

    task.title = title
    task.date = date
    task.team = team
    task.stage = stage.toLowerCase()
    task.priority = priority.toLowerCase()
    task.assets = assets

    await task.save()

    res
      .status(200)
      .json({ status: true, message: 'Task updated successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)

    task.isTrashed = true

    await task.save()

    res
      .status(200)
      .json({ success: true, message: 'Task trashed successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params
    const { actionType } = req.query

    if (actionType === 'delete') {
      await Task.findByIdAndDelete(id)
    } else if (actionType === 'deleteAll') {
      await Task.deleteMany({ isTrashed: true })
    } else if (actionType === 'restore') {
      const task = await Task.findById(id)

      task.isTrashed = false

      await task.save()
    } else if (actionType === 'restoreAll')
      await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } })

    res
      .status(200)
      .json({ status: true, message: 'Operation performed successfully.' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}
