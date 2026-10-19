export type TaskStatus = 'Pending' | 'Completed' | 'Overdue' | 'Upcoming'
export type GenericStatus = 'Scheduled' | 'Acknowledged' | 'Missed' | 'Failed' | 'Sent' | 'Completed' | 'Cancelled' | 'Queued' | 'Delivered' | 'Unread' | 'Read'

export type Task = {
  id: string
  title: string
  assignee: string
  due: string
  dueLabel: string
  status: TaskStatus
  priority: 'High' | 'Medium' | 'Low'
  recipient: string
  description: string
}

export const careRecipient = {
  name: 'Maya Singh',
  age: 78,
  initials: 'MS',
  relationship: 'Mom',
  timezone: 'IST (UTC+5:30)',
}

export const currentUser = {
  name: 'Aarav Singh',
  role: 'Circle admin',
  initials: 'AS',
}

export const tasks: Task[] = [
  { id: 'task-1', title: 'Call the cardiology clinic', assignee: 'Priya', due: 'Today, 10:00 AM', dueLabel: '10:00 AM', status: 'Overdue', priority: 'High', recipient: 'Maya Singh', description: 'Confirm whether Maya should continue the new blood pressure medication.' },
  { id: 'task-2', title: 'Pick up prescription refill', assignee: 'Aarav', due: 'Today, 2:30 PM', dueLabel: '2:30 PM', status: 'Pending', priority: 'High', recipient: 'Maya Singh', description: 'Collect the 30-day refill from Green Cross Pharmacy.' },
  { id: 'task-3', title: 'Check in after lunch', assignee: 'Priya', due: 'Today, 1:00 PM', dueLabel: '1:00 PM', status: 'Completed', priority: 'Medium', recipient: 'Maya Singh', description: 'Quick call to check appetite, hydration and energy.' },
  { id: 'task-4', title: 'Set out evening medication', assignee: 'Aarav', due: 'Today, 7:30 PM', dueLabel: '7:30 PM', status: 'Upcoming', priority: 'Medium', recipient: 'Maya Singh', description: 'Place the labeled evening organizer next to the kettle.' },
  { id: 'task-5', title: 'Review physiotherapy exercises', assignee: 'Meera', due: 'Tomorrow, 9:00 AM', dueLabel: 'Tomorrow', status: 'Upcoming', priority: 'Low', recipient: 'Maya Singh', description: 'Go through the new balance exercises together.' },
]

export const medications = [
  { name: 'Amlodipine', dose: '5 mg · 1 tablet', time: '8:00 AM', schedule: 'Daily · started 04 Oct 2026', caregiver: 'Priya', status: 'Acknowledged' as GenericStatus, note: 'Morning dose' },
  { name: 'Metformin', dose: '500 mg · 1 tablet', time: '1:00 PM', schedule: 'Daily · with lunch', caregiver: 'Aarav', status: 'Missed' as GenericStatus, note: 'Confirm with caregiver before rescheduling' },
  { name: 'Vitamin D3', dose: '1000 IU · 1 capsule', time: '8:00 PM', schedule: 'Every Sunday', caregiver: 'Meera', status: 'Scheduled' as GenericStatus, note: 'Sunday organizer' },
]

export const appointments = [
  { id: 'apt-1', title: 'Cardiology follow-up', type: 'Specialist visit', clinician: 'Dr. Neha Rao', location: 'Apollo Clinic · Indiranagar', date: 'Thu, 22 Oct', time: '11:30 AM', caregiver: 'Priya', status: 'Scheduled' as GenericStatus, note: 'Bring the latest blood pressure log.' },
  { id: 'apt-2', title: 'Physiotherapy session', type: 'Home visit', clinician: 'Rohan Mehta, PT', location: 'Maya’s home', date: 'Fri, 23 Oct', time: '4:00 PM', caregiver: 'Aarav', status: 'Scheduled' as GenericStatus, note: 'Focus: balance and confidence on stairs.' },
  { id: 'apt-3', title: 'Routine blood work', type: 'Lab appointment', clinician: 'Green Cross Diagnostics', location: 'Koramangala · 2nd floor', date: 'Mon, 26 Oct', time: '8:15 AM', caregiver: 'Meera', status: 'Scheduled' as GenericStatus, note: 'Fasting required. Confirm transport the day before.' },
]

export const notes = [
  { id: 'note-1', author: 'Priya', date: 'Today · 8:42 AM', tag: 'Morning check-in', body: 'Maya felt steady after breakfast and finished a full glass of water. She mentioned mild stiffness in her right knee, but no new pain.', tone: 'teal' },
  { id: 'note-2', author: 'Aarav', date: 'Yesterday · 7:18 PM', tag: 'Evening routine', body: 'Evening medication was taken with dinner. Maya was in good spirits and asked about the garden visit this weekend.', tone: 'amber' },
  { id: 'note-3', author: 'Meera', date: '18 Oct · 3:06 PM', tag: 'Home visit', body: 'Practiced the sit-to-stand exercise three times. Maya preferred holding the chair arm for balance.', tone: 'purple' },
]

export const familyMembers = [
  { name: 'Aarav Singh', role: 'Circle admin', relation: 'Son', initials: 'AS', status: 'Active', tasks: 5, availability: 'Usually available mornings' },
  { name: 'Priya Singh', role: 'Caregiver', relation: 'Daughter', initials: 'PS', status: 'Active', tasks: 7, availability: 'Available today until 6 PM' },
  { name: 'Meera Kapoor', role: 'Viewer', relation: 'Family friend', initials: 'MK', status: 'Invited', tasks: 2, availability: 'Invite sent 16 Oct' },
]

export const notifications = [
  { id: 'n-1', title: 'Metformin reminder was missed', body: 'Maya’s 1:00 PM reminder still needs acknowledgement.', time: '14 min ago', kind: 'Missed', channel: 'Push', related: 'Medications', unread: true },
  { id: 'n-2', title: 'Priya completed “Check in after lunch”', body: 'The task was marked complete from the mobile app.', time: '1 hr ago', kind: 'Delivered', channel: 'Activity', related: 'Tasks', unread: false },
  { id: 'n-3', title: 'Cardiology follow-up is coming up', body: 'Thu, 22 Oct at 11:30 AM · Apollo Clinic', time: 'Yesterday', kind: 'Queued', channel: 'Email', related: 'Appointments', unread: false },
  { id: 'n-4', title: 'New family member invited', body: 'Meera Kapoor has not accepted the circle invitation yet.', time: '3 days ago', kind: 'Unread', channel: 'Email', related: 'Family', unread: true },
]

export const activity = [
  { actor: 'Priya', action: 'completed', target: 'Check in after lunch', time: '1 hour ago', initials: 'PS', tone: 'teal' },
  { actor: 'Aarav', action: 'assigned', target: 'Pick up prescription refill', time: '2 hours ago', initials: 'AS', tone: 'purple' },
  { actor: 'Meera', action: 'added a note', target: 'Home visit', time: 'Yesterday', initials: 'MK', tone: 'amber' },
]
