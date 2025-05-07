/**
 * Upload a file to the server
 * @param {File} file File to upload
 * @returns {Promise} Promise with uploaded file URL
 */
export async function uploadProof(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/api/uploads', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload proof');
  }
  
  return res.json(); // Should return { url: 'uploaded_file_url' }
}
