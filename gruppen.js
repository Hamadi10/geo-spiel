// =====================================================
//  REGIONEN & GRUPPEN – welche Länder gehören wozu?
//  Jede Gruppe hat: id, kategorie, laender (Ländercodes), name, info, fakt (je 4 Sprachen)
//  Stand der Mitgliedschaften: 2026
// =====================================================

const GRUPPEN = [

  // ---------- 🗺️ REGIONEN ----------
  {
    id: 'skandinavien', kategorie: 'region',
    laender: ['DNK', 'NOR', 'SWE'],
    name: { de: 'Skandinavien', en: 'Scandinavia', fr: 'Scandinavie', ar: 'إسكندنافيا' },
    info: {
      de: 'Im engen Sinn gehören nur Dänemark, Norwegen und Schweden zu Skandinavien. Ihre Sprachen sind so ähnlich, dass sich die Menschen oft gegenseitig verstehen.',
      en: 'In the strict sense, only Denmark, Norway and Sweden belong to Scandinavia. Their languages are so similar that people can often understand each other.',
      fr: 'Au sens strict, seuls le Danemark, la Norvège et la Suède font partie de la Scandinavie. Leurs langues sont si proches que les habitants se comprennent souvent.',
      ar: 'بالمعنى الدقيق تضم إسكندنافيا الدنمارك والنرويج والسويد فقط. لغاتها متشابهة جدًا لدرجة أن سكانها يفهمون بعضهم غالبًا.'
    },
    fakt: {
      de: 'Finnland und Island zählen nicht zu Skandinavien, sondern zu den „Nordischen Ländern“.',
      en: 'Finland and Iceland are not part of Scandinavia but of the "Nordic countries".',
      fr: 'La Finlande et l’Islande ne font pas partie de la Scandinavie, mais des « pays nordiques ».',
      ar: 'فنلندا وآيسلندا ليستا جزءًا من إسكندنافيا، بل من «دول الشمال الأوروبي».'
    }
  },
  {
    id: 'nordisch', kategorie: 'region',
    laender: ['DNK', 'NOR', 'SWE', 'FIN', 'ISL'],
    name: { de: 'Nordische Länder', en: 'Nordic countries', fr: 'Pays nordiques', ar: 'دول الشمال الأوروبي' },
    info: {
      de: 'Die fünf Nordischen Länder arbeiten im Nordischen Rat eng zusammen. Dazu gehören auch die autonomen Gebiete Färöer, Grönland und Åland.',
      en: 'The five Nordic countries work closely together in the Nordic Council. The autonomous territories of the Faroe Islands, Greenland and Åland are also part of it.',
      fr: 'Les cinq pays nordiques coopèrent étroitement au sein du Conseil nordique. Les territoires autonomes des îles Féroé, du Groenland et d’Åland en font aussi partie.',
      ar: 'تتعاون دول الشمال الخمس بشكل وثيق في مجلس الشمال. وتنتمي إليها أيضًا مناطق ذات حكم ذاتي هي جزر فارو وغرينلاند وأولاند.'
    },
    fakt: {
      de: 'Finnisch ist mit Schwedisch oder Norwegisch gar nicht verwandt – es ist eher mit Estnisch und Ungarisch verwandt.',
      en: 'Finnish is not related to Swedish or Norwegian at all – it is closer to Estonian and Hungarian.',
      fr: 'Le finnois n’est pas du tout apparenté au suédois ni au norvégien – il est plus proche de l’estonien et du hongrois.',
      ar: 'اللغة الفنلندية لا تمت بصلة إلى السويدية أو النرويجية، بل هي أقرب إلى الإستونية والمجرية.'
    }
  },
  {
    id: 'baltikum', kategorie: 'region',
    laender: ['EST', 'LVA', 'LTU'],
    name: { de: 'Baltikum', en: 'Baltic states', fr: 'Pays baltes', ar: 'دول البلطيق' },
    info: {
      de: 'Estland, Lettland und Litauen liegen an der Ostsee. Seit 1991 sind sie wieder unabhängig, seit 2004 gehören sie zur EU und NATO.',
      en: 'Estonia, Latvia and Lithuania lie on the Baltic Sea. They regained independence in 1991 and joined the EU and NATO in 2004.',
      fr: 'L’Estonie, la Lettonie et la Lituanie bordent la mer Baltique. Indépendants à nouveau depuis 1991, ils ont rejoint l’UE et l’OTAN en 2004.',
      ar: 'تقع إستونيا ولاتفيا وليتوانيا على بحر البلطيق. استعادت استقلالها عام 1991 وانضمت إلى الاتحاد الأوروبي وحلف الناتو عام 2004.'
    },
    fakt: {
      de: '1989 bildeten rund zwei Millionen Menschen eine 600 km lange Menschenkette durch alle drei Länder – den „Baltischen Weg“.',
      en: 'In 1989, around two million people formed a 600 km human chain through all three countries – the "Baltic Way".',
      fr: 'En 1989, environ deux millions de personnes ont formé une chaîne humaine de 600 km à travers les trois pays – la « Voie balte ».',
      ar: 'في عام 1989 شكّل نحو مليوني شخص سلسلة بشرية بطول 600 كم عبر الدول الثلاث، عُرفت باسم «طريق البلطيق».'
    }
  },
  {
    id: 'benelux', kategorie: 'region',
    laender: ['BEL', 'NLD', 'LUX'],
    name: { de: 'Benelux', en: 'Benelux', fr: 'Benelux', ar: 'البنلوكس' },
    info: {
      de: 'Der Name setzt sich aus den Anfängen von Belgien, Nederland (Niederlande) und Luxemburg zusammen. Die drei Länder arbeiten seit 1944 eng zusammen.',
      en: 'The name is made from the beginnings of Belgium, Nederland (Netherlands) and Luxembourg. The three countries have worked closely together since 1944.',
      fr: 'Le nom combine les débuts de Belgique, Nederland (Pays-Bas) et Luxembourg. Les trois pays coopèrent étroitement depuis 1944.',
      ar: 'يتكون الاسم من بدايات أسماء بلجيكا وهولندا (Nederland) ولوكسمبورغ. تتعاون الدول الثلاث بشكل وثيق منذ عام 1944.'
    },
    fakt: {
      de: 'In Brüssel (Belgien) und Luxemburg sitzen wichtige Einrichtungen der Europäischen Union.',
      en: 'Important institutions of the European Union are based in Brussels (Belgium) and Luxembourg.',
      fr: 'D’importantes institutions de l’Union européenne siègent à Bruxelles (Belgique) et à Luxembourg.',
      ar: 'توجد مؤسسات مهمة للاتحاد الأوروبي في بروكسل (بلجيكا) ولوكسمبورغ.'
    }
  },
  {
    id: 'iberien', kategorie: 'region',
    laender: ['ESP', 'PRT', 'AND'],
    name: { de: 'Iberische Halbinsel', en: 'Iberian Peninsula', fr: 'Péninsule Ibérique', ar: 'شبه الجزيرة الإيبيرية' },
    info: {
      de: 'Die Halbinsel im Südwesten Europas teilen sich Spanien, Portugal und der kleine Pyrenäenstaat Andorra. Dazu kommt das britische Gibraltar.',
      en: 'Spain, Portugal and the small Pyrenean state of Andorra share this peninsula in south-western Europe, along with British Gibraltar.',
      fr: 'L’Espagne, le Portugal et le petit État pyrénéen d’Andorre se partagent cette péninsule du sud-ouest de l’Europe, avec Gibraltar, territoire britannique.',
      ar: 'تتقاسم إسبانيا والبرتغال ودولة أندورا الصغيرة في جبال البرانس شبه الجزيرة هذه في جنوب غرب أوروبا، إضافة إلى جبل طارق البريطاني.'
    },
    fakt: {
      de: 'An der Straße von Gibraltar sind Europa und Afrika nur etwa 14 km voneinander entfernt.',
      en: 'At the Strait of Gibraltar, Europe and Africa are only about 14 km apart.',
      fr: 'Au détroit de Gibraltar, l’Europe et l’Afrique ne sont séparées que d’environ 14 km.',
      ar: 'عند مضيق جبل طارق لا تفصل بين أوروبا وأفريقيا سوى نحو 14 كم.'
    }
  },
  {
    id: 'westbalkan', kategorie: 'region',
    laender: ['ALB', 'BIH', 'KOS', 'MNE', 'MKD', 'SRB'],
    name: { de: 'Westbalkan', en: 'Western Balkans', fr: 'Balkans occidentaux', ar: 'غرب البلقان' },
    info: {
      de: 'So nennt man die Länder im Südosten Europas, die noch nicht in der EU sind. Bis auf Albanien gehörten alle früher zu Jugoslawien.',
      en: 'This is the name for the countries in south-eastern Europe that are not yet in the EU. Except for Albania, all were once part of Yugoslavia.',
      fr: 'On désigne ainsi les pays du sud-est de l’Europe qui ne sont pas encore dans l’UE. Sauf l’Albanie, tous faisaient partie de la Yougoslavie.',
      ar: 'هو اسم دول جنوب شرق أوروبا التي لم تنضم بعد إلى الاتحاد الأوروبي. كانت جميعها، باستثناء ألبانيا، جزءًا من يوغوسلافيا سابقًا.'
    },
    fakt: {
      de: 'Der Name „Balkan“ stammt vom gleichnamigen Gebirge in Bulgarien.',
      en: 'The name "Balkans" comes from the mountain range of the same name in Bulgaria.',
      fr: 'Le nom « Balkans » vient de la chaîne de montagnes du même nom en Bulgarie.',
      ar: 'يأتي اسم «البلقان» من سلسلة جبال تحمل الاسم نفسه في بلغاريا.'
    }
  },
  {
    id: 'kaukasus', kategorie: 'region',
    laender: ['GEO', 'ARM', 'AZE'],
    name: { de: 'Südkaukasus', en: 'South Caucasus', fr: 'Caucase du Sud', ar: 'جنوب القوقاز' },
    info: {
      de: 'Georgien, Armenien und Aserbaidschan liegen zwischen dem Schwarzen und dem Kaspischen Meer, an der Grenze zwischen Europa und Asien.',
      en: 'Georgia, Armenia and Azerbaijan lie between the Black Sea and the Caspian Sea, on the border between Europe and Asia.',
      fr: 'La Géorgie, l’Arménie et l’Azerbaïdjan se situent entre la mer Noire et la mer Caspienne, à la frontière entre l’Europe et l’Asie.',
      ar: 'تقع جورجيا وأرمينيا وأذربيجان بين البحر الأسود وبحر قزوين، على الحدود بين أوروبا وآسيا.'
    },
    fakt: {
      de: 'Georgien und Armenien gehören zu den ersten Ländern der Welt, die das Christentum zur Staatsreligion machten.',
      en: 'Georgia and Armenia were among the first countries in the world to make Christianity the state religion.',
      fr: 'La Géorgie et l’Arménie ont été parmi les premiers pays au monde à faire du christianisme la religion d’État.',
      ar: 'كانت جورجيا وأرمينيا من أوائل دول العالم التي جعلت المسيحية دينًا رسميًا للدولة.'
    }
  },
  {
    id: 'zentralasien', kategorie: 'region',
    laender: ['KAZ', 'KGZ', 'TJK', 'TKM', 'UZB'],
    name: { de: 'Zentralasien', en: 'Central Asia', fr: 'Asie centrale', ar: 'آسيا الوسطى' },
    info: {
      de: 'Die fünf „-stan“-Länder waren bis 1991 Teil der Sowjetunion. Durch sie verlief früher die berühmte Seidenstraße.',
      en: 'The five "-stan" countries were part of the Soviet Union until 1991. The famous Silk Road once ran through them.',
      fr: 'Les cinq pays en « -stan » faisaient partie de l’Union soviétique jusqu’en 1991. La célèbre route de la soie les traversait autrefois.',
      ar: 'كانت الدول الخمس التي تنتهي أسماؤها بـ«ستان» جزءًا من الاتحاد السوفيتي حتى عام 1991. وكان طريق الحرير الشهير يمر عبرها قديمًا.'
    },
    fakt: {
      de: 'Usbekistan ist eines von nur zwei Ländern der Welt, die „doppelt“ vom Meer abgeschnitten sind: Auch alle Nachbarn haben keinen Zugang zum Meer.',
      en: 'Uzbekistan is one of only two "doubly landlocked" countries in the world: all of its neighbours are landlocked too.',
      fr: 'L’Ouzbékistan est l’un des deux seuls pays au monde « doublement enclavés » : tous ses voisins sont aussi sans accès à la mer.',
      ar: 'أوزبكستان واحدة من دولتين فقط في العالم محاطتين باليابسة «مرتين»: فجميع جيرانها أيضًا بلا منفذ على البحر.'
    }
  },
  {
    id: 'golfstaaten', kategorie: 'region',
    laender: ['SAU', 'ARE', 'QAT', 'KWT', 'BHR', 'OMN'],
    name: { de: 'Golfstaaten', en: 'Gulf states', fr: 'États du Golfe', ar: 'دول الخليج' },
    info: {
      de: 'Die sechs Länder am Persischen Golf bilden zusammen den Golf-Kooperationsrat. Sie sind durch Erdöl und Erdgas sehr reich geworden.',
      en: 'The six countries on the Persian Gulf together form the Gulf Cooperation Council. They have become very rich through oil and gas.',
      fr: 'Les six pays du golfe Persique forment ensemble le Conseil de coopération du Golfe. Le pétrole et le gaz les ont rendus très riches.',
      ar: 'تشكّل الدول الست المطلة على الخليج معًا مجلس التعاون لدول الخليج العربية. وقد أصبحت غنية جدًا بفضل النفط والغاز.'
    },
    fakt: {
      de: 'In Dubai (Vereinigte Arabische Emirate) steht mit dem Burj Khalifa das höchste Gebäude der Welt (828 m).',
      en: 'Dubai (United Arab Emirates) is home to the Burj Khalifa, the tallest building in the world (828 m).',
      fr: 'À Dubaï (Émirats arabes unis) se trouve le Burj Khalifa, le plus haut bâtiment du monde (828 m).',
      ar: 'في دبي (الإمارات العربية المتحدة) يقع برج خليفة، أطول مبنى في العالم (828 م).'
    }
  },
  {
    id: 'levante', kategorie: 'region',
    laender: ['SYR', 'LBN', 'JOR', 'ISR', 'PSX'],
    name: { de: 'Levante', en: 'Levant', fr: 'Levant', ar: 'بلاد الشام' },
    info: {
      de: 'So heißt das Gebiet am östlichen Mittelmeer. Hier liegen einige der ältesten Städte der Welt.',
      en: 'This is the name of the region on the eastern Mediterranean. Some of the oldest cities in the world are located here.',
      fr: 'C’est le nom de la région située à l’est de la Méditerranée. On y trouve certaines des plus anciennes villes du monde.',
      ar: 'هو اسم المنطقة الواقعة على الساحل الشرقي للبحر المتوسط، وفيها بعض أقدم مدن العالم.'
    },
    fakt: {
      de: 'Damaskus und Byblos zählen zu den ältesten ununterbrochen bewohnten Städten der Welt.',
      en: 'Damascus and Byblos are among the oldest continuously inhabited cities in the world.',
      fr: 'Damas et Byblos comptent parmi les plus anciennes villes habitées sans interruption au monde.',
      ar: 'تُعد دمشق وجبيل من أقدم المدن المأهولة باستمرار في العالم.'
    }
  },
  {
    id: 'maghreb', kategorie: 'region',
    laender: ['MAR', 'DZA', 'TUN', 'LBY', 'MRT'],
    name: { de: 'Maghreb', en: 'Maghreb', fr: 'Maghreb', ar: 'المغرب العربي' },
    info: {
      de: '„Maghreb“ ist Arabisch und bedeutet „Westen“ – gemeint sind die arabischen Länder im Nordwesten Afrikas. Neben Arabisch werden dort auch Berbersprachen (Amazigh) gesprochen.',
      en: '"Maghreb" is Arabic for "west" – it refers to the Arab countries in north-west Africa. Besides Arabic, Berber languages (Amazigh) are spoken there.',
      fr: '« Maghreb » signifie « ouest » en arabe – ce sont les pays arabes du nord-ouest de l’Afrique. On y parle aussi des langues berbères (amazighes).',
      ar: 'تعني كلمة «المغرب» جهة الغرب، وتشير إلى الدول العربية في شمال غرب أفريقيا. وإلى جانب العربية تُتحدث هناك اللغات الأمازيغية.'
    },
    fakt: {
      de: 'Algerien ist das flächenmäßig größte Land Afrikas.',
      en: 'Algeria is the largest country in Africa by area.',
      fr: 'L’Algérie est le plus grand pays d’Afrique par sa superficie.',
      ar: 'الجزائر هي أكبر دولة في أفريقيا من حيث المساحة.'
    }
  },
  {
    id: 'horn', kategorie: 'region',
    laender: ['SOM', 'ETH', 'ERI', 'DJI'],
    name: { de: 'Horn von Afrika', en: 'Horn of Africa', fr: 'Corne de l’Afrique', ar: 'القرن الأفريقي' },
    info: {
      de: 'Die Halbinsel im Osten Afrikas sieht auf der Karte aus wie ein Horn. Sie liegt gegenüber der Arabischen Halbinsel.',
      en: 'This peninsula in East Africa looks like a horn on the map. It lies opposite the Arabian Peninsula.',
      fr: 'Cette péninsule de l’est de l’Afrique ressemble à une corne sur la carte. Elle fait face à la péninsule Arabique.',
      ar: 'تبدو شبه الجزيرة هذه في شرق أفريقيا على الخريطة مثل القرن، وتقع مقابل شبه الجزيرة العربية.'
    },
    fakt: {
      de: 'Äthiopien hat einen eigenen Kalender – dort ist das Jahr etwa 7 bis 8 Jahre „hinter“ unserem.',
      en: 'Ethiopia has its own calendar – its year is about 7 to 8 years "behind" ours.',
      fr: 'L’Éthiopie a son propre calendrier – l’année y a environ 7 à 8 ans de « retard » sur la nôtre.',
      ar: 'لإثيوبيا تقويم خاص بها، إذ تتأخر السنة فيه نحو 7 إلى 8 سنوات عن التقويم الميلادي.'
    }
  },
  {
    id: 'suedasien', kategorie: 'region',
    laender: ['AFG', 'BGD', 'BTN', 'IND', 'MDV', 'NPL', 'PAK', 'LKA'],
    name: { de: 'Südasien', en: 'South Asia', fr: 'Asie du Sud', ar: 'جنوب آسيا' },
    info: {
      de: 'Zu Südasien zählen die acht Länder der Südasiatischen Vereinigung (SAARC). Hier lebt rund ein Viertel der Weltbevölkerung.',
      en: 'South Asia includes the eight countries of the South Asian Association (SAARC). About a quarter of the world’s population lives here.',
      fr: 'L’Asie du Sud comprend les huit pays de l’Association sud-asiatique (ASACR). Environ un quart de la population mondiale y vit.',
      ar: 'يضم جنوب آسيا الدول الثماني الأعضاء في رابطة جنوب آسيا للتعاون الإقليمي (سارك). ويعيش فيه نحو ربع سكان العالم.'
    },
    fakt: {
      de: 'Der Mount Everest, der höchste Berg der Welt (8.849 m), liegt an der Grenze zwischen Nepal und China.',
      en: 'Mount Everest, the highest mountain in the world (8,849 m), lies on the border between Nepal and China.',
      fr: 'L’Everest, la plus haute montagne du monde (8 849 m), se trouve à la frontière entre le Népal et la Chine.',
      ar: 'يقع جبل إيفرست، أعلى جبل في العالم (8849 م)، على الحدود بين نيبال والصين.'
    }
  },
  {
    id: 'mittelamerika', kategorie: 'region',
    laender: ['GTM', 'BLZ', 'SLV', 'HND', 'NIC', 'CRI', 'PAN'],
    name: { de: 'Mittelamerika', en: 'Central America', fr: 'Amérique centrale', ar: 'أمريكا الوسطى' },
    info: {
      de: 'Die schmale Landbrücke verbindet Nord- und Südamerika. In fast allen Ländern wird Spanisch gesprochen – nur in Belize ist Englisch Amtssprache.',
      en: 'This narrow land bridge connects North and South America. Spanish is spoken in almost every country – only Belize has English as its official language.',
      fr: 'Cet étroit pont terrestre relie l’Amérique du Nord et l’Amérique du Sud. On y parle espagnol presque partout – seul le Belize a l’anglais comme langue officielle.',
      ar: 'يربط هذا الجسر البري الضيق بين أمريكا الشمالية والجنوبية. تُتحدث الإسبانية في كل دوله تقريبًا، وبليز وحدها لغتها الرسمية الإنجليزية.'
    },
    fakt: {
      de: 'Durch den Panamakanal können Schiffe vom Atlantik in den Pazifik fahren, ohne um Südamerika herum zu müssen.',
      en: 'The Panama Canal lets ships travel from the Atlantic to the Pacific without sailing around South America.',
      fr: 'Le canal de Panama permet aux navires de passer de l’Atlantique au Pacifique sans contourner l’Amérique du Sud.',
      ar: 'تستطيع السفن عبر قناة بنما الانتقال من المحيط الأطلسي إلى المحيط الهادئ دون الالتفاف حول أمريكا الجنوبية.'
    }
  },
  {
    id: 'karibik', kategorie: 'region',
    laender: ['CUB', 'JAM', 'HTI', 'DOM', 'BHS', 'TTO', 'BRB', 'GRD', 'LCA', 'VCT', 'KNA', 'DMA', 'ATG'],
    name: { de: 'Karibik (Inselstaaten)', en: 'Caribbean (island states)', fr: 'Caraïbes (États insulaires)', ar: 'الكاريبي (الدول الجزرية)' },
    info: {
      de: 'Das sind die 13 unabhängigen Inselstaaten der Karibik. Dazu kommen viele Inseln, die zu anderen Ländern gehören, z. B. zu Frankreich, den Niederlanden oder den USA.',
      en: 'These are the 13 independent island states of the Caribbean. There are also many islands that belong to other countries, such as France, the Netherlands or the USA.',
      fr: 'Ce sont les 13 États insulaires indépendants des Caraïbes. S’y ajoutent de nombreuses îles appartenant à d’autres pays, comme la France, les Pays-Bas ou les États-Unis.',
      ar: 'هي الدول الجزرية المستقلة الثلاث عشرة في الكاريبي. وهناك أيضًا جزر كثيرة تابعة لدول أخرى مثل فرنسا وهولندا والولايات المتحدة.'
    },
    fakt: {
      de: 'Haiti wurde 1804 als erstes Land Lateinamerikas unabhängig.',
      en: 'In 1804, Haiti became the first country in Latin America to gain independence.',
      fr: 'En 1804, Haïti est devenu le premier pays d’Amérique latine à obtenir son indépendance.',
      ar: 'في عام 1804 أصبحت هايتي أول دولة في أمريكا اللاتينية تنال استقلالها.'
    }
  },
  {
    id: 'anden', kategorie: 'region',
    laender: ['VEN', 'COL', 'ECU', 'PER', 'BOL', 'CHL', 'ARG'],
    name: { de: 'Andenstaaten', en: 'Andean countries', fr: 'Pays andins', ar: 'دول الأنديز' },
    info: {
      de: 'Durch diese sieben Länder ziehen sich die Anden – mit rund 7.000 km das längste Gebirge der Welt.',
      en: 'The Andes – at around 7,000 km the longest mountain range in the world – run through these seven countries.',
      fr: 'Les Andes – environ 7 000 km, la plus longue chaîne de montagnes du monde – traversent ces sept pays.',
      ar: 'تمتد جبال الأنديز، وهي أطول سلسلة جبلية في العالم بطول نحو 7000 كم، عبر هذه الدول السبع.'
    },
    fakt: {
      de: 'La Paz in Bolivien ist der höchstgelegene Regierungssitz der Welt (rund 3.600 m).',
      en: 'La Paz in Bolivia is the highest seat of government in the world (about 3,600 m).',
      fr: 'La Paz, en Bolivie, est le siège de gouvernement le plus haut du monde (environ 3 600 m).',
      ar: 'لاباز في بوليفيا هي أعلى مقر حكومي في العالم (نحو 3600 م).'
    }
  },
  {
    id: 'conosur', kategorie: 'region',
    laender: ['ARG', 'CHL', 'URY', 'PRY'],
    name: { de: 'Südkegel (Cono Sur)', en: 'Southern Cone', fr: 'Cône Sud', ar: 'المخروط الجنوبي' },
    info: {
      de: 'Der südlichste Teil Südamerikas hat die Form eines Kegels. Hier liegt Kap Hoorn, die Südspitze des Kontinents.',
      en: 'The southernmost part of South America is shaped like a cone. Cape Horn, the southern tip of the continent, is located here.',
      fr: 'La partie la plus méridionale de l’Amérique du Sud a la forme d’un cône. On y trouve le cap Horn, la pointe sud du continent.',
      ar: 'يشبه الجزء الأقصى جنوبًا من أمريكا الجنوبية المخروط، وفيه يقع رأس هورن، الطرف الجنوبي للقارة.'
    },
    fakt: {
      de: 'Uruguay gewann 1930 die allererste Fußball-Weltmeisterschaft.',
      en: 'Uruguay won the very first FIFA World Cup in 1930.',
      fr: 'L’Uruguay a remporté la toute première Coupe du monde de football en 1930.',
      ar: 'فازت الأوروغواي بأول بطولة لكأس العالم لكرة القدم عام 1930.'
    }
  },

  // ---------- 🤝 BÜNDNISSE & ORGANISATIONEN ----------
  {
    id: 'eu', kategorie: 'buendnis',
    laender: ['AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'IRL',
              'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'],
    name: { de: 'Europäische Union (EU)', en: 'European Union (EU)', fr: 'Union européenne (UE)', ar: 'الاتحاد الأوروبي' },
    info: {
      de: '27 Länder arbeiten in der EU politisch und wirtschaftlich eng zusammen. Die meisten davon bezahlen mit dem Euro.',
      en: '27 countries work closely together politically and economically in the EU. Most of them pay with the euro.',
      fr: '27 pays coopèrent étroitement sur le plan politique et économique au sein de l’UE. La plupart paient en euros.',
      ar: 'تتعاون 27 دولة بشكل وثيق سياسيًا واقتصاديًا في الاتحاد الأوروبي، ويستخدم معظمها عملة اليورو.'
    },
    fakt: {
      de: 'Die EU hat 24 Amtssprachen – alle wichtigen Dokumente werden in jede davon übersetzt.',
      en: 'The EU has 24 official languages – all important documents are translated into each of them.',
      fr: 'L’UE compte 24 langues officielles – tous les documents importants sont traduits dans chacune d’elles.',
      ar: 'للاتحاد الأوروبي 24 لغة رسمية، وتُترجم جميع الوثائق المهمة إلى كل واحدة منها.'
    }
  },
  {
    id: 'nato', kategorie: 'buendnis',
    laender: ['ALB', 'BEL', 'BGR', 'CAN', 'HRV', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'ISL',
              'ITA', 'LVA', 'LTU', 'LUX', 'MNE', 'NLD', 'MKD', 'NOR', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP',
              'SWE', 'TUR', 'GBR', 'USA'],
    name: { de: 'NATO', en: 'NATO', fr: 'OTAN', ar: 'حلف شمال الأطلسي (الناتو)' },
    info: {
      de: 'Die NATO ist ein Verteidigungsbündnis von 32 Ländern in Europa und Nordamerika, gegründet 1949. Ein Angriff auf ein Mitglied gilt als Angriff auf alle.',
      en: 'NATO is a defence alliance of 32 countries in Europe and North America, founded in 1949. An attack on one member is considered an attack on all.',
      fr: 'L’OTAN est une alliance de défense de 32 pays d’Europe et d’Amérique du Nord, fondée en 1949. Une attaque contre un membre est considérée comme une attaque contre tous.',
      ar: 'الناتو تحالف دفاعي يضم 32 دولة في أوروبا وأمريكا الشمالية، تأسس عام 1949. ويُعدّ الهجوم على أي عضو هجومًا على الجميع.'
    },
    fakt: {
      de: 'Die neuesten Mitglieder sind Finnland (2023) und Schweden (2024).',
      en: 'The newest members are Finland (2023) and Sweden (2024).',
      fr: 'Les membres les plus récents sont la Finlande (2023) et la Suède (2024).',
      ar: 'أحدث الأعضاء هما فنلندا (2023) والسويد (2024).'
    }
  },
  {
    id: 'g7', kategorie: 'buendnis',
    laender: ['CAN', 'FRA', 'DEU', 'ITA', 'JPN', 'GBR', 'USA'],
    name: { de: 'G7', en: 'G7', fr: 'G7', ar: 'مجموعة السبع' },
    info: {
      de: 'Die „Gruppe der Sieben“ sind sieben große Industrieländer, deren Regierungschefs sich jedes Jahr treffen. Die EU nimmt ebenfalls teil.',
      en: 'The "Group of Seven" are seven major industrialised countries whose leaders meet every year. The EU also takes part.',
      fr: 'Le « Groupe des sept » réunit sept grands pays industrialisés dont les dirigeants se rencontrent chaque année. L’UE y participe aussi.',
      ar: 'تضم «مجموعة السبع» سبع دول صناعية كبرى يجتمع قادتها كل عام، ويشارك الاتحاد الأوروبي أيضًا.'
    },
    fakt: {
      de: 'Russland gehörte von 1998 bis 2014 dazu – damals hieß die Gruppe G8.',
      en: 'Russia was a member from 1998 to 2014 – back then the group was called the G8.',
      fr: 'La Russie en a fait partie de 1998 à 2014 – le groupe s’appelait alors le G8.',
      ar: 'كانت روسيا عضوًا من 1998 إلى 2014، وكانت المجموعة تُسمى آنذاك مجموعة الثماني.'
    }
  },
  {
    id: 'g20', kategorie: 'buendnis',
    laender: ['ARG', 'AUS', 'BRA', 'CAN', 'CHN', 'FRA', 'DEU', 'IND', 'IDN', 'ITA', 'JPN', 'KOR', 'MEX', 'RUS',
              'SAU', 'ZAF', 'TUR', 'GBR', 'USA'],
    name: { de: 'G20', en: 'G20', fr: 'G20', ar: 'مجموعة العشرين' },
    info: {
      de: 'In der G20 treffen sich 19 große Volkswirtschaften sowie die EU und die Afrikanische Union. Zusammen erwirtschaften sie den Großteil der Weltwirtschaft.',
      en: 'The G20 brings together 19 major economies plus the EU and the African Union. Together they account for most of the world economy.',
      fr: 'Le G20 réunit 19 grandes économies ainsi que l’UE et l’Union africaine. Ensemble, elles représentent l’essentiel de l’économie mondiale.',
      ar: 'تجمع مجموعة العشرين 19 اقتصادًا كبيرًا إضافة إلى الاتحاد الأوروبي والاتحاد الأفريقي، وتنتج معًا معظم الاقتصاد العالمي.'
    },
    fakt: {
      de: 'In den G20-Ländern lebt rund zwei Drittel der Weltbevölkerung.',
      en: 'About two thirds of the world’s population live in the G20 countries.',
      fr: 'Environ deux tiers de la population mondiale vivent dans les pays du G20.',
      ar: 'يعيش نحو ثلثي سكان العالم في دول مجموعة العشرين.'
    }
  },
  {
    id: 'arabliga', kategorie: 'buendnis',
    laender: ['DZA', 'BHR', 'COM', 'DJI', 'EGY', 'IRQ', 'JOR', 'KWT', 'LBN', 'LBY', 'MRT', 'MAR', 'OMN', 'PSX',
              'QAT', 'SAU', 'SOM', 'SDN', 'SYR', 'TUN', 'ARE', 'YEM'],
    name: { de: 'Arabische Liga', en: 'Arab League', fr: 'Ligue arabe', ar: 'جامعة الدول العربية' },
    info: {
      de: 'Die 22 Mitglieder der Arabischen Liga reichen von Marokko im Westen bis Oman im Osten. Gegründet wurde sie 1945, ihr Sitz ist in Kairo.',
      en: 'The 22 members of the Arab League stretch from Morocco in the west to Oman in the east. It was founded in 1945 and is based in Cairo.',
      fr: 'Les 22 membres de la Ligue arabe s’étendent du Maroc à l’ouest jusqu’à Oman à l’est. Fondée en 1945, elle a son siège au Caire.',
      ar: 'تمتد الدول الأعضاء الـ22 في جامعة الدول العربية من المغرب غربًا إلى عُمان شرقًا. تأسست عام 1945 ومقرها القاهرة.'
    },
    fakt: {
      de: 'Die Komoren im Indischen Ozean sind das südlichste Mitglied der Liga.',
      en: 'The Comoros in the Indian Ocean are the southernmost member of the League.',
      fr: 'Les Comores, dans l’océan Indien, sont le membre le plus au sud de la Ligue.',
      ar: 'جزر القمر في المحيط الهندي هي العضو الواقع في أقصى جنوب الجامعة.'
    }
  },
  {
    id: 'asean', kategorie: 'buendnis',
    laender: ['BRN', 'KHM', 'IDN', 'LAO', 'MYS', 'MMR', 'PHL', 'SGP', 'THA', 'VNM', 'TLS'],
    name: { de: 'ASEAN', en: 'ASEAN', fr: 'ASEAN', ar: 'آسيان' },
    info: {
      de: 'Der Verband Südostasiatischer Nationen hat 11 Mitglieder. Als neuestes Mitglied kam im Oktober 2025 Osttimor (Timor-Leste) dazu.',
      en: 'The Association of Southeast Asian Nations has 11 members. Timor-Leste (East Timor) joined as the newest member in October 2025.',
      fr: 'L’Association des nations de l’Asie du Sud-Est compte 11 membres. Le Timor oriental l’a rejointe en octobre 2025, devenant le membre le plus récent.',
      ar: 'تضم رابطة دول جنوب شرق آسيا 11 عضوًا، وأحدثها تيمور الشرقية التي انضمت في أكتوبر 2025.'
    },
    fakt: {
      de: 'Indonesien ist das größte Inselreich der Welt – es besteht aus über 17.000 Inseln.',
      en: 'Indonesia is the largest archipelago country in the world, with over 17,000 islands.',
      fr: 'L’Indonésie est le plus grand pays archipel du monde, avec plus de 17 000 îles.',
      ar: 'إندونيسيا أكبر دولة أرخبيلية في العالم، إذ تتكون من أكثر من 17 ألف جزيرة.'
    }
  },

  // ---------- 🗣️ SPRACHRÄUME ----------
  {
    id: 'arabisch', kategorie: 'sprache',
    laender: ['DZA', 'BHR', 'COM', 'DJI', 'EGY', 'IRQ', 'JOR', 'KWT', 'LBN', 'LBY', 'MRT', 'MAR', 'OMN', 'PSX',
              'QAT', 'SAU', 'SOM', 'SDN', 'SYR', 'TUN', 'ARE', 'YEM', 'TCD'],
    name: { de: 'Arabischsprachige Länder', en: 'Arabic-speaking countries', fr: 'Pays arabophones', ar: 'الدول الناطقة بالعربية' },
    info: {
      de: 'In 23 Ländern ist Arabisch Amtssprache – alle Mitglieder der Arabischen Liga und dazu der Tschad.',
      en: 'Arabic is an official language in 23 countries – all members of the Arab League plus Chad.',
      fr: 'L’arabe est langue officielle dans 23 pays – tous les membres de la Ligue arabe, plus le Tchad.',
      ar: 'العربية لغة رسمية في 23 دولة: جميع أعضاء جامعة الدول العربية إضافة إلى تشاد.'
    },
    fakt: {
      de: 'Arabisch wird von rechts nach links geschrieben und ist eine der sechs Amtssprachen der Vereinten Nationen.',
      en: 'Arabic is written from right to left and is one of the six official languages of the United Nations.',
      fr: 'L’arabe s’écrit de droite à gauche et fait partie des six langues officielles des Nations unies.',
      ar: 'تُكتب العربية من اليمين إلى اليسار، وهي إحدى اللغات الرسمية الست للأمم المتحدة.'
    }
  },
  {
    id: 'deutsch', kategorie: 'sprache',
    laender: ['DEU', 'AUT', 'CHE', 'LIE', 'LUX', 'BEL'],
    name: { de: 'Deutschsprachige Länder', en: 'German-speaking countries', fr: 'Pays germanophones', ar: 'الدول الناطقة بالألمانية' },
    info: {
      de: 'In diesen Ländern ist Deutsch Amtssprache. In Belgien gilt das nur für eine kleine Region im Osten, in der Schweiz und in Luxemburg neben anderen Sprachen.',
      en: 'German is an official language in these countries. In Belgium this applies only to a small region in the east; in Switzerland and Luxembourg it is one of several official languages.',
      fr: 'L’allemand est langue officielle dans ces pays. En Belgique, seulement dans une petite région de l’est ; en Suisse et au Luxembourg, à côté d’autres langues.',
      ar: 'الألمانية لغة رسمية في هذه الدول. في بلجيكا يقتصر ذلك على منطقة صغيرة في الشرق، وفي سويسرا ولوكسمبورغ هي واحدة من عدة لغات رسمية.'
    },
    fakt: {
      de: 'Deutsch ist die Muttersprache mit den meisten Sprechern in der Europäischen Union.',
      en: 'German is the most widely spoken mother tongue in the European Union.',
      fr: 'L’allemand est la langue maternelle la plus parlée de l’Union européenne.',
      ar: 'الألمانية هي اللغة الأم الأكثر انتشارًا في الاتحاد الأوروبي.'
    }
  },
  {
    id: 'franzoesisch', kategorie: 'sprache',
    laender: ['FRA', 'BEL', 'CHE', 'LUX', 'MCO', 'CAN', 'HTI', 'SEN', 'MLI', 'BFA', 'NER', 'CIV', 'GIN', 'BEN',
              'TGO', 'CMR', 'TCD', 'CAF', 'COG', 'COD', 'GAB', 'GNQ', 'DJI', 'COM', 'MDG', 'RWA', 'BDI', 'SYC', 'VUT'],
    name: { de: 'Französischsprachige Länder', en: 'French-speaking countries', fr: 'Pays francophones', ar: 'الدول الناطقة بالفرنسية' },
    info: {
      de: 'In diesen Ländern ist Französisch Amts- oder Arbeitssprache – vor allem in Europa und in West- und Zentralafrika.',
      en: 'French is an official or working language in these countries – mainly in Europe and in West and Central Africa.',
      fr: 'Dans ces pays, le français est langue officielle ou de travail – surtout en Europe et en Afrique de l’Ouest et centrale.',
      ar: 'الفرنسية لغة رسمية أو لغة عمل في هذه الدول، ومعظمها في أوروبا وغرب ووسط أفريقيا.'
    },
    fakt: {
      de: 'Kinshasa (DR Kongo) ist heute die größte französischsprachige Stadt der Welt – größer als Paris.',
      en: 'Kinshasa (DR Congo) is now the largest French-speaking city in the world – bigger than Paris.',
      fr: 'Kinshasa (RD Congo) est aujourd’hui la plus grande ville francophone du monde – plus grande que Paris.',
      ar: 'كينشاسا (الكونغو الديمقراطية) هي اليوم أكبر مدينة ناطقة بالفرنسية في العالم، وهي أكبر من باريس.'
    }
  },
  {
    id: 'spanisch', kategorie: 'sprache',
    laender: ['ESP', 'MEX', 'GTM', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'DOM', 'COL', 'VEN', 'ECU', 'PER',
              'BOL', 'CHL', 'ARG', 'URY', 'PRY', 'GNQ'],
    name: { de: 'Spanischsprachige Länder', en: 'Spanish-speaking countries', fr: 'Pays hispanophones', ar: 'الدول الناطقة بالإسبانية' },
    info: {
      de: 'In 20 Ländern ist Spanisch Amtssprache – fast ganz Lateinamerika, Spanien und Äquatorialguinea in Afrika.',
      en: 'Spanish is an official language in 20 countries – almost all of Latin America, Spain and Equatorial Guinea in Africa.',
      fr: 'L’espagnol est langue officielle dans 20 pays – presque toute l’Amérique latine, l’Espagne et la Guinée équatoriale en Afrique.',
      ar: 'الإسبانية لغة رسمية في 20 دولة: معظم أمريكا اللاتينية وإسبانيا وغينيا الاستوائية في أفريقيا.'
    },
    fakt: {
      de: 'Mexiko hat mehr spanischsprachige Einwohner als jedes andere Land – sogar mehr als Spanien.',
      en: 'Mexico has more Spanish speakers than any other country – even more than Spain.',
      fr: 'Le Mexique compte plus d’hispanophones que tout autre pays – même plus que l’Espagne.',
      ar: 'في المكسيك ناطقون بالإسبانية أكثر من أي دولة أخرى، حتى أكثر من إسبانيا.'
    }
  },
  {
    id: 'portugiesisch', kategorie: 'sprache',
    laender: ['PRT', 'BRA', 'AGO', 'MOZ', 'GNB', 'CPV', 'STP', 'TLS', 'GNQ'],
    name: { de: 'Portugiesischsprachige Länder', en: 'Portuguese-speaking countries', fr: 'Pays lusophones', ar: 'الدول الناطقة بالبرتغالية' },
    info: {
      de: 'Diese 9 Länder bilden die Gemeinschaft der Portugiesischsprachigen Länder (CPLP). Fast alle waren früher portugiesische Kolonien.',
      en: 'These 9 countries form the Community of Portuguese Language Countries (CPLP). Almost all of them were once Portuguese colonies.',
      fr: 'Ces 9 pays forment la Communauté des pays de langue portugaise (CPLP). Presque tous étaient autrefois des colonies portugaises.',
      ar: 'تشكّل هذه الدول التسع مجموعة البلدان الناطقة بالبرتغالية. وكانت جميعها تقريبًا مستعمرات برتغالية سابقًا.'
    },
    fakt: {
      de: 'In Brasilien leben rund 20-mal so viele Menschen wie in Portugal.',
      en: 'Brazil has around 20 times as many inhabitants as Portugal.',
      fr: 'Le Brésil compte environ 20 fois plus d’habitants que le Portugal.',
      ar: 'يبلغ عدد سكان البرازيل نحو 20 ضعف عدد سكان البرتغال.'
    }
  },

  // ---------- ⭐ BESONDERE GRUPPEN ----------
  {
    id: 'binnen', kategorie: 'besonders',
    laender: ['AFG', 'AND', 'ARM', 'AUT', 'AZE', 'BDI', 'BFA', 'BLR', 'BOL', 'BTN', 'BWA', 'CAF', 'CHE', 'CZE', 'ETH', 'HUN', 'KAZ', 'KGZ', 'KOS', 'LAO', 'LIE', 'LSO', 'LUX', 'MDA', 'MKD', 'MLI', 'MNG', 'MWI', 'NER', 'NPL', 'PRY', 'RWA', 'SDS', 'SMR', 'SRB', 'SVK', 'SWZ', 'TCD', 'TJK', 'TKM', 'UGA', 'UZB', 'VAT', 'ZMB', 'ZWE'],
    name: { de: 'Binnenstaaten (ohne Meer)', en: 'Landlocked countries', fr: 'Pays enclavés', ar: 'الدول الحبيسة' },
    info: {
      de: 'Diese Länder haben keinen Zugang zum Meer. Für den Handel sind sie oft auf ihre Nachbarländer angewiesen.',
      en: 'These countries have no access to the sea. For trade they often depend on their neighbours.',
      fr: 'Ces pays n’ont pas d’accès à la mer. Pour le commerce, ils dépendent souvent de leurs voisins.',
      ar: 'لا تملك هذه الدول منفذًا على البحر، وغالبًا ما تعتمد على جيرانها في التجارة.'
    },
    fakt: {
      de: 'Kasachstan ist der größte Binnenstaat der Welt.',
      en: 'Kazakhstan is the largest landlocked country in the world.',
      fr: 'Le Kazakhstan est le plus grand pays enclavé du monde.',
      ar: 'كازاخستان هي أكبر دولة حبيسة في العالم.'
    }
  },
  {
    id: 'aequator', kategorie: 'besonders',
    laender: ['ECU', 'COL', 'BRA', 'STP', 'GAB', 'COG', 'COD', 'UGA', 'KEN', 'SOM', 'MDV', 'IDN', 'KIR'],
    name: { de: 'Länder am Äquator', en: 'Countries on the equator', fr: 'Pays de l’équateur', ar: 'دول خط الاستواء' },
    info: {
      de: 'Durch diese 13 Länder (oder ihre Gewässer) verläuft der Äquator – die Linie, die die Erde in Nord- und Südhalbkugel teilt.',
      en: 'The equator – the line that divides the Earth into the northern and southern hemispheres – passes through these 13 countries (or their waters).',
      fr: 'L’équateur – la ligne qui divise la Terre en hémisphères nord et sud – traverse ces 13 pays (ou leurs eaux).',
      ar: 'يمر خط الاستواء، الذي يقسم الأرض إلى نصف شمالي ونصف جنوبي، عبر هذه الدول الثلاث عشرة أو مياهها.'
    },
    fakt: {
      de: 'Ecuador ist nach dem Äquator benannt – „Ecuador“ ist das spanische Wort dafür.',
      en: 'Ecuador is named after the equator – "Ecuador" is the Spanish word for it.',
      fr: 'L’Équateur doit son nom à l’équateur : « Ecuador » est le mot espagnol qui le désigne.',
      ar: 'سُميت الإكوادور على اسم خط الاستواء، فكلمة «إكوادور» تعني خط الاستواء بالإسبانية.'
    }
  }
];
