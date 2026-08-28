export type Category = {
  id: string;
  name: string;
  displayOrder: number;
};

export type MenuItem = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  variantPrice?: number;
  variantLabel?: string;
  description?: string;
  emoji: string;
  isAvailable: boolean;
};

export type Deal = {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
};

export const categories: Category[] = [
  { id: "chicken-roll", name: "Chicken Roll", displayOrder: 1 },
  { id: "malai-roll", name: "Chicken Malai Boti Roll", displayOrder: 2 },
  { id: "beef-roll", name: "Beef Boti Roll", displayOrder: 3 },
  { id: "bbq", name: "Bar B.Q", displayOrder: 4 },
  { id: "desi", name: "Desi Foods", displayOrder: 5 },
  { id: "shawarma", name: "Shawarma", displayOrder: 6 },
  { id: "broast", name: "Chicken Broast", displayOrder: 7 },
  { id: "zinger", name: "Zinger & Chicken", displayOrder: 8 },
  { id: "beef-burger", name: "Beef Burger", displayOrder: 9 },
  { id: "sandwiches", name: "Sandwiches", displayOrder: 10 },
  { id: "fries", name: "French Fries", displayOrder: 11 },
  { id: "karahi", name: "Koyla Karahi", displayOrder: 12 },
  { id: "noodles", name: "Noodles & Spaghetti", displayOrder: 13 },
];

function item(
  id: string,
  name: string,
  categoryId: string,
  price: number,
  emoji: string,
  extra?: Partial<MenuItem>
): MenuItem {
  return { id, name, categoryId, price, emoji, isAvailable: true, ...extra };
}

