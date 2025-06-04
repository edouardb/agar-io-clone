
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

import { 
  createRoomInputSchema,
  joinRoomInputSchema,
  movePlayerInputSchema,
  splitPlayerInputSchema,
  consumeInputSchema,
  respawnPlayerInputSchema
} from './schema';

import { createRoom } from './handlers/create_room';
import { getRooms } from './handlers/get_rooms';
import { joinRoom } from './handlers/join_room';
import { getGameState } from './handlers/get_game_state';
import { movePlayer } from './handlers/move_player';
import { splitPlayer } from './handlers/split_player';
import { consume } from './handlers/consume';
import { respawnPlayer } from './handlers/respawn_player';
import { mergeCells } from './handlers/merge_cells';
import { generateFood } from './handlers/generate_food';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Room management
  createRoom: publicProcedure
    .input(createRoomInputSchema)
    .mutation(({ input }) => createRoom(input)),
    
  getRooms: publicProcedure
    .query(() => getRooms()),
    
  joinRoom: publicProcedure
    .input(joinRoomInputSchema)
    .mutation(({ input }) => joinRoom(input)),
    
  // Game state
  getGameState: publicProcedure
    .input(z.string())
    .query(({ input }) => getGameState(input)),
    
  // Player actions
  movePlayer: publicProcedure
    .input(movePlayerInputSchema)
    .mutation(({ input }) => movePlayer(input)),
    
  splitPlayer: publicProcedure
    .input(splitPlayerInputSchema)
    .mutation(({ input }) => splitPlayer(input)),
    
  consume: publicProcedure
    .input(consumeInputSchema)
    .mutation(({ input }) => consume(input)),
    
  respawnPlayer: publicProcedure
    .input(respawnPlayerInputSchema)
    .mutation(({ input }) => respawnPlayer(input)),
    
  mergeCells: publicProcedure
    .input(z.string())
    .mutation(({ input }) => mergeCells(input)),
    
  // Game mechanics
  generateFood: publicProcedure
    .input(z.object({
      roomId: z.string(),
      count: z.number().int().positive()
    }))
    .mutation(({ input }) => generateFood(input.roomId, input.count))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
