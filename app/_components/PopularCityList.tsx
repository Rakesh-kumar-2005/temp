"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
  const cards = popularCities.map((card, index) => (
    <Card card={card} index={index} slug={card.slug} key={card.slug} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Destinations Beyond{" "}
        <strong className="text-primary">Imagination</strong>
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
export const popularCities = [
  {
    title: "Bhatinda Waterfalls",
    category: "Natural Wonder",
    description: `Bhatinda Waterfalls is a scenic natural fall tucked away in the forests of Dhanbad district, Jharkhand. It holds cultural significance for locals and is a popular trekking and picnic destination.

Highlights:
- Surrounded by dense forests and rocky terrain.
- Ideal for nature lovers and photographers.
- Less commercialized, offering raw natural beauty.

Location: Bhawardaha village, Dhanbad district, Jharkhand

Entry Fee: Free

Opening Hours: 6:00 AM - 6:00 PM

History: A natural site without man-made structures, known to locals for generations.`,

    src: "https://images.unsplash.com/photo-1596103399853-6b41f3fad275?q=80&w=735&auto=format&fit=crop",
bestTimeToVisit: 'October to March (post-monsoon and winter season)'

  },
  {
    title: "Hazaribagh",
    category: "Heritage Destination",
    bestTimeToVisit: 'November to February (cool and pleasant weather)',
    description: `Hazaribagh is an ancient region that once served as a British cantonment town. It is famous for its wildlife sanctuary, lakes, and colonial-era heritage.

Highlights:
- Hazaribagh Wildlife Sanctuary (home to tigers, leopards, and deer).
- Historical significance during the freedom movement.
- Picturesque lakes like Canary Hill Lake.

Location: Hazaribagh district, Jharkhand

Entry Fee: ₹20-₹50 per person (for sanctuary entry)

Opening Hours: 6:00 AM - 5:30 PM

History: The town dates back to the British colonial era, serving as a cantonment. Sanctuary established in 1950.`,

    src: "https://images.unsplash.com/photo-1653305436918-d2fa7f5b6b27?q=80&w=1910&auto=format&fit=crop",
  },
  {
    title: "Jubilee Park",
    category: "Garden Paradise",
    bestTimeToVisit: 'November to February',
    description: `Jubilee Park was built in 1958 by Tata Steel as a gift to the people of Jamshedpur. It reflects the vision of J.R.D. Tata to create a city of gardens.

Highlights:
- Lush gardens with rose beds and fountains.
- Laser light shows and illuminations during festivals.
- Modeled after Mysore's Brindavan Gardens.

Location: Sakchi, Jamshedpur, East Singhbhum district, Jharkhand

Entry Fee: Free

Opening Hours: 6:00 AM - 7:00 PM

History: Established in 1958 by Tata Steel, commemorating J.R.D. Tata's vision of a green city.`,

src: "https://images.unsplash.com/photo-1673960846620-bddc8e985eb1?q=80&w=1170&auto=format&fit=crop",
  },
  {
    title: "Parasnath Hill",
    category: "Sacred Summit",
    bestTimeToVisit: 'October to March',
    description: `Parasnath Hill, also called Shikharji, is the highest peak of Jharkhand and one of the most important Jain pilgrimage centers. It is believed that 20 out of 24 Jain Tirthankaras attained nirvana here.

Highlights:
- Ancient Jain temples dating back centuries.
- Trekking trails with panoramic forest views.
- A holy site revered by Jain pilgrims worldwide.

Location: Giridih district, Jharkhand

Entry Fee: Free

Opening Hours: 5:00 AM - 6:00 PM

History: Parasnath Hill has been a sacred Jain site for thousands of years; believed 20 out of 24 Jain Tirthankaras attained nirvana here.`,

src: "https://images.unsplash.com/photo-1624077881116-7cc1228ce575?q=80&w=1073&auto=format&fit=crop",
  },
  {
    title: "Trikut Parvat",
    category: "Mythological Marvel",
    bestTimeToVisit: 'September to March',
    description: `Trikut Parvat is a mythological site associated with the Ramayana. The hill has three main peaks, considered sacred by Hindus, and also offers ropeway rides.

Highlights:
- Ropeway ride offering aerial views.
- Associated with Sage Valmiki's ashram in mythology.
- Popular with trekkers and pilgrims alike.

Location: Deoghar district, Jharkhand

Entry Fee: Ropeway ₹150-₹300, Temple entry free

Opening Hours: 6:00 AM - 6:00 PM

History: Linked to Ramayana legends; has been a pilgrimage site for centuries.`,

src: "https://images.unsplash.com/photo-1605160738885-5f86a3bb709c?q=80&w=1170&auto=format&fit=crop",
  },
  {
    title: "Ranchi",
    category: "Capital City",
    bestTimeToVisit: 'July to February (avoid peak summer)',
    description: `Ranchi, the capital of Jharkhand, was once the summer capital of Bihar during the British era. Known as the 'City of Waterfalls,' it is surrounded by forests, hills, and rivers.

Highlights:
- Famous for Dassam, Hundru, and Jonha waterfalls.
- Tribal culture and handicrafts hub.
- Once a key tribal and political center.

Location: Ranchi district, Jharkhand

Entry Fee: Free for most natural sites; waterfall entry ₹10-₹50

Opening Hours: 6:00 AM - 6:00 PM

History: Once summer capital of Bihar under British rule; the city developed around its waterfalls and forests.`,

src: "https://plus.unsplash.com/premium_photo-1691031428459-eb63c37acbdd?q=80&w=687&auto=format&fit=crop",
  },
];
export default PopularCityList;
