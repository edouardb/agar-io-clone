
import { z } from 'zod';

// Game Room schema
export const gameRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  max_players: z.number().int().positive(),
  created_at: z.coerce.date(),
  is_active: z.boolean()
});

export type GameRoom = z.infer<typeof gameRoomSchema>;

// Player schema
export const playerSchema = z.object({
  id: z.string(),
  room_id: z.string(),
  name: z.string(),
  color: z.string(),
  x: z.number(),
  y: z.number(),
  size: z.number().positive(),
  score: z.number().int().nonnegative(),
  is_alive: z.boolean(),
  last_active: z.coerce.date(),
  created_at: z.coerce.date()
});

export type Player = z.infer<typeof playerSchema>;

// Player Cell schema (for split mechanics)
export const playerCellSchema = z.object({
  id: z.string(),
  player_id: z.string(),
  x: z.number(),
  y: z.number(),
  size: z.number().positive(),
  can_merge_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type PlayerCell = z.infer<typeof playerCellSchema>;

// Food schema
export const foodSchema = z.object({
  id: z.string(),
  room_id: z.string(),
  x: z.number(),
  y: z.number(),
  size: z.number().positive(),
  color: z.string(),
  created_at: z.coerce.date()
});

export type Food = z.infer<typeof foodSchema>;

// Input schemas
export const createRoomInputSchema = z.object({
  name: z.string().min(1).max(50),
  max_players: z.number().int().min(2).max(100)
});

export type CreateRoomInput = z.infer<typeof createRoomInputSchema>;

export const joinRoomInputSchema = z.object({
  room_id: z.string(),
  player_name: z.string().min(1).max(20),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/) // Hex color validation
});

export type JoinRoomInput = z.infer<typeof joinRoomInputSchema>;

export const movePlayerInputSchema = z.object({
  player_id: z.string(),
  x: z.number(),
  y: z.number()
});

export type MovePlayerInput = z.infer<typeof movePlayerInputSchema>;

export const splitPlayerInputSchema = z.object({
  player_id: z.string(),
  direction_x: z.number().min(-1).max(1),
  direction_y: z.number().min(-1).max(1)
});

export type SplitPlayerInput = z.infer<typeof splitPlayerInputSchema>;

export const consumeInputSchema = z.object({
  player_id: z.string(),
  target_type: z.enum(['food', 'player']),
  target_id: z.string()
});

export type ConsumeInput = z.infer<typeof consumeInputSchema>;

export const respawnPlayerInputSchema = z.object({
  player_id: z.string()
});

export type RespawnPlayerInput = z.infer<typeof respawnPlayerInputSchema>;

// Game state response schema
export const gameStateSchema = z.object({
  room: gameRoomSchema,
  players: z.array(playerSchema),
  cells: z.array(playerCellSchema),
  food: z.array(foodSchema),
  leaderboard: z.array(z.object({
    player_id: z.string(),
    name: z.string(),
    score: z.number().int().nonnegative()
  }))
});

export type GameState = z.infer<typeof gameStateSchema>;
