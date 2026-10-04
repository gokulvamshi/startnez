import { api } from './api';
import { supabase } from '../lib/supabase';

export const uploadService = {
  async uploadImage(file, bucket = 'avatars') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      // Direct local object URL fallback
      return URL.createObjectURL(file);
    }
  }
};
