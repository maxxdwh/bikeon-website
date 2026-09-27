export interface Supplier {
  name: string;
  contact: string;
  phone: string;
  email: string;
  website: string;
  region: string;
}

export interface SupplierCategory {
  category: string;
  suppliers: Supplier[];
}

export const supplierCategories: SupplierCategory[] = [
  {
    category: "Bikes",
    suppliers: [
      {
        name: "Evo Cycles",
        contact: "Richie Stratford",
        phone: "027 512 7620",
        email: "richard.stratford@evocycles.co.nz",
        website: "https://evocycles.co.nz/",
        region: "Nationwide",
      },
      {
        name: "My Ride NZ",
        contact: "Cory Cannings",
        phone: "0800 999 499",
        email: "coryc@sheppardcycles.com",
        website: "https://myride.co.nz/",
        region: "Nationwide",
      },
      {
        name: "Torpedo 7",
        contact: "Emily Fernandes",
        phone: "021 890 742",
        email: "emily.fernandes@twgroup.co.nz",
        website: "https://www.torpedo7.co.nz/",
        region: "Nationwide",
      },
    ],
  },
  {
    category: "Bike storage",
    suppliers: [
      {
        name: "A1 Containers",
        contact: "",
        phone: "0800 400 400",
        email: "",
        website: "http://www.a1containers.co.nz/",
        region: "Nationwide",
      },
      {
        name: "Boxman",
        contact: "",
        phone: "027 208 7196",
        email: "",
        website: "http://boxman.co.nz/",
        region: "Nationwide",
      },
      {
        name: "NZBOX Ltd",
        contact: "",
        phone: "0800 818 818",
        email: "",
        website: "http://nzbox.kiwi.nz/",
        region: "Nationwide",
      },
      {
        name: "Royal Wolf",
        contact: "",
        phone: "0800 635 216",
        email: "",
        website: "https://www.royalwolf.co.nz/contact-us",
        region: "Nationwide",
      },
      {
        name: "Sea Containers",
        contact: "",
        phone: "0508 732 266",
        email: "",
        website: "http://www.seacontainers.co.nz/contact/",
        region: "Nationwide",
      },
    ],
  },
];
