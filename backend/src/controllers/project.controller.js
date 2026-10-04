const projectService = require('../services/project.service');
const { successResponse } = require('../utils/response');

class ProjectController {
  async getUserProjects(req, res, next) {
    try {
      const projects = await projectService.getUserProjects(req.user.id);
      return successResponse(res, projects);
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.projectId, req.user.id);
      return successResponse(res, project);
    } catch (err) {
      next(err);
    }
  }

  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.user.id, req.body);
      return successResponse(res, project, 201, 'Project workspace created');
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req, res, next) {
    try {
      const updated = await projectService.updateProject(req.params.projectId, req.user.id, req.body);
      return successResponse(res, updated, 200, 'Project updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.params.projectId, req.user.id);
      return successResponse(res, { message: 'Project deleted' });
    } catch (err) {
      next(err);
    }
  }

  async addMember(req, res, next) {
    try {
      const { user_id, role } = req.body;
      const member = await projectService.addMember(req.params.projectId, req.user.id, user_id, role);
      return successResponse(res, member, 201, 'Member added to project');
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req, res, next) {
    try {
      await projectService.removeMember(req.params.projectId, req.user.id, req.params.userId);
      return successResponse(res, { message: 'Member removed' });
    } catch (err) {
      next(err);
    }
  }

  async updateMemberRole(req, res, next) {
    try {
      const updated = await projectService.updateMemberRole(req.params.projectId, req.user.id, req.params.userId, req.body.role);
      return successResponse(res, updated, 200, 'Role updated');
    } catch (err) {
      next(err);
    }
  }

  // --- KANBAN ---
  async getKanban(req, res, next) {
    try {
      const cards = await projectService.getKanbanCards(req.params.projectId);
      return successResponse(res, cards);
    } catch (err) {
      next(err);
    }
  }

  async createKanbanCard(req, res, next) {
    try {
      const card = await projectService.createKanbanCard(req.params.projectId, req.user.id, req.body);
      return successResponse(res, card, 201, 'Card created');
    } catch (err) {
      next(err);
    }
  }

  async updateKanbanCard(req, res, next) {
    try {
      const card = await projectService.updateKanbanCard(req.params.cardId, req.body);
      return successResponse(res, card, 200, 'Card updated');
    } catch (err) {
      next(err);
    }
  }

  async moveKanbanCard(req, res, next) {
    try {
      const card = await projectService.updateKanbanCard(req.params.cardId, {
        status: req.body.status,
        display_order: req.body.display_order
      });
      return successResponse(res, card, 200, 'Card moved');
    } catch (err) {
      next(err);
    }
  }

  async deleteKanbanCard(req, res, next) {
    try {
      await projectService.deleteKanbanCard(req.params.cardId);
      return successResponse(res, { message: 'Card deleted' });
    } catch (err) {
      next(err);
    }
  }

  // --- FILES ---
  async getFiles(req, res, next) {
    try {
      const files = await projectService.getProjectFiles(req.params.projectId);
      return successResponse(res, files);
    } catch (err) {
      next(err);
    }
  }

  async addFile(req, res, next) {
    try {
      const file = await projectService.addProjectFile(req.params.projectId, req.user.id, req.body);
      return successResponse(res, file, 201, 'File registered');
    } catch (err) {
      next(err);
    }
  }

  async deleteFile(req, res, next) {
    try {
      await projectService.deleteProjectFile(req.params.fileId, req.user.id);
      return successResponse(res, { message: 'File deleted' });
    } catch (err) {
      next(err);
    }
  }

  // --- MESSAGES ---
  async getMessages(req, res, next) {
    try {
      const messages = await projectService.getMessages(req.params.projectId);
      return successResponse(res, messages);
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const message = await projectService.sendMessage(req.params.projectId, req.user.id, req.body);
      return successResponse(res, message, 201);
    } catch (err) {
      next(err);
    }
  }

  // --- LINKS ---
  async getLinks(req, res, next) {
    try {
      const links = await projectService.getLinks(req.params.projectId);
      return successResponse(res, links);
    } catch (err) {
      next(err);
    }
  }

  async addLink(req, res, next) {
    try {
      const link = await projectService.addLink(req.params.projectId, req.user.id, req.body);
      return successResponse(res, link, 201, 'Link saved');
    } catch (err) {
      next(err);
    }
  }

  async updateLink(req, res, next) {
    try {
      const updated = await projectService.updateLink(req.params.linkId, req.body);
      return successResponse(res, updated, 200, 'Link updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteLink(req, res, next) {
    try {
      await projectService.deleteLink(req.params.linkId);
      return successResponse(res, { message: 'Link deleted' });
    } catch (err) {
      next(err);
    }
  }

  // --- NOTES ---
  async getNotes(req, res, next) {
    try {
      const notes = await projectService.getNotes(req.params.projectId);
      return successResponse(res, notes);
    } catch (err) {
      next(err);
    }
  }

  async createNote(req, res, next) {
    try {
      const note = await projectService.createNote(req.params.projectId, req.user.id, req.body);
      return successResponse(res, note, 201, 'Note created');
    } catch (err) {
      next(err);
    }
  }

  async updateNote(req, res, next) {
    try {
      const updated = await projectService.updateNote(req.params.noteId, req.user.id, req.body);
      return successResponse(res, updated, 200, 'Note updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteNote(req, res, next) {
    try {
      await projectService.deleteNote(req.params.noteId);
      return successResponse(res, { message: 'Note deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProjectController();
