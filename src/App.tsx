import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import heroImg from './assets/hero.jpg'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  FilePlus2,
  Filter,
  HeartHandshake,
  Info,
  Languages,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  NotebookPen,
  Pause,
  Pencil,
  Phone,
  Pill,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Repeat2,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Stethoscope,
  Trash2,
  UserPlus,
  UsersRound,
  Volume2,
  X,
} from 'lucide-react'
import {
  activity,
  appointments,
  careRecipient,
  currentUser,
  familyMembers,
  medications,
  notes,
  notifications,
  tasks as seedTasks,
  type GenericStatus,
  type Task,
} from './data'

type RouteKey = 'dashboard' | 'assistant' | 'tasks' | 'medications' | 'appointments' | 'care-notes' | 'family' | 'notifications' | 'settings'
type AssistantMode = 'idle' | 'recording' | 'processing' | 'clarification' | 'confirmation' | 'saved' | 'error'

type NavItem = {
  route: RouteKey
  label: string
  icon: LucideIcon
  badge?: string
}

const navItems: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: ListChecks },
  { route: 'assistant', label: 'AI assistant', icon: Sparkles, badge: 'Beta' },
  { route: 'tasks', label: 'Care tasks', icon: ClipboardCheck },
  { route: 'medications', label: 'Medications', icon: Pill },
  { route: 'appointments', label: 'Appointments', icon: CalendarDays },
  { route: 'care-notes', label: 'Care notes', icon: NotebookPen },
  { route: 'family', label: 'Family circle', icon: UsersRound },
  { route: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
]

const routeMeta: Record<RouteKey, { title: string; eyebrow: string; description: string; action: string }> = {
  dashboard: { title: 'Good morning, Aarav', eyebrow: 'Tuesday, 20 October 2026', description: 'Here’s what deserves attention today.', action: 'Open assistant' },
  assistant: { title: 'CareCircle assistant', eyebrow: 'Voice-first coordination', description: 'Ask in your own words. Review everything before it is saved.', action: 'New request' },
  tasks: { title: 'Care tasks', eyebrow: 'Shared responsibility', description: 'Keep the small, important things moving.', action: 'Create task' },
  medications: { title: 'Medication reminders', eyebrow: 'Today’s schedule', description: 'A clear record of what was scheduled, acknowledged, or missed.', action: 'Add reminder' },
  appointments: { title: 'Appointments', eyebrow: 'Maya’s care calendar', description: 'Upcoming visits, travel details, and who is taking the lead.', action: 'Add appointment' },
  'care-notes': { title: 'Care notes', eyebrow: 'Observations & summaries', description: 'Keep original observations close and summaries clearly labeled.', action: 'Add care note' },
  family: { title: 'Family circle', eyebrow: 'Shared care, visible ownership', description: 'See who is in the circle and how the work is distributed.', action: 'Invite member' },
  notifications: { title: 'Notifications', eyebrow: 'Activity & delivery', description: 'Know what was sent, missed, queued, or still needs a response.', action: 'Notification settings' },
  settings: { title: 'Settings', eyebrow: 'Your CareCircle preferences', description: 'Make the experience feel right for the way your family coordinates care.', action: 'Save changes' },
}

function routeFromPath(pathname: string): RouteKey {
  const clean = pathname.replace(/^\//, '').split('?')[0]
  if (clean === '' || clean === 'login' || clean === 'register') return 'dashboard'
  const known = navItems.find((item) => item.route === clean)
  return known?.route ?? 'dashboard'
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/ /g, '-')
  return <span className={`status-pill status-${key}`}><span className="status-dot" />{status}</span>
}

function Avatar({ label, tone = 'teal', size = 'md' }: { label: string; tone?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`avatar avatar-${tone} avatar-${size}`}>{label}</span>
}

function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="section-heading"><h2>{title}</h2>{action && <button className="text-button" onClick={onAction}>{action}<ArrowUpRight size={15} /></button>}</div>
}

function MetricCard({ label, value, caption, tone, onClick }: { label: string; value: string; caption: string; tone: string; onClick?: () => void }) {
  return <button className={`metric-card metric-${tone}`} onClick={onClick}><span className="metric-label">{label}</span><strong>{value}</strong><span className="metric-caption">{caption}</span><ArrowUpRight size={16} className="metric-arrow" /></button>
}

function PageHeader({ route, onAction }: { route: RouteKey; onAction: () => void }) {
  const meta = routeMeta[route]
  return <div className="page-header"><div><span className="eyebrow">{meta.eyebrow}</span><h1>{meta.title}</h1><p>{meta.description}</p></div><button className="primary-button" onClick={onAction}><Plus size={17} />{meta.action}</button></div>
}

