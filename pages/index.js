import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react/jsx-runtime";


export default function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a huge list of highly active React meetups!" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

//data fetching for static pages
export async function getStaticProps() {
  //fetch data from an ApI

  const client = await MongoClient.connect('mongodb+srv://sepezh:WuNL0sfcutWjhX@cluster0.gi6csrm.mongodb.net/meetups=Cluster0')
  const db = client.db()

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: JSON.parse(JSON.stringify(
        meetups.map(meetup => ({
          title: meetup.data.title,
          address: meetup.data.address,
          image: meetup.data.image,
          // description: meetup.data.description, //we avoid description because we are not outputting description in this component
          id: meetup._id.toString()
        }))

      ))
    },
    revalidate: 1 //seconds nextjs wait to regenerate
  }

}
