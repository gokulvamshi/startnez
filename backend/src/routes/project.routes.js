const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
  createLinkSchema,
  updateLinkSchema,
  createNoteSchema,
  updateNoteSchema,
  sendMessageSchema
} = require('../schemas/project.schemas');
const {
  createKanbanCardSchema,
  updateKanbanCardSchema,
  moveKanbanCardSchema
} = require('../schemas/kanban.schemas');

router.use(authMiddleware);

// Project Core
router.get('/', projectController.getUserProjects);
router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/:projectId', projectController.getProjectById);
router.put('/:projectId', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

// Members
router.post('/:projectId/members', validate(addProjectMemberSchema), projectController.addMember);
router.delete('/:projectId/members/:userId', projectController.removeMember);
router.put('/:projectId/members/:userId/role', validate(updateProjectMemberRoleSchema), projectController.updateMemberRole);

// Kanban
router.get('/:projectId/kanban', projectController.getKanban);
router.post('/:projectId/kanban', validate(createKanbanCardSchema), projectController.createKanbanCard);
router.put('/kanban/:cardId', validate(updateKanbanCardSchema), projectController.updateKanbanCard);
router.put('/kanban/:cardId/move', validate(moveKanbanCardSchema), projectController.moveKanbanCard);
router.delete('/kanban/:cardId', projectController.deleteKanbanCard);

// Files
router.get('/:projectId/files', projectController.getFiles);
router.post('/:projectId/files', projectController.addFile);
router.delete('/files/:fileId', projectController.deleteFile);

// Messages / Chat
router.get('/:projectId/messages', projectController.getMessages);
router.post('/:projectId/messages', validate(sendMessageSchema), projectController.sendMessage);

// Links
router.get('/:projectId/links', projectController.getLinks);
router.post('/:projectId/links', validate(createLinkSchema), projectController.addLink);
router.put('/links/:linkId', validate(updateLinkSchema), projectController.updateLink);
router.delete('/links/:linkId', projectController.deleteLink);

// Notes
router.get('/:projectId/notes', projectController.getNotes);
router.post('/:projectId/notes', validate(createNoteSchema), projectController.createNote);
router.put('/notes/:noteId', validate(updateNoteSchema), projectController.updateNote);
router.delete('/notes/:noteId', projectController.deleteNote);

module.exports = router;
