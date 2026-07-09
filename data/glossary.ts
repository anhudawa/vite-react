export interface GlossaryTerm {
  term: string; // display name, e.g. "Escapement"
  slug: string; // kebab-case, e.g. "escapement"
  short: string; // ONE sentence (~15-25 words) — the DefinedTerm definition
  body: string; // 2-4 sentences, fuller, in voice; athlete angle only where it genuinely fits
  related?: string[]; // 1-3 slugs of other terms in this list
  /**
   * Slug of the essay (content/essays/registry.ts) that goes deeper on this
   * term — rendered on the term page as a quiet "Read the piece" line.
   */
  essay?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: "Automatic (self-winding)",
    slug: "automatic",
    short:
      "A mechanical movement that winds its mainspring from the wearer's motion, using a weighted rotor that pivots as the wrist moves.",
    body: "An automatic movement carries a semicircular weight, the rotor, that swings on a central pivot as your wrist moves and feeds that motion into the mainspring through a winding train. Worn daily, it stays running on its own; set aside for a day or two, it stops and needs a wind or a shake to wake up. The energy you put in walking around is the same energy the escapement doles back out, beat by beat.",
    related: ["mainspring", "power-reserve", "manual-wind"],
    essay: "your-first-automatic-what-matters",
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
    essay: "the-chronograph-for-athletes",
  },
  {
    term: "Chronometer (COSC)",
    slug: "chronometer",
    short:
      "A watch whose movement has passed an official precision test; COSC is the Swiss body that certifies movements to a defined accuracy standard.",
    body: "Chronometer is not marketing; it is a certified grade of accuracy awarded after a movement is tested over several days in different positions and temperatures. In Switzerland that testing is done by the COSC, the Contrôle Officiel Suisse des Chronomètres, which holds a mechanical movement to a defined daily-rate tolerance. A watch earns the word on the dial only by passing; it is precision proved rather than claimed.",
    related: ["caliber", "isochronism", "balance-wheel"],
    essay: "what-a-chronometer-actually-is",
  },
  {
    term: "Escapement",
    slug: "escapement",
    short:
      "The mechanism that releases the mainspring's energy in small, regular increments and keeps the oscillator swinging, producing the tick.",
    body: "The escapement sits between the stored power and the balance, letting the gear train advance one measured step at a time instead of unwinding all at once. Each release gives the balance a tiny push to keep it going and makes the sound we hear as ticking. It is the governor of the whole system: power on one side, pacing on the other, the same job a rider's discipline does over the length of a long effort.",
    related: ["balance-wheel", "mainspring", "isochronism"],
    essay: "the-escapement-the-part-that-lets-go",
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
    essay: "water-resistance-for-swimmers",
  },
  {
    term: "Chip timing",
    slug: "chip-timing",
    short:
      "Race timing that records each athlete automatically via a small RFID tag read at mats on the course.",
    body: "A method of timing mass-participation races in which every athlete carries a small RFID tag — in the bib, on the shoe, or strapped to the ankle — that is read by antenna mats at the start, finish, and intermediate points. Because the clock starts when you cross the line rather than when the gun fires, chip timing gives each runner a personal, honest elapsed time. It made accurate results possible for fields of tens of thousands, something no human with a stopwatch could manage.",
    related: ["transponder", "photo-finish"],
  },
  {
    term: "Transponder",
    slug: "transponder",
    short:
      "The small radio device an athlete or bike carries so timing systems can identify and clock them automatically.",
    body: "The device that makes chip timing work: a passive or battery-powered tag that answers a timing mat's radio signal with a unique identification number. In cycling and motorsport, transponders are fixed to the frame or car and read to the thousandth of a second. It is the quiet successor to the trackside official with a split-second eye — the same job, delegated to physics.",
    related: ["chip-timing", "photo-finish", "lap"],
  },
  {
    term: "Photo finish",
    slug: "photo-finish",
    short:
      "A finish decided by a slit camera that images the finish line itself, continuously, at thousands of lines per second.",
    body: "A finish too close for the eye, settled by a camera that photographs only the plane of the finish line, thousands of times per second, building an image in which the horizontal axis is time rather than space. Officials read the picture to order athletes by the moment their torso (or, in cycling, the leading edge of the front tyre) crossed the line. The technology dates to the mid-twentieth century and remains the final court of appeal in sprint finishes.",
    related: ["chip-timing", "transponder"],
    essay: "omega-and-the-olympic-clock",
  },
  {
    term: "FKT (Fastest Known Time)",
    slug: "fkt",
    short:
      "The fastest recorded time for a defined route outside formal competition, verified by GPS evidence rather than officials.",
    body: "The fastest verified time anyone has covered a defined route — a trail, a peak, a traverse — outside the structure of an organised race. FKTs are self-timed and self-reported, then verified through GPS tracks and documentation, which makes the athlete's own instruments part of the record. Attempts come in flavours: supported, self-supported, and unsupported, each with its own rules about outside help.",
    related: ["negative-split", "dnf-dns-dsq"],
    essay: "no-one-at-the-line",
  },
  {
    term: "Time cut / autobus",
    slug: "time-cut-autobus",
    short:
      "The deadline by which riders must finish a stage to stay in a race, and the group of non-climbers who ride together to beat it.",
    body: "In stage racing, the time cut is the limit — usually a percentage of the winner's time, scaled to the stage's difficulty — inside which every rider must finish or be eliminated. On mountain days the sprinters and the suffering form the autobus (or gruppetto), a large group that rides at a calculated collective pace to arrive just inside the limit. It is pacing as survival: an entire peloton's back half doing arithmetic against the clock.",
    related: ["dnf-dns-dsq", "negative-split"],
    essay: "the-autobus",
  },
  {
    term: "Negative split",
    slug: "negative-split",
    short:
      "Running or riding the second half of an effort faster than the first.",
    body: "Covering the second half of a race faster than the first — the pacing strategy behind most well-executed distance performances, including the majority of marathon world records. A negative split demands restraint early, when the body is fresh and the pace feels cheap, and pays it back late, when everyone else is slowing. The term borrows 'split' from timing itself: the race read as two halves on a stopwatch.",
    related: ["pacing-partner-rabbit", "fkt", "lap"],
  },
  {
    term: "DNF / DNS / DSQ",
    slug: "dnf-dns-dsq",
    short:
      "The three timing states for an athlete without a finishing time: did not finish, did not start, disqualified.",
    body: "The abbreviations a results sheet uses when there is no time to print. DNF — did not finish — means the athlete started but abandoned or was pulled. DNS means they never crossed the start line; DSQ (sometimes DQ) means they finished but were disqualified, their time struck for a rules infraction. Each is a timing state as real as any number: the record of a clock that started and was never honestly stopped.",
    related: ["time-cut-autobus", "photo-finish"],
  },
  {
    term: "Pacing partner / rabbit",
    slug: "pacing-partner-rabbit",
    short:
      "A runner hired or assigned to hold a precise pace for others, usually dropping out before the finish.",
    body: "A runner whose job is to be a human metronome: hired to lead a race at an agreed pace — often to set up a record attempt — before stepping off the track or the road, typically without finishing. Rabbits (formally, pacemakers) turn a competitor's tactical race into a time trial against a schedule. The role is timing embodied: someone else wears the responsibility of the clock so the protected athlete can simply follow.",
    related: ["negative-split", "lap"],
  },
  {
    term: "Frequency (vph / Hz)",
    slug: "frequency",
    short:
      "How fast a watch's balance beats, quoted in vibrations per hour or hertz; 28,800 vph equals 4 Hz.",
    body: "The rate at which a balance wheel oscillates, quoted either in vibrations per hour (each half-swing counted) or in hertz (full oscillations per second). The modern standard is 28,800 vph — 4 Hz, eight ticks a second — with 18,000, 21,600, and 36,000 vph also common. Higher frequency generally means finer resolution and steadier timekeeping at some cost in wear and power; it is a watch's cadence, in the cyclist's sense of the word.",
    related: ["balance-wheel", "hairspring", "chronometer-vs-chronograph"],
  },
  {
    term: "Chronometer vs chronograph",
    slug: "chronometer-vs-chronograph",
    short:
      "A chronometer is a watch certified for accuracy; a chronograph is a watch with a stopwatch function — often confused, rarely the same thing.",
    body: "Two words the trade is careful not to swap. A chronometer is a watch whose movement has passed an independent precision test — most often COSC certification, which requires an average daily rate between −4 and +6 seconds. A chronograph is a watch with a built-in stopwatch, started and stopped by pushers, for timing an interval. One is a credential, the other a function; a single watch can be both, and many are neither.",
    related: ["chronometer", "chronograph", "frequency"],
    essay: "what-a-chronometer-actually-is",
  },
  {
    term: "Complication",
    slug: "complication",
    short:
      "Any function a watch performs beyond telling the time of day.",
    body: "Any function a movement offers beyond hours, minutes, and seconds: a date, a chronograph, a second time zone, a moonphase, an alarm, a perpetual calendar. The word is used without irony — each added function genuinely complicates the mechanism — and watches carrying many of them are called grandes complications. It is the watchmaker's way of saying that everything past plain timekeeping is elective difficulty.",
    related: ["chronograph", "gmt", "crown"],
  },
  {
    term: "Crown",
    slug: "crown",
    short:
      "The knurled knob on the case used to wind the watch and set the time.",
    body: "The knurled knob, usually at three o'clock, through which you wind the mainspring and set the hands and date. On dive and sports watches it often screws down against a gasket to seal the case — the reason a crown left unscrewed is the most common way a water-resistant watch floods. It is the one part of a watch you are meant to handle daily, the interface between fingers and movement.",
    related: ["manual-wind", "water-resistance-rating", "complication"],
  },
  {
    term: "Lug-to-lug",
    slug: "lug-to-lug",
    short:
      "The distance between the tips of a watch's lugs — the measurement that decides how a watch actually fits.",
    body: "The distance from the tip of a watch's upper lugs to the tip of the lower ones, measured across the case. More than diameter, it determines whether a watch sits within the flat of your wrist or hangs over the edges — the number to check before buying, the way a rider checks stack and reach before believing a frame size. Two watches with the same diameter can wear very differently if their lug-to-lug figures diverge.",
    related: ["bezel", "crown"],
    essay: "sizing-a-watch-for-a-lean-wrist",
  },
  {
    term: "Super-LumiNova",
    slug: "super-luminova",
    short:
      "The standard photoluminescent paint on modern dials and hands: charged by light, glowing in the dark, containing no radioactive material.",
    body: "The photoluminescent pigment applied to most modern hands, indices, and bezel markers. Based on strontium aluminate, it absorbs light and re-emits it as a glow that fades over hours and recharges indefinitely, with no radioactive content — the safe successor to the radium and tritium paints of earlier eras. Its brightness in the first dark hour of a night ride or a pre-dawn start is one of the small practical tests a tool watch either passes or fails.",
    related: ["lume", "bezel"],
    essay: "lume-and-the-dark",
  },
  {
    term: "Helium escape valve",
    slug: "helium-escape-valve",
    short:
      "A one-way valve that lets helium leave a dive watch's case during decompression from saturation diving.",
    body: "A one-way valve fitted to some professional dive watches that lets helium vent from the case during decompression. In saturation diving, breathing-gas helium atoms are small enough to seep past a watch's seals over days in a pressurised habitat; without a release, the trapped gas can pop the crystal off as outside pressure drops. It solves a problem almost no owner will ever have — which is precisely the kind of over-engineering dive watch culture prizes.",
    related: ["water-resistance-rating", "crown"],
    essay: "the-overbuilt-watch",
  },
  {
    term: "Lap",
    slug: "lap",
    short:
      "One complete circuit of a course, and the timing function — flyback on a watch, lap button on a stopwatch — built to measure it.",
    body: "One full circuit of a track, criterium course, or loop, and by extension the time it took. Timing devices grew functions to serve it: a stopwatch's lap button freezes the display while counting continues underneath, and a flyback chronograph lets one press reset and instantly restart the seconds hand for the next interval. Here again the tool and the sport shaped each other — the lap is a unit of racing that watches learned to speak.",
    related: ["chronograph", "rattrapante", "negative-split"],
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return glossary.find((t) => t.slug === slug);
}
