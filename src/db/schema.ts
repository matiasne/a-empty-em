import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  parentsAddressStreet: varchar('parents_address_street', { length: 255 }).notNull(),
  parentsAddressCity: varchar('parents_address_city', { length: 100 }).notNull(),
  parentsAddressState: varchar('parents_address_state', { length: 100 }).notNull(),
  parentsAddressZip: varchar('parents_address_zip', { length: 20 }).notNull(),
  parentsAddressCountry: varchar('parents_address_country', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert