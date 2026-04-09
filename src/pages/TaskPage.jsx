import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Layout from "../components/Layout";
import { getTasksByProjectApi, createTaskApi, moveTaskApi, updateTaskApi, updateTaskStatusApi, deleteTaskApi, searchTasksApi } from "../api/taskApi";
import { getProjectMembersApi, addProjectMemberApi, removeProjectMemberApi, getProjectPermissionApi } from "../api/projectApi";
import { getAllUsersApi } from "../api/userApi";

const STATUS_COLUMNS = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" },
];

function TaskCard({ task, index, onDeleteTask, onUpdateTask, onUpdateTaskStatus, members, canManageTasks, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusEditor, setShowStatusEditor] = useState(false);
  const [form, setForm] = useState({ title: task.title || "", description: task.description || "", status: task.status || "TODO", priority: task.priority || "MEDIUM", assigneeId: task.assigneeId || "" });
  const isAssignee = Number(task.assigneeId) === Number(currentUserId);
  const handleSave = async () => { await onUpdateTask(task.id, { ...form, assigneeId: form.assigneeId ? Number(form.assigneeId) : null }); setIsEditing(false); };
  const handleSaveStatus = async () => { await onUpdateTaskStatus(task.id, { status: form.status }); setShowStatusEditor(false); };
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.06)', ...provided.draggableProps.style }}>
          {!isEditing ? (<>
            <h4 style={{ margin: '0 0 8px' }}>{task.title}</h4>
            <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: 14 }}>{task.description || 'No description'}</p>
            <div style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>
              <div><strong>Status:</strong> {task.status}</div>
              <div><strong>Priority:</strong> {task.priority}</div>
              <div><strong>Assignee:</strong> {members.find((m) => Number(m.id) === Number(task.assigneeId))?.username || 'Unassigned'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {canManageTasks && <button onClick={() => setIsEditing(true)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Edit</button>}
              {canManageTasks && <button onClick={() => onDeleteTask(task.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Delete</button>}
              {!canManageTasks && isAssignee && <button onClick={() => setShowStatusEditor((prev) => !prev)} style={{ background: '#0f766e', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Change Status</button>}
            </div>
            {!canManageTasks && isAssignee && showStatusEditor && <div style={{ marginTop: 12, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 10 }}>
                <option value="TODO">TODO</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="DONE">DONE</option>
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveStatus} style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Save Status</button>
                <button onClick={() => setShowStatusEditor(false)} style={{ background: '#6b7280', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>}
          </>) : (<>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 8, boxSizing: 'border-box' }} />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Task description" rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 8, boxSizing: 'border-box' }} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 8 }}><option value="TODO">TODO</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="DONE">DONE</option></select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 8 }}><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select>
            <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 8 }}><option value="">Unassigned</option>{members.map((member)=><option key={member.id} value={member.id}>{member.username}</option>)}</select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSave} style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Save</button>
              <button onClick={() => setIsEditing(false)} style={{ background: '#6b7280', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </>)}
        </div>
      )}
    </Draggable>
  );
}

