export interface GlossaryTerm {
  term: string; // display name, e.g. "Escapement"
  slug: string; // kebab-case, e.g. "escapement"
  short: string; // ONE sentence (~15-25 words) — the DefinedTerm definition
  body: string; // 2-4 sentences, fuller, in voice; athlete angle only where it genuinely fits
  related?: string[]; // 1-3 slugs of other terms in this list
}

export const glossary: GlossaryTerm[] = [
  {
    term: "Automatic (self-winding)",
    slug: "automatic",
    short:
      "A mechanical movement that winds its mainspring from the wearer's motion, using a weighted rotor that pivots as the wrist moves.",
    body: "An automatic movement carries a semicircular weight, the rotor, that swings on a central pivot as your wrist moves and feeds that motion into the mainspring through a winding train. Worn daily, it stays running on its own; set aside for a day or two, it stops and needs a wind or a shake to wake up. The energy you put in walking around is the same energy the escapement doles back out, beat by beat.",
    related: ["mainspring", "power-reserve", "manual-wind"],
  },
  {
    term: "Balance wheel",
    slug: "balance-wheel",
    short:
      "The oscillating wheel that, with the hairspring, swings back and forth at a fixed rate to divide time into equal beats.",
    body: "The balance wheel is the timekeeping heart of a mechanical watch: it rotates one way, the hairspring pulls it back, and it returns, over and over, at a steady frequency. A common modern rate is 28,800 vibrations per hour, which works out to 4 Hz, or eight beats a second. It is an oscillator tuned to keep time whether or not anyone is watching, the way a trained body holds a rhythm long after the mind has stopped counting.",
    related: ["hairspring", "escapement", "isochronism"],
  },
  {
    term: "Bezel",
    slug: "bezel",
    short:
      "The ring around the dial, often rotating, that can carry a scale for timing, navigation, or other readings.",
    body: "At its plainest the bezel just secures the crystal, but on tool watches it earns its keep. A rotating dive bezel tracks elapsed time so you can read how long you have been under; a GMT bezel marks a second time zone; a tachymeter bezel converts elapsed seconds into speed. The good ones turn with a firm, deliberate click and don't move when you don't want them to.",
    related: ["tachymeter", "gmt", "water-resistance-rating"],
  },
  {
    term: "Caliber (movement)",
    slug: "caliber",
    short:
      "The complete mechanism inside a watch that keeps time and drives its functions; a caliber is a specific named movement design.",
    body: "Movement is the whole engine: the gears, the mainspring, the escapement, the balance, and any added complications, all working together to measure time and show it. Caliber is the name and reference given to a particular movement design, the way an engine has a model number. When someone asks what's inside a watch, the caliber is the honest answer, more telling than the case or the dial.",
    related: ["escapement", "mainspring", "chronometer"],
  },
  {
    term: "Chronograph",
    slug: "chronograph",
    short:
      "A watch with a built-in stopwatch that can start, stop, and reset an independent timing function without disturbing the running time.",
    body: "A chronograph adds a stopwatch to the watch, usually worked by pushers flanking the crown, with elapsed time read off subdials or a central hand. It answers the oldest endurance instinct there is, timing yourself against yourself: the lap, the interval, the climb you swore you'd ride faster this year. Underneath, the start, stop, and reset are a small mechanical event each time, which is part of why a good one feels so satisfying to run.",
    related: ["rattrapante", "tachymeter", "caliber"],
  },
  {
    term: "Chronometer (COSC)",
    slug: "chronometer",
    short:
      "A watch whose movement has passed an official precision test; COSC is the Swiss body that certifies movements to a defined accuracy standard.",
    body: "Chronometer is not marketing; it is a certified grade of accuracy awarded after a movement is tested over several days in different positions and temperatures. In Switzerland that testing is done by the COSC, the Contrôle Officiel Suisse des Chronomètres, which holds a mechanical movement to a defined daily-rate tolerance. A watch earns the word on the dial only by passing; it is precision proved rather than claimed.",
    related: ["caliber", "isochronism", "balance-wheel"],
  },
  {
    term: "Escapement",
    slug: "escapement",
    short:
      "The mechanism that releases the mainspring's energy in small, regular increments and keeps the oscillator swinging, producing the tick.",
    body: "The escapement sits between the stored power and the balance, letting the gear train advance one measured step at a time instead of unwinding all at once. Each release gives the balance a tiny push to keep it going and makes the sound we hear as ticking. It is the governor of the whole system: power on one side, pacing on the other, the same job a rider's discipline does over the length of a long effort.",
    related: ["balance-wheel", "mainspring", "isochronism"],
  },
  {
    term: "GMT",
    slug: "gmt",
    short:
      "A complication that shows a second time zone, traditionally via an extra hand reading against a 24-hour scale.",
    body: "A GMT watch tracks two time zones at once, usually with a fourth hand that sweeps the dial every 24 hours and is read against a 24-hour bezel or ring. The name comes from Greenwich Mean Time, the old reference for the world's zones. For anyone who travels to a race or starts before dawn in one place to finish in another, it answers two questions on one dial: what time is it here, and what time is it back home.",
    related: ["bezel", "tachymeter", "caliber"],
  },
  {
    term: "Hacking seconds",
    slug: "hacking-seconds",
    short:
      "A feature where pulling the crown to set the time stops the seconds hand, so the watch can be synchronized to the exact second.",
    body: "On a hacking movement, pulling the crown out to the time-setting position brakes the balance and freezes the seconds hand at zero. You can then set the watch against a reference and push the crown back in on the exact second, so it starts precisely in sync. It is a small thing until the moment a shared start time actually matters, and then it is the whole point.",
    related: ["balance-wheel", "caliber", "chronometer"],
  },
  {
    term: "Hairspring (balance spring)",
    slug: "hairspring",
    short:
      "The fine coiled spring that returns the balance wheel after each swing, setting the rate at which the watch keeps time.",
    body: "The hairspring, also called the balance spring, is a slender coil fixed to the balance wheel that winds and unwinds with every oscillation, pulling the balance back each time it turns. Its length and elasticity set the frequency, so it is what actually determines the rate. It is among the most delicate parts in the watch, and the precision of its breathing is most of why one movement keeps better time than another.",
    related: ["balance-wheel", "escapement", "isochronism"],
  },
  {
    term: "Isochronism",
    slug: "isochronism",
    short:
      "The ideal that an oscillator keeps the same period regardless of how wide its swings are, so the watch runs at a constant rate.",
    body: "Isochronism is the property of an oscillator beating at the same rate whether its swings are wide or narrow. It matters in a watch because the balance swings more strongly when the mainspring is full and more weakly as it runs down, and a good movement keeps near-constant time across that range. Perfect isochronism is a goal rather than a given; much of fine watchmaking is the long pursuit of it.",
    related: ["balance-wheel", "hairspring", "power-reserve"],
  },
  {
    term: "Lume",
    slug: "lume",
    short:
      "Luminous material on the hands and markers that glows in the dark after absorbing light, so the watch stays readable without illumination.",
    body: "Lume is the photoluminescent compound painted onto hands and markers; it charges under light and then glows, fading slowly through the night. Modern watches generally use non-radioactive pigments that you charge and that discharge over hours. It earns its place at the edges of the day, the pre-dawn start when nothing else is lit and the watch is the one thing you can still read.",
    related: ["bezel", "water-resistance-rating"],
  },
  {
    term: "Mainspring",
    slug: "mainspring",
    short:
      "The coiled spring inside the barrel that stores the watch's energy when wound and releases it to run the movement.",
    body: "The mainspring is the power source of a mechanical watch, a flat coiled spring wound tight inside its barrel. As it slowly unwinds, it drives the gear train, which the escapement meters out one beat at a time. Wind it and you store effort for later; the watch then spends that store at a measured pace until it runs out, which is the whole arc of a power reserve.",
    related: ["power-reserve", "escapement", "automatic"],
  },
  {
    term: "Manual wind",
    slug: "manual-wind",
    short:
      "A mechanical movement wound by hand, by turning the crown, rather than by the motion of the wearer's wrist.",
    body: "A manual-wind, or hand-wound, watch has no automatic rotor; you wind the crown to tension the mainspring, usually once a day, until it offers gentle resistance and you stop. It asks for a small daily ritual in exchange for a thinner case and an uninterrupted view of the movement. Some people find the winding a chore; others find it the best few seconds of the morning.",
    related: ["automatic", "mainspring", "power-reserve"],
  },
  {
    term: "Power reserve",
    slug: "power-reserve",
    short:
      "How long a fully wound mechanical watch will keep running before the mainspring unwinds and it stops.",
    body: "Power reserve is the running time a watch has left from a full wind, the gap between fully wound and stopped. Some watches show it on the dial with a power-reserve indicator so you can see the store draining. It is the cleanest analogue in the whole craft to glycogen at hour five: a finite store you wind up in advance and then ration to the finish, knowing exactly when it runs out.",
    related: ["mainspring", "automatic", "isochronism"],
  },
  {
    term: "Rattrapante (split-seconds)",
    slug: "rattrapante",
    short:
      "A chronograph with two stacked seconds hands that lets you time two events that start together, recording a split while timing continues.",
    body: "A rattrapante, or split-seconds chronograph, has a second chronograph hand stacked under the first. Both start together; pressing the split button stops one to read an intermediate time while the other keeps running, and a further press snaps the stopped hand back to catch up. It is one of the harder complications to make, and it does the exact job an athlete knows by heart: holding one time still to read it while the clock keeps moving.",
    related: ["chronograph", "tachymeter", "caliber"],
  },
  {
    term: "Tachymeter",
    slug: "tachymeter",
    short:
      "A scale, usually on the bezel, that converts elapsed time over a known distance into average speed, used with a chronograph.",
    body: "A tachymeter is a fixed scale, most often printed on the bezel, that reads average speed from elapsed time. Start the chronograph as a measured distance begins, stop it as the distance ends, and the seconds hand points at your speed over that distance on the scale. It assumes a set distance, classically one unit such as a mile or a kilometre, and turns the stopwatch into a speedometer for anyone willing to do the timing.",
    related: ["chronograph", "bezel", "rattrapante"],
  },
  {
    term: "Water resistance rating",
    slug: "water-resistance-rating",
    short:
      "A figure, given in metres, bar, or ATM, indicating the pressure a watch is built and tested to withstand rather than a literal diving depth.",
    body: "A water resistance rating marks the pressure a watch is designed to resist, expressed in metres, bar, or ATM. It is a measure of tested static pressure, not an invitation to swim to that depth, since real-world movement and water flow add load the static figure doesn't account for. Read the rating conservatively, keep the crown pushed in, and have the gaskets checked over time; seals age.",
    related: ["bezel", "lume"],
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return glossary.find((t) => t.slug === slug);
}
