// Mock SDK for development
export function createClient(config) {
  // Mock implementation
  return {
    // Add mock methods as needed
    auth: {
      me: () => Promise.resolve({ id: 1, name: 'Mock User' }),
    },
    entities: {
      ContactSubmission: {
        create: (data) => Promise.resolve({ id: 1, ...data }),
      },
    },
    integrations: {
      Core: {
        SendEmail: (data) => Promise.resolve({ success: true }),
      },
    },
    agents: {
      createConversation: (opts) => Promise.resolve({ id: 'mock-conv-1', messages: [], ...opts }),
      addMessage: (conv, msg) => Promise.resolve({ ...msg, id: Date.now() }),
      subscribeToConversation: (id, callback) => {
        return () => {};
      },
    },
  };
}