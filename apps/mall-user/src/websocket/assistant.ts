import { ref } from 'vue'

export const useAssistantSocket = () => {
  const connected = ref(false)
  const supported = ref(false)
  let socket: WebSocket | null = null

  const connect = (onMessage: (message: string) => void) => {
    const wsUrl = import.meta.env.VITE_MALL_USER_WS_URL
    if (!wsUrl) return false

    try {
      socket = new WebSocket(wsUrl)
      supported.value = true
      socket.onopen = () => {
        connected.value = true
      }
      socket.onmessage = (event) => {
        onMessage(String(event.data))
      }
      socket.onclose = () => {
        connected.value = false
      }
      socket.onerror = () => {
        connected.value = false
      }
      return true
    } catch {
      connected.value = false
      return false
    }
  }

  const send = (payload: unknown) => {
    if (socket && connected.value) {
      socket.send(JSON.stringify(payload))
      return true
    }
    return false
  }

  const close = () => {
    socket?.close()
    connected.value = false
  }

  return {
    connected,
    supported,
    connect,
    send,
    close,
  }
}
