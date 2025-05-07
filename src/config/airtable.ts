import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.VITE_AIRTABLE_API_KEY
}).base(process.env.VITE_AIRTABLE_BASE_ID || '');

// Define table names
export const TABLES = {
  CONTACTS: 'Contacts',
  DEALS: 'Deals',
  ACTIVITIES: 'Activities'
};

// Define field names for Contacts table
export const CONTACT_FIELDS = {
  NAME: 'Name',
  EMAIL: 'Email',
  PHONE: 'Phone',
  COMPANY: 'Company',
  STATUS: 'Status',
  NOTES: 'Notes',
  CREATED_AT: 'Created At'
};

// Define field names for Deals table
export const DEAL_FIELDS = {
  NAME: 'Deal Name',
  AMOUNT: 'Amount',
  STAGE: 'Stage',
  CONTACT: 'Contact',
  CLOSE_DATE: 'Close Date',
  NOTES: 'Notes'
};

// Define field names for Activities table
export const ACTIVITY_FIELDS = {
  TYPE: 'Type',
  SUBJECT: 'Subject',
  CONTACT: 'Contact',
  DEAL: 'Deal',
  DUE_DATE: 'Due Date',
  STATUS: 'Status',
  NOTES: 'Notes'
};

export default base; 