export interface Phone {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  colors: Array<{ name: string; hex: string }>;
  display: {
    size: string;
    resolution: string;
    type: string;
    refreshRate: string;
  };
  camera: {
    main: string;
    ultrawide: string;
    telephoto: string;
    video: string;
    score: number;
  };
  performance: {
    chipset: string;
    ram: string;
    score: number;
  };
  battery: {
    capacity: string;
    charging: string;
    score: number;
  };
  storage: string[];
  displayScore: number;
}

export const phones: Phone[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Apple+iPhone+15+Pro",
    price: 999,
    colors: [
      { name: "Natural Titanium", hex: "#e5e3d9" },
      { name: "Blue Titanium", hex: "#444a57" },
      { name: "White Titanium", hex: "#f4f4f4" },
      { name: "Black Titanium", hex: "#323334" }
    ],
    display: {
      size: "6.1 inches",
      resolution: "2556 x 1179",
      type: "Super Retina XDR OLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "48MP f/1.78",
      ultrawide: "12MP f/2.2",
      telephoto: "12MP 3x Optical",
      video: "4K@60fps ProRes",
      score: 96
    },
    performance: {
      chipset: "Apple A17 Pro",
      ram: "8GB",
      score: 98
    },
    battery: {
      capacity: "3274 mAh",
      charging: "27W wired, 15W MagSafe",
      score: 85
    },
    storage: ["128GB", "256GB", "512GB", "1TB"],
    displayScore: 95
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Apple+iPhone+15",
    price: 799,
    colors: [
      { name: "Black", hex: "#353637" },
      { name: "Blue", hex: "#c7d7e3" },
      { name: "Green", hex: "#ced8c9" },
      { name: "Yellow", hex: "#f5e4bd" },
      { name: "Pink", hex: "#f8cfd7" }
    ],
    display: {
      size: "6.1 inches",
      resolution: "2556 x 1179",
      type: "Super Retina XDR OLED",
      refreshRate: "60Hz"
    },
    camera: {
      main: "48MP f/1.6",
      ultrawide: "12MP f/2.4",
      telephoto: "None (2x crop)",
      video: "4K@60fps",
      score: 89
    },
    performance: {
      chipset: "Apple A16 Bionic",
      ram: "6GB",
      score: 92
    },
    battery: {
      capacity: "3349 mAh",
      charging: "20W wired, 15W MagSafe",
      score: 87
    },
    storage: ["128GB", "256GB", "512GB"],
    displayScore: 85
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Samsung+Galaxy+S24+Ultra",
    price: 1299,
    colors: [
      { name: "Titanium Black", hex: "#3b3b3b" },
      { name: "Titanium Gray", hex: "#87888c" },
      { name: "Titanium Violet", hex: "#5d5c64" },
      { name: "Titanium Yellow", hex: "#e5d5a4" }
    ],
    display: {
      size: "6.8 inches",
      resolution: "3120 x 1440",
      type: "Dynamic LTPO AMOLED 2X",
      refreshRate: "120Hz"
    },
    camera: {
      main: "200MP f/1.7",
      ultrawide: "12MP f/2.2",
      telephoto: "50MP 5x + 10MP 3x",
      video: "8K@30fps",
      score: 95
    },
    performance: {
      chipset: "Snapdragon 8 Gen 3",
      ram: "12GB",
      score: 97
    },
    battery: {
      capacity: "5000 mAh",
      charging: "45W wired, 15W wireless",
      score: 94
    },
    storage: ["256GB", "512GB", "1TB"],
    displayScore: 98
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    brand: "Samsung",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Samsung+Galaxy+S24",
    price: 799,
    colors: [
      { name: "Onyx Black", hex: "#2b2b2b" },
      { name: "Marble Gray", hex: "#c4c5c7" },
      { name: "Cobalt Violet", hex: "#837d92" },
      { name: "Amber Yellow", hex: "#f3e7bd" }
    ],
    display: {
      size: "6.2 inches",
      resolution: "2340 x 1080",
      type: "Dynamic LTPO AMOLED 2X",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP f/1.8",
      ultrawide: "12MP f/2.2",
      telephoto: "10MP 3x Optical",
      video: "8K@30fps",
      score: 90
    },
    performance: {
      chipset: "Snapdragon 8 Gen 3 / Exynos 2400",
      ram: "8GB",
      score: 94
    },
    battery: {
      capacity: "4000 mAh",
      charging: "25W wired, 15W wireless",
      score: 86
    },
    storage: ["128GB", "256GB"],
    displayScore: 92
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    brand: "Google",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Google+Pixel+8+Pro",
    price: 999,
    colors: [
      { name: "Obsidian", hex: "#1f2022" },
      { name: "Porcelain", hex: "#e8e5df" },
      { name: "Bay", hex: "#a4b5c4" }
    ],
    display: {
      size: "6.7 inches",
      resolution: "2992 x 1344",
      type: "LTPO OLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP f/1.68",
      ultrawide: "48MP f/1.95",
      telephoto: "48MP 5x Optical",
      video: "4K@60fps",
      score: 97
    },
    performance: {
      chipset: "Google Tensor G3",
      ram: "12GB",
      score: 88
    },
    battery: {
      capacity: "5050 mAh",
      charging: "30W wired, 23W wireless",
      score: 88
    },
    storage: ["128GB", "256GB", "512GB", "1TB"],
    displayScore: 94
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    brand: "Google",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Google+Pixel+8",
    price: 699,
    colors: [
      { name: "Obsidian", hex: "#1f2022" },
      { name: "Hazel", hex: "#7a827d" },
      { name: "Rose", hex: "#e5c5c3" }
    ],
    display: {
      size: "6.2 inches",
      resolution: "2400 x 1080",
      type: "OLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP f/1.68",
      ultrawide: "12MP f/2.2",
      telephoto: "None",
      video: "4K@60fps",
      score: 92
    },
    performance: {
      chipset: "Google Tensor G3",
      ram: "8GB",
      score: 86
    },
    battery: {
      capacity: "4575 mAh",
      charging: "27W wired, 18W wireless",
      score: 84
    },
    storage: ["128GB", "256GB"],
    displayScore: 90
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=OnePlus+12",
    price: 799,
    colors: [
      { name: "Silky Black", hex: "#1d1d1f" },
      { name: "Flowy Emerald", hex: "#4b6c62" }
    ],
    display: {
      size: "6.82 inches",
      resolution: "3168 x 1440",
      type: "LTPO AMOLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP f/1.6",
      ultrawide: "48MP f/2.2",
      telephoto: "64MP 3x Optical",
      video: "8K@24fps",
      score: 91
    },
    performance: {
      chipset: "Snapdragon 8 Gen 3",
      ram: "12GB / 16GB",
      score: 96
    },
    battery: {
      capacity: "5400 mAh",
      charging: "100W wired, 50W wireless",
      score: 98
    },
    storage: ["256GB", "512GB"],
    displayScore: 96
  },
  {
    id: "xiaomi-14-pro",
    name: "Xiaomi 14 Pro",
    brand: "Xiaomi",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Xiaomi+14+Pro",
    price: 899,
    colors: [
      { name: "Black", hex: "#111" },
      { name: "Silver", hex: "#ccc" },
      { name: "Titanium", hex: "#999" }
    ],
    display: {
      size: "6.73 inches",
      resolution: "3200 x 1440",
      type: "LTPO AMOLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP Variable Aperture",
      ultrawide: "50MP f/2.2",
      telephoto: "50MP 3.2x Optical",
      video: "8K@24fps",
      score: 93
    },
    performance: {
      chipset: "Snapdragon 8 Gen 3",
      ram: "12GB / 16GB",
      score: 96
    },
    battery: {
      capacity: "4880 mAh",
      charging: "120W wired, 50W wireless",
      score: 95
    },
    storage: ["256GB", "512GB", "1TB"],
    displayScore: 95
  },
  {
    id: "sony-xperia-1-vi",
    name: "Xperia 1 VI",
    brand: "Sony",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Sony+Xperia+1+VI",
    price: 1199,
    colors: [
      { name: "Black", hex: "#111" },
      { name: "Platinum Silver", hex: "#e5e4e2" }
    ],
    display: {
      size: "6.5 inches",
      resolution: "2340 x 1080",
      type: "LTPO OLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "48MP f/1.9",
      ultrawide: "12MP f/2.2",
      telephoto: "12MP Continuous Zoom",
      video: "4K@120fps",
      score: 90
    },
    performance: {
      chipset: "Snapdragon 8 Gen 3",
      ram: "12GB",
      score: 95
    },
    battery: {
      capacity: "5000 mAh",
      charging: "30W wired",
      score: 92
    },
    storage: ["256GB", "512GB"],
    displayScore: 92
  },
  {
    id: "motorola-edge-50-pro",
    name: "Edge 50 Pro",
    brand: "Motorola",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Motorola+Edge+50+Pro",
    price: 699,
    colors: [
      { name: "Black Beauty", hex: "#1c1d21" },
      { name: "Luxe Lavender", hex: "#8d86a6" }
    ],
    display: {
      size: "6.7 inches",
      resolution: "2712 x 1220",
      type: "POLED",
      refreshRate: "144Hz"
    },
    camera: {
      main: "50MP f/1.4",
      ultrawide: "13MP f/2.2",
      telephoto: "10MP 3x Optical",
      video: "4K@30fps",
      score: 87
    },
    performance: {
      chipset: "Snapdragon 7 Gen 3",
      ram: "12GB",
      score: 82
    },
    battery: {
      capacity: "4500 mAh",
      charging: "125W wired, 50W wireless",
      score: 89
    },
    storage: ["256GB", "512GB"],
    displayScore: 93
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Nothing+Phone+(2)",
    price: 599,
    colors: [
      { name: "Dark Gray", hex: "#2f3136" },
      { name: "White", hex: "#ffffff" }
    ],
    display: {
      size: "6.7 inches",
      resolution: "2412 x 1080",
      type: "LTPO OLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP f/1.88",
      ultrawide: "50MP f/2.2",
      telephoto: "None",
      video: "4K@60fps",
      score: 85
    },
    performance: {
      chipset: "Snapdragon 8+ Gen 1",
      ram: "8GB / 12GB",
      score: 89
    },
    battery: {
      capacity: "4700 mAh",
      charging: "45W wired, 15W wireless",
      score: 86
    },
    storage: ["128GB", "256GB", "512GB"],
    displayScore: 88
  },
  {
    id: "galaxy-a54",
    name: "Galaxy A54",
    brand: "Samsung",
    imageUrl: "https://placehold.co/400x600/111111/d4af37?text=Samsung+Galaxy+A54",
    price: 449,
    colors: [
      { name: "Awesome Graphite", hex: "#2b2f32" },
      { name: "Awesome White", hex: "#f0f2f1" },
      { name: "Awesome Violet", hex: "#b4a6d4" },
      { name: "Awesome Lime", hex: "#cde9af" }
    ],
    display: {
      size: "6.4 inches",
      resolution: "2340 x 1080",
      type: "Super AMOLED",
      refreshRate: "120Hz"
    },
    camera: {
      main: "50MP f/1.8",
      ultrawide: "12MP f/2.2",
      telephoto: "None",
      video: "4K@30fps",
      score: 78
    },
    performance: {
      chipset: "Exynos 1380",
      ram: "6GB / 8GB",
      score: 75
    },
    battery: {
      capacity: "5000 mAh",
      charging: "25W wired",
      score: 88
    },
    storage: ["128GB", "256GB"],
    displayScore: 84
  }
];
