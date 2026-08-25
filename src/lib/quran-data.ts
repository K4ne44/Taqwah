export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface AyahData {
  number: number;
  text: string;
  translation: string;
  surahNumber: number;
  ayahNumber: number;
  juz: number;
}

export interface DailyAyah {
  ayahNumber: number;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  arabicText: string;
  translation: string;
  translationSource: string;
  juz: number;
}

export const SURAH_LIST: SurahInfo[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, name: "آل عمران", englishName: "Aal-E-Imran", englishNameTranslation: "The Family of Imran", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, name: "طه", englishName: "Taha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan" },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan" },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan" },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, name: "العنكبوت", englishName: "Al-Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, name: "سبأ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those Ranged in Ranks", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Sad", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan" },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Gold Adornments", numberOfAyahs: 89, revelationType: "Meccan" },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan" },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan" },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan" },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadilah", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan" },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahinah", englishNameTranslation: "She That is Examined", numberOfAyahs: 13, revelationType: "Medinan" },
  { number: 61, name: "الصف", englishName: "As-Saff", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan" },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan" },
  { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan" },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", englishNameTranslation: "The Man", numberOfAyahs: 31, revelationType: "Medinan" },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan" },
  { number: 78, name: "النبأ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those Who Drag Forth", numberOfAyahs: 46, revelationType: "Meccan" },
  { number: 80, name: "عبس", englishName: "Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
  { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan" },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan" },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Sundering", numberOfAyahs: 25, revelationType: "Meccan" },
  { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan" },
  { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan" },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan" },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, name: "العلق", englishName: "Al-Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 100, name: "العاديات", englishName: "Al-Adiyat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in Worldly Increase", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 103, name: "العصر", englishName: "Al-Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan" },
  { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan" },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan" },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" },
];

export const TOTAL_SURAHS = 114;
export const TOTAL_AYAH = 6236;
export const TOTAL_PAGES = 604;

export const JUZ_LIST = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  name: `Juz ${i + 1}`,
}));