function App() {
  const [path, setPath] = useState(window.location.pathname + window.location.search)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [taskComposerOpen, setTaskComposerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const route = routeFromPath(path)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname + window.location.search)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextRoute: string) => {
    const target = nextRoute.startsWith('/') ? nextRoute : `/${nextRoute}`
    window.history.pushState({}, '', target)
    setPath(target)
    setMobileOpen(false)
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }

  const openQuickAction = (action: 'task' | 'appointment' | 'note' | 'assistant') => {
    if (action === 'task') {
      navigate('/tasks')
      setTaskComposerOpen(true)
    } else if (action === 'assistant') navigate('/assistant')
    else if (action === 'note') navigate('/care-notes')
    else navigate('/appointments')
  }

  const completeTask = (id: string) => {
    setTasks((items) => items.map((task) => task.id === id ? { ...task, status: 'Completed' } : task))
    notify('Task marked complete. The circle is up to date.')
  }

  const handleHeaderAction = () => {
    if (route === 'dashboard') openQuickAction('assistant')
    if (route === 'assistant') notify('Ready for a new request.')
    if (route === 'tasks') { setTaskComposerOpen(true); return }
    if (route === 'care-notes') { navigate('/care-notes'); return }
    if (route === 'family') notify('Invite flow is ready to connect to your API.')
    if (route === 'appointments') notify('Appointment form is ready to connect to your API.')
    if (route === 'medications') notify('Medication schedules stay read-only until a caregiver confirms the source record.')
    if (route === 'notifications') notify('Notification preferences live in Settings.')
    if (route === 'settings') notify('Settings saved locally for this demo.')
  }

  if (window.location.pathname === '/login' || window.location.pathname === '/register') {
    return <AuthPage mode={window.location.pathname === '/register' ? 'register' : 'login'} onEnter={() => navigate('/dashboard')} />
  }

  return <div className="app-shell">
    <Sidebar route={route} navigate={navigate} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    <div className="app-main">
      <Topbar onMenu={() => setMobileOpen(true)} navigate={navigate} />
      <main className="main-content">
        <PageHeader route={route} onAction={handleHeaderAction} />
        {route === 'dashboard' && <Dashboard tasks={tasks} navigate={navigate} openQuickAction={openQuickAction} completeTask={completeTask} />}
        {route === 'assistant' && <Assistant notify={notify} />}
        {route === 'tasks' && <TasksPage tasks={tasks} setTasks={setTasks} composerOpen={taskComposerOpen} setComposerOpen={setTaskComposerOpen} completeTask={completeTask} notify={notify} />}
        {route === 'medications' && <MedicationsPage notify={notify} />}
        {route === 'appointments' && <AppointmentsPage notify={notify} />}
        {route === 'care-notes' && <NotesPage notify={notify} />}
        {route === 'family' && <FamilyPage notify={notify} />}
        {route === 'notifications' && <NotificationsPage navigate={navigate} />}
        {route === 'settings' && <SettingsPage notify={notify} />}
      </main>
    </div>
    {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button aria-label="Dismiss" onClick={() => setToast(null)}><X size={16} /></button></div>}
  </div>
}