function BoardColumn({
  status,
  tasks,
  members,
  onCreateTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateTaskStatus,
  canCreateTask,
  canManageTasks,
  currentUserId
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', assigneeId: '' });
  const handleSubmit = async () => {
    if (!form.title.trim()) return alert('Task title is required');
    await onCreateTask({ title: form.title, description: form.description, status, priority: form.priority, assigneeId: form.assigneeId ? Number(form.assigneeId) : null });
    setForm({ title: '', description: '', priority: 'MEDIUM', assigneeId: '' }); setShowForm(false);
  };
  return (
    <div style={{ flex: 1, minWidth: 320, background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{status}</h3>
        {canCreateTask  && <button onClick={() => setShowForm(!showForm)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>+ Add task</button>}
      </div>
      {canCreateTask && showForm && <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <input placeholder="Task title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} style={{ width:'100%', padding:8, borderRadius:6, border:'1px solid #d1d5db', marginBottom:8, boxSizing:'border-box' }} />
        <textarea placeholder="Description" rows={3} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} style={{ width:'100%', padding:8, borderRadius:6, border:'1px solid #d1d5db', marginBottom:8, boxSizing:'border-box' }} />
        <select value={form.priority} onChange={(e)=>setForm({...form,priority:e.target.value})} style={{ width:'100%', padding:8, borderRadius:6, border:'1px solid #d1d5db', marginBottom:8 }}><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select>
        <select value={form.assigneeId} onChange={(e)=>setForm({...form,assigneeId:e.target.value})} style={{ width:'100%', padding:8, borderRadius:6, border:'1px solid #d1d5db', marginBottom:8 }}><option value="">Unassigned</option>{members.map((member)=><option key={member.id} value={member.id}>{member.username}</option>)}</select>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={handleSubmit} style={{ background:'#16a34a', color:'white', border:'none', borderRadius:6, padding:'6px 10px', cursor:'pointer' }}>Save</button>
          <button onClick={() => setShowForm(false)} style={{ background:'#6b7280', color:'white', border:'none', borderRadius:6, padding:'6px 10px', cursor:'pointer' }}>Cancel</button>
        </div>
      </div>}
      <Droppable droppableId={status}>
        {(provided) => <div ref={provided.innerRef} {...provided.droppableProps}>{tasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} members={members} onDeleteTask={onDeleteTask} onUpdateTask={onUpdateTask} onUpdateTaskStatus={onUpdateTaskStatus} canManageTasks={canManageTasks} currentUserId={currentUserId} />)}{provided.placeholder}</div>}
      </Droppable>
    </div>
  );
}

export default function TaskPage() {
  const { projectId } = useParams();
  const numericProjectId = Number(projectId);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [permission, setPermission] = useState(null);
  const [filters, setFilters] = useState({ title: '', status: '', priority: '' });

  const fetchTasks = async () => {
    try { const res = await getTasksByProjectApi({ projectId: numericProjectId, page: 0, size: 50, status: filters.status, priority: filters.priority }); setTasks(res?.data?.data?.content || []); }
    catch (error) { console.error(error); alert(error?.response?.data?.message || 'Lấy danh sách task thất bại'); }
  };
  const fetchMembers = async () => { try { const res = await getProjectMembersApi(numericProjectId); setMembers(res?.data?.data || []); } catch (error) { console.error(error); } };
  const fetchAllUsers = async () => { try { const res = await getAllUsersApi(); setAllUsers(res?.data?.data || res?.data || []); } catch (error) { console.error(error); } };
  const fetchPermission = async () => { try { const res = await getProjectPermissionApi(numericProjectId); setPermission(res?.data?.data || null); } catch (error) { console.error(error); setPermission(null); } };

  useEffect(() => { if (!numericProjectId) return; fetchTasks(); fetchMembers(); fetchAllUsers(); fetchPermission(); }, [numericProjectId]);

  const handleCreateTask = async (data) => { try { await createTaskApi({ ...data, projectId: numericProjectId }); await fetchTasks(); } catch (error) { alert(error?.response?.data?.message || 'Create task failed'); } };
  const handleUpdateTask = async (id, data) => { try { await updateTaskApi(id, data); await fetchTasks(); } catch (error) { alert(error?.response?.data?.message || 'Update task failed'); } };
  const handleUpdateTaskStatus = async (id, data) => { try { await updateTaskStatusApi(id, data); await fetchTasks(); } catch (error) { alert(error?.response?.data?.message || 'Update task status failed'); } };
  const handleDeleteTask = async (id) => { if (!window.confirm('Are you sure you want to delete this task?')) return; try { await deleteTaskApi(id); await fetchTasks(); } catch (error) { alert(error?.response?.data?.message || 'Delete task failed'); } };
  const handleAddMember = async () => { if (!selectedUserId) return alert('Please select a user'); try { await addProjectMemberApi(numericProjectId, { userId: Number(selectedUserId), role: 'MEMBER' }); setSelectedUserId(''); await fetchMembers(); } catch (error) { alert(error?.response?.data?.message || 'Add member failed'); } };
  const handleRemoveMember = async (userId) => { if (!window.confirm('Are you sure you want to remove this member?')) return; try { await removeProjectMemberApi(numericProjectId, userId); await fetchMembers(); await fetchTasks(); } catch (error) { alert(error?.response?.data?.message || 'Remove member failed'); } };
  const handleSearchTasks = async () => { try { const res = await searchTasksApi({ projectId: numericProjectId, title: filters.title, status: filters.status, priority: filters.priority, page: 0, size: 50 }); const content = res?.data?.content || res?.data?.data?.content || []; setTasks(content); } catch (error) { alert(error?.response?.data?.message || 'Search tasks failed'); } };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const taskId = Number(result.draggableId);
    const task = tasks.find((t) => Number(t.id) === taskId);
    if (!task) return;
    const currentUserId = permission?.userId;
    const canManageTasks = !!permission?.canManageTasks;
    const isAssignee = Number(task.assigneeId) === Number(currentUserId);
    const canMove = canManageTasks || isAssignee;
    if (!canMove) return alert('Bạn không có quyền di chuyển task này');
    const newStatus = result.destination.droppableId;
    const oldTasks = [...tasks];
    setTasks(tasks.map((t) => Number(t.id) === taskId ? { ...t, status: newStatus } : t));
    try { await moveTaskApi(taskId, { status: newStatus, orderIndex: result.destination.index + 1 }); } catch (error) { setTasks(oldTasks); alert(error?.response?.data?.message || 'Move task failed'); }
  };

  const canManageMembers = !!permission?.canManageMembers;
  const canManageTasks = !!permission?.canManageTasks;
  const currentUserId = permission?.userId;
  const canCreateTask = !!permission?.projectRole;
  const usersCanAdd = allUsers.filter((user) => !members.some((member) => Number(member.id) === Number(user.id)));

  return (
    <Layout title="Project Tasks">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div><h2 style={{ margin: '0 0 8px' }}>Project Tasks</h2><div style={{ color: '#6b7280', fontSize: 14 }}>Role: <strong>{permission?.projectRole || 'UNKNOWN'}</strong></div></div>
        {canManageMembers && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', minWidth: 200 }}>
            <option value="">Select user</option>{usersCanAdd.map((user) => <option key={user.id} value={user.id}>{user.username}</option>)}
          </select>
          <button onClick={handleAddMember} style={{ background:'#2563eb', color:'white', border:'none', borderRadius:8, padding:'10px 14px', cursor:'pointer' }}>+ Add Member</button>
        </div>}
      </div>
      <div style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, padding:16, marginBottom:20 }}>
        <h3 style={{ marginTop:0 }}>Members</h3>
        {members.length === 0 ? <p style={{ color:'#6b7280' }}>No members found</p> : <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>{members.map((member) => <div key={member.id} style={{ display:'flex', alignItems:'center', gap:8, background:'#f3f4f6', borderRadius:999, padding:'6px 10px' }}><span>{member.username}</span>{canManageMembers && Number(member.id)!==Number(currentUserId) && <button onClick={() => handleRemoveMember(member.id)} style={{ background:'#ef4444', color:'white', border:'none', borderRadius:999, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>Remove</button>}</div>)}</div>}
      </div>
      <div style={{ background:'white', border:'1px solid #e5e7eb', borderRadius:12, padding:16, marginBottom:20 }}>
        <h3 style={{ marginTop:0 }}>Search / Filter</h3>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <input placeholder="Search by title" value={filters.title} onChange={(e)=>setFilters({...filters,title:e.target.value})} style={{ padding:10, borderRadius:8, border:'1px solid #d1d5db', minWidth:220 }} />
          <select value={filters.status} onChange={(e)=>setFilters({...filters,status:e.target.value})} style={{ padding:10, borderRadius:8, border:'1px solid #d1d5db' }}><option value="">All Status</option><option value="TODO">TODO</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="DONE">DONE</option></select>
          <select value={filters.priority} onChange={(e)=>setFilters({...filters,priority:e.target.value})} style={{ padding:10, borderRadius:8, border:'1px solid #d1d5db' }}><option value="">All Priority</option><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select>
          <button onClick={handleSearchTasks} style={{ background:'#111827', color:'white', border:'none', borderRadius:8, padding:'10px 14px', cursor:'pointer' }}>Search</button>
          <button onClick={() => { setFilters({ title: '', status: '', priority: '' }); fetchTasks(); }} style={{ background:'#6b7280', color:'white', border:'none', borderRadius:8, padding:'10px 14px', cursor:'pointer' }}>Reset</button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display:'flex', gap:16, alignItems:'flex-start', overflowX:'auto' }}>
          {STATUS_COLUMNS.map((column) => (
            <BoardColumn
              key={column.key}
              status={column.key}
              tasks={tasks.filter((task) => task.status === column.key)}
              members={members}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              canCreateTask={canCreateTask}
              canManageTasks={canManageTasks}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </DragDropContext>
    </Layout>
  );
}
