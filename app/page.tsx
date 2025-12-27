import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
// import { events } from "@/lib/constants"

const BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;

// Cached component for fetching events data
async function CachedEventsData() {
  'use cache';
  cacheLife('hours');
  
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  
  return (
    <ul className="events">
      {events.map((event : IEvent) => (
        <li key={event.title}>
          <EventCard {...event}/>
        </li>
      ))}
    </ul>
  );
}

const Page = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for every dev <br /> Event you can't miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups and conferences, All in One Place</p>

      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <CachedEventsData />
      </div>
    </section>
  )
}

export default Page