function Sidebar({ route, navigate, mobileOpen, onClose }: { route: RouteKey; navigate: (route: string) => void; mobileOpen: boolean; onClose: () => void }) {
  return <>
    {mobileOpen && <button className="scrim" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><HeartHandshake size={21} /></span><div><strong>CareCircle</strong><span>AI</span></div></div>
      <div className="circle-switcher"><div className="circle-avatar">MS</div><div><span className="muted-label">CARE CIRCLE</span><strong>Maya’s circle</strong></div><ChevronDown size={16} /></div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        <span className="nav-label">Workspace</span>
        {navItems.slice(0, 2).map((item) => <NavLink key={item.route} item={item} active={route === item.route} navigate={navigate} />)}
        <span className="nav-label nav-label-spaced">Care records</span>
        {navItems.slice(2, 6).map((item) => <NavLink key={item.route} item={item} active={route === item.route} navigate={navigate} />)}
        <span className="nav-label nav-label-spaced">Circle</span>
        {navItems.slice(6).map((item) => <NavLink key={item.route} item={item} active={route === item.route} navigate={navigate} />)}
      </nav>
      <div className="sidebar-bottom"><div className="privacy-note"><ShieldCheck size={17} /><div><strong>Private by design</strong><span>Only your care circle can see these records.</span></div></div><div className="profile-mini"><Avatar label={currentUser.initials} tone="purple" size="sm" /><div><strong>{currentUser.name}</strong><span>{currentUser.role}</span></div><MoreHorizontal size={17} /></div></div>
    </aside>
  </>
}

function NavLink({ item, active, navigate }: { item: NavItem; active: boolean; navigate: (route: string) => void }) {
  const Icon = item.icon
  return <button className={`nav-link ${active ? 'nav-link-active' : ''}`} onClick={() => navigate(item.route)}><Icon size={18} /><span>{item.label}</span>{item.badge && <span className={`nav-badge ${item.badge === '2' ? 'nav-badge-alert' : ''}`}>{item.badge}</span>}</button>
}

function Topbar({ onMenu, navigate }: { onMenu: () => void; navigate: (route: string) => void }) {
  return <header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={onMenu}><Menu size={21} /></button><div className="topbar-context"><span className="context-pulse" /><span>Maya Singh</span><span className="topbar-divider" /><span className="topbar-zone">IST · UTC+5:30</span></div><div className="topbar-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => navigate('/notifications')}><Bell size={19} /><span /></button><button className="topbar-profile" aria-label="Open profile menu"><Avatar label={currentUser.initials} tone="purple" size="sm" /><ChevronDown size={15} /></button></div></header>
}

function Dashboard({ tasks, navigate, openQuickAction, completeTask }: { tasks: Task[]; navigate: (route: string) => void; openQuickAction: (action: 'task' | 'appointment' | 'note' | 'assistant') => void; completeTask: (id: string) => void }) {
  const pending = tasks.filter((task) => task.status === 'Pending').length
  const completed = tasks.filter((task) => task.status === 'Completed').length
  const overdue = tasks.filter((task) => task.status === 'Overdue').length
  const upcoming = tasks.filter((task) => task.status === 'Upcoming').length + appointments.length
  return <div className="page-stack">
    <div className="dashboard-layout"><section className="dashboard-primary">
      <div className="today-card"><div className="today-card-copy"><div className="today-kicker"><span className="sun-dot" />Tuesday, 20 October</div><h2>A little clarity goes a long way.</h2><p>Maya’s care plan is moving well. You have <strong>{overdue + pending} items</strong> that could use a look today.</p><button className="secondary-button" onClick={() => navigate('/tasks')}>Review today’s tasks <ArrowUpRight size={16} /></button></div><div className="today-orbit"><span className="orbit-ring orbit-ring-one" /><span className="orbit-ring orbit-ring-two" /><div className="orbit-center"><HeartHandshake size={27} /><span>MS</span></div><span className="orbit-caption">Maya<br /><small>in your care</small></span></div></div>
      <div className="metric-grid"><MetricCard label="Pending" value={String(pending)} caption="need an owner or next step" tone="teal" onClick={() => navigate('/tasks?filter=Pending')} /><MetricCard label="Completed" value={String(completed)} caption="closed by your circle" tone="purple" onClick={() => navigate('/tasks?filter=Completed')} /><MetricCard label="Overdue" value={String(overdue)} caption="should be checked first" tone="coral" onClick={() => navigate('/tasks?filter=Overdue')} /><MetricCard label="Upcoming" value={String(upcoming)} caption="in the next 48 hours" tone="amber" onClick={() => navigate('/appointments')} /></div>
      <section className="panel"><SectionHeading title="Today’s care plan" action="View all tasks" onAction={() => navigate('/tasks')} /><div className="task-list">{tasks.slice(0, 4).map((task) => <TaskRow key={task.id} task={task} onComplete={() => completeTask(task.id)} onOpen={() => navigate('/tasks')} />)}</div></section>
    </section><aside className="dashboard-rail">
      <section className="panel attention-panel"><SectionHeading title="Needs attention" /><div className="attention-item attention-danger"><span className="attention-icon"><AlertTriangle size={17} /></span><div><strong>1 overdue task</strong><span>Call the cardiology clinic</span></div><ChevronRight size={17} /></div><div className="attention-item attention-warn"><span className="attention-icon"><Pill size={17} /></span><div><strong>Medication missed</strong><span>Metformin · 1:00 PM</span></div><ChevronRight size={17} /></div><div className="attention-item attention-neutral"><span className="attention-icon"><MessageCircle size={17} /></span><div><strong>Awaiting confirmation</strong><span>Assistant draft from yesterday</span></div><ChevronRight size={17} /></div></section>
      <section className="panel"><SectionHeading title="Next up" action="Calendar" onAction={() => navigate('/appointments')} /><div className="upcoming-list"><UpcomingItem time="2:30 PM" label="Pick up prescription refill" meta="Aarav · Task" tone="teal" /><UpcomingItem time="7:30 PM" label="Set out evening medication" meta="Aarav · Reminder" tone="amber" /><UpcomingItem time="Fri, 4:00 PM" label="Physiotherapy session" meta="23 Oct · Appointment" tone="purple" /></div></section>
      <section className="panel activity-panel"><SectionHeading title="Family activity" action="See all" onAction={() => navigate('/family')} />{activity.map((item) => <div className="activity-row" key={`${item.actor}-${item.target}`}><Avatar label={item.initials} tone={item.tone} size="sm" /><div><p><strong>{item.actor}</strong> {item.action} <strong>{item.target}</strong></p><span>{item.time}</span></div></div>)}</section>
    </aside></div>
    <section className="quick-actions"><div><span className="eyebrow">Shortcuts for a busy day</span><h2>What would you like to do?</h2></div><div className="quick-action-grid"><QuickAction icon={ClipboardCheck} label="Create task" hint="Assign the next step" onClick={() => openQuickAction('task')} /><QuickAction icon={CalendarPlus} label="Add appointment" hint="Keep the calendar clear" onClick={() => openQuickAction('appointment')} /><QuickAction icon={FilePlus2} label="Add care note" hint="Capture an observation" onClick={() => openQuickAction('note')} /><QuickAction icon={Sparkles} label="Ask assistant" hint="Use voice or text" onClick={() => openQuickAction('assistant')} /></div></section>
  </div>
}

function TaskRow({ task, onComplete, onOpen }: { task: Task; onComplete: () => void; onOpen: () => void }) {
  return <div className="task-row"><button className={`check-button ${task.status === 'Completed' ? 'check-button-complete' : ''}`} aria-label={task.status === 'Completed' ? 'Completed' : `Mark ${task.title} complete`} onClick={onComplete}>{task.status === 'Completed' ? <Check size={15} /> : <span />}</button><button className="task-row-main" onClick={onOpen}><span className="task-row-title">{task.title}</span><span className="task-row-meta"><Avatar label={initials(task.assignee)} tone={task.assignee === 'Aarav' ? 'purple' : task.assignee === 'Priya' ? 'teal' : 'amber'} size="sm" />{task.assignee}<span className="meta-divider" />{task.due}</span></button><StatusPill status={task.status} /><button className="row-more" aria-label="More task actions"><MoreHorizontal size={18} /></button></div>
}

function UpcomingItem({ time, label, meta, tone }: { time: string; label: string; meta: string; tone: string }) {
  return <div className="upcoming-item"><span className={`timeline-dot timeline-${tone}`} /><div><strong>{time}</strong><span>{label}</span><small>{meta}</small></div></div>
}

function QuickAction({ icon: Icon, label, hint, onClick }: { icon: LucideIcon; label: string; hint: string; onClick: () => void }) {
  return <button className="quick-action" onClick={onClick}><span className="quick-action-icon"><Icon size={19} /></span><span><strong>{label}</strong><small>{hint}</small></span><ChevronRight size={17} /></button>
}

function Assistant({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<AssistantMode>('idle')
  const [draft, setDraft] = useState('Create a task to call the doctor tomorrow at 10 AM and assign it to Priya.')
  const [readAloud, setReadAloud] = useState(false)
  const [history, setHistory] = useState([{ role: 'assistant', text: 'Tell me what needs coordinating. I’ll show you the details before anything is saved.', time: 'Just now' }])

  const statusCopy: Record<AssistantMode, string> = { idle: 'Ready when you are', recording: 'Listening… tap stop when you’re done', processing: 'Processing request', clarification: 'Needs clarification', confirmation: 'Review before saving', saved: 'Saved and confirmed', error: 'Could not complete' }
  const isBusy = mode === 'processing'

  const startRecording = () => {
    if (mode === 'recording') {
      setMode('processing')
      window.setTimeout(() => { setDraft('Create a task to call the doctor tomorrow at 10 AM and assign it to Priya.'); setMode('confirmation'); setHistory((items) => [...items, { role: 'user', text: 'Call the doctor tomorrow at 10 AM and assign it to Priya.', time: 'Just now' }, { role: 'assistant', text: 'I’ve prepared a task for your review.', time: 'Just now' }]) }, 850)
    } else {
      setMode('recording')
    }
  }

  const submitText = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    if (draft.toLowerCase().includes('someone') || draft.toLowerCase().includes('which')) { setMode('clarification'); setHistory((items) => [...items, { role: 'user', text: draft, time: 'Just now' }, { role: 'assistant', text: 'I found more than one possible person. Which family member should I assign this to?', time: 'Just now' }]); return }
    setMode('processing')
    window.setTimeout(() => { setMode('confirmation'); setHistory((items) => [...items, { role: 'user', text: draft, time: 'Just now' }, { role: 'assistant', text: 'I’ve prepared a task for your review.', time: 'Just now' }]) }, 800)
  }

  const confirm = () => {
    setMode('processing')
    window.setTimeout(() => { setMode('saved'); setHistory((items) => [...items, { role: 'assistant', text: 'Task saved and assigned to Priya.', time: 'Just now' }]); notify('Task saved and assigned to Priya.') }, 700)
  }

  const reset = () => { setMode('idle'); setDraft(''); setHistory((items) => [...items, { role: 'assistant', text: 'Okay — nothing was saved. What would you like to try instead?', time: 'Just now' }]) }

  return <div className="assistant-layout"><section className="assistant-main"><div className="assistant-hero"><div className="assistant-orb"><span className="orb-glow" /><span className={`orb-core orb-${mode}`}><Sparkles size={30} /></span></div><img src={heroImg} className="hero-image" alt="Hero illustration" /><div><span className="eyebrow">Voice-first care coordination</span><h2>Say it simply.<br /><em>See it clearly.</em></h2><p>CareCircle turns a spoken request into a transparent next step — never a mystery action.</p></div></div><div className={`assistant-console console-${mode}`}><div className="console-top"><div><span className="console-status"><span className="live-dot" />{statusCopy[mode]}</span><span className="console-caption">Microphone access is optional. You can always type instead.</span></div><button className={`read-aloud-toggle ${readAloud ? 'toggle-on' : ''}`} onClick={() => setReadAloud(!readAloud)}><Volume2 size={16} />Read responses aloud<span className="toggle-track"><span /></span></button></div><div className="mic-stage"><button className={`mic-button mic-${mode}`} onClick={startRecording} disabled={isBusy} aria-label={mode === 'recording' ? 'Stop recording' : 'Start recording'}>{mode === 'recording' ? <Square size={24} fill="currentColor" /> : mode === 'processing' ? <RefreshCw size={25} className="spin" /> : mode === 'error' ? <MicOff size={25} /> : <Mic size={28} />}</button><span className="mic-label">{mode === 'recording' ? 'Tap to stop' : mode === 'processing' ? 'Working on it' : 'Tap to speak'}</span></div><form className="assistant-input" onSubmit={submitText}><input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Type a request" placeholder="Type a request, like “Remind Priya about the appointment”" disabled={isBusy} /><button className="send-button" aria-label="Send request" disabled={isBusy || !draft.trim()}><Send size={18} /></button></form><div className="mic-help">{mode === 'error' ? <><CircleAlert size={15} />Microphone access is unavailable. You can type your request instead.</> : mode === 'clarification' ? <><CircleHelp size={15} />Try adding the family member’s name so I can prepare the right action.</> : <><Info size={15} />Your request stays a draft until you confirm the proposed action.</>}</div></div><div className="permission-banner"><div className="permission-icon"><Mic size={18} /></div><div><strong>Microphone access is ready to use</strong><span>If your browser blocks it, choose the lock icon in the address bar or use the text box above.</span></div><button className="icon-button" aria-label="Check microphone access" onClick={() => { setMode('error'); notify('Microphone access is unavailable. You can type your request instead.') }}><ChevronRight size={17} /></button></div></section><aside className="assistant-side"><div className="panel conversation-panel"><SectionHeading title="Conversation" action="Clear" onAction={() => setHistory([])} /><div className="conversation-list">{history.map((item, index) => <div className={`conversation-item conversation-${item.role}`} key={`${item.time}-${index}`}><span className="conversation-avatar">{item.role === 'assistant' ? <Sparkles size={14} /> : <CircleUserRound size={15} />}</span><div><p>{item.text}</p><span>{item.time}</span></div></div>)}</div></div><ActionPreview mode={mode} draft={draft} onConfirm={confirm} onEdit={() => { setMode('idle'); notify('You can edit the request before sending it again.') }} onCancel={reset} /></aside></div>
}

function ActionPreview({ mode, draft, onConfirm, onEdit, onCancel }: { mode: AssistantMode; draft: string; onConfirm: () => void; onEdit: () => void; onCancel: () => void }) {
  const showCard = ['confirmation', 'saved', 'processing'].includes(mode)
  return <div className={`panel action-preview ${showCard ? 'action-preview-visible' : ''}`}><div className="preview-header"><div><span className="eyebrow">Proposed action</span><h3>{mode === 'saved' ? 'Confirmed task' : 'Review before saving'}</h3></div><span className={`preview-state state-${mode}`}>{mode === 'saved' ? <CheckCheck size={14} /> : <CircleAlert size={14} />}{mode === 'saved' ? 'Saved' : mode === 'processing' ? 'Processing' : 'Needs confirmation'}</span></div>{showCard ? <><div className="preview-callout"><Sparkles size={16} /><span>{draft || 'Create a task to call the doctor tomorrow at 10 AM and assign it to Priya.'}</span></div><div className="preview-fields"><PreviewField label="Action" value="Create care task" /><PreviewField label="Assigned to" value="Priya Singh" avatar="PS" /><PreviewField label="Due" value="Tomorrow · 10:00 AM IST" /><PreviewField label="Reminder" value="30 min before" /></div>{mode !== 'saved' && <div className="preview-actions"><button className="secondary-button" onClick={onEdit}><Pencil size={15} />Edit</button><button className="ghost-button" onClick={onCancel}>Cancel</button><button className="primary-button" onClick={onConfirm} disabled={mode === 'processing'}>{mode === 'processing' ? <RefreshCw size={15} className="spin" /> : <Check size={15} />}Confirm</button></div>}{mode === 'saved' && <div className="saved-confirmation"><CheckCircle2 size={20} /><span>Saved only after your confirmation. Your dashboard will update next.</span></div>}</> : <div className="preview-empty"><Sparkles size={22} /><p>When you ask me to create or change something, you’ll see the exact details here before anything is saved.</p></div>}</div>
}

function PreviewField({ label, value, avatar }: { label: string; value: string; avatar?: string }) {
  return <div className="preview-field"><span>{label}</span><strong>{avatar && <Avatar label={avatar} tone="teal" size="sm" />}{value}</strong></div>
}

function TasksPage({ tasks, setTasks, composerOpen, setComposerOpen, completeTask, notify }: { tasks: Task[]; setTasks: (tasks: Task[]) => void; composerOpen: boolean; setComposerOpen: (open: boolean) => void; completeTask: (id: string) => void; notify: (message: string) => void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(() => new URLSearchParams(window.location.search).get('filter') || 'All')
  const [newAssignee, setNewAssignee] = useState('Aarav')
  const [newDue, setNewDue] = useState('2026-10-21T09:00')
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')
  const visibleTasks = tasks.filter((task) => (filter === 'All' || task.status === filter) && task.title.toLowerCase().includes(search.toLowerCase()))
  const [newTitle, setNewTitle] = useState('')
  const addTask = (event: FormEvent) => { event.preventDefault(); if (!newTitle.trim()) return; const dueDate = new Date(newDue); const next: Task = { id: `task-${Date.now()}`, title: newTitle, assignee: newAssignee, due: dueDate.toLocaleString('en-IN', { weekday: 'short', hour: 'numeric', minute: '2-digit' }), dueLabel: dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), status: 'Pending', priority: newPriority, recipient: careRecipient.name, description: 'New task created from the CareCircle demo.' }; setTasks([next, ...tasks]); setNewTitle(''); setNewAssignee('Aarav'); setNewDue('2026-10-21T09:00'); setNewPriority('Medium'); setComposerOpen(false); notify(`Task created and assigned to ${newAssignee}.`) }
  return <div className="page-stack"><div className="toolbar-row"><div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search task title" aria-label="Search task title" /></div><div className="filter-group"><Filter size={16} />{['All', 'Pending', 'Overdue', 'Completed'].map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div>{composerOpen && <form className="composer-card" onSubmit={addTask}><div><span className="eyebrow">New care task</span><h2>What needs doing?</h2></div><label>Task title<input autoFocus required value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="e.g. Confirm transport for the clinic visit" /></label><div className="form-grid"><label>Assignee<select value={newAssignee} onChange={(event) => setNewAssignee(event.target.value)}><option>Aarav</option><option>Priya</option><option>Meera</option><option>Unassigned</option></select></label><label>Due date<input type="datetime-local" value={newDue} onChange={(event) => setNewDue(event.target.value)} /></label><label>Priority<select value={newPriority} onChange={(event) => setNewPriority(event.target.value as 'High' | 'Medium' | 'Low')}><option>High</option><option>Medium</option><option>Low</option></select></label></div><div className="composer-actions"><button type="button" className="ghost-button" onClick={() => setComposerOpen(false)}>Cancel</button><button className="primary-button"><Check size={16} />Create task</button></div></form>}<section className="panel"><div className="table-header"><div><span className="eyebrow">{visibleTasks.length} visible tasks</span><h2>Everything in one place</h2></div><button className="secondary-button"><SlidersHorizontal size={16} />More filters</button></div><div className="task-list task-list-large">{visibleTasks.map((task) => <TaskRow key={task.id} task={task} onComplete={() => completeTask(task.id)} onOpen={() => notify(`Opening details for “${task.title}”.`)} />)}</div>{visibleTasks.length === 0 && <EmptyState icon={ClipboardCheck} title="No tasks match that filter" body="Try clearing the search or choose another status." />}</section></div>
}

function MedicationsPage({ notify }: { notify: (message: string) => void }) {
  return <div className="page-stack"><div className="record-banner"><div className="record-banner-icon"><ShieldCheck size={20} /></div><div><strong>Source records stay in control.</strong><span>CareCircle shows medication schedules and events exactly as supplied by an authorized caregiver or source record.</span></div></div><section className="panel"><div className="table-header"><div><span className="eyebrow">3 active reminders</span><h2>Medication schedule</h2></div><div className="table-actions"><button className="secondary-button"><Filter size={16} />Filter</button><button className="secondary-button" onClick={() => notify('Medication records are read-only in this demo.')}><Pill size={16} />View source</button></div></div><div className="medication-list">{medications.map((medication) => <div className="medication-row" key={medication.name}><div className="med-icon"><Pill size={19} /></div><div className="med-main"><strong>{medication.name}</strong><span>{medication.dose} · {medication.note}</span></div><div className="med-time"><Clock3 size={16} /><strong>{medication.time}</strong><span>{medication.schedule} · {careRecipient.timezone}</span></div><div className="med-caregiver"><Avatar label={initials(medication.caregiver)} tone={medication.caregiver === 'Aarav' ? 'purple' : 'teal'} size="sm" /><span><small>Caregiver</small><strong>{medication.caregiver}</strong></span></div><div className="med-status"><StatusPill status={medication.status} /><div className="med-actions">{medication.status === 'Missed' && <><button className="small-button" onClick={() => notify('Acknowledgement recorded for review.')}>Acknowledge</button><button className="small-button" onClick={() => notify('Completion report sent to the care circle.')}>Report complete</button><button className="icon-button" aria-label="More medication actions"><MoreHorizontal size={17} /></button></>}</div></div></div>)}</div></section><div className="two-column"><section className="panel"><SectionHeading title="Reminder event history" /><div className="history-line"><span className="history-dot history-success" /><div><strong>Amlodipine reminder acknowledged</strong><span>Today at 8:12 AM · Priya</span></div><StatusPill status="Acknowledged" /></div><div className="history-line"><span className="history-dot history-warning" /><div><strong>Metformin reminder missed</strong><span>Today at 1:25 PM · No response yet</span></div><StatusPill status="Missed" /></div><div className="history-line"><span className="history-dot history-neutral" /><div><strong>Vitamin D3 reminder scheduled</strong><span>Sunday at 8:00 PM · Meera</span></div><StatusPill status="Scheduled" /></div></section><section className="panel quiet-panel"><div className="quiet-icon"><Info size={18} /></div><div><h3>Never guess a dose</h3><p>AI suggestions can help coordinate a reminder, but they cannot change a prescribed dose or source record.</p></div></section></div></div>
}

function AppointmentsPage({ notify }: { notify: (message: string) => void }) {
  return <div className="page-stack"><div className="calendar-strip"><div className="calendar-day calendar-day-active"><span>Tue</span><strong>20</strong><small>Today</small></div><div className="calendar-day"><span>Wed</span><strong>21</strong><small>Oct</small></div><div className="calendar-day"><span>Thu</span><strong>22</strong><small>Oct</small></div><div className="calendar-day"><span>Fri</span><strong>23</strong><small>Oct</small></div><div className="calendar-day"><span>Sat</span><strong>24</strong><small>Oct</small></div><button className="calendar-more"><CalendarDays size={19} /><span>Open calendar</span></button></div><section className="panel"><div className="table-header"><div><span className="eyebrow">October 2026</span><h2>Upcoming appointments</h2></div><div className="table-actions"><button className="secondary-button"><SlidersHorizontal size={16} />List view</button><button className="secondary-button" onClick={() => notify('Appointment form is ready to connect to your API.')}><Plus size={16} />Add appointment</button></div></div><div className="appointment-list">{appointments.map((appointment) => <div className="appointment-card" key={appointment.id}><div className="appointment-date"><span>{appointment.date.split(',')[0]}</span><strong>{appointment.date.split(' ')[1]}</strong><small>OCT</small></div><div className="appointment-info"><div className="appointment-title"><span className="eyebrow">{appointment.type}</span><h3>{appointment.title}</h3><p><Stethoscope size={15} />{appointment.clinician}</p></div><div className="appointment-meta"><span><Clock3 size={15} />{appointment.time} · {careRecipient.timezone}</span><span><MapPin size={15} />{appointment.location}</span><span><Avatar label={initials(appointment.caregiver)} tone="purple" size="sm" />{appointment.caregiver} is leading</span></div><p className="appointment-note"><Info size={15} />{appointment.note}</p></div><div className="appointment-actions"><StatusPill status={appointment.status} /><button className="icon-button" aria-label="Edit appointment" onClick={() => notify('Appointment details are ready to edit.')}><Pencil size={16} /></button><button className="icon-button" aria-label="More appointment actions"><MoreHorizontal size={17} /></button></div></div>)}</div></section></div>
}

function NotesPage({ notify }: { notify: (message: string) => void }) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const addNote = (event: FormEvent) => { event.preventDefault(); if (!noteText.trim()) return; setNoteText(''); setNoteOpen(false); notify('Care note saved to Maya’s record.') }
  return <div className="page-stack"><div className="notes-toolbar"><div className="search-box"><Search size={17} /><input placeholder="Search notes" aria-label="Search notes" /></div><div className="notes-toolbar-actions"><button className="secondary-button"><CalendarDays size={16} />Date range</button><button className="secondary-button" onClick={() => notify('AI summary would be generated from selected notes.')}><Sparkles size={16} />Generate summary</button></div></div>{noteOpen && <form className="composer-card note-composer" onSubmit={addNote}><div><span className="eyebrow">New observation</span><h2>What did you notice?</h2></div><label>Observation<textarea required rows={4} value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Write what happened, how Maya felt, or what the next caregiver should know." /></label><div className="composer-actions"><span className="form-hint"><Lock size={14} />Visible to your care circle only</span><div><button type="button" className="ghost-button" onClick={() => setNoteOpen(false)}>Cancel</button><button className="primary-button"><Check size={16} />Save note</button></div></div></form>}<section className="panel"><div className="table-header"><div><span className="eyebrow">3 original observations</span><h2>Recent care notes</h2></div><button className="primary-button" onClick={() => setNoteOpen(true)}><Plus size={16} />Add care note</button></div><div className="notes-list">{notes.map((note) => <article className="note-card" key={note.id}><div className={`note-accent note-accent-${note.tone}`} /><div className="note-card-main"><div className="note-card-header"><div><span className="note-tag">{note.tag}</span><h3>{note.date}</h3></div><button className="icon-button" aria-label="More note actions"><MoreHorizontal size={17} /></button></div><p>{note.body}</p><div className="note-footer"><span><Avatar label={initials(note.author)} tone={note.tone} size="sm" />{note.author}</span><button className="text-button" onClick={() => notify('Original note opened in detail view.')}>Open note <ChevronRight size={15} /></button></div></div></article>)}</div></section><section className="ai-summary-card"><div className="summary-spark"><Sparkles size={19} /></div><div><span className="eyebrow">AI-generated summary · review needed</span><h2>Steady mornings, with extra attention to mobility.</h2><p>Maya’s recent notes describe steady appetite and hydration. The family has noticed recurring right-knee stiffness and is practicing balance exercises with support.</p><div className="summary-meta"><span><FilePlus2 size={15} />Based on 3 source notes</span><span><Clock3 size={15} />Created today at 9:04 AM</span><button className="text-button" onClick={() => notify('Summary marked for review.')}>Flag for review</button></div></div></section></div>
}

function FamilyPage({ notify }: { notify: (message: string) => void }) {
  return <div className="page-stack"><div className="family-hero"><div className="family-hero-mark"><HeartHandshake size={28} /></div><div><span className="eyebrow">Current care circle</span><h2>Maya Singh</h2><p>78 years old · Bengaluru · {careRecipient.timezone}</p></div><div className="family-hero-right"><span className="online-dot" />3 members connected</div></div><div className="family-grid"><section className="panel"><div className="table-header"><div><span className="eyebrow">People with access</span><h2>Family members</h2></div><button className="secondary-button" onClick={() => notify('Invite flow is ready to connect to your API.')}><UserPlus size={16} />Invite member</button></div><div className="member-list">{familyMembers.map((member) => <div className="member-row" key={member.name}><Avatar label={member.initials} tone={member.initials === 'AS' ? 'purple' : member.initials === 'PS' ? 'teal' : 'amber'} size="md" /><div className="member-main"><strong>{member.name}</strong><span>{member.relation} · {member.role}</span></div><div className="member-status"><StatusPill status={member.status} /><small>{member.availability}</small></div><button className="icon-button" aria-label={`More actions for ${member.name}`}><MoreHorizontal size={17} /></button></div>)}</div></section><section className="panel balance-panel"><SectionHeading title="Responsibility balance" action="See workload" onAction={() => notify('Workload details opened.')} /><div className="balance-copy"><p>Priya is carrying a little more this week. A small re-balance could make the plan easier for everyone.</p><div className="balance-legend"><span><i className="legend-teal" />Completed</span><span><i className="legend-purple" />Assigned</span></div></div><div className="balance-bars">{familyMembers.map((member) => <div className="balance-row" key={member.name}><div><Avatar label={member.initials} tone={member.initials === 'AS' ? 'purple' : member.initials === 'PS' ? 'teal' : 'amber'} size="sm" /><span>{member.name.split(' ')[0]}</span></div><div className="bar-track"><span style={{ width: `${Math.max(18, member.tasks * 10)}%` }} /></div><strong>{member.tasks}</strong></div>)}</div></section></div><section className="permissions-card"><div className="permissions-icon"><ShieldCheck size={20} /></div><div><h3>Permissions stay visible</h3><p>Circle admins can invite members and edit assignments. Viewers can read shared records but cannot change medication or appointment details.</p></div><button className="secondary-button" onClick={() => notify('Role permissions opened.')}>View roles <ArrowUpRight size={15} /></button></section></div>
}

function NotificationsPage({ navigate }: { navigate: (route: string) => void }) {
  const [filter, setFilter] = useState('All')
  const visible = notifications.filter((item) => filter === 'All' || (filter === 'Unread' && item.unread) || item.kind === filter)
  return <div className="page-stack"><div className="toolbar-row"><div className="filter-group notification-filters"><Filter size={16} />{['All', 'Unread', 'Missed', 'Queued'].map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}{item === 'Unread' && <span className="filter-count">2</span>}</button>)}</div><button className="secondary-button"><CheckCheck size={16} />Mark all as read</button></div><section className="panel"><div className="table-header"><div><span className="eyebrow">{visible.length} notifications</span><h2>Keep the loop closed</h2></div><div className="delivery-legend"><span><i className="legend-teal" />Delivered</span><span><i className="legend-amber" />Queued</span><span><i className="legend-coral" />Needs attention</span></div></div><div className="notification-list">{visible.map((notification) => <div className={`notification-row ${notification.unread ? 'notification-unread' : ''}`} key={notification.id}><span className={`notification-icon notification-${notification.kind.toLowerCase()}`}>{notification.kind === 'Missed' ? <AlertTriangle size={17} /> : notification.kind === 'Queued' ? <Clock3 size={17} /> : notification.kind === 'Unread' ? <Mail size={17} /> : <CheckCheck size={17} />}</span><div className="notification-copy"><div><strong>{notification.title}</strong>{notification.unread && <span className="unread-dot" />}</div><p>{notification.body}</p><span>{notification.time} · {notification.channel} · {notification.related}</span></div><button className="text-button" onClick={() => navigate(`/${notification.related.toLowerCase()}`)}>Open <ChevronRight size={15} /></button></div>)}{visible.length === 0 && <EmptyState icon={Bell} title="Nothing here" body="There are no notifications in this view right now." />}</div></section></div>
}

