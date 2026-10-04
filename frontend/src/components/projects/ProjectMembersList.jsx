import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import ProjectRoleBadge from './ProjectRoleBadge';
import MemberSelector from './MemberSelector';
import { PROJECT_ROLES } from '../../config/skills';
import { projectService } from '../../services/projectService';
import { ROUTES } from '../../config/routes';

export default function ProjectMembersList({
  projectId,
  members = [],
  isCreator = false,
  onMembersUpdated
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await projectService.updateMemberRole(projectId, userId, newRole);
      onMembersUpdated?.();
    } catch (err) {
      console.error('Failed to update member role:', err);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this teammate from the workspace?')) return;
    try {
      await projectService.removeMember(projectId, userId);
      onMembersUpdated?.();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleAddMembersSubmit = async () => {
    try {
      setIsAdding(true);
      for (const userId of selectedToAdd) {
        await projectService.addMember(projectId, userId, 'member');
      }
      setShowAddModal(false);
      setSelectedToAdd([]);
      onMembersUpdated?.();
    } catch (err) {
      console.error('Failed to add members:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Team Roster ({members.length} Members)
        </h4>

        {isCreator && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            <span>Add Teammate</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((member) => {
          const isLead = member.role === 'lead';

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Link to={ROUTES.PROFILE(member.id)}>
                  <Avatar
                    src={member.avatar_url}
                    name={member.full_name}
                    size="md"
                    className="cursor-pointer hover:ring-2 ring-primary-500/50"
                  />
                </Link>
                <div>
                  <Link
                    to={ROUTES.PROFILE(member.id)}
                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
                  >
                    {member.full_name}
                  </Link>
                  <div className="mt-1">
                    {isCreator && !isLead ? (
                      <select
                        value={member.role || 'member'}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="text-[10px] font-semibold py-0.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                      >
                        {PROJECT_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <ProjectRoleBadge role={member.role} />
                    )}
                  </div>
                </div>
              </div>

              {isCreator && !isLead && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Remove from project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Teammates Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Invite Teammates to Project"
        size="md"
      >
        <div className="space-y-4">
          <MemberSelector
            selectedMemberIds={selectedToAdd}
            onChange={setSelectedToAdd}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isAdding}
              disabled={selectedToAdd.length === 0}
              onClick={handleAddMembersSubmit}
            >
              Add Teammates
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
