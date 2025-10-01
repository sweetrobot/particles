import { supabase } from './supabase';

function generateEmbedCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function uploadImage(file) {
  const embedCode = generateEmbedCode();
  const fileExt = file.name.split('.').pop();
  const fileName = `${embedCode}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('particle-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('particle-images')
    .getPublicUrl(filePath);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  const { data, error } = await supabase
    .from('particle_images')
    .insert({
      title: file.name,
      original_url: publicUrl,
      width: img.width,
      height: img.height,
      file_size: file.size,
      mime_type: file.type,
      embed_code: embedCode
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getAllImages() {
  const { data, error } = await supabase
    .from('particle_images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getImageByEmbedCode(embedCode) {
  const { data, error } = await supabase
    .from('particle_images')
    .select('*')
    .eq('embed_code', embedCode)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteImage(id, originalUrl) {
  const fileName = originalUrl.split('/').pop();

  await supabase.storage
    .from('particle-images')
    .remove([fileName]);

  const { error } = await supabase
    .from('particle_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function incrementViewCount(id) {
  const { error } = await supabase.rpc('increment_view_count', { image_id: id });
  if (error) console.error('Failed to increment view count:', error);
}
