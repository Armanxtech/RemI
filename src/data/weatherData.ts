export interface CityWeatherData {
  cityName: string;
  state: string;
  pincode?: string;
  district?: string;
  temperature: string;
  celsius: number;
  condition: string;
  dayName: string;
  note: string;
  bgImage: string;
}

export interface PinCodeInfo {
  pincode: string;
  cityName: string;
  district: string;
  state: string;
  postOffice?: string;
  temperature: string;
  celsius: number;
  condition: string;
  dayName: string;
  note: string;
  bgImage: string;
}

export const PIN_CODE_DIRECTORY: Record<string, PinCodeInfo> = {
  // --- ASSAM ---
  '784001': {
    pincode: '784001',
    cityName: 'Tezpur',
    district: 'Sonitpur',
    state: 'Assam',
    postOffice: 'Tezpur H.O (Brahmaputra Bank)',
    temperature: '72°F · 22°C',
    celsius: 22,
    condition: 'Sunny & Clear',
    dayName: 'Sunny Afternoon',
    note: 'Tezpur breeze is calm and clear by the Brahmaputra banks. Good afternoon for a gentle stroll by the garden.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '784025': {
    pincode: '784025',
    cityName: 'Napaam (Tezpur)',
    district: 'Sonitpur',
    state: 'Assam',
    postOffice: 'Tezpur University Campus',
    temperature: '71°F · 22°C',
    celsius: 22,
    condition: 'Fresh Green Breeze',
    dayName: 'Pleasant Day',
    note: 'Fresh campus greenery and calm atmosphere around Napaam. Pleasant time for outdoor relaxation.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '784176': {
    pincode: '784176',
    cityName: 'Biswanath Chariali',
    district: 'Biswanath',
    state: 'Assam',
    postOffice: 'Biswanath Chariali H.O',
    temperature: '73°F · 23°C',
    celsius: 23,
    condition: 'Bright & Calm',
    dayName: 'Bright Afternoon',
    note: 'Gentle warmth across northern Brahmaputra plains. Perfect for tea and light memory stories.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '784115': {
    pincode: '784115',
    cityName: 'Dhekiajuli',
    district: 'Sonitpur',
    state: 'Assam',
    postOffice: 'Dhekiajuli S.O',
    temperature: '73°F · 23°C',
    celsius: 23,
    condition: 'Warm Sunshine',
    dayName: 'Serene Day',
    note: 'Quiet afternoon across Sonitpur tea gardens. Refreshing air for hydration and light walks.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '781001': {
    pincode: '781001',
    cityName: 'Guwahati (Panbazar)',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    postOffice: 'Guwahati G.P.O / Panbazar',
    temperature: '78°F · 26°C',
    celsius: 26,
    condition: 'Warm & Pleasant',
    dayName: 'Pleasant Tuesday',
    note: 'Warm sunshine over the Brahmaputra valley. Pleasant time for indoor reading or porch tea.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '781005': {
    pincode: '781005',
    cityName: 'Dispur (Guwahati)',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    postOffice: 'Dispur Capital Complex S.O',
    temperature: '77°F · 25°C',
    celsius: 25,
    condition: 'Gentle Sunshine',
    dayName: 'Sunny Afternoon',
    note: 'Clear skies over the state capital. Good lighting for cognitive games and listening to music.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '781014': {
    pincode: '781014',
    cityName: 'Beltola (Guwahati)',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    postOffice: 'Beltola S.O',
    temperature: '77°F · 25°C',
    celsius: 25,
    condition: 'Comfortable & Warm',
    dayName: 'Pleasant Afternoon',
    note: 'Mild hillside warmth in South Guwahati. Pleasant day for family connection.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '785001': {
    pincode: '785001',
    cityName: 'Jorhat',
    district: 'Jorhat',
    state: 'Assam',
    postOffice: 'Jorhat H.O',
    temperature: '71°F · 22°C',
    celsius: 22,
    condition: 'Sunny & Serene',
    dayName: 'Peaceful Afternoon',
    note: 'Clear skies over the cultural capital. Fresh air for garden relaxation and tea time.',
    bgImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=400&fit=crop',
  },
  '785621': {
    pincode: '785621',
    cityName: 'Sivasagar',
    district: 'Sivasagar',
    state: 'Assam',
    postOffice: 'Sivasagar H.O (Historic Ahom Capital)',
    temperature: '72°F · 22°C',
    celsius: 22,
    condition: 'Pleasant & Calm',
    dayName: 'Calm Afternoon',
    note: 'Peaceful day around the historic Joysagar and Rang Ghar lakes. Ideal for gentle strolls.',
    bgImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=400&fit=crop',
  },
  '785640': {
    pincode: '785640',
    cityName: 'Golaghat',
    district: 'Golaghat',
    state: 'Assam',
    postOffice: 'Golaghat H.O (Kaziranga Gateway)',
    temperature: '73°F · 23°C',
    celsius: 23,
    condition: 'Bright Sunshine',
    dayName: 'Serene Afternoon',
    note: 'Crisp breezes from Kaziranga foothills. Keep hydrated and enjoy your daily rituals.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '786001': {
    pincode: '786001',
    cityName: 'Dibrugarh',
    district: 'Dibrugarh',
    state: 'Assam',
    postOffice: 'Dibrugarh H.O (Tea City)',
    temperature: '70°F · 21°C',
    celsius: 21,
    condition: 'Mild & Gentle',
    dayName: 'Serene Day',
    note: 'Fresh breeze from the upper Assam tea plantations. Calm conditions for light stretching and relaxation.',
    bgImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=400&fit=crop',
  },
  '786125': {
    pincode: '786125',
    cityName: 'Tinsukia',
    district: 'Tinsukia',
    state: 'Assam',
    postOffice: 'Tinsukia H.O',
    temperature: '69°F · 20°C',
    celsius: 20,
    condition: 'Cool & Pleasant',
    dayName: 'Pleasant Day',
    note: 'Clean air across upper Assam valleys. Great time for calming brain games.',
    bgImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=400&fit=crop',
  },
  '786151': {
    pincode: '786151',
    cityName: 'Digboi',
    district: 'Tinsukia',
    state: 'Assam',
    postOffice: 'Digboi H.O (Historic Oil Town)',
    temperature: '68°F · 20°C',
    celsius: 20,
    condition: 'Mild Forest Breeze',
    dayName: 'Peaceful Afternoon',
    note: 'Clean green breezes near Dehing Patkai rainforest. Enjoy a warm cup of herbal tea.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '788001': {
    pincode: '788001',
    cityName: 'Silchar',
    district: 'Cachar',
    state: 'Assam',
    postOffice: 'Silchar H.O (Barak Valley)',
    temperature: '75°F · 24°C',
    celsius: 24,
    condition: 'Partly Sunny',
    dayName: 'Bright Afternoon',
    note: 'Gentle warmth across Barak Valley. A great day to listen to nostalgic melodies and reminiscence albums.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '788710': {
    pincode: '788710',
    cityName: 'Karimganj',
    district: 'Karimganj',
    state: 'Assam',
    postOffice: 'Karimganj H.O',
    temperature: '76°F · 24°C',
    celsius: 24,
    condition: 'Warm & Fair',
    dayName: 'Sunny Day',
    note: 'Pleasant daylight by the Kushiara river. Stay comfortable indoors during mid-afternoon.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '782001': {
    pincode: '782001',
    cityName: 'Nagaon',
    district: 'Nagaon',
    state: 'Assam',
    postOffice: 'Nagaon H.O',
    temperature: '74°F · 23°C',
    celsius: 23,
    condition: 'Clear & Bright',
    dayName: 'Sunny Tuesday',
    note: 'Pleasant weather in Central Assam. Good conditions for morning and evening courtyard strolls.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '787001': {
    pincode: '787001',
    cityName: 'North Lakhimpur',
    district: 'Lakhimpur',
    state: 'Assam',
    postOffice: 'North Lakhimpur H.O',
    temperature: '70°F · 21°C',
    celsius: 21,
    condition: 'Gentle Himalayan Breeze',
    dayName: 'Calm Day',
    note: 'Fresh mountain breezes from Arunachal foothills. Stay warm and hydrated.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '783301': {
    pincode: '783301',
    cityName: 'Bongaigaon',
    district: 'Bongaigaon',
    state: 'Assam',
    postOffice: 'Bongaigaon H.O',
    temperature: '75°F · 24°C',
    celsius: 24,
    condition: 'Sunny & Pleasant',
    dayName: 'Bright Afternoon',
    note: 'Warm western Assam sunlight. Relax on the veranda with nostalgic Assamese folk songs.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '783334': {
    pincode: '783334',
    cityName: 'Kokrajhar',
    district: 'Kokrajhar',
    state: 'Assam',
    postOffice: 'Kokrajhar H.O (BTR HQ)',
    temperature: '73°F · 23°C',
    celsius: 23,
    condition: 'Gentle Breeze',
    dayName: 'Serene Day',
    note: 'Peaceful atmosphere across Bodoland territorial region. Ideal for memory storytelling.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },

  // --- MEGHALAYA ---
  '793001': {
    pincode: '793001',
    cityName: 'Shillong',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    postOffice: 'Shillong G.P.O (Police Bazar)',
    temperature: '64°F · 18°C',
    celsius: 18,
    condition: 'Cool Pine Mist',
    dayName: 'Misty Afternoon',
    note: 'Crisp pine breeze in the Scotland of the East. Keep a warm shawl handy for your afternoon routine.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '793003': {
    pincode: '793003',
    cityName: 'Laitumkhrah (Shillong)',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    postOffice: 'Laitumkhrah S.O',
    temperature: '63°F · 17°C',
    celsius: 17,
    condition: 'Crisp Mountain Breeze',
    dayName: 'Chilly Afternoon',
    note: 'Fresh highland air in Laitumkhrah. Enjoy a warm beverage and comfortable woolens.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '793119': {
    pincode: '793119',
    cityName: 'Cherrapunji (Sohra)',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    postOffice: 'Sohra S.O (Living Root Bridges)',
    temperature: '60°F · 16°C',
    celsius: 16,
    condition: 'Highland Mist & Clouds',
    dayName: 'Misty Mountain Day',
    note: 'Enchanting cloud mist over the waterfalls. Stay cozy indoors and keep warm.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '794001': {
    pincode: '794001',
    cityName: 'Tura',
    district: 'West Garo Hills',
    state: 'Meghalaya',
    postOffice: 'Tura H.O',
    temperature: '69°F · 21°C',
    celsius: 21,
    condition: 'Gentle Hill Breeze',
    dayName: 'Pleasant Afternoon',
    note: 'Serene breezes over Tura Peak. Beautiful lighting for your daily cognitive puzzle.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },

  // --- MANIPUR ---
  '795001': {
    pincode: '795001',
    cityName: 'Imphal',
    district: 'Imphal West',
    state: 'Manipur',
    postOffice: 'Imphal H.O (Kangla Fort)',
    temperature: '68°F · 20°C',
    celsius: 20,
    condition: 'Pleasant Valley Breeze',
    dayName: 'Clear Afternoon',
    note: 'Cool and peaceful air across Manipur valley. Perfect for enjoying mild sunshine and family talk.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '795128': {
    pincode: '795128',
    cityName: 'Churachandpur',
    district: 'Churachandpur',
    state: 'Manipur',
    postOffice: 'Churachandpur H.O',
    temperature: '66°F · 19°C',
    celsius: 19,
    condition: 'Cool & Peaceful',
    dayName: 'Breezy Day',
    note: 'Refreshing mountain valley air. Great day for gentle relaxation and memory review.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },

  // --- MIZORAM ---
  '796001': {
    pincode: '796001',
    cityName: 'Aizawl',
    district: 'Aizawl',
    state: 'Mizoram',
    postOffice: 'Aizawl H.O (Ridge Hill)',
    temperature: '66°F · 19°C',
    celsius: 19,
    condition: 'Fresh Hill Air',
    dayName: 'Breezy Day',
    note: 'Clear mountain atmosphere on the ridges. Beautiful daylight for mind-stimulating cognitive puzzles.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '796701': {
    pincode: '796701',
    cityName: 'Lunglei',
    district: 'Lunglei',
    state: 'Mizoram',
    postOffice: 'Lunglei H.O',
    temperature: '67°F · 19°C',
    celsius: 19,
    condition: 'Mild Mountain Climate',
    dayName: 'Serene Day',
    note: 'Clean high-ridge air across Southern Mizoram. Stay hydrated with warm drinks.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },

  // --- NAGALAND ---
  '797001': {
    pincode: '797001',
    cityName: 'Kohima',
    district: 'Kohima',
    state: 'Nagaland',
    postOffice: 'Kohima H.O (Capital Hill)',
    temperature: '62°F · 17°C',
    celsius: 17,
    condition: 'Crisp Highland Air',
    dayName: 'Cool Highland Day',
    note: 'Refreshing cool breeze across the hills. Enjoy a warm cup of herbal tea and stay cozy.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '797112': {
    pincode: '797112',
    cityName: 'Dimapur',
    district: 'Dimapur',
    state: 'Nagaland',
    postOffice: 'Dimapur H.O',
    temperature: '74°F · 23°C',
    celsius: 23,
    condition: 'Warm & Clear',
    dayName: 'Sunny Afternoon',
    note: 'Pleasant sunshine in the commercial gateway of Nagaland. Great time for afternoon rituals.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },

  // --- TRIPURA ---
  '799001': {
    pincode: '799001',
    cityName: 'Agartala',
    district: 'West Tripura',
    state: 'Tripura',
    postOffice: 'Agartala H.O (Ujjayanta Palace)',
    temperature: '76°F · 24°C',
    celsius: 24,
    condition: 'Bright & Sunny',
    dayName: 'Sunny Tuesday',
    note: 'Pleasant tropical sunshine in Tripura. Good afternoon for hydration and light cognitive games.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '799120': {
    pincode: '799120',
    cityName: 'Dharmanagar',
    district: 'North Tripura',
    state: 'Tripura',
    postOffice: 'Dharmanagar H.O',
    temperature: '75°F · 24°C',
    celsius: 24,
    condition: 'Pleasant Sun',
    dayName: 'Bright Day',
    note: 'Calm conditions across North Tripura. Enjoy your daily water intake and soothing tunes.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },

  // --- ARUNACHAL PRADESH ---
  '791111': {
    pincode: '791111',
    cityName: 'Itanagar',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    postOffice: 'Itanagar H.O (Ganga Lake)',
    temperature: '65°F · 18°C',
    celsius: 18,
    condition: 'Himalayan Foothill Breeze',
    dayName: 'Peaceful Daylight',
    note: 'Pure Himalayan mountain air. A serene day for daily rituals and music reminiscence.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '790104': {
    pincode: '790104',
    cityName: 'Tawang',
    district: 'Tawang',
    state: 'Arunachal Pradesh',
    postOffice: 'Tawang H.O (Monastery Ridge)',
    temperature: '50°F · 10°C',
    celsius: 10,
    condition: 'Alpine Cold & Sunshine',
    dayName: 'Crisp Alpine Day',
    note: 'High-altitude cold and pure mountain sunlight. Keep warmly layered by the fireplace.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '791102': {
    pincode: '791102',
    cityName: 'Pasighat',
    district: 'East Siang',
    state: 'Arunachal Pradesh',
    postOffice: 'Pasighat H.O (Siang Valley)',
    temperature: '69°F · 21°C',
    celsius: 21,
    condition: 'Fresh River Valley Breeze',
    dayName: 'Serene Day',
    note: 'Fresh Siang river breezes. Excellent conditions for mindful deep breathing.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },

  // --- SIKKIM ---
  '737101': {
    pincode: '737101',
    cityName: 'Gangtok',
    district: 'East Sikkim',
    state: 'Sikkim',
    postOffice: 'Gangtok H.O (Kanchenjunga View)',
    temperature: '59°F · 15°C',
    celsius: 15,
    condition: 'Cool Mountain Air',
    dayName: 'Crisp Mountain Day',
    note: 'Pure Himalayan mountain clarity. Stay warm with cozy woolen wear and hot water.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },

  // --- WEST BENGAL & METROS ---
  '700001': {
    pincode: '700001',
    cityName: 'Kolkata (BBD Bagh)',
    district: 'Kolkata',
    state: 'West Bengal',
    postOffice: 'Kolkata G.P.O',
    temperature: '82°F · 28°C',
    celsius: 28,
    condition: 'Warm & Sunny',
    dayName: 'Bright Afternoon',
    note: 'Breezy Hooghly river banks. Comfortable day for music reminiscence and brain exercises.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '734001': {
    pincode: '734001',
    cityName: 'Siliguri',
    district: 'Darjeeling',
    state: 'West Bengal',
    postOffice: 'Siliguri H.O (North East Corridor)',
    temperature: '74°F · 23°C',
    celsius: 23,
    condition: 'Pleasant & Mild',
    dayName: 'Pleasant Day',
    note: 'Mild weather at the foothills of the Himalayas. Great afternoon for porch relaxation.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
  '734101': {
    pincode: '734101',
    cityName: 'Darjeeling',
    district: 'Darjeeling',
    state: 'West Bengal',
    postOffice: 'Darjeeling H.O (Queen of Hills)',
    temperature: '58°F · 14°C',
    celsius: 14,
    condition: 'Chilly Hill Mist',
    dayName: 'Crisp Hill Day',
    note: 'Fragrant tea estate mist and mountain freshness. Keep warm with a shawl.',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
  },
  '110001': {
    pincode: '110001',
    cityName: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    postOffice: 'New Delhi G.P.O',
    temperature: '80°F · 27°C',
    celsius: 27,
    condition: 'Sunny & Clear',
    dayName: 'Sunny Day',
    note: 'Clear daylight in the national capital region. Keep hydrated throughout the afternoon.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '400001': {
    pincode: '400001',
    cityName: 'Mumbai (Fort)',
    district: 'Mumbai City',
    state: 'Maharashtra',
    postOffice: 'Mumbai G.P.O',
    temperature: '84°F · 29°C',
    celsius: 29,
    condition: 'Coastal Sea Breeze',
    dayName: 'Warm Afternoon',
    note: 'Humid sea breeze along the Arabian coast. Stay cool indoors with good ventilation.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
  },
  '560001': {
    pincode: '560001',
    cityName: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    postOffice: 'Bengaluru G.P.O',
    temperature: '76°F · 24°C',
    celsius: 24,
    condition: 'Pleasant & Breezy',
    dayName: 'Serene Day',
    note: 'Pleasant garden city temperatures. Wonderful time for garden stroll and family call.',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  },
};

export const POPULAR_PIN_CODES: { pincode: string; label: string; state: string; isNE: boolean }[] = [
  { pincode: '784001', label: 'Tezpur (Sonitpur)', state: 'Assam', isNE: true },
  { pincode: '781001', label: 'Guwahati (Panbazar)', state: 'Assam', isNE: true },
  { pincode: '785001', label: 'Jorhat (Cultural Hub)', state: 'Assam', isNE: true },
  { pincode: '786001', label: 'Dibrugarh (Tea City)', state: 'Assam', isNE: true },
  { pincode: '788001', label: 'Silchar (Barak Valley)', state: 'Assam', isNE: true },
  { pincode: '793001', label: 'Shillong (Pine Hills)', state: 'Meghalaya', isNE: true },
  { pincode: '795001', label: 'Imphal (Kangla)', state: 'Manipur', isNE: true },
  { pincode: '796001', label: 'Aizawl (Ridge)', state: 'Mizoram', isNE: true },
  { pincode: '797001', label: 'Kohima (Highlands)', state: 'Nagaland', isNE: true },
  { pincode: '799001', label: 'Agartala (Palace)', state: 'Tripura', isNE: true },
  { pincode: '791111', label: 'Itanagar (Himalayan)', state: 'Arunachal Pradesh', isNE: true },
  { pincode: '737101', label: 'Gangtok (Kanchenjunga)', state: 'Sikkim', isNE: true },
  { pincode: '784176', label: 'Biswanath Chariali', state: 'Assam', isNE: true },
  { pincode: '793119', label: 'Cherrapunji (Sohra)', state: 'Meghalaya', isNE: true },
  { pincode: '700001', label: 'Kolkata GPO', state: 'West Bengal', isNE: false },
  { pincode: '110001', label: 'New Delhi GPO', state: 'Delhi NCR', isNE: false },
  { pincode: '560001', label: 'Bengaluru GPO', state: 'Karnataka', isNE: false },
  { pincode: '400001', label: 'Mumbai GPO', state: 'Maharashtra', isNE: false },
];

/**
 * Prefix-based fallback resolution for any 6-digit Indian PIN Code
 */
export function lookupPinCode(inputPin: string): PinCodeInfo | null {
  const cleanPin = inputPin.replace(/\D/g, '').trim();
  if (!cleanPin || cleanPin.length !== 6) {
    return null;
  }

  // 1. Direct match in dictionary
  if (PIN_CODE_DIRECTORY[cleanPin]) {
    return PIN_CODE_DIRECTORY[cleanPin];
  }

  // 2. Intelligent prefix heuristics for Indian Postal Circles
  const prefix2 = cleanPin.substring(0, 2);
  const prefix3 = cleanPin.substring(0, 3);

  let state = 'India';
  let district = 'Postal District';
  let cityName = `Area (${cleanPin})`;
  let tempC = 24;
  let condition = 'Pleasant & Fair';
  let note = `Weather forecast for PIN ${cleanPin}. Good conditions for your daily routines.`;

  if (prefix3 === '784') {
    state = 'Assam';
    district = 'Sonitpur / Biswanath';
    cityName = 'Tezpur Division';
    tempC = 22;
    condition = 'Sunny & Clear';
  } else if (prefix3 === '781') {
    state = 'Assam';
    district = 'Kamrup Metro';
    cityName = 'Guwahati Region';
    tempC = 26;
    condition = 'Warm & Pleasant';
  } else if (prefix3 === '785') {
    state = 'Assam';
    district = 'Jorhat / Sivasagar';
    cityName = 'Upper Assam';
    tempC = 22;
    condition = 'Serene & Clear';
  } else if (prefix3 === '786') {
    state = 'Assam';
    district = 'Dibrugarh / Tinsukia';
    cityName = 'Dibrugarh Region';
    tempC = 21;
    condition = 'Mild & Gentle';
  } else if (prefix3 === '788') {
    state = 'Assam';
    district = 'Cachar / Karimganj';
    cityName = 'Barak Valley';
    tempC = 24;
    condition = 'Partly Sunny';
  } else if (prefix3 === '782') {
    state = 'Assam';
    district = 'Nagaon / Hojai';
    cityName = 'Central Assam';
    tempC = 23;
    condition = 'Clear & Pleasant';
  } else if (prefix3 === '783') {
    state = 'Assam';
    district = 'Goalpara / Dhubri';
    cityName = 'Lower Assam';
    tempC = 24;
    condition = 'Sunny';
  } else if (prefix3 === '787') {
    state = 'Assam';
    district = 'Lakhimpur / Dhemaji';
    cityName = 'North Assam';
    tempC = 21;
    condition = 'Cool Breeze';
  } else if (prefix3 === '793' || prefix3 === '794') {
    state = 'Meghalaya';
    district = prefix3 === '793' ? 'Khasi Hills' : 'Garo Hills';
    cityName = prefix3 === '793' ? 'Shillong Area' : 'Tura Area';
    tempC = 18;
    condition = 'Cool Pine Mist';
  } else if (prefix3 === '795') {
    state = 'Manipur';
    district = 'Imphal Valley';
    cityName = 'Imphal Region';
    tempC = 20;
    condition = 'Pleasant Valley Air';
  } else if (prefix3 === '796') {
    state = 'Mizoram';
    district = 'Aizawl Ridge';
    cityName = 'Aizawl Region';
    tempC = 19;
    condition = 'Fresh Hill Air';
  } else if (prefix3 === '797') {
    state = 'Nagaland';
    district = 'Kohima / Dimapur';
    cityName = 'Nagaland Hills';
    tempC = 17;
    condition = 'Crisp Highland Air';
  } else if (prefix3 === '799') {
    state = 'Tripura';
    district = 'Agartala Region';
    cityName = 'Tripura Central';
    tempC = 24;
    condition = 'Tropical Sun';
  } else if (prefix3 === '790' || prefix3 === '791' || prefix3 === '792') {
    state = 'Arunachal Pradesh';
    district = 'Foothills / Ridge';
    cityName = 'Arunachal Region';
    tempC = 17;
    condition = 'Himalayan Breeze';
  } else if (prefix3 === '737') {
    state = 'Sikkim';
    district = 'East / South Sikkim';
    cityName = 'Gangtok Region';
    tempC = 15;
    condition = 'Cool Mountain Air';
  } else if (prefix2 === '70' || prefix2 === '71' || prefix2 === '72' || prefix2 === '73' || prefix2 === '74') {
    state = 'West Bengal';
    district = 'Bengal Circle';
    cityName = `Bengal (${cleanPin})`;
    tempC = 27;
    condition = 'Warm & Pleasant';
  } else if (prefix2 === '11') {
    state = 'Delhi';
    district = 'National Capital Region';
    cityName = 'Delhi NCR';
    tempC = 27;
    condition = 'Sunny';
  } else if (prefix2 === '40' || prefix2 === '41' || prefix2 === '42' || prefix2 === '43' || prefix2 === '44') {
    state = 'Maharashtra';
    district = 'Maharashtra Circle';
    cityName = `Maharashtra (${cleanPin})`;
    tempC = 28;
    condition = 'Warm & Clear';
  } else if (prefix2 === '56' || prefix2 === '57' || prefix2 === '58' || prefix2 === '59') {
    state = 'Karnataka';
    district = 'Karnataka Circle';
    cityName = `Karnataka (${cleanPin})`;
    tempC = 25;
    condition = 'Pleasant & Breezy';
  } else if (prefix2 === '60' || prefix2 === '61' || prefix2 === '62' || prefix2 === '63' || prefix2 === '64') {
    state = 'Tamil Nadu';
    district = 'Tamil Nadu Circle';
    cityName = `Tamil Nadu (${cleanPin})`;
    tempC = 29;
    condition = 'Tropical Sun';
  } else if (prefix2 === '50') {
    state = 'Telangana';
    district = 'Hyderabad Circle';
    cityName = `Telangana (${cleanPin})`;
    tempC = 28;
    condition = 'Warm & Bright';
  }

  const tempF = Math.round((tempC * 9) / 5 + 32);

  return {
    pincode: cleanPin,
    cityName,
    district,
    state,
    postOffice: `P.O. (${cleanPin})`,
    temperature: `${tempF}°F · ${tempC}°C`,
    celsius: tempC,
    condition,
    dayName: 'Pleasant Daylight',
    note,
    bgImage: tempC < 19
      ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop'
      : 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  };
}

/**
 * Get dynamic weather info for a location string or PIN code
 */
export function getWeatherForLocation(locationStr: string, pincode?: string): CityWeatherData {
  // If a valid 6-digit pin code is provided or embedded in locationStr
  const candidatePin = pincode || locationStr.match(/\b\d{6}\b/)?.[0];
  if (candidatePin) {
    const pinData = lookupPinCode(candidatePin);
    if (pinData) {
      return {
        cityName: pinData.cityName,
        district: pinData.district,
        state: pinData.state,
        pincode: pinData.pincode,
        temperature: pinData.temperature,
        celsius: pinData.celsius,
        condition: pinData.condition,
        dayName: pinData.dayName,
        note: pinData.note,
        bgImage: pinData.bgImage,
      };
    }
  }

  // Look up by city name in directory
  const lowerLoc = (locationStr || '').toLowerCase();
  for (const pinKey of Object.keys(PIN_CODE_DIRECTORY)) {
    const item = PIN_CODE_DIRECTORY[pinKey];
    if (
      lowerLoc.includes(item.cityName.toLowerCase()) ||
      lowerLoc.includes(item.district.toLowerCase()) ||
      lowerLoc.includes(item.pincode)
    ) {
      return {
        cityName: item.cityName,
        district: item.district,
        state: item.state,
        pincode: item.pincode,
        temperature: item.temperature,
        celsius: item.celsius,
        condition: item.condition,
        dayName: item.dayName,
        note: item.note,
        bgImage: item.bgImage,
      };
    }
  }

  // Default fallback (Tezpur, Sonitpur Assam)
  const defaultPin = PIN_CODE_DIRECTORY['784001'];
  return {
    cityName: defaultPin.cityName,
    district: defaultPin.district,
    state: defaultPin.state,
    pincode: defaultPin.pincode,
    temperature: defaultPin.temperature,
    celsius: defaultPin.celsius,
    condition: defaultPin.condition,
    dayName: defaultPin.dayName,
    note: defaultPin.note,
    bgImage: defaultPin.bgImage,
  };
}
