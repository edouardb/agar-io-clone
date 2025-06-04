
import { pgTable, text, integer, boolean, timestamp, real, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const gameRoomsTable = pgTable('game_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  max_players: integer('max_players').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  is_active: boolean('is_active').default(true).notNull()
});

export const playersTable = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  room_id: uuid('room_id').notNull().references(() => gameRoomsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  x: real('x').notNull(),
  y: real('y').notNull(),
  size: real('size').notNull(),
  score: integer('score').default(0).notNull(),
  is_alive: boolean('is_alive').default(true).notNull(),
  last_active: timestamp('last_active').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const playerCellsTable = pgTable('player_cells', {
  id: uuid('id').primaryKey().defaultRandom(),
  player_id: uuid('player_id').notNull().references(() => playersTable.id, { onDelete: 'cascade' }),
  x: real('x').notNull(),
  y: real('y').notNull(),
  size: real('size').notNull(),
  can_merge_at: timestamp('can_merge_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const foodTable = pgTable('food', {
  id: uuid('id').primaryKey().defaultRandom(),
  room_id: uuid('room_id').notNull().references(() => gameRoomsTable.id, { onDelete: 'cascade' }),
  x: real('x').notNull(),
  y: real('y').notNull(),
  size: real('size').notNull(),
  color: text('color').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const gameRoomsRelations = relations(gameRoomsTable, ({ many }) => ({
  players: many(playersTable),
  food: many(foodTable)
}));

export const playersRelations = relations(playersTable, ({ one, many }) => ({
  room: one(gameRoomsTable, {
    fields: [playersTable.room_id],
    references: [gameRoomsTable.id]
  }),
  cells: many(playerCellsTable)
}));

export const playerCellsRelations = relations(playerCellsTable, ({ one }) => ({
  player: one(playersTable, {
    fields: [playerCellsTable.player_id],
    references: [playersTable.id]
  })
}));

export const foodRelations = relations(foodTable, ({ one }) => ({
  room: one(gameRoomsTable, {
    fields: [foodTable.room_id],
    references: [gameRoomsTable.id]
  })
}));

// Export all tables for proper query building
export const tables = {
  gameRooms: gameRoomsTable,
  players: playersTable,
  playerCells: playerCellsTable,
  food: foodTable
};
