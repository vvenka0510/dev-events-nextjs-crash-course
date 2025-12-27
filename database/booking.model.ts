import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          // Email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to verify that the referenced event exists
 * Throws an error if the event is not found in the database
 */
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or has been modified
  if (booking.isModified('eventId')) {
    try {
      // Import Event model to check if referenced event exists
      const Event = mongoose.models.Event || 
        (await import('./event.model')).default;

      const eventExists = await Event.exists({ _id: booking.eventId });

      if (!eventExists) {
        return next(
          new Error(`Event with ID ${booking.eventId} does not exist`)
        );
      }
    } catch (error) {
      return next(
        new Error(
          `Error validating event reference: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        )
      );
    }
  }

  next();
});

// Create and export Booking model
const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;