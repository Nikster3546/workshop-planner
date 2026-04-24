import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login:  (data) => api.post('/auth/login', data),
  logout: ()     => api.post('/auth/logout'),
}

export const ordersApi = {
  getAll:  ()           => api.get('/orders/'),
  getById: (id)         => api.get(`/orders/${id}`),
  create:  (data)       => api.post('/orders/', data),
  update:  (id, data)   => api.put(`/orders/${id}`, data),
  delete:  (id)         => api.delete(`/orders/${id}`),
}

export const routesApi = {
  getAll:  ()           => api.get('/routes/'),
  getById: (id)         => api.get(`/routes/${id}`),
  create:  (data)       => api.post('/routes/', data),
  update:  (id, data)   => api.put(`/routes/${id}`, data),
  delete:  (id)         => api.delete(`/routes/${id}`),
}

export const workersApi = {
  getAll:  ()           => api.get('/workers/'),
  create:  (data)       => api.post('/workers/', data),
  update:  (id, data)   => api.put(`/workers/${id}`, data),
  delete:  (id)         => api.delete(`/workers/${id}`),
}

export const equipmentApi = {
  getAll:  ()           => api.get('/equipment/'),
  create:  (data)       => api.post('/equipment/', data),
  update:  (id, data)   => api.put(`/equipment/${id}`, data),
  delete:  (id)         => api.delete(`/equipment/${id}`),
}

export const scheduleApi = {
  getAll: ()     => api.get('/schedule/'),
  run:    (data) => api.post('/schedule/run', data),
  clear:  ()     => api.delete('/schedule/'),
}