export const menuItems: MenuItem[] = [
  item("cr1", "Chicken Chatni Roll", "chicken-roll", 190, "🌯"),
  item("cr2", "Chicken Garlic Mayo Roll", "chicken-roll", 230, "🌯"),
  item("cr3", "Chicken Mayo Cheese Roll", "chicken-roll", 270, "🌯"),
  item("cr4", "Garlic Mayo Roll", "chicken-roll", 220, "🌯"),
  item("cr5", "Chicken Spicy Mayo Roll", "chicken-roll", 250, "🌯"),
  item("cr6", "Chicken Crispy Roll", "chicken-roll", 280, "🌯"),
  item("cr7", "Chicken Crispy Cheese Roll", "chicken-roll", 350, "🌯"),

  item("mr1", "Chicken Malai Chatni Roll", "malai-roll", 220, "🌯"),
  item("mr2", "Chicken Malai Garlic Mayo Roll", "malai-roll", 240, "🌯"),
  item("mr3", "Chicken Malai Cheese Roll", "malai-roll", 280, "🌯"),

  item("br1", "Beef Boti Roll", "beef-roll", 220, "🌯"),
  item("br2", "Beef Garlic Mayo Roll", "beef-roll", 280, "🌯"),
  item("br3", "Beef Mayo Cheese Roll", "beef-roll", 300, "🌯"),
  item("br4", "Beef Kabab Roll", "beef-roll", 180, "🌯"),

  item("bbq1", "Chicken Tikka Leg", "bbq", 360, "🍗"),
  item("bbq2", "Chicken Tikka Chest", "bbq", 400, "🍗"),
  item("bbq3", "Chicken Bihari Tikka Chest", "bbq", 430, "🍗"),
  item("bbq4", "Chicken Malai Tikka Chest", "bbq", 450, "🍗"),
  item("bbq5", "Chicken Boti Boneless", "bbq", 450, "🍢"),
  item("bbq6", "Chicken Malai Boti Boneless", "bbq", 500, "🍢"),
  item("bbq7", "Beef Bihari Boti", "bbq", 500, "🍢"),
  item("bbq8", "Beef Seekh Kabab", "bbq", 450, "🍢"),
  item("bbq9", "Beef Gola Kabab", "bbq", 500, "🍢"),
  item("bbq10", "Chandan Kabab", "bbq", 500, "🍢"),
  item("bbq11", "Chicken Reshmi Kabab", "bbq", 490, "🍢"),

  item("ds1", "Chicken Biryani (1/5 Kg)", "desi", 290, "🍛"),
  item("ds2", "Aloo Wale Biryani (1/5 Kg)", "desi", 190, "🍛"),
  item("ds3", "Sada Burger", "desi", 90, "🍔"),
  item("ds4", "Anda Wala Burger", "desi", 140, "🍔"),

  item("sh1", "Chicken Shawarma", "shawarma", 180, "🥙"),
  item("sh2", "Arabian Shawarma", "shawarma", 200, "🥙"),
  item("sh3", "Arabian Roll", "shawarma", 200, "🌯"),
  item("sh4", "BM-P Roll", "shawarma", 180, "🌯"),

  item("bro1", "Chicken Broast Full (2 Chest, 2 Leg)", "broast", 1700, "🍗"),
  item("bro2", "Chicken Broast Half (1 Chest, 1 Leg)", "broast", 900, "🍗"),
  item("bro3", "Chicken Broast (Chest)", "broast", 470, "🍗"),
  item("bro4", "Chicken Broast (Leg)", "broast", 430, "🍗"),
  item("bro5", "Chatpata Broast (Chest)", "broast", 450, "🍗"),
  item("bro6", "Chatpata Broast (Leg)", "broast", 450, "🍗"),
  item("bro7", "Mayo Garlic Broast (Leg)", "broast", 470, "🍗"),
  item("bro8", "Mayo Garlic Broast (Chest)", "broast", 530, "🍗"),

  item("zg1", "Zinger Burger with Fries", "zinger", 270, "🍔"),
  item("zg2", "Zinger Cheese Burger with Fries", "zinger", 330, "🍔"),
  item("zg3", "Zinger Burger without Fries", "zinger", 240, "🍔"),
  item("zg4", "Chicken Burger", "zinger", 270, "🍔"),
  item("zg5", "Chicken Cheese Burger", "zinger", 330, "🍔"),
  item("zg6", "Hot Zinger", "zinger", 320, "🍔"),
  item("zg7", "Arabian Zinger with Fries", "zinger", 330, "🍔"),
  item("zg8", "Double Dip Zinger with Fries", "zinger", 500, "🍔"),
  item("zg9", "Double Dip Zinger with Cheese Fries", "zinger", 550, "🍔"),
  item("zg10", "Chicken Double Decker Burger", "zinger", 450, "🍔"),
  item("zg11", "Chicken Double Decker Cheese", "zinger", 500, "🍔"),

  item("bf1", "Beef Burger with Fries", "beef-burger", 300, "🍔"),
  item("bf2", "Beef Cheese Burger with Fries", "beef-burger", 350, "🍔"),
  item("bf3", "Beef Double Decker Burger", "beef-burger", 500, "🍔"),
  item("bf4", "Beef Double Decker Burger with Cheese", "beef-burger", 550, "🍔"),

  item("sw1", "Chicken Sandwich", "sandwiches", 280, "🥪"),
  item("sw2", "Chicken Sandwich with Cheese", "sandwiches", 340, "🥪"),
  item("sw3", "Club Sandwich", "sandwiches", 350, "🥪"),
  item("sw4", "Club Sandwich with Cheese", "sandwiches", 400, "🥪"),
  item("sw5", "BBQ Club Sandwich", "sandwiches", 400, "🥪"),
  item("sw6", "Crispy Club Sandwich", "sandwiches", 330, "🥪"),
  item("sw7", "Crispy Club Sandwich with Cheese", "sandwiches", 380, "🥪"),
  item("sw8", "BBQ Club Sandwich with Cheese", "sandwiches", 450, "🥪"),

  item("fr1", "Crispy Fries", "fries", 250, "🍟"),
  item("fr2", "Regular Fries", "fries", 100, "🍟"),
  item("fr3", "Mayo Garlic Fries", "fries", 200, "🍟"),

  item("kh1", "Plain Karahi", "karahi", 1600, "🥘", {
    variantPrice: 800,
    variantLabel: "Half",
    description: "Full Rs 1600 · Half Rs 800",
  }),
  item("kh2", "White Karahi", "karahi", 1700, "🥘", {
    variantPrice: 850,
    variantLabel: "Half",
    description: "Full Rs 1700 · Half Rs 850",
  }),
  item("kh3", "Peshawari Karahi", "karahi", 1700, "🥘", {
    variantPrice: 850,
    variantLabel: "Half",
    description: "Full Rs 1700 · Half Rs 850",
  }),
  item("kh4", "Balochi Karahi", "karahi", 1800, "🥘", {
    variantPrice: 900,
    variantLabel: "Half",
    description: "Full Rs 1800 · Half Rs 900",
  }),
  item("kh5", "Chicken Handi (Boneless)", "karahi", 1800, "🥘", {
    variantPrice: 900,
    variantLabel: "Half",
    description: "Full Rs 1800 · Half Rs 900",
  }),
  item("kh6", "Chicken Handi Plate", "karahi", 400, "🥘"),

  item("nd1", "Chicken Chow Mein", "noodles", 450, "🍜"),
  item("nd2", "Vegetable Chow Mein", "noodles", 380, "🍜"),
];

