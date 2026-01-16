import { Fragment } from "react/jsx-runtime";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

export default function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        title={props.meetupData.title}
        description={props.meetupData.description}
        address={props.meetupData.address}
        image={props.meetupData.image}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect('mongodb+srv://sepezh:WuNL0sfcutWjhX@cluster0.gi6csrm.mongodb.net/meetups=Cluster0')
  const db = client.db()

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close()

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } }))
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect('mongodb+srv://sepezh:WuNL0sfcutWjhX@cluster0.gi6csrm.mongodb.net/meetups=Cluster0')
  const db = client.db()

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) })

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        image: selectedMeetup.data.image,
        description: selectedMeetup.data.description, //we avoid description because we are not outputting description in this component
      }
    },
  };
}
