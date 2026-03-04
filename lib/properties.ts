export type Purpose = "rent" | "sale" | "shortlet";

export type PropertyType =
  | "apartment"
  | "duplex"
  | "terrace"
  | "bungalow"
  | "land";

export type State =
  | "Lagos"
  | "Abuja"
  | "Rivers"
  | "Edo"
  | "Delta"
  | "Anambra"
  | "Enugu"
  | "Imo"
  | "Abia";

export type Property = {
  id: string;
  slug: string;

  title: string;
  purpose: Purpose;
  propertyType: PropertyType;

  price: number;

  bedrooms: number;
  bathrooms: number;

  state: State;
  area: string;
  city: string;

  imageUrl: string;
  listedAtText: string;
};

export const properties: Property[] = [
  // 1
  {
    id: "p1",
    slug: "2-bedroom-apartment-lekki-phase-1",
    title: "2 Bedroom Apartment in Lekki Phase 1",
    purpose: "rent",
    propertyType: "apartment",
    price: 3500000,
    bedrooms: 2,
    bathrooms: 2,
    state: "Lagos",
    area: "Lekki Phase 1",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "Updated today",
  },

  // 2
  {
    id: "p2",
    slug: "3-bedroom-duplex-ajah",
    title: "3 Bedroom Duplex in Ajah (Gated Estate)",
    purpose: "sale",
    propertyType: "duplex",
    price: 85000000,
    bedrooms: 3,
    bathrooms: 3,
    state: "Lagos",
    area: "Ajah",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "2 days ago",
  },

  // 3
  {
    id: "p3",
    slug: "shortlet-1-bedroom-victoria-island",
    title: "1 Bedroom Shortlet in Victoria Island",
    purpose: "shortlet",
    propertyType: "apartment",
    price: 65000,
    bedrooms: 1,
    bathrooms: 1,
    state: "Lagos",
    area: "Victoria Island",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "Updated today",
  },

  // 4
  {
    id: "p4",
    slug: "4-bedroom-terrace-ikoyi",
    title: "4 Bedroom Terrace in Ikoyi",
    purpose: "sale",
    propertyType: "terrace",
    price: 320000000,
    bedrooms: 4,
    bathrooms: 5,
    state: "Lagos",
    area: "Ikoyi",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "5 days ago",
  },

  // 5
  {
    id: "p5",
    slug: "3-bedroom-bungalow-gra-port-harcourt",
    title: "3 Bedroom Bungalow in GRA, Port Harcourt",
    purpose: "rent",
    propertyType: "bungalow",
    price: 4200000,
    bedrooms: 3,
    bathrooms: 3,
    state: "Rivers",
    area: "GRA",
    city: "Port Harcourt",
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "1 week ago",
  },

  // 6
  {
    id: "p6",
    slug: "land-plot-ikeja-cofo",
    title: "Land Plot in Ikeja (C of O)",
    purpose: "sale",
    propertyType: "land",
    price: 120000000,
    bedrooms: 0,
    bathrooms: 0,
    state: "Lagos",
    area: "Ikeja",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "3 days ago",
  },

  // 7
  {
    id: "p7",
    slug: "2-bedroom-apartment-wuse-2",
    title: "2 Bedroom Apartment in Wuse 2",
    purpose: "rent",
    propertyType: "apartment",
    price: 3800000,
    bedrooms: 2,
    bathrooms: 2,
    state: "Abuja",
    area: "Wuse 2",
    city: "Abuja",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "Updated today",
  },

  // 8
  {
    id: "p8",
    slug: "shortlet-studio-garki",
    title: "Studio Shortlet in Garki",
    purpose: "shortlet",
    propertyType: "apartment",
    price: 45000,
    bedrooms: 1,
    bathrooms: 1,
    state: "Abuja",
    area: "Garki",
    city: "Abuja",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "2 days ago",
  },

  // 9
  {
    id: "p9",
    slug: "4-bedroom-duplex-lekki",
    title: "4 Bedroom Duplex in Lekki (Organised Estate)",
    purpose: "sale",
    propertyType: "duplex",
    price: 180000000,
    bedrooms: 4,
    bathrooms: 4,
    state: "Lagos",
    area: "Lekki",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "Updated today",
  },

  // 10
  {
    id: "p10",
    slug: "2-bedroom-apartment-ikeja-alausa",
    title: "2 Bedroom Apartment in Alausa, Ikeja",
    purpose: "rent",
    propertyType: "apartment",
    price: 2800000,
    bedrooms: 2,
    bathrooms: 2,
    state: "Lagos",
    area: "Alausa",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "3 days ago",
  },

  // 11
  {
    id: "p11",
    slug: "3-bedroom-terrace-chevron-lekki",
    title: "3 Bedroom Terrace in Chevron, Lekki",
    purpose: "sale",
    propertyType: "terrace",
    price: 135000000,
    bedrooms: 3,
    bathrooms: 4,
    state: "Lagos",
    area: "Chevron",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "1 week ago",
  },

  // 12
  {
    id: "p12",
    slug: "shortlet-2-bedroom-lekki-phase-1",
    title: "2 Bedroom Shortlet in Lekki Phase 1 (Serviced)",
    purpose: "shortlet",
    propertyType: "apartment",
    price: 90000,
    bedrooms: 2,
    bathrooms: 2,
    state: "Lagos",
    area: "Lekki Phase 1",
    city: "Lagos",
    imageUrl:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=80",
    listedAtText: "Updated today",
  },
];