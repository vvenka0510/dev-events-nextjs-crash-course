'use server';

import { Booking } from '@/database';

import connectDB from '../mongodb';

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        // Only pass eventId and email to Booking.create (slug is not needed for booking)
        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
}