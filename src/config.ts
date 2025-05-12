// Load environment variables
const getEnvVar = (key: string): string => {
  console.log(`Checking environment variable: ${key}`);
  const value = import.meta.env[key];
  console.log(`Value for ${key}:`, value ? 'Present' : 'Missing');
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

// Validate Vapi key format
const validateVapiKey = (key: string): boolean => {
  // Accept both public and private Vapi keys
  return key.startsWith('vapi_') || key.startsWith('cd5c9');
};

// Get and validate Vapi key
const vapiKey = getEnvVar('VITE_VAPI_KEY');
if (!validateVapiKey(vapiKey)) {
  console.error('Invalid Vapi API key format. Key should be a valid Vapi public or private key.');
}

// Default Vapi configuration
const DEFAULT_VAPI_KEY = 'vapi_public_1234567890abcdef'; // Replace with your actual default key if needed
const DEFAULT_ASSISTANT_ID = 'default';

// Log the final configuration
export const config = {
  vapi: {
    key: vapiKey,
    assistantId: getEnvVar('VITE_VAPI_ASSISTANT_ID') || DEFAULT_ASSISTANT_ID
  },
  api: {
    url: getEnvVar('VITE_LEAD_API_URL') || 'https://api.example.com'
  }
};

console.log('Final config:', {
  vapiKey: config.vapi.key ? 'Present' : 'Missing',
  assistantId: config.vapi.assistantId ? 'Present' : 'Missing',
  apiUrl: config.api.url
}); 