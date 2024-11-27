import { number, z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const bookingRouter = createTRPCRouter({
  getAllByRestaurantId: publicProcedure
    .input(z.object({ restaurantId: z.number() }))
    .query(({ input }) => {
      try {
        return db.booking.findFirst({
          where: { restaurantId: input.restaurantId },
          include: {
            table: true,
          },
        });
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        contactName: z.string().min(1),
        contactPhone: z.string().min(1),
        contactEmail: z.string().min(1),
        numberOfGuests: z.number().min(1),
        date: z.date(),
        tableId: z.number().min(1),
        restaurantId: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.booking.create({
        data: {
          contactName: input.contactName,
          contactPhone: input.contactPhone,
          contactEmail: input.contactEmail,
          numberOfGuests: input.numberOfGuests,
          date: input.date,
          table: {
            connect: {
              id: input.tableId,
            },
          },
          restaurant: {
            connect: {
              id: input.restaurantId,
            },
          },
        },
      });
    }),
});
