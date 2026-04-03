import api from './api';

export const incidentService = {
  async list(params?: { status?: string; type?: string; severity?: string; limit?: number; offset?: number }) {
    const { data } = await api.get('/incidents', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/incidents/${id}`);
    return data;
  },

  async getStats() {
    const { data } = await api.get('/incidents/stats');
    return data;
  },

  async create(incident: {
    camera_id: string;
    type: string;
    severity?: string;
    description?: string;
    confidence?: number;
  }) {
    const { data } = await api.post('/incidents', incident);
    return data;
  },

  async update(id: string, update: { status?: string; notes?: string }) {
    const { data } = await api.patch(`/incidents/${id}`, update);
    return data;
  },
};

export const cameraService = {
  async list() {
    const { data } = await api.get('/cameras');
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/cameras/${id}`);
    return data;
  },

  async create(camera: { name: string; location: string; stream_url: string; type?: string; map_x?: number; map_y?: number }) {
    const { data } = await api.post('/cameras', camera);
    return data;
  },

  async update(id: string, update: Partial<{ name: string; location: string; stream_url: string; status: string; map_x: number; map_y: number }>) {
    const { data } = await api.patch(`/cameras/${id}`, update);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/cameras/${id}`);
    return data;
  },
};

export const videoService = {
  async list(params?: { camera_id?: string; limit?: number; offset?: number }) {
    const { data } = await api.get('/videos', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/videos/${id}`);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/videos/${id}`);
    return data;
  },
};
