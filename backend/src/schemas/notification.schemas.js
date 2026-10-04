const { z } = require('zod');

const notificationTypes = [
  'connection_request',
  'connection_accepted',
  'post_like',
  'post_comment',
  'project_invite',
  'project_message',
  'startup_application',
  'startup_application_accepted',
  'startup_application_rejected',
  'mention'
];

const createNotificationSchema = z.object({
  recipient_id: z.string().uuid('Invalid recipient UUID'),
  type: z.enum(notificationTypes),
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().max(500).optional().nullable(),
  reference_id: z.string().uuid().optional().nullable(),
  reference_type: z.string().optional().nullable()
});

module.exports = {
  createNotificationSchema,
  notificationTypes
};
