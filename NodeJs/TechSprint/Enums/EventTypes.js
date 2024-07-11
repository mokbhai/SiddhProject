const EVENTTYPES = Object.freeze({
  HACKATHON: "Hack-a-thon",
  FAIR: "Fair",
  CONFERENCE: "Conference",
  WORKSHOP: "Workshop",
  SEMINAR: "Seminar",
  MEETUP: "Meetup",
});

export default EVENTTYPES;

const event = EVENTTYPES["CONFERENCE"];
console.log(event);