function SettingsPage({ notify }: { notify: (message: string) => void }) {
  const [quietHours, setQuietHours] = useState(true)
  const [voice, setVoice] = useState(true)
  return <div className="settings-layout"><div className="settings-nav"><span className="eyebrow">Account</span><button className="settings-nav-active"><CircleUserRound size={17} />Profile</button><button><Bell size={17} />Notifications</button><button><Languages size={17} />Language & voice</button><button><Lock size={17} />Privacy & access</button></div><div className="settings-content"><section className="panel settings-card"><div className="settings-card-heading"><div><span className="eyebrow">Profile</span><h2>How your circle sees you</h2></div><button className="secondary-button" onClick={() => notify('Profile settings saved for this demo.')}><Check size={16} />Save</button></div><div className="profile-edit"><Avatar label={currentUser.initials} tone="purple" size="lg" /><button className="text-button">Change photo <Pencil size={14} /></button></div><div className="form-grid"><label>Full name<input defaultValue="Aarav Singh" /></label><label>Role<select defaultValue="Circle admin"><option>Circle admin</option><option>Caregiver</option><option>Viewer</option></select></label><label>Email address<input defaultValue="aarav@example.com" type="email" /></label><label>Time zone<select defaultValue="IST (UTC+5:30)"><option>IST (UTC+5:30)</option><option>GMT (UTC+0:00)</option><option>EST (UTC-5:00)</option></select></label></div></section><section className="panel settings-card"><div className="settings-card-heading"><div><span className="eyebrow">Preferences</span><h2>Make coordination feel lighter</h2></div></div><div className="setting-toggle-row"><div className="setting-icon"><Bell size={17} /></div><div><strong>Quiet hours</strong><span>No non-urgent notifications between 10:00 PM and 7:00 AM.</span></div><button className={`toggle ${quietHours ? 'toggle-active' : ''}`} onClick={() => setQuietHours(!quietHours)} aria-label="Toggle quiet hours"><span /></button></div><div className="setting-toggle-row"><div className="setting-icon"><Volume2 size={17} /></div><div><strong>Read assistant responses aloud</strong><span>Use voice playback when the assistant confirms a saved action.</span></div><button className={`toggle ${voice ? 'toggle-active' : ''}`} onClick={() => setVoice(!voice)} aria-label="Toggle read aloud"><span /></button></div><div className="setting-toggle-row"><div className="setting-icon"><Mail size={17} /></div><div><strong>Email activity digest</strong><span>A short summary of changes to your care circle each evening.</span></div><button className="toggle" aria-label="Toggle email digest"><span /></button></div></section><section className="danger-zone"><div><span className="eyebrow">Session</span><h3>Sign out of this device</h3><p>Sign out if you’re using a shared computer. Your care circle will stay safe.</p></div><button className="ghost-button danger-button"><LogOut size={16} />Sign out</button></section></div></div>
}

