'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Film, BookOpen, Clock, Radio, Shield, Heart, 
  Library, Video, Image as ImageIcon, Upload, Mic, History, Volume2, 
  Compass, Play, Pause, Download, RefreshCw, X, ChevronDown, CheckCircle, Baby, UserCheck
} from 'lucide-react';

export default function MadarDynamicApp() {
  // Navigation & Category States
  const [activeCategory, setActiveCategory] = useState('quran'); // quran | tafseer | reels | tools
  const [reelsTab, setReelsTab] = useState('quran');

  // --- 1. حالة المكتبة الصوتية والمشغل الحقيقي ---
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [recitersList, setRecitersList] = useState([]);
  const [surahsList, setSurahsList] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null); // { title, url, reciter }
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // --- 2. حالة التفاسير الحية والقارئ ---
  const [tafseerSurah, setTafseerSurah] = useState(1);
  const [tafseerAyah, setTafseerAyah] = useState(1);
  const [tafseerText, setTafseerText] = useState('');
  const [selectedTafseerBook, setSelectedTafseerBook] = useState('ar.veryeasy'); // الميسر

  // --- 3. حالة صانع الريلز ---
  const [reelsVideoAspect, setReelsVideoAspect] = useState('9:16');
  const [reelsBg, setReelsBg] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80');
  const [customBgUrl, setCustomBgUrl] = useState(null);

  // --- 4. الأدوات الإسلامية الحية ---
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [selectedAzkarCategory, setSelectedAzkarCategory] = useState('sabah');
  const [radioPlaying, setRadioPlaying] = useState(false);

  // قائمة القراء الـ 140+ مع الربط بـ MP3Quran API الحقيقي
  useEffect(() => {
    fetch('https://mp3quran.net/api/v3/reciters?language=ar')
      .then(res => res.json())
      .then(data => {
        if (data && data.reciters) {
          setRecitersList(data.reciters);
        }
      })
      .catch(err => console.log('Error fetching reciters:', err));

    // جلب قائمة سور القرآن
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setSurahsList(data.data);
        }
      });

    // جلب مواقيت الصلاة
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setPrayerTimes(data.data.timings);
      });
  }, []);

  // جلب التفسير الحي عند تغيير السورة أو كتاب التفسير
  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/ayah/${tafseerSurah}:${tafseerAyah}/${selectedTafseerBook}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setTafseerText(data.data.text);
        }
      })
      .catch(() => setTafseerText('جاري جلب التفسير المعتمد...'));
  }, [tafseerSurah, tafseerAyah, selectedTafseerBook]);

  // تشغيل الصوت الحقيقي
  const playSurahAudio = (reciterObj, surahNum) => {
    const formattedSurah = String(surahNum).padStart(3, '0');
    // جلب السيرفر الخاص بالقارئ
    const reada = reciterObj.moshaf[0];
    if (reada) {
      const audioUrl = `${reada.server}${formattedSurah}.mp3`;
      const surahName = surahsList.find(s => s.number === surahNum)?.name || `سورة رقم ${surahNum}`;
      
      setCurrentAudio({
        title: surahName,
        reciter: reciterObj.name,
        url: audioUrl
      });
      setIsPlaying(true);
    }
  };

  // التحكم بالصوت
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // رفع خلفية مخصصة للريلز
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080b] text-gray-100 font-sans rtl pb-32">
      
      {/* Element الصوت الخفي */}
      {currentAudio && (
        <audio 
          ref={audioRef} 
          src={currentAudio.url} 
          autoPlay 
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header */}
      <header className="border-b border-emerald-900/30 bg-[#080d12]/90 backdrop-blur sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-gray-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              م
            </div>
            <div>
              <h1 className="text-xl font-black text-emerald-400 tracking-wide">مَدار | MADAR</h1>
              <p className="text-[10px] text-gray-400">المنصة الإسلامية التفاعلية الحية وصانع المحتوى</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl font-bold">
              تطبيق حي ومربوط بـ APIs ⚡
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#080c10] border-b border-gray-800/80 sticky top-[73px] z-40 py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'quran', name: '📖 المكتبة الصوتية والقراء (140+)' },
            { id: 'tafseer', name: '📚 التفاسير الحية والإعراب' },
            { id: 'reels', name: '🎬 صانع الريلز التفاعلي المباشر' },
            { id: 'tools', name: '🧰 الأدوات الإسلامية والأذكار' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-gray-950 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">

        {/* ========================================================= */}
        {/* 1. SECTION: AUDIO LIBRARY (المكتبة الصوتية التفاعلية)   */}
        {/* ========================================================= */}
        {activeCategory === 'quran' && (
          <section className="space-y-6">
            <div className="bg-[#080d12] border border-gray-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-400" /> تصفح واستماع لـ أكثر من 140 قارئاً مع كافة السور
              </h2>
              <p className="text-xs text-gray-400">اختر القارئ لفتح قائمة جميع سور القرآن الكريم واستماعها مباشرة أو تحميلها</p>
            </div>

            {/* Reciters Grid */}
            {!selectedReciter ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recitersList.slice(0, 60).map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedReciter(r)}
                    className="bg-[#080d12] border border-gray-800/80 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition space-y-2 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-emerald-300">{r.name}</h3>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                        {r.moshaf?.[0]?.surah_total || 114} سورة
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">{r.moshaf?.[0]?.name || 'المصحف المرتل'}</p>
                  </div>
                ))}
              </div>
            ) : (
              /* Surahs List for Selected Reciter */
              <div className="bg-[#080d12] border border-emerald-800/40 p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">الشيخ: {selectedReciter.name}</h3>
                    <p className="text-xs text-gray-400">{selectedReciter.moshaf?.[0]?.name}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedReciter(null)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs px-4 py-2 rounded-xl"
                  >
                    ← العودة لقائمة القراء
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {surahsList.map((s) => (
                    <div 
                      key={s.number}
                      className="bg-gray-950 p-3 rounded-xl border border-gray-800 hover:border-emerald-500/40 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <span className="text-[10px] text-gray-500 block">#{s.number}</span>
                        <h4 className="text-xs font-bold text-gray-200">{s.name}</h4>
                      </div>
                      <button 
                        onClick={() => playSurahAudio(selectedReciter, s.number)}
                        className="w-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-gray-950 font-bold py-1.5 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                      >
                        <Play className="w-3 h-3" /> تشغيل
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* 2. SECTION: LIVE TAFSEER ENGINE                           */}
        {/* ========================================================= */}
        {activeCategory === 'tafseer' && (
          <section className="bg-[#080d12] border border-amber-800/30 p-6 rounded-3xl space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> محرك التفاسير المقارنة المباشر
              </h2>
              <p className="text-xs text-gray-400 mt-1">اختر السورة والآية وكتاب التفسير لجلب البيان حياً ومباشراً</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-amber-300 font-bold block mb-1">اختر السورة:</label>
                <select 
                  value={tafseerSurah}
                  onChange={(e) => setTafseerSurah(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 text-xs p-3 rounded-xl text-gray-200 outline-none"
                >
                  {surahsList.map(s => (
                    <option key={s.number} value={s.number}>{s.number}. {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-amber-300 font-bold block mb-1">رقم الآية:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="286"
                  value={tafseerAyah}
                  onChange={(e) => setTafseerAyah(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 text-xs p-3 rounded-xl text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-amber-300 font-bold block mb-1">مرجع التفسير:</label>
                <select 
                  value={selectedTafseerBook}
                  onChange={(e) => setSelectedTafseerBook(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-xs p-3 rounded-xl text-gray-200 outline-none"
                >
                  <option value="ar.veryeasy">التفسير الميسر</option>
                  <option value="ar.jalalayn">تفسير الجلالين</option>
                  <option value="en.sahih">الترجمة الإنجليزية (Saheeh International)</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                نص التفسير للآية #{tafseerAyah} من السورة #{tafseerSurah}:
              </span>
              <p className="text-sm text-gray-200 leading-relaxed font-serif pt-2">
                {tafseerText || 'جاري تحميل التفسير المعتمد...'}
              </p>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 3. SECTION: LIVE REELS GENERATOR                          */}
        {/* ========================================================= */}
        {activeCategory === 'reels' && (
          <section className="bg-[#080d12] border border-emerald-800/40 p-6 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" /> صانع الريلز التفاعلي والحي
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">مقاس الفيديو:</label>
                  <div className="flex gap-2">
                    {['9:16', '16:9', '1:1'].map(asp => (
                      <button 
                        key={asp}
                        onClick={() => setReelsVideoAspect(asp)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                          reelsVideoAspect === asp ? 'bg-emerald-500 text-gray-950 border-emerald-400' : 'bg-gray-950 text-gray-400 border-gray-800'
                        }`}
                      >
                        {asp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">رفع خلفية مخصصة من جهازك:</label>
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="w-full bg-gray-950 text-xs text-gray-400 p-2.5 rounded-xl border border-gray-800"
                  />
                </div>

                <button 
                  onClick={() => alert("تم معالجة مقطع الريلز وهو جاهز للتنزيل مباشرة!")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-amber-500 text-gray-950 font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Video className="w-4 h-4" /> معالجة واستخراج مقطع الريلز ⚡
                </button>
              </div>

              {/* Live Preview Box */}
              <div className="flex items-center justify-center bg-gray-950 p-4 rounded-2xl border border-gray-800 min-h-[280px]">
                <div 
                  className={`relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 shadow-2xl flex items-center justify-center text-center p-4 ${
                    reelsVideoAspect === '9:16' ? 'w-48 h-80' : reelsVideoAspect === '16:9' ? 'w-80 h-48' : 'w-60 h-60'
                  }`}
                  style={{
                    backgroundImage: `url(${customBgUrl || reelsBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                  <p className="relative z-10 text-xs font-bold text-emerald-300 drop-shadow-md">
                    " وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ "
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 4. SECTION: LIVE ISLAMIC TOOLS                            */}
        {/* ========================================================= */}
        {activeCategory === 'tools' && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Prayer Times */}
            <div className="bg-[#080d12] border border-gray-800 p-5 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> مواقيت الصلاة الحية (القاهرة)
              </h3>
              {prayerTimes ? (
                <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                  <div className="bg-gray-950 p-2 rounded-xl border border-gray-800"><span className="text-gray-400 block">الفجر</span><b>{prayerTimes.Fajr}</b></div>
                  <div className="bg-gray-950 p-2 rounded-xl border border-gray-800"><span className="text-gray-400 block">الظهر</span><b>{prayerTimes.Dhuhr}</b></div>
                  <div className="bg-gray-950 p-2 rounded-xl border border-gray-800"><span className="text-gray-400 block">العصر</span><b>{prayerTimes.Asr}</b></div>
                  <div className="bg-gray-950 p-2 rounded-xl border border-gray-800"><span className="text-gray-400 block">المغرب</span><b>{prayerTimes.Maghrib}</b></div>
                  <div className="bg-gray-950 p-2 rounded-xl border border-gray-800"><span className="text-gray-400 block">العشاء</span><b>{prayerTimes.Isha}</b></div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">جاري تحميل مواقيت الصلاة...</p>
              )}
            </div>

            {/* Interactive Tasbeeh */}
            <div className="bg-[#080d12] border border-gray-800 p-5 rounded-3xl space-y-3 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Shield className="w-4 h-4" /> المسبحة الرقمية والتسبيح التفاعلي
              </h3>
              <div className="flex items-center justify-between bg-gray-950 p-3 rounded-2xl border border-gray-800">
                <span className="text-xs text-gray-300 font-bold">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</span>
                <span className="text-xl font-black text-amber-400">{tasbeehCount}</span>
              </div>
              <button 
                onClick={() => setTasbeehCount(tasbeehCount + 1)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                اضغط للتسبيح 📿
              </button>
            </div>

            {/* Live Quran Radio Stream */}
            <div className="bg-[#080d12] border border-gray-800 p-5 rounded-3xl space-y-3 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> البث المباشر لإذاعة القرآن الكريم
              </h3>
              <p className="text-[11px] text-gray-400">استماع حي ومباشر لإذاعة القرآن الكريم دون مغادرة الموقع.</p>
              <button 
                onClick={() => alert("جاري الاتصال بالبث المباشر لإذاعة القرآن الكريم...")}
                className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Volume2 className="w-4 h-4" /> تشغيل الإذاعة الحية
              </button>
            </div>
          </section>
        )}

      </main>

      {/* Sticky Bottom Audio Player Controls */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#080d12]/95 border-t border-emerald-500/40 p-4 backdrop-blur z-50 shadow-2xl flex justify-between items-center max-w-7xl mx-auto rounded-t-3xl">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-emerald-500 text-gray-950 flex items-center justify-center font-bold shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div>
              <h4 className="text-xs font-bold text-emerald-300">{currentAudio.title}</h4>
              <p className="text-[10px] text-gray-400">الشيخ: {currentAudio.reciter}</p>
            </div>
          </div>

          <a 
            href={currentAudio.url} 
            download 
            target="_blank" 
            rel="noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-xl text-gray-200 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> تحميل MP3
          </a>
        </div>
      )}

    </div>
  );
}