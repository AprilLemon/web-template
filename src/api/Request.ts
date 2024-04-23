import axios from 'axios'
import type { AxiosResponse, AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'
import { ElMessage } from 'element-plus'

enum TipStatus {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

export interface ResponseBase<T = any> {
  code: string,
  time: string,
  data: T
}

export default class Request {
  config: CreateAxiosDefaults
  instance: AxiosInstance

  constructor (config: CreateAxiosDefaults) {
    this.config = config
    this.instance = axios.create(config)
  }

  get<D = any> (config: AxiosRequestConfig): Promise<ResponseBase<D>> {
    return new Promise((resolve, reject) => {
      this.mergeConfig(config)
      if (config.data && Object.keys(config.data).length !== 0) {
        config.params = { ...config.data, ...config.params }
      }
      this.instance.request({
        method: 'get',
        ...config,
      }).then(res => {
        this.requestSuccess(res, resolve, reject)
      }).catch(e => {
        this.requestCatch(e, resolve, reject)
      })
    })
  }

  post<D = any> (config: AxiosRequestConfig): Promise<ResponseBase<D>> {
    return new Promise((resolve, reject) => {
      this.mergeConfig(config)
      this.instance.request({
        method: 'post',
        ...config,
      }).then(res => {
        this.requestSuccess(res, resolve, reject)
      }).catch(e => {
        this.requestCatch(e, resolve, reject)
      })
    })
  }

  postForm<D = any> (config: AxiosRequestConfig): Promise<ResponseBase<D>> {
    return new Promise((resolve, reject) => {
      this.mergeConfig(config)
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      this.instance.request({
        method: 'post',
        ...config,
      }).then(res => {
        this.requestSuccess(res, resolve, reject)
      }).catch(e => {
        this.requestCatch(e, resolve, reject)
      })
    })
  }

  upload<D = any> (config: AxiosRequestConfig): Promise<ResponseBase<D>> {
    return new Promise((resolve, reject) => {
      this.mergeConfig(config)
      if (Object.keys(config.data).length !== 0) {
        const formData = new FormData()
        for (const key in config.data) {
          formData.append(key, config.data[key])
        }
        config.data = formData
      }
      this.instance.request({
        method: 'post',
        ...config,
      }).then(res => {
        this.requestSuccess(res, resolve, reject)
      }).catch(e => {
        this.requestCatch(e, resolve, reject)
        reject(e)
      })
    })
  }

  mergeConfig (config: AxiosRequestConfig) {
    config = Object.assign({}, this.config, config)
    return config
  }

  requestSuccess (res: AxiosResponse, resolve: (val: any) => void, reject: (reason?: any) => void) {
    const { code, message } = res.data
    if (code !== '0') {
      this.customTip(TipStatus.error, message)
      reject(new Error(message))
      return
    }
    resolve(res.data)
  }

  requestCatch (e: any, resolve: (val: any) => void, reject: (reason?: any) => void) {
    this.customTip(TipStatus.error, `服务异常${e.response.status}`)
    reject(e)
  }

  customTip (type: TipStatus, message = ''): void {
    ElMessage({
      type: type,
      message,
    })
  }
}
