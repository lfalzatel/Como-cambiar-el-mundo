// API utility functions for the Event Management Application

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3000';

// Events API
export const eventsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  },

  create: async (eventData: {
    name: string;
    date: string;
    place: string;
    description: string;
    imageUrl?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  update: async (id: string, eventData: Partial<{
    name: string;
    date: string;
    place: string;
    description: string;
    imageUrl?: string;
  }>) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    return response.json();
  },
};

// Attendees API
export const attendeesApi = {
  getByEventId: async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/attendees?eventId=${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch attendees');
    }
    return response.json();
  },

  create: async (attendeeData: {
    name: string;
    email?: string;
    phone?: string;
    eventId: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/attendees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendeeData),
    });
    if (!response.ok) {
      throw new Error('Failed to add attendee');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/attendees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove attendee');
    }
    return response.json();
  },
};

// Experiences API
export const experiencesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/experiences`);
    if (!response.ok) {
      throw new Error('Failed to fetch experiences');
    }
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch experience');
    }
    return response.json();
  },

  create: async (experienceData: {
    title: string;
    description: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experienceData),
    });
    if (!response.ok) {
      throw new Error('Failed to create experience');
    }
    return response.json();
  },
};

// Ratings API
export const ratingsApi = {
  createEventRating: async (ratingData: {
    eventId: string;
    rating: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/event-ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });
    if (!response.ok) {
      throw new Error('Failed to rate event');
    }
    return response.json();
  },

  createExperienceRating: async (ratingData: {
    experienceId: string;
    rating: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/experience-ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });
    if (!response.ok) {
      throw new Error('Failed to rate experience');
    }
    return response.json();
  },
};

// Reports API
export const reportsApi = {
  getSummary: async (period: 'all' | 'month' | 'year' = 'all') => {
    const response = await fetch(`${API_BASE_URL}/api/reports/summary?period=${period}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report summary');
    }
    return response.json();
  },

  getEventsReport: async (options: {
    limit?: number;
    offset?: number;
    sortBy?: 'date' | 'rating' | 'attendees';
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${API_BASE_URL}/api/reports/events?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events report');
    }
    return response.json();
  },

  getExperiencesReport: async (options: {
    limit?: number;
    offset?: number;
    sortBy?: 'date' | 'rating';
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${API_BASE_URL}/api/reports/experiences?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch experiences report');
    }
    return response.json();
  },
};

// Error handling utility
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  console.error('API Error:', error);
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};