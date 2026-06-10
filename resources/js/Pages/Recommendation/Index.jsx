import { useForm, usePage, Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

// Custom Sport Icons and Descriptions
const SPORT_INFO = {
    'Walking or jogging': {
        name: 'Jogging',
        image: '/images/jogging.png',
        icon: (className) => (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h5l11-4M9 9v5L6 20M12 14v4l5 4" />
            </svg>
        ),
        desc: 'Kesesuaian Jantung, Sendi, & Stamina',
        tag: 'Cocok untuk pemula',
        tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        longDesc: 'Jogging adalah aktivitas lari santai yang sangat baik untuk meningkatkan kapasitas kardiorespirasi (daya tahan jantung dan paru) tanpa membebani tubuh secara berlebihan. Olahraga ini dapat dilakukan kapan saja tanpa peralatan khusus.',
        benefits: ['Meningkatkan kesehatan jantung dan stamina', 'Membakar kalori dan membantu manajemen berat badan', 'Memperkuat tulang dan otot kaki', 'Mengurangi tingkat stres dan kecemasan'],
        safety: 'Bagi yang memiliki cedera lutut, disarankan jogging di permukaan yang empuk (seperti rumput atau lintasan khusus) or menggantinya dengan jalan cepat.'
    },
    'Cycling': {
        name: 'Bersepeda',
        image: '/images/cycle.png',
        icon: (className) => (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="5.5" cy="17.5" r="2.5" />
                <circle cx="18.5" cy="17.5" r="2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h2M6.5 17.5l3-7h5.5l3 7M9.5 10.5l2.5-4.5h3" />
            </svg>
        ),
        desc: 'Melatih Kardio & Kekuatan Kaki',
        tag: 'Aktivitas Kardio Tinggi',
        tagBg: 'bg-sky-50 text-sky-700 border-sky-200',
        longDesc: 'Bersepeda adalah latihan aerobik rendah benturan yang melatih kekuatan otot tubuh bagian bawah (paha, betis, dan bokong) sekaligus meningkatkan kebugaran kardiovaskular secara efisien.',
        benefits: ['Ramah terhadap sendi lutut dan pergelangan kaki', 'Membangun kekuatan dan tonus otot kaki', 'Meningkatkan koordinasi tubuh dan mobilitas sendi', 'Alternatif transportasi sehat dan ramah lingkungan'],
        safety: 'Atur tinggi sadel sepeda dengan benar untuk menghindari tekanan berlebihan pada lutut. Gunakan helm dan pelindung saat bersepeda di jalan raya.'
    },
    'Yoga': {
        name: 'Yoga',
        image: '/images/yoga.png',
        icon: (className) => (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M8 11h8M6 21c3-1 9-1 12 0" />
            </svg>
        ),
        desc: 'Meningkatkan Fleksibilitas & Ketenangan',
        tag: 'Relaksasi & Fokus',
        tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
        longDesc: 'Yoga mengombinasikan postur fisik, teknik pernapasan, dan meditasi untuk menciptakan keselarasan tubuh dan pikiran. Sangat baik untuk rehabilitasi fisik, kelenturan, dan relaksasi mental.',
        benefits: ['Meningkatkan kelenturan dan keseimbangan tubuh', 'Memperbaiki postur tubuh dan kekuatan otot inti', 'Membantu menurunkan tekanan darah dan detak jantung', 'Sangat baik untuk manajemen stres dan kecemasan'],
        safety: 'Lakukan gerakan sesuai batas kemampuan Anda. Gunakan matras yang tidak licin dan jangan memaksakan pose yang menimbulkan rasa nyeri tajam.'
    },
    'Swimming': {
        name: 'Renang',
        image: '/images/swimming.png',
        icon: (className) => (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 10a4 4 0 0 1 8 0 4 4 0 0 1 8 0 4 4 0 0 1 4 0M2 14a4 4 0 0 1 8 0 4 4 0 0 1 8 0 4 4 0 0 1 4 0" />
            </svg>
        ),
        desc: 'Seluruh Tubuh & Rendah Beban Sendi',
        tag: 'Rendah Risiko Cedera',
        tagBg: 'bg-teal-50 text-teal-700 border-teal-200',
        longDesc: 'Berenang merupakan olahraga aerobik yang melatih seluruh otot tubuh (full body workout). Karena dilakukan di dalam air, berat tubuh ditopang sehingga meminimalkan beban sendi secara signifikan.',
        benefits: ['Olahraga dengan beban sendi terendah (ideal untuk terapi cedera)', 'Melatih otot lengan, punggung, dada, dan kaki secara bersamaan', 'Meningkatkan kapasitas paru-paru dan daya tahan tubuh', 'Membantu membakar kalori tinggi secara merata'],
        safety: 'Lakukan pemanasan sebelum berenang. Atur tempo napas agar tidak mudah lelah, dan pilih gaya renang yang paling nyaman (misal gaya dada untuk pemula).'
    },
    'Gym': {
        name: 'Gym / Fitness',
        image: '/images/gym.png',
        icon: (className) => (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12M6 6h12M3 12h18M3 9v6M21 9v6" />
            </svg>
        ),
        desc: 'Latihan Beban & Pembentukan Otot',
        tag: 'Melatih Kekuatan',
        tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
        longDesc: 'Gym/Fitness berfokus pada latihan beban (strength training) dan ketahanan untuk membangun massa otot, meningkatkan kepadatan tulang, dan mempercepat metabolisme tubuh.',
        benefits: ['Meningkatkan kekuatan dan massa otot secara signifikan', 'Mempercepat metabolisme tubuh (bagus untuk pembakaran lemak)', 'Meningkatkan kepadatan mineral tulang', 'Meningkatkan sensitivitas insulin dan kesehatan metabolik'],
        safety: 'Pelajari form gerakan yang benar sebelum menambah beban. Selalu lakukan pemanasan, gunakan spotter jika mengangkat beban berat, dan beri jeda istirahat yang cukup.'
    },
};

const getSportInfo = (sportName) => {
    let key = sportName;
    if (/walk|jog/i.test(sportName)) key = 'Walking or jogging';
    else if (/cycle|bike/i.test(sportName)) key = 'Cycling';
    else if (/yoga/i.test(sportName)) key = 'Yoga';
    else if (/swim/i.test(sportName)) key = 'Swimming';
    else if (/gym|fitness|work|lift|weight/i.test(sportName)) key = 'Gym';

    return SPORT_INFO[key] || {
        name: sportName,
        image: '/images/jogging.png',
        icon: (className) => (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        ),
        desc: 'Aktivitas Kebugaran Terpersonalisasi',
        tag: 'Rekomendasi SPK',
        tagBg: 'bg-stone-50 text-stone-700 border-stone-200',
        longDesc: `Olahraga ${sportName} adalah aktivitas fisik yang dianalisis oleh sistem SPK kami berdasarkan kecocokan parameter tubuh dan tingkat kebugaran Anda.`,
        benefits: ['Meningkatkan kebugaran tubuh secara keseluruhan', 'Menjaga stamina dan daya tahan fisik', 'Melatih otot tubuh sesuai jenis gerakannya'],
        safety: 'Pastikan melakukan pemanasan yang cukup dan minum air mineral untuk menjaga hidrasi tubuh selama berolahraga.'
    };
};

function AnimatedCounter({ target, duration = 1800 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString('id-ID')}</span>;
}

export default function Index({ formData, histories = [], stats = {}, testimonials = [] }) {
    const { recommendations: recommendationsProp, auth, bmi: bmiProp, bmiCategory: bmiCategoryProp } = usePage().props;
    const [localRecommendations, setLocalRecommendations] = useState(recommendationsProp);
    const [localBmi, setLocalBmi] = useState(bmiProp);
    const [localBmiCategory, setLocalBmiCategory] = useState(bmiCategoryProp);

    const recommendations = localRecommendations;
    const bmi = localBmi;
    const bmiCategory = localBmiCategory;

    const { data, setData, post, processing, errors } = useForm({
        age: formData?.age || '',
        age_group: formData?.age_group || '19 to 25',
        gender: formData?.gender || 'Male',
        fitness_level: formData?.fitness_level || 'Good',
        exercise_frequency: formData?.exercise_frequency || '1 to 2 times a week',
        diet: formData?.diet || 'Not always',
        height: formData?.height || '',
        weight: formData?.weight || '',
        physical_condition: formData?.physical_condition || 'none',
    });

    const [initialFormLoaded, setInitialFormLoaded] = useState(false);

    useEffect(() => {
        if (recommendationsProp) {
            setLocalRecommendations(recommendationsProp);
            localStorage.setItem('optimove_recommendations', JSON.stringify(recommendationsProp));
        } else {
            const stored = localStorage.getItem('optimove_recommendations');
            if (stored) {
                try {
                    setLocalRecommendations(JSON.parse(stored));
                } catch (e) {}
            }
        }
    }, [recommendationsProp]);

    useEffect(() => {
        if (bmiProp) {
            setLocalBmi(bmiProp);
            localStorage.setItem('optimove_bmi', bmiProp);
        } else {
            const stored = localStorage.getItem('optimove_bmi');
            if (stored) setLocalBmi(Number(stored));
        }
    }, [bmiProp]);

    useEffect(() => {
        if (bmiCategoryProp) {
            setLocalBmiCategory(bmiCategoryProp);
            localStorage.setItem('optimove_bmi_category', bmiCategoryProp);
        } else {
            const stored = localStorage.getItem('optimove_bmi_category');
            if (stored) setLocalBmiCategory(stored);
        }
    }, [bmiCategoryProp]);

    useEffect(() => {
        if (formData) {
            localStorage.setItem('optimove_form_data', JSON.stringify(formData));
        } else if (!initialFormLoaded) {
            const storedForm = localStorage.getItem('optimove_form_data');
            if (storedForm) {
                try {
                    const parsed = JSON.parse(storedForm);
                    Object.entries(parsed).forEach(([key, val]) => {
                        setData(key, val || '');
                    });
                } catch (e) {}
            }
            setInitialFormLoaded(true);
        }
    }, [formData]);

    const formRef = useRef(null);
    const lang = 'id';

    const [ageWarning, setAgeWarning] = useState('');
    const [conditionInfo, setConditionInfo] = useState('');
    const [showHealthForm, setShowHealthForm] = useState(false);
    const [selectedSportDetail, setSelectedSportDetail] = useState(null);

    useEffect(() => {
        const ageVal = parseInt(data.age);
        if (ageVal) {
            let grp = '40 and above';
            if (ageVal <= 18) grp = '15 to 18';
            else if (ageVal <= 25) grp = '19 to 25';
            else if (ageVal <= 30) grp = '26 to 30';
            else if (ageVal <= 40) grp = '31 to 40';
            setData('age_group', grp);
        }
    }, [data.age]);

    useEffect(() => {
        const ageVal = parseInt(data.age);
        if (ageVal && (ageVal < 15 || ageVal > 60)) {
            setAgeWarning('⚠️ Perhatian: Metode SAW dioptimalkan untuk usia produktif (15 - 60 tahun). Rekomendasi di luar rentang ini mungkin kurang relevan.');
        } else {
            setAgeWarning('');
        }
    }, [data.age]);

    useEffect(() => {
        if (data.physical_condition === 'knee_injury') {
            setConditionInfo('💡 Cedera Lutut Terdeteksi: Sistem akan membatasi olahraga beban sendi tinggi (High-Impact) seperti Lari & Basket, serta menyarankan olahraga beban sendi rendah (Low-Impact) seperti Renang & Yoga.');
        } else if (data.physical_condition === 'asthma') {
            setConditionInfo('💡 Gangguan Asma Terdeteksi: Sistem akan menandai olahraga intensitas kardio tinggi dengan penanda peringatan, dan merekomendasikan olahraga bernapas stabil (Low-Impact) seperti Yoga atau Berjalan.');
        } else if (data.physical_condition === 'heart') {
            setConditionInfo('💡 Masalah Jantung Terdeteksi: Dianjurkan berkonsultasi dengan dokter. Sistem akan menyaring olahraga berintensitas tinggi (High-Impact).');
        } else {
            setConditionInfo('');
        }
    }, [data.physical_condition]);

    const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });

    const submit = (e) => {
        e.preventDefault();
        post(route('recommend'), {
            preserveScroll: true,
            onSuccess: () => {
                setTimeout(() => {
                    const resultEl = document.getElementById('hasil-analisis');
                    if (resultEl) {
                        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        formRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            },
        });
    };

    // Calculations for counter values
    const totalDataset = stats.total || 709;
    const totalSports = Object.keys(stats.top_sports || {}).length || 8;

    return (
        <div className="min-h-screen font-sans bg-canvas-ice text-adaline-ink selection:bg-forest-dew selection:text-valley-green">
            
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 border-b border-stone-moss/70 backdrop-blur-md bg-canvas-ice/85">
                <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-valley-green hover:opacity-85 transition">
                            <img src="/images/icon hijau.png" alt="Optimove" className="w-7 h-7 object-contain" />
                            Optimove
                        </Link>
                        <div className="hidden md:flex gap-8 text-sm font-medium">
                            <a href="#statistik" className="transition text-adaline-ink/75 hover:text-valley-green">
                                {lang === 'id' ? 'Statistik Dataset' : 'Dataset Statistics'}
                            </a>
                            <a href="#metodologi" className="transition text-adaline-ink/75 hover:text-valley-green">
                                {lang === 'id' ? 'Metodologi' : 'Methodology'}
                            </a>
                            <a href="#form" className="transition text-adaline-ink/75 hover:text-valley-green">
                                {lang === 'id' ? 'Mulai Analisis' : 'Start Analysis'}
                            </a>
                            <a href="#riwayat" className="transition text-adaline-ink/75 hover:text-valley-green">
                                {lang === 'id' ? 'Riwayat' : 'History'}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">

                        {auth?.user ? (
                            <>
                                {auth.user.role === 'admin' ? (
                                    <a href={route('admin.dashboard')} className="py-2.5 px-5 rounded-full text-xs font-bold transition hover:bg-valley-green hover:text-white border border-valley-green text-valley-green">
                                        {lang === 'id' ? 'Dashboard Admin' : 'Admin Dashboard'}
                                    </a>
                                ) : (
                                    <Link href={route('workspace.index')} className="py-2.5 px-5 rounded-full text-xs font-bold transition bg-forest-dew text-valley-green border border-valley-green/30 hover:bg-forest-dew/80">
                                        Personal Workspace
                                    </Link>
                                )}
                                <Link href={route('logout')} method="post" as="button" className="text-xs font-bold text-red-600 hover:text-red-800 transition">
                                    {lang === 'id' ? 'Logout' : 'Log Out'}
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={route('login')} className="py-2 px-4.5 rounded-full text-xs font-bold border border-stone-200 text-stone-600 hover:bg-stone-50 bg-white transition shadow-3xs">
                                    Login
                                </Link>
                                <button onClick={scrollToForm} className="py-2.5 px-6 rounded-full text-xs md:text-sm font-bold bg-valley-green text-white hover:opacity-90 transition flex items-center gap-1.5 shadow-sm">
                                    {lang === 'id' ? 'Mulai Analisis' : 'Start Analysis'} <span className="text-xs">→</span>
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden flex items-center pt-8 pb-16 lg:py-24" style={{ minHeight: '85vh' }}>
                <img src="/images/hero-bg.png" alt="Landscape background" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.15 }} />
                <div className="absolute inset-0 bg-gradient-to-b from-canvas-ice/30 via-canvas-ice/90 to-canvas-ice" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Hero Left Content */}
                        <div className="lg:col-span-6 flex flex-col items-start text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-valley-green/30 bg-forest-dew/40 text-valley-green mb-6">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                SPK Olahraga Berbasis SAW
                            </div>
                            
                            <h1 className="font-bold text-adaline-ink leading-tight tracking-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
                                Temukan Olahraga yang Paling Cocok untuk Anda
                            </h1>
                            
                            <p className="text-adaline-ink/70 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                                Sistem Pendukung Keputusan menggunakan metode Simple Additive Weighting (SAW) untuk memberikan rekomendasi olahraga terbaik berdasarkan profil tubuh dan kebiasaan Anda secara personal dan berbasis data.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-8">
                                <button onClick={scrollToForm} className="py-3.5 px-8 rounded-full font-bold text-sm bg-valley-green text-white hover:opacity-95 transition flex items-center gap-2 shadow-md">
                                    Mulai Analisis Sekarang <span>→</span>
                                </button>
                                <a href="#metodologi" className="py-3.5 px-8 rounded-full font-bold text-sm border border-stone-moss bg-white hover:bg-stone-50 transition text-valley-green">
                                    Lihat Cara Kerja
                                </a>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3 overflow-hidden">
                                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-canvas-ice object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User avatar" />
                                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-canvas-ice object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User avatar" />
                                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-canvas-ice object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User avatar" />
                                </div>
                                <div className="text-xs font-medium text-adaline-ink/65">
                                    <span className="font-bold text-adaline-ink">709+</span> Pengguna Telah Mencoba
                                </div>
                            </div>
                        </div>

                        {/* Hero Right Visual Mockup */}
                        <div className="lg:col-span-6 relative flex justify-center">
                            <div className="w-full max-w-[520px] rounded-3xl border border-stone-moss shadow-xl bg-white overflow-hidden flex flex-col aspect-[4/3] md:aspect-[16/11]">
                                {/* Top Bar mockup */}
                                <div className="bg-stone-50 border-b border-stone-200/60 px-4 py-2.5 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="mx-auto text-[10px] text-stone-400 font-mono">optimove-spk.saw/dashboard</div>
                                </div>
                                
                                <div className="flex-1 flex overflow-hidden">
                                    {/* Sidebar mockup */}
                                    <div className="w-[140px] md:w-[170px] bg-valley-green p-4 flex flex-col gap-4 text-white shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <img src="/images/icon hijau.png" alt="Optimove" className="w-6 h-6 object-contain" />
                                            <span className="font-bold text-xs md:text-sm tracking-tight text-forest-dew">OptiMove</span>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1.5 mt-2">
                                            <div className="px-2.5 py-1.5 rounded-lg bg-forest-dew/20 text-forest-dew text-[10px] md:text-xs font-semibold flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-forest-dew"></div>
                                                Dashboard
                                            </div>
                                            {['Analisis SAW', 'Riwayat', 'Rekomendasi', 'Profil', 'Pengaturan'].map((menu) => (
                                                <div key={menu} className="px-2.5 py-1.5 text-stone-300 text-[10px] md:text-xs hover:text-white transition cursor-default">
                                                    {menu}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Content mockup */}
                                    <div className="flex-1 p-4 md:p-6 bg-white overflow-y-auto flex flex-col gap-3">
                                        <div>
                                            <h4 className="font-bold text-xs md:text-sm text-adaline-ink">Hasil Analisis Anda</h4>
                                            <p className="text-[8px] md:text-[10px] text-stone-400 mt-0.5 leading-snug">Berdasarkan data profil yang Anda isi, berikut rekomendasi kecocokan olahraga:</p>
                                        </div>
                                        
                                        <div className="border border-stone-100 rounded-xl p-3 bg-stone-50/50 flex flex-col gap-2.5">
                                            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">Ranking Rekomendasi Olahraga</span>
                                            
                                            <div className="flex flex-col gap-2">
                                                {[
                                                    { rank: 1, name: 'Jogging', pct: 92, barW: '92%' },
                                                    { rank: 2, name: 'Bersepeda', pct: 80, barW: '80%' },
                                                    { rank: 3, name: 'Yoga', pct: 78, barW: '78%' },
                                                    { rank: 4, name: 'Renang', pct: 74, barW: '74%' },
                                                    { rank: 5, name: 'Gym / Fitness', pct: 60, barW: '60%' },
                                                ].map((sport) => (
                                                    <div key={sport.rank} className="flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded-full bg-forest-dew/40 text-valley-green font-bold text-[9px] flex items-center justify-center">{sport.rank}</span>
                                                        <span className="text-[10px] font-bold text-stone-700 w-16 truncate">{sport.name}</span>
                                                        <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: sport.barW }}></div>
                                                        </div>
                                                        <span className="text-[9px] font-mono font-bold text-emerald-600">{sport.pct}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Gauge Overlap mockup */}
                            <div className="absolute bottom-6 -right-2 md:-right-6 w-32 md:w-36 bg-white border border-stone-100 rounded-2xl shadow-xl p-4 flex flex-col items-center text-center animate-bounce" style={{ animationDuration: '6s' }}>
                                <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-stone-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="text-emerald-500" strokeDasharray="92, 100" strokeWidth="3.2" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="absolute font-mono text-xs md:text-sm font-black text-valley-green">92%</div>
                                </div>
                                <span className="text-[8px] md:text-[9px] font-bold text-stone-500 mt-2 block leading-none">Rekomendasi Terbaik</span>
                                <span className="text-[10px] md:text-xs font-black text-emerald-600 mt-0.5">Jogging</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* KENAPA MEMILIH OPTIMOVE SECTION */}
            <section className="py-20 bg-white border-y border-stone-200/50">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-adaline-ink tracking-tight mb-4">Kenapa Memilih Optimove?</h2>
                        <p className="text-adaline-ink/65 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            Sistem kami dirancang untuk memberikan rekomendasi olahraga paling akurat dan personal dengan mengedepankan transparansi data dan algoritma ilmiah.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: 'Cepat & Akurat',
                                desc: 'Hasil analisis dalam hitungan detik menggunakan algoritma perhitungan SAW yang terpercaya.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Personal & Tepat',
                                desc: 'Rekomendasi disesuaikan dengan kondisi tubuh, usia, dan kebiasaan harian Anda secara spesifik.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Berbasis Data',
                                desc: 'Didukung dengan 709+ data responden fitness riil dan 5 kriteria penilaian keputusan ilmiah.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                                        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Aman & Terpercaya',
                                desc: 'Data Anda dijamin aman dan hanya digunakan untuk menghitung hasil rekomendasi kebugaran.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                )
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-canvas-ice/30 rounded-2xl border border-stone-200/50 hover:shadow-md transition duration-300">
                                <div className="w-12 h-12 rounded-full bg-valley-green flex items-center justify-center mb-5 shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg text-valley-green mb-3">{item.title}</h3>
                                <p className="text-adaline-ink/65 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATISTICS COUNTER BAR */}
            <section className="py-10 bg-canvas-ice">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="bg-forest-dew/40 border border-valley-green/20 rounded-3xl p-8 md:p-10 shadow-sm">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-valley-green/10">
                            {[
                                { val: totalDataset, suffix: '+', lbl: 'Total Responden', icon: (
                                    <svg className="w-5 h-5 text-valley-green mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                )},
                                { val: totalSports, suffix: '+', lbl: 'Jenis Olahraga', icon: (
                                    <svg className="w-5 h-5 text-valley-green mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.5M10.4 21t-1.75-.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )},
                                { val: 5, suffix: '', lbl: 'Kriteria Penilaian', icon: (
                                    <svg className="w-5 h-5 text-valley-green mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                )},
                                { val: 92, suffix: '%', lbl: 'Akurasi Rekomendasi', icon: (
                                    <svg className="w-5 h-5 text-valley-green mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )},
                            ].map((item, idx) => (
                                <div key={idx} className={`flex flex-col items-center justify-center text-center ${idx > 0 ? 'pt-6 lg:pt-0 lg:pl-6' : ''}`}>
                                    <div className="flex items-center text-4xl font-extrabold text-valley-green tracking-tight mb-2">
                                        {item.icon}
                                        <AnimatedCounter target={item.val} />{item.suffix}
                                    </div>
                                    <span className="text-xs font-semibold text-adaline-ink/60 uppercase tracking-widest">{item.lbl}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* BAGAIMANA SISTEM BEKERJA SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-adaline-ink tracking-tight mb-4">Bagaimana Sistem Bekerja?</h2>
                        <p className="text-adaline-ink/65 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            3 langkah mudah untuk mendapatkan rekomendasi olahraga terbaik yang paling sesuai profil Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto relative">
                        {/* Connecting lines for large screens */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1.5px] bg-stone-200 z-0"></div>
                        
                        {[
                            {
                                step: 'Isi Profil Anda',
                                desc: 'Masukkan data diri, kebiasaan olahraga, dan kondisi tubuh Anda pada formulir analisis.',
                                icon: (
                                    <svg className="w-6 h-6 text-valley-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
                                    </svg>
                                )
                            },
                            {
                                step: 'Sistem Menganalisis',
                                desc: 'Metode SAW melakukan perhitungan dengan mencocokkan profil Anda ke database menggunakan 5 kriteria.',
                                icon: (
                                    <svg className="w-6 h-6 text-valley-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="20" x2="18" y2="10" />
                                        <line x1="12" y1="20" x2="12" y2="4" />
                                        <line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                )
                            },
                            {
                                step: 'Dapatkan Rekomendasi',
                                desc: 'Sistem menampilkan peringkat hasil rekomendasi olahraga lengkap beserta persentase kecocokannya.',
                                icon: (
                                    <svg className="w-6 h-6 text-valley-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="7" />
                                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                    </svg>
                                )
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-white px-4">
                                <div className="w-14 h-14 rounded-2xl bg-forest-dew flex items-center justify-center mb-6 shadow-sm border border-valley-green/10">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg text-valley-green mb-2">{item.step}</h3>
                                <p className="text-adaline-ink/65 text-sm leading-relaxed max-w-[260px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE FORM + RESULTS SECTION */}
            <section id="form" ref={formRef} className="py-24 bg-canvas-ice border-t border-stone-200/40">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-adaline-ink tracking-tight mb-4">Siap Memulai Gaya Hidup Sehat?</h2>
                        <p className="text-adaline-ink/65 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            Analisis sekarang dan temukan olahraga terbaik untuk Anda berdasarkan perhitungan SPK SAW!
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-start">
                        
                        {/* Form Card (Left Column) */}
                        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md">
                            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-stone-100">
                                <div className="w-10 h-10 rounded-full bg-forest-dew flex items-center justify-center text-valley-green shadow-xs">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-adaline-ink">Masukkan Data Profil Anda</h3>
                                    <p className="text-xs text-stone-400">Pilih kriteria untuk menyesuaikan perhitungan SAW</p>
                                </div>
                            </div>
                            
                            <form onSubmit={submit} className="space-y-5">
                                {/* Jenis Kelamin */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-adaline-ink/90">Jenis Kelamin</label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-dew/60 text-valley-green">Bobot 10%</span>
                                    </div>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border border-stone-200 focus:border-valley-green focus:ring-1 focus:ring-valley-green bg-white text-adaline-ink outline-none transition">
                                        <option value="Male">Laki-laki</option>
                                        <option value="Female">Perempuan</option>
                                    </select>
                                    {errors.gender && <div className="text-red-500 text-xs mt-1">{errors.gender}</div>}
                                </div>

                                {/* Rentang Usia */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-adaline-ink/90">Rentang Usia</label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-dew/60 text-valley-green">Bobot 15%</span>
                                    </div>
                                    <select value={data.age_group} onChange={e => setData('age_group', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border border-stone-200 focus:border-valley-green focus:ring-1 focus:ring-valley-green bg-white text-adaline-ink outline-none transition">
                                        <option value="15 to 18">15–18 tahun</option>
                                        <option value="19 to 25">19–25 tahun</option>
                                        <option value="26 to 30">26–30 tahun</option>
                                        <option value="31 to 40">31–40 tahun</option>
                                        <option value="40 and above">40+ tahun</option>
                                    </select>
                                    {errors.age_group && <div className="text-red-500 text-xs mt-1">{errors.age_group}</div>}
                                </div>

                                {/* Tingkat Kebugaran */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-adaline-ink/90">Tingkat Kebugaran</label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-dew/60 text-valley-green">Bobot 35%</span>
                                    </div>
                                    <select value={data.fitness_level} onChange={e => setData('fitness_level', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border border-stone-200 focus:border-valley-green focus:ring-1 focus:ring-valley-green bg-white text-adaline-ink outline-none transition">
                                        <option value="Unfit">Tidak Bugar</option>
                                        <option value="Average">Rata-rata</option>
                                        <option value="Good">Bugar</option>
                                        <option value="Very good">Sangat Bugar</option>
                                        <option value="Excellent">Prima</option>
                                    </select>
                                    {errors.fitness_level && <div className="text-red-500 text-xs mt-1">{errors.fitness_level}</div>}
                                </div>

                                {/* Frekuensi Olahraga */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-adaline-ink/90">Frekuensi Olahraga</label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-dew/60 text-valley-green">Bobot 20%</span>
                                    </div>
                                    <select value={data.exercise_frequency} onChange={e => setData('exercise_frequency', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border border-stone-200 focus:border-valley-green focus:ring-1 focus:ring-valley-green bg-white text-adaline-ink outline-none transition">
                                        <option value="Never">Tidak Pernah</option>
                                        <option value="1 to 2 times a week">1–2x seminggu</option>
                                        <option value="3 to 4 times a week">3–4x seminggu</option>
                                        <option value="Everyday">Setiap Hari</option>
                                    </select>
                                    {errors.exercise_frequency && <div className="text-red-500 text-xs mt-1">{errors.exercise_frequency}</div>}
                                </div>

                                {/* Pola Makan Sehat */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-adaline-ink/90">Pola Makan Sehat</label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-dew/60 text-valley-green">Bobot 20%</span>
                                    </div>
                                    <select value={data.diet} onChange={e => setData('diet', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border border-stone-200 focus:border-valley-green focus:ring-1 focus:ring-valley-green bg-white text-adaline-ink outline-none transition">
                                        <option value="No">Tidak</option>
                                        <option value="Not always">Kadang-kadang</option>
                                        <option value="Yes">Ya, Selalu</option>
                                    </select>
                                    {errors.diet && <div className="text-red-500 text-xs mt-1">{errors.diet}</div>}
                                </div>

                                {/* Collapsible Optional Section for BMI & Health */}
                                <div className="border border-stone-200/70 rounded-2xl overflow-hidden transition-all bg-stone-50/50">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowHealthForm(!showHealthForm)}
                                        className="w-full px-4 py-3 text-left font-bold text-xs flex justify-between items-center text-valley-green hover:bg-stone-100/60 transition">
                                        <span className="flex items-center gap-1.5">
                                            🩺 Tambah Detail Kesehatan & BMI (Opsional)
                                        </span>
                                        <span>{showHealthForm ? '▼' : '►'}</span>
                                    </button>
                                    
                                    {showHealthForm && (
                                        <div className="p-4 border-t border-stone-200/70 bg-white space-y-4 animate-fade-in">
                                            {/* Exact Age */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500">Usia Angka (Tahun)</label>
                                                <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} min="5" max="100" placeholder="Masukkan angka usia (opsional)..."
                                                    className="w-full rounded-xl text-xs py-2.5 px-3 border border-stone-200 focus:border-valley-green outline-none transition text-adaline-ink" />
                                                {ageWarning && <p className="text-[10px] text-amber-800 font-semibold mt-1">{ageWarning}</p>}
                                                {errors.age && <div className="text-red-500 text-[10px] mt-1">{errors.age}</div>}
                                            </div>

                                            {/* Height & Weight */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-stone-500">Tinggi Badan (cm)</label>
                                                    <input type="number" value={data.height} onChange={e => setData('height', e.target.value)} min="50" max="250" placeholder="cm"
                                                        className="w-full rounded-xl text-xs py-2.5 px-3 border border-stone-200 focus:border-valley-green outline-none transition text-adaline-ink" />
                                                    {errors.height && <div className="text-red-500 text-[10px] mt-1">{errors.height}</div>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-stone-500">Berat Badan (kg)</label>
                                                    <input type="number" value={data.weight} onChange={e => setData('weight', e.target.value)} min="10" max="300" placeholder="kg"
                                                        className="w-full rounded-xl text-xs py-2.5 px-3 border border-stone-200 focus:border-valley-green outline-none transition text-adaline-ink" />
                                                    {errors.weight && <div className="text-red-500 text-[10px] mt-1">{errors.weight}</div>}
                                                </div>
                                            </div>

                                            {/* Physical Condition */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500">Kondisi Fisik / Batasan</label>
                                                <select value={data.physical_condition} onChange={e => setData('physical_condition', e.target.value)}
                                                    className="w-full rounded-xl text-xs py-2.5 px-3 border border-stone-200 focus:border-valley-green outline-none bg-white text-adaline-ink transition">
                                                    <option value="none">Tidak Ada Batasan (Fit)</option>
                                                    <option value="knee_injury">Cedera Lutut</option>
                                                    <option value="asthma">Gangguan Asma</option>
                                                    <option value="heart">Masalah Jantung</option>
                                                </select>
                                                {conditionInfo && <p className="text-[10px] text-valley-green font-mono leading-relaxed mt-1">{conditionInfo}</p>}
                                                {errors.physical_condition && <div className="text-red-500 text-[10px] mt-1">{errors.physical_condition}</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full py-4 rounded-full font-bold text-sm bg-valley-green hover:opacity-90 text-white transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-55">
                                    {processing ? 'Menghitung Skor SAW...' : (
                                        <>
                                            Proses Analisis SAW <span>→</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Result Card (Right Column) */}
                        <div id="hasil-analisis" className="lg:col-span-6">
                            {recommendations ? (
                                <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md space-y-6 animate-fade-in">
                                    
                                    {/* Header */}
                                    <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                                        <div className="w-10 h-10 rounded-full bg-forest-dew flex items-center justify-center text-valley-green shadow-xs">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4l-2 3h-2zm0 0H8l2 3h2zm0 10v-6m-4 6H5a2 2 0 01-2-2v-6a2 2 0 012-2h3m8 10h3a2 2 0 002-2v-6a2 2 0 00-2-2h-3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-adaline-ink">Hasil Peringkat SAW</h3>
                                            <p className="text-xs text-stone-400">Skor dinormalisasi relatif ke rentang 40% – 100%</p>
                                        </div>
                                    </div>

                                    {/* BMI Display */}
                                    {bmi && (
                                        <div className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs">
                                            <div>
                                                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Kalkulasi Indeks Massa Tubuh (BMI)</span>
                                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                                    <span className="text-xl font-extrabold text-adaline-ink">{bmi}</span>
                                                    <span className="text-stone-500 font-medium">Normal: 18.5 - 24.9</span>
                                                </div>
                                            </div>
                                            <span className="px-3.5 py-1 rounded-full font-bold bg-forest-dew text-valley-green border border-valley-green/10">
                                                {bmiCategory || 'Normal'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Recommendations List */}
                                    <div className="space-y-3.5">
                                        {recommendations.map((item) => {
                                            const info = getSportInfo(item.sport);
                                            return (
                                                <div key={item.rank} className={`flex flex-col p-4 rounded-2xl border transition-all ${
                                                    item.warning ? 'bg-amber-50/20 border-amber-200' : 'bg-white border-stone-200/80 hover:border-valley-green/30'
                                                }`}>
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 bg-valley-green text-white">
                                                            {item.rank}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm text-adaline-ink truncate flex items-center gap-2">
                                                                <span>{info.name}</span>
                                                                {item.low_impact && (
                                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                        Low-Impact
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-stone-400 block truncate mt-0.5">{info.desc}</span>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <span className="text-xs font-mono font-bold text-valley-green">{item.score}%</span>
                                                            <div className="w-16 md:w-24 h-1.5 rounded-full bg-stone-100 overflow-hidden mt-1">
                                                                <div className="h-full bg-emerald-500" style={{ width: `${item.score}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Warning banner inside item */}
                                                    {item.warning && (
                                                        <div className="mt-2.5 p-2 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-[10px] text-amber-900 leading-snug">
                                                            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">!</span>
                                                            <p>Beban tinggi: Kurang direkomendasikan untuk kondisi fisik cedera/pernapasan Anda saat ini.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Top Recommendation Accent Card */}
                                    {recommendations.length > 0 && (
                                        <div className="bg-valley-green text-white rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-md">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-forest-dew text-valley-green flex items-center justify-center shrink-0">
                                                    {getSportInfo(recommendations[0].sport).icon("w-6 h-6")}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-dew">Rekomendasi Utama</span>
                                                    <div className="text-base font-extrabold flex items-baseline gap-1.5 mt-0.5">
                                                        <span>{getSportInfo(recommendations[0].sport).name}</span>
                                                        <span className="text-xs font-mono font-medium text-forest-dew/90">({recommendations[0].score}%)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => setSelectedSportDetail(getSportInfo(recommendations[0].sport))}
                                                className="py-2 px-4 rounded-full bg-white hover:bg-stone-50 text-valley-green text-xs font-bold transition shadow-xs">
                                                Lihat Detail
                                            </button>
                                        </div>
                                    )}

                                    {/* Workspace Prompt */}
                                    <div className="pt-4 border-t border-stone-100 flex flex-col items-center text-center">
                                        <h4 className="font-bold text-xs text-adaline-ink mb-1">Simpan Rencana Olahraga & Rutin Berlatih!</h4>
                                        <p className="text-[11px] text-stone-400 max-w-sm mb-4 leading-normal">
                                            Simpan data kebugaran ini untuk generate to-do list harian dan pelacakan perkembangan Anda di Personal Workspace.
                                        </p>
                                        {auth?.user ? (
                                            <Link href={route('workspace.index')} className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-center bg-forest-dew text-valley-green hover:bg-forest-dew/80 transition border border-valley-green/10">
                                                Buka Personal Workspace Anda ↗
                                            </Link>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                                <Link href={route('register')} className="py-2.5 px-3 rounded-full text-xs font-bold text-center bg-valley-green text-white hover:opacity-90 transition">
                                                    Daftar Akun Baru
                                                </Link>
                                                <Link href={route('login')} className="py-2.5 px-3 rounded-full text-xs font-bold text-center border border-stone-200 hover:bg-stone-50 transition text-adaline-ink bg-white">
                                                    Login Masuk
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    
                                </div>
                            ) : (
                                <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-10 flex flex-col items-center text-center min-h-[380px] justify-center">
                                    <div className="w-12 h-12 rounded-full border border-stone-200 mb-4 flex items-center justify-center text-stone-300 font-bold text-lg bg-stone-50">?</div>
                                    <h3 className="font-bold text-base text-adaline-ink mb-1.5">Hasil Analisis Muncul di Sini</h3>
                                    <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                                        Isi kriteria data tubuh Anda di samping kemudian klik "Proses Analisis SAW" untuk menghitung kecocokan olahraga terbaik.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* DETAIL OLAHRAGA MODAL */}
            {selectedSportDetail && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-[560px] border border-stone-200 shadow-2xl overflow-hidden animate-slide-up">
                        <div className="relative h-44 bg-valley-green flex items-center p-6 text-white">
                            <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" src={selectedSportDetail.image} alt={selectedSportDetail.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-valley-green via-valley-green/80 to-transparent" />
                            
                            <div className="relative z-10 flex items-center gap-4 mt-auto">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    {selectedSportDetail.icon("w-7 h-7 text-forest-dew")}
                                </div>
                                <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedSportDetail.tagBg} border-white/20 bg-white/10 text-white`}>
                                        {selectedSportDetail.tag}
                                    </span>
                                    <h3 className="text-2xl font-extrabold tracking-tight mt-1">{selectedSportDetail.name}</h3>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedSportDetail(null)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white font-bold flex items-center justify-center transition border border-white/10 text-sm">
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-2">Tentang Olahraga</h4>
                                <p className="text-sm text-adaline-ink/80 leading-relaxed">{selectedSportDetail.longDesc}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-3">Manfaat Utama</h4>
                                <ul className="space-y-2">
                                    {selectedSportDetail.benefits.map((b, i) => (
                                        <li key={i} className="text-sm text-adaline-ink/85 flex items-start gap-2">
                                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-forest-dew/20 border border-valley-green/10">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-valley-green mb-1.5">Panduan Keselamatan & Tips</h4>
                                <p className="text-xs text-adaline-ink/80 leading-relaxed">{selectedSportDetail.safety}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
                            <button 
                                onClick={() => setSelectedSportDetail(null)}
                                className="py-2.5 px-6 rounded-full text-xs font-bold bg-valley-green hover:opacity-90 text-white transition">
                                Tutup Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* POPULAR SPORTS SECTION */}
            <section className="py-24 bg-white border-t border-stone-100">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-adaline-ink tracking-tight mb-4">Rekomendasi Olahraga Populer untuk Anda</h2>
                        <p className="text-adaline-ink/65 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            Temukan berbagai jenis aktivitas fisik terpopuler yang didukung dalam perhitungan dataset kami.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {Object.entries(SPORT_INFO).map(([key, info]) => (
                            <div key={key} className="bg-canvas-ice/30 border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 flex flex-col group">
                                <div className="h-32 bg-stone-100 overflow-hidden relative">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={info.image} alt={info.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-3 left-3 w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                        {info.icon("w-4 h-4")}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                                    <div>
                                        <h3 className="font-extrabold text-sm text-valley-green mb-1">{info.name}</h3>
                                        <p className="text-[11px] text-stone-400 leading-normal line-clamp-3">{info.longDesc}</p>
                                    </div>
                                    <div>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-extrabold border uppercase tracking-wider ${info.tagBg}`}>
                                            {info.tag}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* METODOLOGI SECTION */}
            <section id="metodologi" className="py-24 bg-forest-dew/10 border-t border-stone-200/30">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-widest text-valley-green bg-forest-dew/50 px-3 py-1 rounded-full mb-3 inline-block">Metodologi SPK</span>
                        <h2 className="text-3xl font-bold tracking-tight text-adaline-ink">Tabel Bobot Kriteria SAW</h2>
                        <p className="text-xs text-stone-400 mt-2">Kombinasi pembobotan total 100% (1.00) yang digunakan dalam perhitungan normalisasi</p>
                    </div>

                    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-xs md:text-sm">
                            <thead>
                                <tr className="bg-valley-green text-white text-left font-bold border-b border-stone-200">
                                    <th className="px-5 py-4 w-12 text-center">No.</th>
                                    <th className="px-5 py-4">Kriteria Keputusan</th>
                                    <th className="px-5 py-4">Skala Pengukuran</th>
                                    <th className="px-5 py-4">Jenis</th>
                                    <th className="px-5 py-4 text-right">Persentase</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { no: 1, name: 'Tingkat Kebugaran', scale: 'Ordinal (5 Level)', type: 'Benefit', pct: '35%' },
                                    { no: 2, name: 'Rentang Usia', scale: 'Ordinal (5 Rentang)', type: 'Benefit', pct: '15%' },
                                    { no: 3, name: 'Frekuensi Olahraga', scale: 'Ordinal (4 Level)', type: 'Benefit', pct: '20%' },
                                    { no: 4, name: 'Jenis Kelamin', scale: 'Nominal (Biner)', type: 'Benefit', pct: '10%' },
                                    { no: 5, name: 'Pola Makan Sehat', scale: 'Ordinal (3 Level)', type: 'Benefit', pct: '20%' },
                                ].map((row, i) => (
                                    <tr key={row.no} className={`border-b border-stone-100 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}>
                                        <td className="px-5 py-3 text-center font-mono text-stone-400">{row.no}</td>
                                        <td className="px-5 py-3 font-bold text-valley-green">{row.name}</td>
                                        <td className="px-5 py-3 text-stone-500">{row.scale}</td>
                                        <td className="px-5 py-3">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-forest-dew/40 text-valley-green border border-valley-green/10">
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right font-bold text-adaline-ink">{row.pct}</td>
                                    </tr>
                                ))}
                                <tr className="bg-stone-50 font-bold border-t border-stone-200">
                                    <td colSpan={4} className="px-5 py-4 text-right text-stone-500 uppercase tracking-wider text-[10px]">Total Pembobotan</td>
                                    <td className="px-5 py-4 text-right text-valley-green text-base">100%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-24 bg-[#0B2C16] text-white overflow-hidden relative">
                {/* Background graphic */}
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-forest-dew opacity-[0.03] rounded-full blur-3xl"></div>
                <div className="absolute left-0 top-0 w-80 h-80 bg-forest-dew opacity-[0.03] rounded-full blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Testimonial Left Info */}
                        <div className="lg:col-span-4 space-y-4">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-forest-dew border border-forest-dew/30 bg-forest-dew/10 px-3 py-1 rounded-full">Testimoni</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dipercaya oleh Ratusan Pengguna</h2>
                            <p className="text-stone-300 text-sm leading-relaxed max-w-sm">
                                Pengalaman nyata dari pengguna yang telah merasakan manfaat rekomendasi aktivitas fisik yang akurat dari Optimove.
                            </p>
                        </div>
                        
                        {/* Testimonial Cards Right */}
                        <div className="lg:col-span-8">
                            {testimonials.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                                    <span className="text-3xl mb-3">💬</span>
                                    <h4 className="font-bold text-base text-forest-dew">Jadilah yang pertama memberikan testimoni!</h4>
                                    <p className="text-xs text-stone-300 max-w-sm mt-2 leading-relaxed">
                                        Bagikan pengalaman nyata Anda setelah menggunakan Optimove melalui Personal Workspace untuk memotivasi pengguna lain.
                                    </p>
                                    {auth?.user && (
                                        <Link href={route('workspace.index')} className="mt-4 py-2.5 px-6 rounded-full text-xs font-bold bg-valley-green text-white hover:opacity-90 transition">
                                            Kirim Testimoni Saya
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {testimonials.slice(0, 3).map((testi) => (
                                        <div key={testi.id} className="bg-white text-adaline-ink p-5 rounded-2xl shadow-lg border border-white/10 flex flex-col justify-between gap-5 relative hover:-translate-y-1 transition duration-300">
                                            <div className="absolute top-4 right-4 text-emerald-500/20 text-4xl font-serif">“</div>
                                            <div className="relative z-10 space-y-2">
                                                <div className="flex gap-0.5 text-amber-500 text-xs font-bold">
                                                    {Array.from({ length: testi.rating }).map((_, i) => '★')}
                                                    {Array.from({ length: 5 - testi.rating }).map((_, i) => '☆')}
                                                </div>
                                                <p className="text-xs text-stone-500 leading-relaxed font-medium">
                                                    "{testi.content}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 border-t border-stone-100 pt-3">
                                                <img 
                                                    className="w-8 h-8 rounded-full object-cover shrink-0" 
                                                    src={testi.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testi.user?.name || 'User')}&color=166534&background=f0fdf4`} 
                                                    alt={testi.user?.name || 'User'} 
                                                />
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-xs text-valley-green truncate">{testi.user?.name || 'Pengguna'}</h4>
                                                    <span className="text-[10px] text-stone-400 block truncate">Pengguna Terverifikasi</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#0A1D08] py-16 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
                        <div className="md:col-span-6 space-y-4">
                            <h3 className="text-xl font-bold tracking-tight text-forest-dew">Optimove</h3>
                            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                                Sistem Pendukung Keputusan pemilihan cabang olahraga terbaik menggunakan metode pembobotan akademis Simple Additive Weighting (SAW) berdasarkan dataset riil.
                            </p>
                        </div>
                        <div className="md:col-span-3 space-y-3.5">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-300">Akses Cepat</h4>
                            <div className="flex flex-col gap-2.5 text-xs text-stone-400">
                                <a href="#statistik" className="hover:text-forest-dew transition">Statistik Data</a>
                                <a href="#metodologi" className="hover:text-forest-dew transition">Metodologi SAW</a>
                                <a href="#form" className="hover:text-forest-dew transition">Mulai Rekomendasi</a>
                                <a href="#riwayat" className="hover:text-forest-dew transition">Histori Kalkulasi</a>
                            </div>
                        </div>
                        <div className="md:col-span-3 space-y-3.5">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-300">Ikuti Kami</h4>
                            <div className="flex gap-4">
                                {['X', 'Instagram', 'YouTube', 'LinkedIn'].map((soc) => (
                                    <span key={soc} className="w-8 h-8 rounded-full border border-white/10 hover:border-forest-dew hover:text-forest-dew transition cursor-pointer flex items-center justify-center text-xs font-bold text-stone-400">
                                        {soc[0]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
                        <div>
                            © 2026 Optimove · Sistem Pendukung Keputusan · Hak Cipta Dilindungi.
                        </div>
                        {auth?.user?.role === 'admin' && (
                            <div className="flex items-center gap-2">
                                <Link href={route('admin.dashboard')} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-stone-400 hover:border-forest-dew hover:text-forest-dew transition uppercase text-[9px] font-bold">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Halaman Admin
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </footer>
            
        </div>
    );
}