function AuthPage({ mode, onEnter }: { mode: 'login' | 'register'; onEnter: () => void }) {
  const isRegister = mode === 'register'
  return <div className="auth-screen"><div className="auth-brand"><span className="brand-mark"><HeartHandshake size={21} /></span><div><strong>CareCircle</strong><span>AI</span></div></div><div className="auth-card"><div className="auth-intro"><span className="eyebrow">{isRegister ? 'Create your circle' : 'Welcome back'}</span><h1>{isRegister ? 'Care works better together.' : 'A calmer way to coordinate care.'}</h1><p>{isRegister ? 'Set up a private space for the people who help Maya feel supported.' : 'Sign in to see what needs attention for Maya today.'}</p></div><form onSubmit={(event) => { event.preventDefault(); onEnter() }}><label>Email address<input type="email" required defaultValue={isRegister ? '' : 'aarav@example.com'} placeholder="you@example.com" /></label>{isRegister && <label>Your name<input required placeholder="Aarav Singh" /></label>}<label>Password<input type="password" required defaultValue={isRegister ? '' : '••••••••'} placeholder="At least 8 characters" /></label><button className="primary-button auth-submit">{isRegister ? 'Create account' : 'Sign in'}<ArrowUpRight size={16} /></button></form><div className="auth-note"><ShieldCheck size={15} />Your care records are private to your circle.</div><button className="auth-switch" onClick={() => { window.history.pushState({}, '', isRegister ? '/login' : '/register'); window.location.reload() }}>{isRegister ? 'Already have an account? Sign in' : 'New to CareCircle? Create an account'}</button></div><div className="auth-footer"><span>CareCircle AI</span><span>Private by design · {careRecipient.timezone}</span></div></div>
}

function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return <div className="empty-state"><span><Icon size={22} /></span><h3>{title}</h3><p>{body}</p></div>
}

export default App
