import base, { TABLES, CONTACT_FIELDS, DEAL_FIELDS, ACTIVITY_FIELDS } from '../config/airtable';

// Contact operations
export const contactService = {
  async getAll() {
    const records = await base(TABLES.CONTACTS).select().all();
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  },

  async create(data: any) {
    return await base(TABLES.CONTACTS).create(data);
  },

  async update(id: string, data: any) {
    return await base(TABLES.CONTACTS).update(id, data);
  },

  async delete(id: string) {
    return await base(TABLES.CONTACTS).destroy(id);
  }
};

// Deal operations
export const dealService = {
  async getAll() {
    const records = await base(TABLES.DEALS).select().all();
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  },

  async create(data: any) {
    return await base(TABLES.DEALS).create(data);
  },

  async update(id: string, data: any) {
    return await base(TABLES.DEALS).update(id, data);
  },

  async delete(id: string) {
    return await base(TABLES.DEALS).destroy(id);
  }
};

// Activity operations
export const activityService = {
  async getAll() {
    const records = await base(TABLES.ACTIVITIES).select().all();
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  },

  async create(data: any) {
    return await base(TABLES.ACTIVITIES).create(data);
  },

  async update(id: string, data: any) {
    return await base(TABLES.ACTIVITIES).update(id, data);
  },

  async delete(id: string) {
    return await base(TABLES.ACTIVITIES).destroy(id);
  }
}; 