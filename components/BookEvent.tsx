'use client'

import React, { useState } from "react"

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTimeout(() => {
            setSubmitted(true)
        }, 1000);
    }
    return (
    <div id='book-event'>
        {submitted ? (
            <p className="text-sm">Thank you for signing up!</p>
        ) : (
            <form>
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

                <button className="button-submit" type="submit" onClick={e => e.preventDefault()}>Submit</button>
            </form>
        )}
    </div>
  )
}

export default BookEvent