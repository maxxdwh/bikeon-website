export interface Video {
  title: string;
  url: string;
  category: string;
  duration: string;
}

export const playlistUrl =
  "https://www.youtube.com/playlist?list=PLeyqMI48hVV_tZWr2YWMKIfmRr6wiJ_uZ";

export const videos: Video[] = [
  {
    title: "Helmet Fitting",
    url: "https://www.youtube.com/watch?v=N14kwnWPzfo",
    category: "Cycle education",
    duration: "3 min",
  },
  {
    title: "Bike Check",
    url: "https://www.youtube.com/watch?v=P-K-bqRb0QQ",
    category: "Cycle education",
    duration: "2 min",
  },
  {
    title: "Brake Safely",
    url: "https://www.youtube.com/watch?v=KuE-nOuQeKQ",
    category: "Cycle education",
    duration: "2 min",
  },
  {
    title: "Bike Game - Musical Bikes",
    url: "https://www.youtube.com/watch?v=IyeA2cWyFJU",
    category: "Bike Games",
    duration: "2 min",
  },
  {
    title: "Bike Game - Le Mans",
    url: "https://www.youtube.com/watch?v=c3hdTxwx8Kw",
    category: "Bike Games",
    duration: "1 min",
  },
  {
    title: "Bike Game - Marathon Challenge",
    url: "https://www.youtube.com/watch?v=scs0L-Xoc70",
    category: "Bike Games",
    duration: "2 min",
  },
  {
    title: "Bike Game - Reach the Teacher",
    url: "https://www.youtube.com/watch?v=nouRu9V1bec",
    category: "Bike Games",
    duration: "2 min",
  },
];
