import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi, getProjectMembersApi, addProjectMemberApi, removeProjectMemberApi } from "../api/projectApi";
import { getAllUsersApi } from "../api/userApi";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try { const res = await getProjectsApi(); setProjects(res.data?.data || []); }
    catch (error) { console.error(error); alert('Không lấy được danh sách project'); }
  };
  const fetchUsers = async () => {
    try { const res = await getAllUsersApi(); setAllUsers(res.data?.data || res.data || []); }
    catch (error) { console.error(error); }
  };

  useEffect(() => { fetchProjects(); fetchUsers(); }, []);

  const resetForm = () => { setProjectName(''); setDescription(''); setSelectedUserId(''); setSelectedMembers([]); setEditingProjectId(null); };
  const handleCloseCreateModal = () => { setIsOpenCreateModal(false); resetForm(); };
  const handleCloseEditModal = () => { setIsOpenEditModal(false); resetForm(); };

  const handleOpenEditModal = async (project) => {
    setEditingProjectId(project.id); setProjectName(project.name || ''); setDescription(project.description || ''); setIsOpenEditModal(true);
    try { const res = await getProjectMembersApi(project.id); setSelectedMembers(res.data?.data || []); }
    catch (error) { console.error(error); alert('Không lấy được danh sách thành viên'); }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return alert('Vui lòng nhập tên project');
    try {
      const createRes = await createProjectApi({ name: projectName, description });
      const createdProject = createRes.data?.data || createRes.data;
      const projectId = createdProject?.id;
      for (const member of selectedMembers) {
        await addProjectMemberApi(projectId, { userId: member.id, role: 'MEMBER' });
      }
      await fetchProjects(); handleCloseCreateModal();
    } catch (error) { console.error(error); alert(error?.response?.data?.message || 'Tạo project thất bại'); }
  };

  const handleUpdateProject = async () => {
    if (!editingProjectId || !projectName.trim()) return alert('Vui lòng nhập tên project');
    try { await updateProjectApi(editingProjectId, { name: projectName, description }); await fetchProjects(); handleCloseEditModal(); }
    catch (error) { console.error(error); alert(error?.response?.data?.message || 'Cập nhật project thất bại'); }
  };

  const handleDeleteProject = async (projectId, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa project "${name}" không?`)) return;
    try { await deleteProjectApi(projectId); await fetchProjects(); }
    catch (error) { console.error(error); alert(error?.response?.data?.message || 'Xóa project thất bại'); }
  };

  const handleAddTempMemberForCreate = () => {
    if (!selectedUserId) return alert('Vui lòng chọn user');
    const selectedUser = allUsers.find((user) => String(user.id) === String(selectedUserId));
    if (!selectedUser) return;
    if (selectedMembers.some((member) => String(member.id) === String(selectedUser.id))) return alert('User này đã được thêm rồi');
    setSelectedMembers([...selectedMembers, selectedUser]); setSelectedUserId('');
  };

  const handleAddMemberForEdit = async () => {
    if (!editingProjectId || !selectedUserId) return alert('Vui lòng chọn user');
    const selectedUser = allUsers.find((user) => String(user.id) === String(selectedUserId));
    if (!selectedUser) return;
    if (selectedMembers.some((member) => String(member.id) === String(selectedUser.id))) return alert('User này đã có trong project');
    try { await addProjectMemberApi(editingProjectId, { userId: selectedUser.id, role: 'MEMBER' }); setSelectedMembers([...selectedMembers, selectedUser]); setSelectedUserId(''); }
    catch (error) { console.error(error); alert(error?.response?.data?.message || 'Thêm thành viên thất bại'); }
  };

  const handleRemoveMemberForEdit = async (userId) => {
    if (!editingProjectId) return;
    try { await removeProjectMemberApi(editingProjectId, userId); setSelectedMembers((prev) => prev.filter((member) => String(member.id) !== String(userId))); }
    catch (error) { console.error(error); alert(error?.response?.data?.message || 'Xóa thành viên thất bại'); }
  };

  const MemberPicker = ({ onAdd }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}>
          <option value="">Select user</option>
          {allUsers.map((user) => <option key={user.id} value={user.id}>{user.username}</option>)}
        </select>
        <button type="button" onClick={onAdd} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}>Add Member</button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {selectedMembers.map((member) => (
          <div key={member.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f3f4f6', padding: '6px 10px', borderRadius: 999 }}>
            <span>{member.username}</span>
            <button type="button" onClick={() => isOpenCreateModal ? setSelectedMembers(selectedMembers.filter((m)=>m.id!==member.id)) : handleRemoveMemberForEdit(member.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 999, padding: '2px 8px', cursor: 'pointer' }}>x</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout title="Projects">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Projects</h2>
          <p style={{ color: '#6b7280' }}>Danh sách các project bạn đang tham gia.</p>
        </div>
        <button onClick={() => { resetForm(); setIsOpenCreateModal(true); }} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, padding: '12px 16px', cursor: 'pointer' }}>+ Create Project</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {projects.map((project) => (
          <div key={project.id} style={{ background: 'white', borderRadius: 16, padding: 18, border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>{project.name}</h3>
            <p style={{ color: '#6b7280', minHeight: 40 }}>{project.description || 'No description'}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => navigate(`/tasks/${project.id}`)} style={{ background: '#111827', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Open</button>
              <button onClick={() => handleOpenEditModal(project)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDeleteProject(project.id, project.name)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {(isOpenCreateModal || isOpenEditModal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 640, background: 'white', borderRadius: 18, padding: 24 }}>
            <h3>{isOpenCreateModal ? 'Create Project' : 'Edit Project'}</h3>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #d1d5db', marginBottom: 12, boxSizing: 'border-box' }} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #d1d5db', marginBottom: 12, boxSizing: 'border-box' }} />
            <MemberPicker onAdd={isOpenCreateModal ? handleAddTempMemberForCreate : handleAddMemberForEdit} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={isOpenCreateModal ? handleCloseCreateModal : handleCloseEditModal} style={{ background: '#6b7280', color: 'white', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={isOpenCreateModal ? handleCreateProject : handleUpdateProject} style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}>{isOpenCreateModal ? 'Create' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
