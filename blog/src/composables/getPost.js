export async function getPost(id) {
  try {
    const response = await fetch(`http://localhost:3000/posts/${id}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.id || !data.title || !data.content) {
      throw new Error('Invalid post structure from server')
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      tags: data.tags || []
    }
  } catch (error) {
    console.error('getPost error:', error)
    throw error
  }
}