import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const tableRouter = createTRPCRouter({
  findAllByRestaurantId: publicProcedure
    .input(z.object({ restaurantId: z.number() }))
    .query(({ input }) => {
      try {
        return db.table.findFirst({
          where: { restaurantId: input.restaurantId },
        });
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  create: publicProcedure
    .input(z.object({ capacity: z.number(), restaurantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.table.create({
        data: {
          capacity: input.capacity,
          restaurant: {
            connect: {
              id: input.restaurantId,
            },
          },
        },
      });
    }),
});
