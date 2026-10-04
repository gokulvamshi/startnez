const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin, isLiveSupabaseConfigured } = require('../config/supabase');

class UploadService {
  async uploadFile(file, bucketName = 'project-files', folder = '') {
    if (!file) throw new Error('No file provided');

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from(bucketName)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (error) throw error;

        const { data: publicUrlData } = supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        return {
          file_name: file.originalname,
          file_url: publicUrlData?.publicUrl || filePath,
          file_size: file.size,
          file_type: file.mimetype
        };
      } catch (err) {
        console.error('Supabase storage upload error:', err);
      }
    }

    // Dev Fallback URL
    const fallbackUrl = file.mimetype.startsWith('image/')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
      : `https://mock-storage.hackconnect.dev/${bucketName}/${filePath}`;

    return {
      file_name: file.originalname,
      file_url: fallbackUrl,
      file_size: file.size,
      file_type: file.mimetype
    };
  }
}

module.exports = new UploadService();
