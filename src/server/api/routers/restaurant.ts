import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      try {
        return db.restaurant.findUnique({ where: { id: input.id } });
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.restaurant.create({
        data: {
          name: input.name,
        },
      });
    }),
});
