'use client'

import React, { useState } from "react"
import { createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({eventId, slug}: {eventId: string, slug: string}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { success } = await createBooking({ eventId, slug, email });
        // TODO
        if(success) {
            setSubmitted(true);
            
        } else {
            console.error('Booking creation failed')
            
        }
    }
    return (
    <div id='book-event'>
        {submitted ? (
            <p className="text-sm">Thank you for signing up!</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email Address
                    </label>
                    <input
                        placeholder="Enter you email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id='email' 
                    />
                </div>

                <button className="button-submit" type="submit" >Submit</button>
            </form>
        )}
    </div>
  )
}

export default BookEvent