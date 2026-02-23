
interface authState {
    isAuthenticated: boolean 
}
const saveToLocalStorage = (data: authState) => {
  localStorage.setItem('auth-state', JSON.stringify(data))
}

const loadFromLocalStorage = (): authState | null => {
  const data = localStorage.getItem('auth-state')
  if (!data) return null
  
  try {
    return JSON.parse(data) as authState
  } catch {
    return null
  }
}

export const useAuth = () => {
  return {
    saveToLocalStorage,
    loadFromLocalStorage,
  }
}