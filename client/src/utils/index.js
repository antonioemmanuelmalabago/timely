export function getInitials(fullName) {
  const names = fullName.split(' ')
  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase())
  const initialsStr = initials.join('')
  return initialsStr
}

export const formatDate = (date) => {
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const year = date.getFullYear()
  const formattedDate = `${day}-${month}-${year}`
  return formattedDate
}

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString)
  if (isNaN(inputDate)) {
    return 'Invalid Date'
  }
  const year = inputDate.getFullYear()
  const month = String(inputDate.getMonth() + 1).padStart(2, '0')
  const day = String(inputDate.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

export const PRIORITYSTYLES = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  normal: 'text-blue-600',
}

export const TASK_TYPE = {
  todo: 'bg-[#A88FEA]',
  'in progress': 'bg-[#A3E4D7]',
  completed: 'bg-[#FF8A65]',
}

export const BGS = [
  'bg-[#4A90E2]',
  'bg-[#A88FEA]',
  'bg-[#A3E4D7]',
  'bg-[#FF8A65]',
]
