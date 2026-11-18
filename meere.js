// =====================================================
//  MEERE & OZEANE – Namen und kurze Infos in 4 Sprachen
//  typ: 'ozean' oder 'meer'
//  teile: welche Flächen aus meere.geojson beim Auswählen aufleuchten
//  ansicht: wohin der Globus schaut
// =====================================================

const MEERE = [

  // ---------- 🌊 OZEANE ----------
  {
    id: 'pazifik', typ: 'ozean', teile: ['North Pacific Ocean', 'South Pacific Ocean'],
    ansicht: { lat: 0, lng: -160, altitude: 2.6 },
    name: { de: 'Pazifischer Ozean (Pazifik)', en: 'Pacific Ocean', fr: 'Océan Pacifique', ar: 'المحيط الهادئ' },
    info: {
      de: 'Der größte und tiefste Ozean der Erde. Er ist größer als alle Kontinente zusammen.',
      en: 'The largest and deepest ocean on Earth. It is bigger than all the continents put together.',
      fr: 'Le plus grand et le plus profond océan de la Terre. Il est plus grand que tous les continents réunis.',
      ar: 'أكبر محيطات الأرض وأعمقها، وهو أكبر من جميع القارات مجتمعة.'
    },
    fakt: {
      de: 'Im Marianengraben liegt die tiefste Stelle der Erde – rund 11.000 m unter dem Meeresspiegel.',
      en: 'The Mariana Trench contains the deepest point on Earth – about 11,000 m below sea level.',
      fr: 'La fosse des Mariannes abrite le point le plus profond de la Terre – environ 11 000 m sous le niveau de la mer.',
      ar: 'في خندق ماريانا تقع أعمق نقطة على الأرض، على عمق نحو 11000 م تحت سطح البحر.'
    }
  },
  {
    id: 'atlantik', typ: 'ozean', teile: ['North Atlantic Ocean', 'South Atlantic Ocean'],
    ansicht: { lat: 10, lng: -35, altitude: 2.4 },
    name: { de: 'Atlantischer Ozean (Atlantik)', en: 'Atlantic Ocean', fr: 'Océan Atlantique', ar: 'المحيط الأطلسي' },
    info: {
      de: 'Der zweitgrößte Ozean trennt Amerika von Europa und Afrika.',
      en: 'The second-largest ocean separates the Americas from Europe and Africa.',
      fr: 'Le deuxième plus grand océan sépare l’Amérique de l’Europe et de l’Afrique.',
      ar: 'ثاني أكبر المحيطات، ويفصل الأمريكيتين عن أوروبا وأفريقيا.'
    },
    fakt: {
      de: 'Der Atlantik wird jedes Jahr ein paar Zentimeter breiter, weil sich die Erdplatten auseinanderbewegen.',
      en: 'The Atlantic gets a few centimetres wider every year because the Earth’s plates are moving apart.',
      fr: 'L’Atlantique s’élargit de quelques centimètres chaque année, car les plaques terrestres s’écartent.',
      ar: 'يزداد عرض المحيط الأطلسي بضعة سنتيمترات كل عام لأن الصفائح الأرضية تتباعد.'
    }
  },
  {
    id: 'indisch', typ: 'ozean', teile: ['INDIAN OCEAN'],
    ansicht: { lat: -20, lng: 80, altitude: 2.4 },
    name: { de: 'Indischer Ozean', en: 'Indian Ocean', fr: 'Océan Indien', ar: 'المحيط الهندي' },
    info: {
      de: 'Der drittgrößte Ozean liegt zwischen Afrika, Asien und Australien.',
      en: 'The third-largest ocean lies between Africa, Asia and Australia.',
      fr: 'Le troisième plus grand océan se situe entre l’Afrique, l’Asie et l’Australie.',
      ar: 'ثالث أكبر المحيطات، ويقع بين أفريقيا وآسيا وأستراليا.'
    },
    fakt: {
      de: 'Er ist der wärmste Ozean der Erde.',
      en: 'It is the warmest ocean on Earth.',
      fr: 'C’est l’océan le plus chaud de la Terre.',
      ar: 'هو أدفأ محيطات الأرض.'
    }
  },
  {
    id: 'arktisch', typ: 'ozean', teile: ['Arctic Ocean'],
    ansicht: { lat: 80, lng: 0, altitude: 2.2 },
    name: { de: 'Arktischer Ozean (Nordpolarmeer)', en: 'Arctic Ocean', fr: 'Océan Arctique', ar: 'المحيط المتجمد الشمالي' },
    info: {
      de: 'Der kleinste und flachste Ozean liegt rund um den Nordpol und ist großteils mit Meereis bedeckt.',
      en: 'The smallest and shallowest ocean surrounds the North Pole and is largely covered with sea ice.',
      fr: 'Le plus petit et le moins profond des océans entoure le pôle Nord et est en grande partie couvert de banquise.',
      ar: 'أصغر المحيطات وأقلها عمقًا، يحيط بالقطب الشمالي وتغطي معظمه طبقة من الجليد البحري.'
    },
    fakt: {
      de: 'Am Nordpol gibt es kein Land – nur gefrorenes Meer.',
      en: 'There is no land at the North Pole – only frozen sea.',
      fr: 'Il n’y a pas de terre au pôle Nord – seulement de la mer gelée.',
      ar: 'لا توجد يابسة عند القطب الشمالي، بل بحر متجمد فقط.'
    }
  },
  {
    id: 'suedlich', typ: 'ozean', teile: ['SOUTHERN OCEAN'],
    ansicht: { lat: -70, lng: 20, altitude: 2.4 },
    name: { de: 'Südlicher Ozean', en: 'Southern Ocean', fr: 'Océan Austral', ar: 'المحيط المتجمد الجنوبي' },
    info: {
      de: 'Er umgibt die Antarktis. Erst seit dem Jahr 2000 zählen ihn viele Fachleute als eigenen Ozean.',
      en: 'It surrounds Antarctica. Many experts have only counted it as a separate ocean since the year 2000.',
      fr: 'Il entoure l’Antarctique. Beaucoup de spécialistes ne le comptent comme un océan à part entière que depuis l’an 2000.',
      ar: 'يحيط بالقارة القطبية الجنوبية، ولم يعدّه كثير من الخبراء محيطًا مستقلًا إلا منذ عام 2000.'
    },
    fakt: {
      de: 'Hier fließt die stärkste Meeresströmung der Welt einmal rund um die Antarktis.',
      en: 'The strongest ocean current in the world flows here, all the way around Antarctica.',
      fr: 'Le courant marin le plus puissant du monde y fait le tour complet de l’Antarctique.',
      ar: 'هنا يجري أقوى تيار بحري في العالم في دورة كاملة حول القارة القطبية الجنوبية.'
    }
  },

  // ---------- 🌊 MEERE ----------
  {
    id: 'mittelmeer', typ: 'meer',
    teile: ['Mediterranean Sea', 'Balearic Sea', 'Tyrrhenian Sea', 'Ionian Sea', 'Golfe du Lion', 'Adriatic Sea', 'Aegean Sea'],
    ansicht: { lat: 38, lng: 16, altitude: 1.2 },
    name: { de: 'Mittelmeer', en: 'Mediterranean Sea', fr: 'Mer Méditerranée', ar: 'البحر الأبيض المتوسط' },
    info: {
      de: 'Es liegt zwischen Europa, Afrika und Asien und ist nur über die schmale Straße von Gibraltar mit dem Atlantik verbunden.',
      en: 'It lies between Europe, Africa and Asia and is connected to the Atlantic only by the narrow Strait of Gibraltar.',
      fr: 'Elle se situe entre l’Europe, l’Afrique et l’Asie et n’est reliée à l’Atlantique que par l’étroit détroit de Gibraltar.',
      ar: 'يقع بين أوروبا وأفريقيا وآسيا، ولا يتصل بالمحيط الأطلسي إلا عبر مضيق جبل طارق الضيق.'
    },
    fakt: {
      de: 'Der Name kommt vom lateinischen „mediterraneus“ – „in der Mitte der Länder“.',
      en: 'The name comes from the Latin "mediterraneus" – "in the middle of the lands".',
      fr: 'Le nom vient du latin « mediterraneus » – « au milieu des terres ».',
      ar: 'يأتي الاسم الأوروبي من الكلمة اللاتينية «mediterraneus» أي «في وسط اليابسة».'
    }
  },
  {
    id: 'adria', typ: 'meer', teile: ['Adriatic Sea'],
    ansicht: { lat: 43, lng: 15.5, altitude: 0.8 },
    name: { de: 'Adriatisches Meer (Adria)', en: 'Adriatic Sea', fr: 'Mer Adriatique', ar: 'البحر الأدرياتيكي' },
    info: {
      de: 'Ein Teil des Mittelmeers zwischen Italien und der Balkanhalbinsel.',
      en: 'A part of the Mediterranean between Italy and the Balkan Peninsula.',
      fr: 'Une partie de la Méditerranée entre l’Italie et la péninsule balkanique.',
      ar: 'جزء من البحر المتوسط بين إيطاليا وشبه جزيرة البلقان.'
    },
    fakt: {
      de: 'Venedig, die Stadt auf dem Wasser, liegt an der Adria.',
      en: 'Venice, the city on the water, lies on the Adriatic.',
      fr: 'Venise, la ville sur l’eau, se trouve au bord de l’Adriatique.',
      ar: 'تقع البندقية، المدينة المبنية على الماء، على البحر الأدرياتيكي.'
    }
  },
  {
    id: 'aegaeis', typ: 'meer', teile: ['Aegean Sea'],
    ansicht: { lat: 38.5, lng: 25, altitude: 0.8 },
    name: { de: 'Ägäisches Meer (Ägäis)', en: 'Aegean Sea', fr: 'Mer Égée', ar: 'بحر إيجه' },
    info: {
      de: 'Ein Teil des Mittelmeers zwischen Griechenland und der Türkei – mit weit über tausend Inseln.',
      en: 'A part of the Mediterranean between Greece and Turkey – with well over a thousand islands.',
      fr: 'Une partie de la Méditerranée entre la Grèce et la Turquie – avec bien plus d’un millier d’îles.',
      ar: 'جزء من البحر المتوسط بين اليونان وتركيا، وفيه أكثر من ألف جزيرة.'
    },
    fakt: {
      de: 'Laut einer griechischen Sage ist es nach König Aigeus benannt.',
      en: 'According to a Greek legend, it is named after King Aegeus.',
      fr: 'Selon une légende grecque, elle doit son nom au roi Égée.',
      ar: 'بحسب أسطورة يونانية سُمّي على اسم الملك إيجيوس.'
    }
  },
  {
    id: 'nordsee', typ: 'meer', teile: ['North Sea'],
    ansicht: { lat: 56, lng: 3, altitude: 0.9 },
    name: { de: 'Nordsee', en: 'North Sea', fr: 'Mer du Nord', ar: 'بحر الشمال' },
    info: {
      de: 'Ein Randmeer des Atlantiks zwischen Großbritannien, Norwegen, Dänemark, Deutschland, den Niederlanden und Belgien.',
      en: 'A marginal sea of the Atlantic between Great Britain, Norway, Denmark, Germany, the Netherlands and Belgium.',
      fr: 'Une mer bordière de l’Atlantique entre la Grande-Bretagne, la Norvège, le Danemark, l’Allemagne, les Pays-Bas et la Belgique.',
      ar: 'بحر هامشي للمحيط الأطلسي بين بريطانيا والنرويج والدنمارك وألمانيا وهولندا وبلجيكا.'
    },
    fakt: {
      de: 'Das Wattenmeer an der Küste ist UNESCO-Weltnaturerbe – bei Ebbe kann man dort auf dem Meeresboden laufen.',
      en: 'The Wadden Sea on the coast is a UNESCO World Heritage Site – at low tide you can walk on the sea floor.',
      fr: 'La mer des Wadden, sur la côte, est inscrite au patrimoine mondial de l’UNESCO – à marée basse, on peut marcher sur le fond de la mer.',
      ar: 'بحر وادن على الساحل من مواقع التراث العالمي لليونسكو، ويمكن عند الجزر المشي على قاع البحر.'
    }
  },
  {
    id: 'ostsee', typ: 'meer', teile: ['Baltic Sea', 'Gulf of Bothnia', 'Gulf of Finland'],
    ansicht: { lat: 59, lng: 20, altitude: 1.0 },
    name: { de: 'Ostsee', en: 'Baltic Sea', fr: 'Mer Baltique', ar: 'بحر البلطيق' },
    info: {
      de: 'Ein fast vollständig von Land umschlossenes Meer in Nordeuropa.',
      en: 'A sea in Northern Europe that is almost completely surrounded by land.',
      fr: 'Une mer d’Europe du Nord presque entièrement entourée de terres.',
      ar: 'بحر في شمال أوروبا تحيط به اليابسة من كل الجهات تقريبًا.'
    },
    fakt: {
      de: 'Sie ist viel weniger salzig als der Ozean, weil sehr viele Flüsse Süßwasser hineinbringen.',
      en: 'It is much less salty than the ocean because many rivers bring fresh water into it.',
      fr: 'Elle est bien moins salée que l’océan, car de nombreux fleuves y apportent de l’eau douce.',
      ar: 'ماؤه أقل ملوحة بكثير من ماء المحيط، لأن أنهارًا كثيرة تصب فيه ماءً عذبًا.'
    }
  },
  {
    id: 'schwarz', typ: 'meer', teile: ['Black Sea'],
    ansicht: { lat: 43, lng: 34, altitude: 0.9 },
    name: { de: 'Schwarzes Meer', en: 'Black Sea', fr: 'Mer Noire', ar: 'البحر الأسود' },
    info: {
      de: 'Es liegt zwischen Südosteuropa und Asien und ist über den Bosporus in Istanbul mit dem Mittelmeer verbunden.',
      en: 'It lies between south-eastern Europe and Asia and is connected to the Mediterranean via the Bosporus in Istanbul.',
      fr: 'Elle se situe entre l’Europe du Sud-Est et l’Asie et est reliée à la Méditerranée par le Bosphore, à Istanbul.',
      ar: 'يقع بين جنوب شرق أوروبا وآسيا، ويتصل بالبحر المتوسط عبر مضيق البوسفور في إسطنبول.'
    },
    fakt: {
      de: 'In der Tiefe gibt es fast keinen Sauerstoff – deshalb sind dort uralte Schiffswracks sehr gut erhalten.',
      en: 'There is almost no oxygen in its depths – that is why ancient shipwrecks are very well preserved there.',
      fr: 'En profondeur, il n’y a presque pas d’oxygène – c’est pourquoi de très anciennes épaves y sont très bien conservées.',
      ar: 'لا يكاد يوجد أكسجين في أعماقه، ولذلك بقيت فيه حطام سفن قديمة جدًا محفوظة بحالة جيدة.'
    }
  },
  {
    id: 'kaspisch', typ: 'meer', teile: ['Caspian Sea'],
    ansicht: { lat: 42, lng: 51, altitude: 1.0 },
    name: { de: 'Kaspisches Meer', en: 'Caspian Sea', fr: 'Mer Caspienne', ar: 'بحر قزوين' },
    info: {
      de: 'Das größte Binnengewässer der Erde. Es hat keine Verbindung zum Ozean und ist eigentlich ein riesiger, leicht salziger See.',
      en: 'The largest inland body of water on Earth. It has no connection to the ocean and is really a huge, slightly salty lake.',
      fr: 'La plus grande étendue d’eau intérieure de la Terre. Sans lien avec l’océan, c’est en réalité un immense lac légèrement salé.',
      ar: 'أكبر مسطح مائي داخلي على الأرض. لا يتصل بالمحيط، وهو في الحقيقة بحيرة ضخمة قليلة الملوحة.'
    },
    fakt: {
      de: 'Hier leben die Störe, von denen der berühmte Kaviar stammt.',
      en: 'It is home to the sturgeon that the famous caviar comes from.',
      fr: 'C’est là que vivent les esturgeons dont provient le célèbre caviar.',
      ar: 'تعيش فيه أسماك الحفش التي يُستخرج منها الكافيار الشهير.'
    }
  },
  {
    id: 'rot', typ: 'meer', teile: ['Red Sea'],
    ansicht: { lat: 20, lng: 38, altitude: 1.1 },
    name: { de: 'Rotes Meer', en: 'Red Sea', fr: 'Mer Rouge', ar: 'البحر الأحمر' },
    info: {
      de: 'Es liegt zwischen Afrika und der Arabischen Halbinsel und ist über den Suezkanal mit dem Mittelmeer verbunden.',
      en: 'It lies between Africa and the Arabian Peninsula and is connected to the Mediterranean by the Suez Canal.',
      fr: 'Elle se situe entre l’Afrique et la péninsule Arabique et est reliée à la Méditerranée par le canal de Suez.',
      ar: 'يقع بين أفريقيا وشبه الجزيرة العربية، ويتصل بالبحر المتوسط عبر قناة السويس.'
    },
    fakt: {
      de: 'Es ist eines der salzigsten Meere der Welt und berühmt für seine Korallenriffe.',
      en: 'It is one of the saltiest seas in the world and famous for its coral reefs.',
      fr: 'C’est l’une des mers les plus salées du monde, célèbre pour ses récifs coralliens.',
      ar: 'من أكثر بحار العالم ملوحة، ومشهور بشعابه المرجانية.'
    }
  },
  {
    id: 'persisch', typ: 'meer', teile: ['Persian Gulf'],
    ansicht: { lat: 27, lng: 51, altitude: 0.8 },
    name: { de: 'Persischer Golf', en: 'Persian Gulf', fr: 'Golfe Persique', ar: 'الخليج العربي (الفارسي)' },
    info: {
      de: 'Ein Randmeer zwischen dem Iran und der Arabischen Halbinsel, in den arabischen Ländern „Arabischer Golf“ genannt. Hier gibt es riesige Erdöl- und Erdgasvorkommen.',
      en: 'A marginal sea between Iran and the Arabian Peninsula, called the "Arabian Gulf" in Arab countries. It has huge oil and gas reserves.',
      fr: 'Une mer bordière entre l’Iran et la péninsule Arabique, appelée « golfe Arabique » dans les pays arabes. On y trouve d’immenses réserves de pétrole et de gaz.',
      ar: 'بحر هامشي بين إيران وشبه الجزيرة العربية، يُسمّى في إيران «الخليج الفارسي». وفيه احتياطيات ضخمة من النفط والغاز.'
    },
    fakt: {
      de: 'Durch die enge Straße von Hormus wird rund ein Fünftel des weltweit verbrauchten Erdöls transportiert.',
      en: 'About a fifth of the oil consumed worldwide is shipped through the narrow Strait of Hormuz.',
      fr: 'Environ un cinquième du pétrole consommé dans le monde transite par l’étroit détroit d’Ormuz.',
      ar: 'يمر عبر مضيق هرمز الضيق نحو خُمس النفط المستهلك في العالم.'
    }
  },
  {
    id: 'arabisch', typ: 'meer', teile: ['Arabian Sea'],
    ansicht: { lat: 15, lng: 64, altitude: 1.4 },
    name: { de: 'Arabisches Meer', en: 'Arabian Sea', fr: 'Mer d’Arabie', ar: 'بحر العرب' },
    info: {
      de: 'Ein Teil des Indischen Ozeans zwischen der Arabischen Halbinsel und Indien.',
      en: 'A part of the Indian Ocean between the Arabian Peninsula and India.',
      fr: 'Une partie de l’océan Indien entre la péninsule Arabique et l’Inde.',
      ar: 'جزء من المحيط الهندي بين شبه الجزيرة العربية والهند.'
    },
    fakt: {
      de: 'Seefahrer nutzen hier seit Jahrtausenden die Monsunwinde, die im Lauf des Jahres ihre Richtung wechseln.',
      en: 'For thousands of years, sailors here have used the monsoon winds, which change direction during the year.',
      fr: 'Depuis des millénaires, les marins y utilisent les vents de mousson, qui changent de direction au fil de l’année.',
      ar: 'يستخدم البحارة هنا منذ آلاف السنين الرياح الموسمية التي تغيّر اتجاهها خلال السنة.'
    }
  },
  {
    id: 'karibik', typ: 'meer', teile: ['Caribbean Sea'],
    ansicht: { lat: 15, lng: -75, altitude: 1.3 },
    name: { de: 'Karibisches Meer', en: 'Caribbean Sea', fr: 'Mer des Caraïbes', ar: 'البحر الكاريبي' },
    info: {
      de: 'Es liegt zwischen Mittelamerika, Südamerika und den Karibikinseln.',
      en: 'It lies between Central America, South America and the Caribbean islands.',
      fr: 'Elle se situe entre l’Amérique centrale, l’Amérique du Sud et les îles des Caraïbes.',
      ar: 'يقع بين أمريكا الوسطى وأمريكا الجنوبية وجزر الكاريبي.'
    },
    fakt: {
      de: 'Das Wort „Hurrikan“ stammt aus der Sprache der Taíno, Ureinwohner der Karibik.',
      en: 'The word "hurricane" comes from the language of the Taíno, indigenous people of the Caribbean.',
      fr: 'Le mot « ouragan » vient de la langue des Taïnos, peuple autochtone des Caraïbes.',
      ar: 'كلمة «هوريكان» (الإعصار) أصلها من لغة شعب التاينو، السكان الأصليين للكاريبي.'
    }
  },
  {
    id: 'mexiko', typ: 'meer', teile: ['Gulf of Mexico', 'Bahía de Campeche'],
    ansicht: { lat: 25, lng: -90, altitude: 1.2 },
    name: { de: 'Golf von Mexiko', en: 'Gulf of Mexico', fr: 'Golfe du Mexique', ar: 'خليج المكسيك' },
    info: {
      de: 'Ein großes Randmeer zwischen den USA, Mexiko und Kuba. In den USA heißt er seit 2025 offiziell „Golf von Amerika“.',
      en: 'A large marginal sea between the USA, Mexico and Cuba. In the USA it has officially been called the "Gulf of America" since 2025.',
      fr: 'Une grande mer bordière entre les États-Unis, le Mexique et Cuba. Aux États-Unis, il s’appelle officiellement « golfe d’Amérique » depuis 2025.',
      ar: 'بحر هامشي كبير بين الولايات المتحدة والمكسيك وكوبا. ويُسمّى رسميًا في الولايات المتحدة منذ 2025 «خليج أمريكا».'
    },
    fakt: {
      de: 'Der Golfstrom, der Europa warmes Wasser bringt, ist nach diesem Golf benannt.',
      en: 'The Gulf Stream, which brings warm water to Europe, is named after this gulf.',
      fr: 'Le Gulf Stream, qui apporte de l’eau chaude en Europe, doit son nom à ce golfe.',
      ar: 'سُمّي تيار الخليج، الذي يجلب المياه الدافئة إلى أوروبا، على اسم هذا الخليج.'
    }
  },
  {
    id: 'bering', typ: 'meer', teile: ['Bering Sea'],
    ansicht: { lat: 58, lng: -178, altitude: 1.4 },
    name: { de: 'Beringmeer', en: 'Bering Sea', fr: 'Mer de Béring', ar: 'بحر بيرينغ' },
    info: {
      de: 'Es liegt zwischen Russland und Alaska (USA). Nördlich davon trennt die Beringstraße Asien von Amerika.',
      en: 'It lies between Russia and Alaska (USA). To the north, the Bering Strait separates Asia from America.',
      fr: 'Elle se situe entre la Russie et l’Alaska (États-Unis). Au nord, le détroit de Béring sépare l’Asie de l’Amérique.',
      ar: 'يقع بين روسيا وألاسكا (الولايات المتحدة). وإلى شماله يفصل مضيق بيرينغ آسيا عن أمريكا.'
    },
    fakt: {
      de: 'Zwischen den zwei Diomedes-Inseln liegen nur etwa 4 km – aber fast ein ganzer Tag Zeitunterschied.',
      en: 'The two Diomede Islands are only about 4 km apart – but almost a whole day apart in time.',
      fr: 'Les deux îles Diomède ne sont séparées que d’environ 4 km – mais de presque une journée entière de décalage horaire.',
      ar: 'لا تفصل بين جزيرتي ديوميد سوى نحو 4 كم، لكن فرق التوقيت بينهما يقارب يومًا كاملًا.'
    }
  },
  {
    id: 'suedchina', typ: 'meer', teile: ['South China Sea', 'Gulf of Thailand', 'Gulf of Tonkin'],
    ansicht: { lat: 12, lng: 113, altitude: 1.4 },
    name: { de: 'Südchinesisches Meer', en: 'South China Sea', fr: 'Mer de Chine méridionale', ar: 'بحر الصين الجنوبي' },
    info: {
      de: 'Es liegt zwischen China, Vietnam, den Philippinen, Malaysia und weiteren Ländern und ist einer der wichtigsten Seewege der Welt.',
      en: 'It lies between China, Vietnam, the Philippines, Malaysia and other countries and is one of the most important sea routes in the world.',
      fr: 'Elle se situe entre la Chine, le Vietnam, les Philippines, la Malaisie et d’autres pays, et c’est l’une des routes maritimes les plus importantes du monde.',
      ar: 'يقع بين الصين وفيتنام والفلبين وماليزيا ودول أخرى، وهو من أهم الطرق البحرية في العالم.'
    },
    fakt: {
      de: 'Etwa ein Drittel des weltweiten Seehandels fährt durch dieses Meer.',
      en: 'About a third of global maritime trade passes through this sea.',
      fr: 'Environ un tiers du commerce maritime mondial traverse cette mer.',
      ar: 'يمر عبر هذا البحر نحو ثلث التجارة البحرية العالمية.'
    }
  },
  {
    id: 'japan', typ: 'meer', teile: ['Sea of Japan'],
    ansicht: { lat: 40, lng: 135, altitude: 1.0 },
    name: { de: 'Japanisches Meer', en: 'Sea of Japan', fr: 'Mer du Japon', ar: 'بحر اليابان' },
    info: {
      de: 'Es liegt zwischen Japan, Korea und Russland. In Korea wird es „Ostmeer“ genannt.',
      en: 'It lies between Japan, Korea and Russia. In Korea it is called the "East Sea".',
      fr: 'Elle se situe entre le Japon, la Corée et la Russie. En Corée, on l’appelle « mer de l’Est ».',
      ar: 'يقع بين اليابان وكوريا وروسيا، ويُسمّى في كوريا «البحر الشرقي».'
    },
    fakt: {
      de: 'Kalte Winde über diesem Meer bringen im Winter riesige Schneemengen an Japans Westküste.',
      en: 'In winter, cold winds over this sea bring huge amounts of snow to Japan’s west coast.',
      fr: 'En hiver, les vents froids au-dessus de cette mer apportent d’énormes quantités de neige sur la côte ouest du Japon.',
      ar: 'في الشتاء تجلب الرياح الباردة فوق هذا البحر كميات هائلة من الثلوج إلى الساحل الغربي لليابان.'
    }
  },
  {
    id: 'bengalen', typ: 'meer', teile: ['Bay of Bengal'],
    ansicht: { lat: 15, lng: 88, altitude: 1.2 },
    name: { de: 'Golf von Bengalen', en: 'Bay of Bengal', fr: 'Golfe du Bengale', ar: 'خليج البنغال' },
    info: {
      de: 'Die größte Bucht der Welt, zwischen Indien, Bangladesch, Myanmar und Sri Lanka.',
      en: 'The largest bay in the world, between India, Bangladesh, Myanmar and Sri Lanka.',
      fr: 'La plus grande baie du monde, entre l’Inde, le Bangladesh, la Birmanie et le Sri Lanka.',
      ar: 'أكبر خليج في العالم، ويقع بين الهند وبنغلاديش وميانمار وسريلانكا.'
    },
    fakt: {
      de: 'Hier münden Ganges und Brahmaputra – zusammen bilden sie das größte Flussdelta der Welt.',
      en: 'The Ganges and Brahmaputra flow into it here – together they form the largest river delta in the world.',
      fr: 'Le Gange et le Brahmapoutre s’y jettent – ensemble, ils forment le plus grand delta fluvial du monde.',
      ar: 'يصب هنا نهرا الغانج وبراهمابوترا، ويشكّلان معًا أكبر دلتا نهرية في العالم.'
    }
  },
  {
    id: 'korallen', typ: 'meer', teile: ['Coral Sea'],
    ansicht: { lat: -17, lng: 155, altitude: 1.4 },
    name: { de: 'Korallenmeer', en: 'Coral Sea', fr: 'Mer de Corail', ar: 'بحر المرجان' },
    info: {
      de: 'Es liegt vor der Nordostküste Australiens.',
      en: 'It lies off the north-east coast of Australia.',
      fr: 'Elle se situe au large de la côte nord-est de l’Australie.',
      ar: 'يقع قبالة الساحل الشمالي الشرقي لأستراليا.'
    },
    fakt: {
      de: 'Hier liegt das Great Barrier Reef – das größte Korallenriff der Welt, sogar vom Weltall aus zu sehen.',
      en: 'This is where the Great Barrier Reef lies – the largest coral reef in the world, visible even from space.',
      fr: 'C’est là que se trouve la Grande Barrière de corail – le plus grand récif corallien du monde, visible même depuis l’espace.',
      ar: 'هنا يقع الحاجز المرجاني العظيم، أكبر شعاب مرجانية في العالم، ويمكن رؤيته حتى من الفضاء.'
    }
  },
  {
    id: 'tasman', typ: 'meer', teile: ['Tasman Sea'],
    ansicht: { lat: -38, lng: 160, altitude: 1.4 },
    name: { de: 'Tasmansee', en: 'Tasman Sea', fr: 'Mer de Tasman', ar: 'بحر تسمان' },
    info: {
      de: 'Es liegt zwischen Australien und Neuseeland.',
      en: 'It lies between Australia and New Zealand.',
      fr: 'Elle se situe entre l’Australie et la Nouvelle-Zélande.',
      ar: 'يقع بين أستراليا ونيوزيلندا.'
    },
    fakt: {
      de: 'Es ist nach dem niederländischen Seefahrer Abel Tasman benannt, der 1642 hierherkam.',
      en: 'It is named after the Dutch explorer Abel Tasman, who came here in 1642.',
      fr: 'Elle doit son nom au navigateur néerlandais Abel Tasman, venu ici en 1642.',
      ar: 'سُمّي على اسم البحّار الهولندي أبل تاسمان الذي وصل إليه عام 1642.'
    }
  },
  {
    id: 'barents', typ: 'meer', teile: ['Barents Sea'],
    ansicht: { lat: 74, lng: 40, altitude: 1.3 },
    name: { de: 'Barentssee', en: 'Barents Sea', fr: 'Mer de Barents', ar: 'بحر بارنتس' },
    info: {
      de: 'Ein Randmeer des Arktischen Ozeans nördlich von Norwegen und Russland.',
      en: 'A marginal sea of the Arctic Ocean north of Norway and Russia.',
      fr: 'Une mer bordière de l’océan Arctique, au nord de la Norvège et de la Russie.',
      ar: 'بحر هامشي للمحيط المتجمد الشمالي، يقع شمال النرويج وروسيا.'
    },
    fakt: {
      de: 'Dank des warmen Golfstroms friert der südliche Teil nie ganz zu.',
      en: 'Thanks to the warm Gulf Stream, the southern part never freezes over completely.',
      fr: 'Grâce au Gulf Stream, chaud, sa partie sud ne gèle jamais complètement.',
      ar: 'بفضل تيار الخليج الدافئ لا يتجمد الجزء الجنوبي منه بالكامل أبدًا.'
    }
  },
  {
    id: 'hudson', typ: 'meer', teile: ['Hudson Bay', 'James Bay'],
    ansicht: { lat: 60, lng: -85, altitude: 1.2 },
    name: { de: 'Hudson Bay', en: 'Hudson Bay', fr: 'Baie d’Hudson', ar: 'خليج هدسون' },
    info: {
      de: 'Eine riesige Bucht im Norden Kanadas, die im Winter zufriert.',
      en: 'A huge bay in northern Canada that freezes over in winter.',
      fr: 'Une immense baie du nord du Canada, qui gèle en hiver.',
      ar: 'خليج ضخم في شمال كندا يتجمد في الشتاء.'
    },
    fakt: {
      de: 'Im Herbst warten Eisbären an der Küste darauf, dass die Bucht zufriert, damit sie auf dem Eis Robben jagen können.',
      en: 'In autumn, polar bears wait on the coast for the bay to freeze so they can hunt seals on the ice.',
      fr: 'En automne, les ours polaires attendent sur la côte que la baie gèle pour chasser les phoques sur la glace.',
      ar: 'في الخريف تنتظر الدببة القطبية على الساحل أن يتجمد الخليج لتصطاد الفقمات على الجليد.'
    }
  }
];
