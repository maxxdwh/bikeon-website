import type { ImageMetadata } from 'astro';
import johnKey from '../assets/images/testimonials/john-key.jpg';
import simonBridges from '../assets/images/testimonials/simon-bridges.jpg';
import nikkiKaye from '../assets/images/testimonials/nikki-kaye.jpg';
import sarahWalker from '../assets/images/testimonials/sarah-walker.jpg';
import benSincock from '../assets/images/testimonials/ben-sincock.jpg';
import kayleneMacnee from '../assets/images/testimonials/kaylene-macnee.jpg';
import cindyWalsh from '../assets/images/testimonials/cindy-walsh.jpg';
import richardInder from '../assets/images/testimonials/richard-inder.jpg';
import russellBurt from '../assets/images/testimonials/russell-burt.jpg';
import michelleJadoo from '../assets/images/testimonials/michelle-jadoo.jpg';
import robPosthumus from '../assets/images/testimonials/rob-posthumus.jpg';
import billieJeanPotaka from '../assets/images/testimonials/billie-jean-potaka.jpg';
import simonBridgesTwo from '../assets/images/testimonials/simon-bridges-2.jpg';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: ImageMetadata;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "We think it is a great idea. It's a great way of introducing kids to bikes and making sure every young New Zealander gets an opportunity to learn to ride a bike ... and it's certainly going to help us get fitter, healthier, more engaged young people.",
    name: "Hon John Key",
    role: "Former Prime Minister of New Zealand",
    image: johnKey,
  },
  {
    quote:
      "We're developing this national programme using very best practice, some of it home grown right here in New Zealand. We're leading the world with our Bikes in Schools programme.",
    name: "Hon Simon Bridges",
    role: "Former Minister of Transport",
    image: simonBridges,
  },
  {
    quote:
      "We know that cycle tracks have numerous benefits, including helping to develop safe cycling habits and building up confidence and fitness, I want to make it easy for schools that want to promote exercise to engage students in lifelong healthy habits that also help with their learning.",
    name: "Hon Nikki Kaye",
    role: "Former Minister of Education",
    image: nikkiKaye,
  },
  {
    quote:
      "When I started riding at school it ended up crossing over towards my school work. Because I was getting better at BMX, I started getting better at school because it just gave me a lot of confidence, so I was happier and got better at everything really.",
    name: "Sarah Walker",
    role: "World Champion BMX Rider and Olympic Medallist",
    image: sarahWalker,
  },
  {
    quote:
      "There's a significant number of students in our wider community who don't have access to bikes. This will increase levels of fitness of students.",
    name: "Ben Sincock",
    role: "Principal at Carisbrook School",
    image: benSincock,
  },
  {
    quote:
      "We really see this resource as something that we can teach with in an ongoing way. We want to be able to link the bike track to some really worthwhile learning linked to the health curriculum and the social sciences — looking at how communities work together.",
    name: "Kaylene MacNee",
    role: "Principal at Pinehaven School, Upper Hutt",
    image: kayleneMacnee,
  },
  {
    quote:
      "We're getting children to be active and helping increase their physical fitness and health, it will have huge benefits for the children. I hope they grow up to become cycling adults.",
    name: "Cindy Walsh",
    role: "Former Principal at Takapuna Primary School",
    image: cindyWalsh,
  },
  {
    quote:
      "It's been a wonderful community project and the kids are very excited. They've been using the first bike path before and after school and during interval but they've been dying to get on to the gully track.",
    name: "Richard Inder",
    role: "Former Principal at Gate Pa School, Tauranga",
    image: richardInder,
  },
  {
    quote:
      "Most of our kids do not have their own bike at home and they're incredibly excited about the track and their new wheels.",
    name: "Russell Burt",
    role: "Principal at Pt. England School, Auckland",
    image: russellBurt,
  },
  {
    quote:
      "We are delighted and very grateful for Bikes in Schools' support for this important recreation and sport programme.",
    name: "Michelle Jadoo",
    role: "Principal at St. Mary's School, Avondale",
    image: michelleJadoo,
  },
  {
    quote:
      "The school's fantastic new bike track is inspiring the children to get their legs and hearts pumping.",
    name: "Rob Posthumus",
    role: "Principal at Hurupaki School, Whangarei",
    image: robPosthumus,
  },
  {
    quote:
      "We are so happy. It has been a huge collective effort to get this finished and the kids love it.",
    name: "Billie-Jean Potaka-Ayton",
    role: "Principal at Kaiti School, Gisborne",
    image: billieJeanPotaka,
  },
  {
    quote:
      "We're also investing in Bikes in Schools to enhance delivery of the cycleway programme and make cycling more accessible for school children. So far we have contributed to 30 urban schools, reaching nearly 10,000 students.",
    name: "Hon Simon Bridges",
    role: "Former Minister of Transport",
    image: simonBridgesTwo,
  },
];
