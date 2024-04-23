import Request from './Request'

export const api = new Request({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
})
api.instance.interceptors.response.use((response) => {
  const { data } = response
  // 成功状态
  if (data.code === 1) {
    data.code = '0'
  }
  // 失败状态
  data.code === 0 ? data.code = '999' : data.code = data.code.toString()

  data.message = data.msg
  return response
})