export const DAILY_AYAHS: DailyAyah[] = [
  { surahNumber: 2, ayahNumber: 255, surahName: "البقرة", surahEnglishName: "Al-Baqarah", arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.", translationSource: "Sahih International", juz: 31 },
  { surahNumber: 2, ayahNumber: 286, surahName: "البقرة", surahEnglishName: "Al-Baqarah", arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", translation: "Allah does not charge a soul except with that within its capacity. It will have earned whatever is good and suffered whatever is evil. Our Lord, do not impose blame upon us if we forget or err. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our Protector, so give us victory over the disbelieving people.", translationSource: "Sahih International", juz: 31 },
  { surahNumber: 3, ayahNumber: 185, surahName: "آل عمران", surahEnglishName: "Aal-E-Imran", arabicText: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ ۖ فَمَن زُحْزِحَ عَنِ النَّارِ وَأُدْخِلَ الْجَنَّةَ فَقَدْ فَازَ ۗ وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ", translation: "Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection. So he who is drawn away from the Fire and admitted to Paradise has attained. And what is the worldly life except the enjoyment of delusion.", translationSource: "Sahih International", juz: 4 },
  { surahNumber: 4, ayahNumber: 135, surahName: "النساء", surahEnglishName: "An-Nisa", arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ وَلَوْ عَلَىٰ أَنفُسِكُمْ أَوِ الْوَالِدَيْنِ وَالْأَقْرَبِينَ ۚ إِن يَكُنْ غَنِيًّا أَوْ فَقِيرًا فَاللَّهُ أَوْلَىٰ بِهِمَا ۖ فَلَا تَتَّبِعُوا الْهَوَىٰ أَن تَعْدِلُوا ۚ وَإِن تَلْوُوا أَوْ تُعْرِضُوا فَإِنَّ اللَّهَ كَانَ بِمَا تَعْمَلُونَ خَبِيرًا", translation: "O you who have believed, be persistently standing firm in justice, witnesses for Allah, even if it be against yourselves or parents and relatives. Whether one is rich or poor, Allah is more worthy of both. So follow not desire, lest you not be just. And if you distort or decline, then indeed Allah is ever, with what you do, Acquainted.", translationSource: "Sahih International", juz: 5 },
  { surahNumber: 5, ayahNumber: 3, surahName: "المائدة", surahEnglishName: "Al-Ma'idah", arabicText: "حُرِّمَتْ عَلَيْكُمُ الْمَيْتَةُ وَالدَّمُ وَلَحْمُ الْخِنزِيرِ وَمَا أُهِلَّ لِغَيْرِ اللَّهِ بِهِ وَمَا وُقِدَ لِنَارٍ وَمَا انتَقَحَ بِالْمِخْضَرِ وَأَلَّا تَسْتَنْسِخُوا الْكِتَابَةَ ۚ ذَٰلِكُمْ فِسْقٌ ۗ الْيَوْمَ يَئِسَ الَّذِينَ كَفَرُوا مِن دِينِكُمْ فَلَا تَخْشَوْهُمْ وَاخْشَوْنِ ۚ الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا ۚ فَمَنِ اضْطُرَّ فِي مَخْمَصَةٍ غَيْرَ مُتَجَانِفٍ لِّإِثْمٍ ۙ فَإِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", translation: "Prohibited to you are dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah, and those animals killed by strangling or by a violent blow or by a headlong fall or by goring, and that which has been partly eaten by a wild animal, unless you are able to slaughter it before its death. And those which have idols. And seek divination with arrows. Those are grave sins. This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion. But whoever is forced by severe hunger with no inclination to sin - then indeed, Allah is Forgiving and Merciful.", translationSource: "Sahih International", juz: 6 },
  { surahNumber: 7, ayahNumber: 180, surahName: "الأعراف", surahEnglishName: "Al-A'raf", arabicText: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا ۖ وَذَرُوا الَّذِينَ يُلْحِدُونَ فِي أَسْمَائِهِ ۚ سَيُجْزَوْنَ مَا كَانُوا يَعْمَلُونَ", translation: "And to Allah belong the best names, so invoke Him by them. And leave those who practice deviation concerning His names. They will be recompensed for what they have been doing.", translationSource: "Sahih International", juz: 9 },
  { surahNumber: 9, ayahNumber: 128, surahName: "التوبة", surahEnglishName: "At-Tawbah", arabicText: "لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ عَزِيزٌ عَلَيْهِ مَا عَنِتُّمْ حَرِيصٌ عَلَيْكُم بِالْمُؤْمِنِينَ رَءُوفٌ رَّحِيمٌ", translation: "There has certainly come to you a Messenger from among yourselves. Grievous to him is what you suffer; concerned over you and to the believers is Kind and Merciful.", translationSource: "Sahih International", juz: 11 },
  { surahNumber: 10, ayahNumber: 57, surahName: "يونس", surahEnglishName: "Yunus", arabicText: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ ۙ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", translation: "O mankind, there has come to you an instruction from your Lord and a healing for what is in the breasts and guidance and mercy for the believers.", translationSource: "Sahih International", juz: 11 },
  { surahNumber: 12, ayahNumber: 111, surahName: "يوسف", surahEnglishName: "Yusuf", arabicText: "لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِّأُولِي الْأَلْبَابِ ۗ مَا كَانَ حَدِيثًا يُفْتَرَىٰ وَلَٰكِن تَصْدِيقَ الَّذِي بَيْنَ يَدَيْهِ وَتَفْصِيلَ كُلِّ شَيْءٍ وَهُدًى وَرَحْمَةً لِّقَوْمٍ يُؤْمِنُونَ", translation: "There was certainly in their stories a lesson for those of understanding. Never was it a narration invented, but a confirmation of what was before it - a detailed explanation of all things and guidance and mercy for a people who believe.", translationSource: "Sahih International", juz: 13 },
  { surahNumber: 13, ayahNumber: 28, surahName: "الرعد", surahEnglishName: "Ar-Ra'd", arabicText: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Unquestionably, by the remembrance of Allah hearts are assured.", translationSource: "Sahih International", juz: 13 },
  { surahNumber: 15, ayahNumber: 9, surahName: "الحجر", surahEnglishName: "Al-Hijr", arabicText: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ", translation: "Indeed, it is We who sent down the reminder and indeed, We will be its guardian.", translationSource: "Sahih International", juz: 14 },
  { surahNumber: 17, ayahNumber: 79, surahName: "الإسراء", surahEnglishName: "Al-Isra", arabicText: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ ۖ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا", translation: "And from the night as well, pray additional with it for you; it is expected that your Lord will resurrect you to a praised station.", translationSource: "Sahih International", juz: 15 },
  { surahNumber: 18, ayahNumber: 10, surahName: "الكهف", surahEnglishName: "Al-Kahf", arabicText: "إِذْ أَوَيَ الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", translation: "[Mention] when the youths retreated to the cave and said, \u201COur Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.\u201D", translationSource: "Sahih International", juz: 15 },
  { surahNumber: 18, ayahNumber: 46, surahName: "الكهف", surahEnglishName: "Al-Kahf", arabicText: "قُلْ أَؤُنَبِّئُكُم بِخَيْرٍ مِّن ذَٰلِكُمْ ۚ لِلَّذِينَ اتَّقَوْا عِندَ رَبِّهِمْ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا وَأَزْوَاجٌ مُّطَهَّرَةٌ وَرِضْوَانٌ مِّنَ اللَّهِ ۗ وَاللَّهُ بَصِيرٌ بِالْعِبَادِ", translation: "Say, \u201CShall I inform you of something better than that for those who fear Allah? For them are Gardens beneath which rivers flow, wherein they abide forever, and purified spouses and approval from Allah. And Allah is Observer of His servants.\u201D", translationSource: "Sahih International", juz: 15 },
  { surahNumber: 19, ayahNumber: 16, surahName: "مريم", surahEnglishName: "Maryam", arabicText: "وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ إِذِ انتَبَذَتْ مِنْ أَهْلِهَا مَكَانًا شَرْقِيًّا", translation: "And mention in the Book, Mary, when she withdrew from her family to a eastern place.", translationSource: "Sahih International", juz: 16 },
  { surahNumber: 20, ayahNumber: 114, surahName: "طه", surahEnglishName: "Taha", arabicText: "فَتَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ", translation: "So blessed is Allah, the best of creators.", translationSource: "Sahih International", juz: 16 },
  { surahNumber: 21, ayahNumber: 35, surahName: "الأنبياء", surahEnglishName: "Al-Anbiya", arabicText: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۖ وَنَبْلُوكُم بِالشَّرِّ وَالْخَيْرِ فِتْنَةً ۖ وَإِلَيْنَا تُرْجَعُونَ", translation: "Every soul will taste death. And We test you with evil and with good as trial; and to Us you will be returned.", translationSource: "Sahih International", juz: 17 },
  { surahNumber: 22, ayahNumber: 46, surahName: "الحج", surahEnglishName: "Al-Hajj", arabicText: "أَفَلَمْ يَسِيرُوا فِي الْأَرْضِ فَتَكُونَ لَهُمْ قُلُوبٌ يَعْقِلُونَ بِهَا أَوْ آذَانٌ يَسْمَعُونَ بِهَا ۖ فَإِنَّهَا لَا تَعْمَى الْأَبْصَارُ وَلَٰكِن تَعْمَى الْقُلُوبُ الَّتِي فِي الصُّدُورِ", translation: "So have they not traveled through the earth and have hearts by which to reason and ears by which to hear? For indeed, it is not eyes that are blinded, but blinded are the hearts which are within the breasts.", translationSource: "Sahih International", juz: 17 },
  { surahNumber: 23, ayahNumber: 115, surahName: "المؤمنون", surahEnglishName: "Al-Mu'minun", arabicText: "أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا وَأَنَّكُمْ إِلَيْنَا لَا تُرْجَعُونَ", translation: "Then did you think that We created you uselessly and that to Us you would not be returned?", translationSource: "Sahih International", juz: 18 },
  { surahNumber: 24, ayahNumber: 35, surahName: "النور", surahEnglishName: "An-Nur", arabicText: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونِةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُّورٌ عَلَىٰ نُورٍ ۗ يَهْدِي اللَّهُ لِنُورِهِ مَن يَشَاءُ ۚ وَيَضْرِبُ اللَّهُ الْأَمْثَالَ لِلنَّاسِ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a pearly white star lit from a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allah guides to His light whom He wills. And Allah presents examples for the people, and Allah is Knowing of all things.", translationSource: "Sahih International", juz: 18 },
  { surahNumber: 25, ayahNumber: 63, surahName: "الفرقان", surahEnglishName: "Al-Furqan", arabicText: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا", translation: "And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them, they say peace.", translationSource: "Sahih International", juz: 18 },
  { surahNumber: 27, ayahNumber: 30, surahName: "النمل", surahEnglishName: "An-Naml", arabicText: "إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Indeed, it is from Solomon, and indeed, it reads: In the name of Allah, the Entirely Merciful, the Especially Merciful.", translationSource: "Sahih International", juz: 20 },
  { surahNumber: 29, ayahNumber: 69, surahName: "العنكبوت", surahEnglishName: "Al-Ankabut", arabicText: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ", translation: "And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.", translationSource: "Sahih International", juz: 20 },
  { surahNumber: 31, ayahNumber: 17, surahName: "لقمان", surahEnglishName: "Luqman", arabicText: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ ۖ إِنَّ ذَٰلِكَ مِنْ عَزْمِ الْأُمُورِ", translation: "O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you. Indeed, that is of the matters requiring determination.", translationSource: "Sahih International", juz: 21 },
  { surahNumber: 33, ayahNumber: 72, surahName: "الأحزاب", surahEnglishName: "Al-Ahzab", arabicText: "إِنَّا عَرَضْنَا الْأَمَانَةَ عَلَى السَّمَاوَاتِ وَالْأَرْضِ وَالْجِبَالِ فَأَبَيْنَ أَن يَحْمِلْنَهَا وَأَشْفَقْنَ مِنْهَا وَحَمَلَهَا الْإِنسَانُ ۖ إِنَّهُ كَانَ ظَلُومًا جَهُولًا", translation: "Indeed, We offered the trust to the heavens and the earth and the mountains, and they declined to bear it and feared it; but man undertook to bear it. Indeed, he was unjust and ignorant.", translationSource: "Sahih International", juz: 21 },
  { surahNumber: 35, ayahNumber: 15, surahName: "فاطر", surahEnglishName: "Fatir", arabicText: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ", translation: "O mankind, you are the ones in need of Allah, while Allah is the Free of need, the Praiseworthy.", translationSource: "Sahih International", juz: 22 },
  { surahNumber: 36, ayahNumber: 82, surahName: "يس", surahEnglishName: "Ya-Sin", arabicText: "إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ", translation: "His command is only when He intends a thing that He says to it, Be, and it is.", translationSource: "Sahih International", juz: 22 },
  { surahNumber: 39, ayahNumber: 53, surahName: "الزمر", surahEnglishName: "Az-Zumar", arabicText: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ", translation: "Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.", translationSource: "Sahih International", juz: 23 },
  { surahNumber: 40, ayahNumber: 60, surahName: "غافر", surahEnglishName: "Ghafir", arabicText: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ ۚ إِنَّ الَّذِينَ يَسْتَكْبِرُونَ عَنْ عِبَادَتِي سَيَدْخُلُونَ جَهَنَّمَ دَاخِرِينَ", translation: "And your Lord says, call upon Me; I will respond to you. Indeed, those who disdain My worship will enter Hell contemptible.", translationSource: "Sahih International", juz: 24 },
  { surahNumber: 41, ayahNumber: 30, surahName: "فصلت", surahEnglishName: "Fussilat", arabicText: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ أَلَّا تَخَافُوا وَلَا تَحْزَنُوا وَأَبْشِرُوا بِالْجَنَّةِ الَّتِي كُنتُمْ تُوعَدُونَ", translation: "Indeed, those who have said, 'Our Lord is Allah' and then remained on a right path - the angels will descend upon them, saying, 'Do not fear and do not grieve but receive good tidings of Paradise, which you were promised.'", translationSource: "Sahih International", juz: 24 },
  { surahNumber: 42, ayahNumber: 13, surahName: "الشورى", surahEnglishName: "Ash-Shura", arabicText: "شَرَعَ لَكُم مِّنَ الدِّينِ مَا وَصَّىٰ بِهِ نُوحًا وَالَّذِي أَوْحَيْنَا إِلَيْكَ وَمَا وَصَّيْنَا بِهِ إِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَىٰ ۖ أَنْ أَقِيمُوا الدِّينَ وَلَا تَتَفَرَّقُوا فِيهِ ۚ كَبُرَ عَلَى الْمُشْرِكِينَ مَا تَدْعُوهُمْ إِلَيْهِ ۚ اللَّهُ يَجْتَبِي إِلَيْهِ مَن يَشَاءُ وَيَهْدِي إِلَيْهِ مَن يُنِيبُ", translation: "He has ordained for you of religion what He enjoined upon Noah and that which We have revealed to you, O Muhammad, and what We enjoined upon Abraham and Moses and Jesus - to establish the religion and not be divided therein. Unacceptable to the associators is that to which you call them. Allah chooses for Himself whom He wills and guides to Himself whoever turns back.", translationSource: "Sahih International", juz: 25 },
  { surahNumber: 44, ayahNumber: 58, surahName: "الدخان", surahEnglishName: "Ad-Dukhan", arabicText: "فَانظُرْ إِلَىٰ آيَاتِنَا كَيْفَ نُصَرِّفُهَا ثُمَّ انظُرْ سَوْءَ الْكِفْرِ", translation: "So observe how We display [Our] signs [again]; then see how [the result of] their denial will be.", translationSource: "Sahih International", juz: 25 },
  { surahNumber: 47, ayahNumber: 15, surahName: "محمد", surahEnglishName: "Muhammad", arabicText: "مَثَلُ الْجَنَّةِ الَّتِي وُعِدَ الْمُتَّقُونَ ۖ فِيهَا أَنْهَارٌ مِّن مَّاءٍ غَيْرِ آسِنٍ وَأَنْهَارٌ مِّن لَّبَنٍ لَّمْ يَتَغَيَّرْ طَعْمُهُ وَأَنْهَارٌ مِّنْ خَمْرٍ لَّذَّةٍ لِّلشَّارِبِينَ وَأَنْهَارٌ مِّنْ عَسَلٍ مُّصَفًّى ۖ وَلَهُمْ فِيهَا مِن كُلِّ الثَّمَرَاتِ وَمَغْفِرَةٌ مِّن رَّبِّهِمْ", translation: "Is the description of Paradise, which the righteous are promised, wherein are rivers of water unaltered and rivers of milk the taste of which never changes and rivers of wine delicious to the drinkers and rivers of purified honey, in which they will have from all [kinds of] fruits and forgiveness from their Lord.", translationSource: "Sahih International", juz: 26 },
  { surahNumber: 49, ayahNumber: 13, surahName: "الحجرات", surahEnglishName: "Al-Hujurat", arabicText: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ", translation: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.", translationSource: "Sahih International", juz: 26 },
  { surahNumber: 51, ayahNumber: 56, surahName: "الذاريات", surahEnglishName: "Adh-Dhariyat", arabicText: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", translation: "And I did not create the jinn and mankind except to worship Me.", translationSource: "Sahih International", juz: 26 },
  { surahNumber: 54, ayahNumber: 17, surahName: "القمر", surahEnglishName: "Al-Qamar", arabicText: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ", translation: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?", translationSource: "Sahih International", juz: 27 },
  { surahNumber: 55, ayahNumber: 13, surahName: "الرحمن", surahEnglishName: "Ar-Rahman", arabicText: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", translation: "So which of the favors of your Lord would you deny?", translationSource: "Sahih International", juz: 27 },
  { surahNumber: 56, ayahNumber: 77, surahName: "الواقعة", surahEnglishName: "Al-Waqi'ah", arabicText: "إِنَّهُ لَقُرْآنٌ كَرِيمٌ", translation: "Indeed, this is a noble Quran.", translationSource: "Sahih International", juz: 27 },
  { surahNumber: 59, ayahNumber: 22, surahName: "الحشر", surahEnglishName: "Al-Hashr", arabicText: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.", translationSource: "Sahih International", juz: 28 },
  { surahNumber: 59, ayahNumber: 24, surahName: "الحشر", surahEnglishName: "Al-Hashr", arabicText: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ", translation: "He is Allah, the Creator, the Originator, the Bestower of forms. To Him belong the best names. Whatever is in the heavens and the earth is exalting Him. And He is the Exalted in Might, the Wise.", translationSource: "Sahih International", juz: 28 },
  { surahNumber: 67, ayahNumber: 15, surahName: "الملك", surahEnglishName: "Al-Mulk", arabicText: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ", translation: "It is He who made the earth tamed for you - so walk among its slopes and eat of His provision - and to Him is the resurrection.", translationSource: "Sahih International", juz: 29 },
  { surahNumber: 73, ayahNumber: 20, surahName: "المزمل", surahEnglishName: "Al-Muzzammil", arabicText: "إِنَّ رَبَّكَ يَعْلَمُ أَنَّكَ تَقُومُ أَدْنَىٰ مِن ثُلُثَيِ اللَّيْلِ وَنِصْفَهُ وَثُلُثَهُ وَطَائِفَةٌ مِّنَ الَّذِينَ مَعَكَ ۚ وَاللَّهُ يُقَدِّرُ اللَّيْلَ وَالنَّهَارَ ۚ عَلِمَ أَن لَّن تُحْصُوهُ فَتَابَ عَلَيْكُمْ ۖ فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ ۚ عَلِمَ أَن سَيَكُونُ مِنكُم مَّرْضَىٰ ۙ وَآخَرُونَ يَضْرِبُونَ فِي الْأَرْضِ يَبْتَغُونَ مِن فَضْلِ اللَّهِ ۙ وَآخَرُونَ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ ۖ فَاقْرَءُوا مَا تَيَسَّرَ مِنْهُ ۚ وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَأَقْرِضُوا اللَّهِ قَرْضًا حَسَنًا ۖ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ هُوَ خَيْرًا وَأَعْظَمَ أَجْرًا ۚ وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", translation: "Indeed, your Lord knows, [O Muhammad], that you stand [in prayer] almost two thirds of the night or half of it or a third of it, and [so do] a group of those with you. Allah measures the night and the day. He knows that you will not be able to endure it, so He has pardoned you. So recite what is easy [for you] of the Quran. He knows that there will be among you those who are ill and others traveling throughout the land seeking of the bounty of Allah and others fighting in the cause of Allah. So recite what is easy from it and establish prayer and give zakah and loan Allah a goodly loan. And whatever good you put forward for yourselves - you will find it with Allah. It is better and greater in reward. And seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful.", translationSource: "Sahih International", juz: 29 },
  { surahNumber: 76, ayahNumber: 3, surahName: "الإنسان", surahEnglishName: "Al-Insan", arabicText: "إِنَّا خَلَقْنَا الْإِنسَانَ مِن نُّطْفَةٍ أَمْشَاجٍ نَّبْتَلِيهِ فَجَعَلْنَاهُ سَمِيعًا بَصِيرًا", translation: "Indeed, We created man from a sperm-drop mixture that We may test him; and We made him hearing and seeing.", translationSource: "Sahih International", juz: 29 },
  { surahNumber: 78, ayahNumber: 29, surahName: "النبأ", surahEnglishName: "An-Naba", arabicText: "إِنَّا سَمَعْنَا كِتَابًا يُدْعَى الْإِنجِيلَ يَأْمُرُهُم بِالْمَعْرُوفِ وَيَنْهَاهُمْ عَنِ الْمُنكَرِ", translation: "Indeed, it is We who gave life to the dead, and We record what they put forth and what they left behind, and everything We have enumerated in a clear register.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 87, ayahNumber: 1, surahName: "الأعلى", surahEnglishName: "Al-A'la", arabicText: "سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى", translation: "Exalt the name of your Lord, the Most High.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 93, ayahNumber: 5, surahName: "الضحى", surahEnglishName: "Ad-Duhaa", arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", translation: "And your Lord is going to give you, and you will be satisfied.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 94, ayahNumber: 5, surahName: "الشرح", surahEnglishName: "Ash-Sharh", arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "For indeed, with hardship will be ease.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 94, ayahNumber: 6, surahName: "الشرح", surahEnglishName: "Ash-Sharh", arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Indeed, with hardship will be ease.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 95, ayahNumber: 4, surahName: "التين", surahEnglishName: "At-Tin", arabicText: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ", translation: "We have certainly created man in the best of stature.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 96, ayahNumber: 1, surahName: "العلق", surahEnglishName: "Al-Alaq", arabicText: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", translation: "Read in the name of your Lord who created.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 97, ayahNumber: 5, surahName: "القدر", surahEnglishName: "Al-Qadr", arabicText: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", translation: "Peace it is until the emergence of dawn.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 103, ayahNumber: 3, surahName: "العصر", surahEnglishName: "Al-Asr", arabicText: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", translation: "Indeed, mankind is in loss.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 103, ayahNumber: 4, surahName: "العصر", surahEnglishName: "Al-Asr", arabicText: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", translation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 110, ayahNumber: 3, surahName: "النصر", surahEnglishName: "An-Nasr", arabicText: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", translation: "And you see the people entering into the religion of Allah in multitudes.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 112, ayahNumber: 1, surahName: "الإخلاص", surahEnglishName: "Al-Ikhlas", arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, He is Allah, the One.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 112, ayahNumber: 2, surahName: "الإخلاص", surahEnglishName: "Al-Ikhlas", arabicText: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 112, ayahNumber: 3, surahName: "الإخلاص", surahEnglishName: "Al-Ikhlas", arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 112, ayahNumber: 4, surahName: "الإخلاص", surahEnglishName: "Al-Ikhlas", arabicText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Nor is there to Him any equivalent.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 113, ayahNumber: 1, surahName: "الفلق", surahEnglishName: "Al-Falaq", arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Say, I seek refuge in the Lord of daybreak.", translationSource: "Sahih International", juz: 30 },
  { surahNumber: 114, ayahNumber: 1, surahName: "الناس", surahEnglishName: "An-Nas", arabicText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Say, I seek refuge in the Lord of mankind.", translationSource: "Sahih International", juz: 30 },
];

export function getDailyAyah(): DailyAyah {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
}

export function getSurahByNumber(num: number): SurahInfo | undefined {
  return SURAH_LIST.find(s => s.number === num);
}

export function searchQuran(query: string): DailyAyah[] {
  const q = query.toLowerCase();
  return DAILY_AYAHS.filter(
    a =>
      a.surahEnglishName.toLowerCase().includes(q) ||
      a.surahName.includes(query) ||
      a.translation.toLowerCase().includes(q) ||
      a.arabicText.includes(query) ||
      String(a.ayahNumber).includes(q)
  );
}

const RECITER_SERVERS: Record<string, string> = {
  "ar.alafasy": "https://server8.mp3quran.net/afs",
  "ar.yasseraldossari": "https://server11.mp3quran.net/yasser",
  "ar.ahmedajamy": "https://server10.mp3quran.net/ajm",
  "ar.minshawi": "https://server10.mp3quran.net/minsh1387",
  "ar.husary": "https://server7.mp3quran.net/husary",
  "ar.husarymujawwad": "https://server7.mp3quran.net/husarym",
  "ar.abdurrahmaanassudais": "https://server7.mp3quran.net/sudais",
  "ar.shaatree": "https://server7.mp3quran.net/shur",
  "ar.minshawimujawwad": "https://server7.mp3quran.net/minsh",
  "ar.saaboreymaah": "https://server8.mp3quran.net/afs",
};

const AYAH_AUDIO_SERVERS: Record<string, string> = {
  "ar.alafasy": "Alafasy_128kbps",
  "ar.husary": "Husary_128kbps",
  "ar.minshawi": "Minshawy_Mujawwad_192kbps",
  "ar.minshawimujawwad": "Minshawy_Mujawwad_192kbps",
  "ar.abdurrahmaanassudais": "Abdul_Basit_Murattal_192kbps",
  "ar.abdulbasit": "Abdul_Basit_Murattal_192kbps",
  "ar.hudhaify": "Hudhaify_128kbps",
  "ar.muhammadjibreel": "Muhammad_Jibreel_128kbps",
};

export function getReciterUrl(surahNumber: number, reciter: string = "ar.yasseraldossari"): string {
  const server = RECITER_SERVERS[reciter] || RECITER_SERVERS["ar.alafasy"];
  const raw = `${server}/${String(surahNumber).padStart(3, "0")}.mp3`;
  return `/api/audio/proxy?url=${encodeURIComponent(raw)}`;
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciter: string = "ar.yasseraldossari"): string {
  const folder = AYAH_AUDIO_SERVERS[reciter] || "Alafasy_128kbps";
  const globalNumber = getGlobalAyahNumber(surahNumber, ayahNumber);
  const raw = `https://everyayah.com/data/${folder}/${String(globalNumber).padStart(6, "0")}.mp3`;
  return `/api/audio/proxy?url=${encodeURIComponent(raw)}`;
}

export function getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
  let total = 0;
  for (const s of SURAH_LIST) {
    if (s.number === surahNumber) {
      total += ayahNumber;
      break;
    }
    total += s.numberOfAyahs;
  }
  return total;
}

export const RECITERS = [
  { id: "ar.yasseraldossari", name: "Yasser Al-Dosari" },
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdurrahmaanassudais", name: "Abdur-Rahmaan As-Sudais" },
  { id: "ar.ahmedajamy", name: "Ahmed ibn Ali al-Ajamy" },
  { id: "ar.minshawi", name: "Muhammad Siddiq Al-Minshawi" },
  { id: "ar.shaatree", name: "Abu Bakr Al-Shaatree" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
];
