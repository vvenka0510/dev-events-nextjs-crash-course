import BookEvent from '@/components/BookEvent';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const EventDetailItem = ({icon, alt, label}: {icon: string, alt: string, label: string}) => (
  <div className='flex-row-gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
  <div className='agenda'>
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map(agenda => (
        <li key={agenda}>{agenda}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({tags}: {tags: string[]}) => (
  <div className='flex flex-row gap-1.5 flex-wrap'>
    {tags.map(tag => (
      <div className='pill' key={tag}>{tag}</div>      
    ))}

  </div>
)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const EventDetailsPage = async({params}: {params: Promise<{slug: string}>}) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event : {description, overview, image, location, date, time, mode, audience, agenda, organizer, tags} } = await request.json();

  let booking = 10;

  const similarEvents = await getSimilarEventsBySlug(slug);
  const serializedEvents: IEvent[] = JSON.parse(JSON.stringify(similarEvents));

  if(!description) return notFound();
    return (
    <section id="event">
        {/* <h1>Event Details: <br /> {slug}</h1> */}
        <div className='header'>
          <h1>Event Description</h1>
          <p className='mt-2'>{description}</p>
        </div>

        <div className='details'>
            {/** left */}
            <div className='content'>
                <Image src={image} alt="Event banner" width={800} height={800} className="banner" />

                <section className='flex-col-gap-2'>
                  <h2>Overview</h2>
                  <p>{overview}</p>
                </section>

                <section className='flex-col-gap-2'>
                  <h2>Event Details</h2>

                  <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={date} />
                  <EventDetailItem icon='/icons/clock.svg' alt='clock' label={time} />
                  <EventDetailItem icon='/icons/pin.svg' alt='location' label={location} />
                  <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
                  <EventDetailItem icon='/icons/audience.svg' alt='audience' label={audience} />
                </section>

                <EventAgenda agendaItems={agenda} />

                <section className='flex-col-gap-2' >
                  <h2>About the Organizer</h2>
                  <p>{organizer}</p>
                </section>

                <EventTags tags={tags} />
            </div>

            {/**Right */}
            <aside className='booking'>
              <div className='signup-card'>
                <h2>Book your spot</h2>
                {booking > 0 ? (
                  <p className='text-sm'>
                    Join {booking} people who have already booked their spot!
                  </p>
                ) : (
                  <p className='text-sm'>Be the first to book your spot!</p>
                )}

                <BookEvent />
              </div>
            </aside>
        </div>
        <div className='flex w-full flex-col gap-4 pt-20'>
          <h2>Similar Events</h2>
          <div className='events'>
            {serializedEvents?.length > 0 && serializedEvents.map((simialrEvent : IEvent) => (
              <EventCard key={simialrEvent.title} {...simialrEvent} />
            ))}
          </div>
        </div>
    </section>
  )
}

export default EventDetailsPage