export const deals: Deal[] = [
  { id: "d1", title: "Deal 1", price: 500, isActive: true, description: "1 Zinger Burger, 1 Chicken Burger, Fries & Coleslaw" },
  { id: "d2", title: "Deal 2", price: 450, isActive: true, description: "1 Twister Roll, 1 Chicken Sandwich, Fries & Coleslaw" },
  { id: "d3", title: "Deal 3", price: 650, isActive: true, description: "1 Qtr. Broast (Leg), 1 Beef Burger, Fries & Coleslaw" },
  { id: "d4", title: "Deal 4", price: 650, isActive: true, description: "1 Qtr. Broast (Leg), 1 Chicken Burger, Fries & Coleslaw" },
  { id: "d5", title: "Deal 5", price: 1350, isActive: true, description: "2 Qtr. Broast (Leg), 2 Zinger Burger, Fries & Coleslaw" },
  { id: "d6", title: "Deal 6", price: 1250, isActive: true, description: "1 Club Sandwich, 2 Zinger Burger, 1 Qtr. Broast (Leg), Fries & Coleslaw" },
  { id: "d7", title: "Deal 7", price: 850, isActive: true, description: "1 Club Sandwich, 1 Zinger Burger, 1 Beef Burger, Fries & Coleslaw" },
  { id: "d8", title: "Deal 8", price: 600, isActive: true, description: "1 Chicken Sandwich, 1 Qtr. Broast (Leg), Fries & Coleslaw" },
  { id: "d9", title: "Deal 9", price: 1250, isActive: true, description: "2 Zinger, 1 Chest Broast, 1 Beef Burger, Fries & Coleslaw" },
  { id: "d10", title: "Deal 10", price: 800, isActive: true, description: "1 Twister Roll, 2 Zinger Burger, Fries & Coleslaw" },
  { id: "d11", title: "Deal 11", price: 1900, isActive: true, description: "2 Broast (Leg), 2 Zinger Burger, 2 Club Sandwich, Fries & Coleslaw" },
  { id: "d12", title: "Deal 12", price: 2700, isActive: true, description: "4 Qtr. Broast (2 Leg, 2 Chest), 4 Zinger, Fries & Coleslaw" },
  { id: "d13", title: "Deal 13", price: 950, isActive: true, description: "1 Broast Chest, 1 Club Sandwich, 1 Crispy Roll, Fries & Coleslaw" },
  { id: "d14", title: "Deal 14", price: 950, isActive: true, description: "1 Zinger, 1 Double Decker Chicken Burger, 1 Club Sandwich, Fries & Coleslaw" },
  { id: "d15", title: "Deal 15", price: 1500, isActive: true, description: "2 Club Sandwich, 2 Zinger Burger, 2 Twister Roll, Fries & Coleslaw" },
  { id: "d16", title: "Deal 16", price: 450, isActive: true, description: "1 Chicken Roll, 1 Bar B.Q Sandwich, Fries & Coleslaw" },
  { id: "d17", title: "Deal 17", price: 1150, isActive: true, description: "2 Tikka Leg, 2 Paratha, 2 Chicken Mayo Roll, Raita & Salad" },
  { id: "d18", title: "Deal 18", price: 550, isActive: true, description: "1 Tikka Leg, 1 Paratha, 1 Chicken Roll" },
  { id: "d19", title: "Deal 19", price: 650, isActive: true, description: "1 Chicken Boti Boneless, 1 Chicken Mayo Roll, 1 Paratha" },
  { id: "d20", title: "Deal 20", price: 450, isActive: true, description: "1 Beef Burger, 1 Chicken Roll, Fries & Coleslaw" },
  { id: "d21", title: "Deal 21", price: 1000, isActive: true, description: "1 Chicken Burger, 1 Zinger Burger, 1 Tikka Leg, 1 Large Paratha, Raita & Salad" },
  { id: "d22", title: "Deal 22", price: 1750, isActive: true, description: "2 Tikka Chest, 2 Chicken Roll, 1 Seekh Kabab, 4 Paratha, Raita & Salad" },
  { id: "d23", title: "Deal 23", price: 900, isActive: true, description: "2 Zinger Burger, 2 Kabab Roll, Fries & Coleslaw" },
  { id: "d24", title: "Deal 24", price: 1050, isActive: true, description: "1 Zinger Burger, 1 Broast Leg, 1 Chicken Mayo Roll, 1 Kabab Roll, Fries & Coleslaw" },
  { id: "d25", title: "Deal 25", price: 950, isActive: true, description: "1 Chicken Burger, 1 Beef Burger, 1 Beef Roll, 1 Chicken Roll, Fries & Coleslaw" },
  { id: "d26", title: "Deal 26", price: 1300, isActive: true, description: "2 Seekh Kabab, 1 Tikka Leg, 1 Paratha, Raita & Salad" },
  { id: "d27", title: "Deal 27", price: 1100, isActive: true, description: "1 Tikka Leg, 1 Qtr. Broast Leg, 1 Beef Burger, 1 Paratha, Raita & Salad" },
  { id: "d28", title: "Deal 28", price: 1100, isActive: true, description: "1 Tikka Leg, 1 Reshmi Kabab, 1 Zinger Burger, 1 Paratha, Raita & Salad" },
];

export const RESTAURANT = {
  name: "Ghousia Fast Foods & Al Jannat",
  shortName: "Jannat Fast Food Pizza & Bar B.Q",
  address: "R-91, 15/A-3 Buffer Zone, North Karachi",
  phones: ["0345-3420997", "0315-2371613"],
  hours: "Daily 12:00 PM – 1:00 AM",
  easypaisa: "0345-3420997",
  jazzcash: "0315-2371613",
};
