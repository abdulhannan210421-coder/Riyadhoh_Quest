// ==========================================
// RIYADHOH QUEST - ULTIMATE GAME ENGINE (app.js)
// ==========================================

// --- 1. WEB AUDIO SYNTHESIZER ENGINE ---
class GameAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playTap() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playReward() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }

    playLevelUp() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.12);
        osc.frequency.setValueAtTime(659.25, now + 0.24);
        osc.frequency.setValueAtTime(880, now + 0.36);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
    }
}

const audioFx = new GameAudioEngine();

function toggleAudio() {
    audioFx.isMuted = !audioFx.isMuted;
    const icon = document.getElementById('audioIcon');
    if (icon) {
        icon.className = audioFx.isMuted
            ? 'fa-solid fa-volume-xmark text-rose-400'
            : 'fa-solid fa-volume-high text-emerald-400';
    }
}

// --- SYSTEM TOAST NOTIFICATION ENGINE ---
function showGameToast(title, message, type = 'emerald') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const colorMap = {
        emerald: { border: 'border-emerald-500/80', bg: 'bg-emerald-950/90', text: 'text-emerald-300', icon: 'fa-shield-halved' },
        amber: { border: 'border-amber-500/80', bg: 'bg-amber-950/90', text: 'text-amber-300', icon: 'fa-coins' },
        purple: { border: 'border-purple-500/80', bg: 'bg-purple-950/90', text: 'text-purple-300', icon: 'fa-gem' },
        rose: { border: 'border-rose-500/80', bg: 'bg-rose-950/90', text: 'text-rose-300', icon: 'fa-triangle-exclamation' },
        sky: { border: 'border-sky-500/80', bg: 'bg-sky-950/90', text: 'text-sky-300', icon: 'fa-ghost' },
        gold: { border: 'border-amber-400', bg: 'bg-slate-950/95', text: 'text-amber-300', icon: 'fa-crown' }
    };

    const style = colorMap[type] || colorMap.emerald;

    const toast = document.createElement('div');
    toast.className = `toast-anim pointer-events-auto p-3.5 rounded-2xl border ${style.border} ${style.bg} backdrop-blur-xl shadow-2xl flex items-start gap-3`;
    
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${style.text} shrink-0 mt-0.5">
            <i class="fa-solid ${style.icon} text-sm"></i>
        </div>
        <div class="flex-1 space-y-0.5">
            <h4 class="font-black text-xs ${style.text}">${title}</h4>
            <p class="text-[11px] text-slate-200 leading-snug">${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white text-xs"><i class="fa-solid fa-xmark"></i></button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentElement) {
            toast.remove();
        }
    }, 4000);
}

function promptResetGame() {
    const modal = document.getElementById('customConfirmModal');
    if (!modal) return;

    document.getElementById('confirmModalTitle').innerText = 'Reset Progress Monark';
    document.getElementById('confirmModalMsg').innerText = 'Apakah kamu yakin ingin mereset seluruh statistik dan data game dari awal?';

    const actionBtn = document.getElementById('confirmModalActionBtn');
    actionBtn.onclick = function() {
        playerState = JSON.parse(JSON.stringify(DEFAULT_PLAYER_STATE));
        savePlayerData();
        hideModal('customConfirmModal');
        showGameToast('SISTEM RESET', 'Seluruh data Monark berhasil direset ke kondisi awal.', 'rose');
    };

    showModal('customConfirmModal');
}

// --- 2. GAME STATE DEFAULT CONFIGURATION ---
const DEFAULT_PLAYER_STATE = {
    username: 'Pejuang Subuh',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    level: 1,
    xp: 0,
    xpToNextLevel: 250,
    mp: 100,
    maxMp: 100,
    rank: 'E-RANK',
    title: 'Monark Subuh Pemula',
    playerClass: 'Subuh Initiate',
    coins: 100,
    gems: 5,
    streak: 1,
    dailyClaimed: false,

    statPoints: 0,
    stats: {
        taqwa: 10,
        khusyu: 10,
        istiqamah: 10,
        ikhlas: 10
    },

    shadows: [],

    equippedGear: {
        weapon: null,
        tasbih: null,
        sajadah: null
    },

    mainQuests: [
        { id: 'mq1', title: 'Salat Subuh Berjamaah', time: '04.30 WIB', xp: 60, coins: 20, completed: false },
        { id: 'mq2', title: 'Salat Dzuhur', time: '12.00 WIB', xp: 50, coins: 15, completed: false },
        { id: 'mq3', title: 'Salat Ashar', time: '15.15 WIB', xp: 50, coins: 15, completed: false },
        { id: 'mq4', title: 'Salat Maghrib & Zikir Petang', time: '18.00 WIB', xp: 55, coins: 15, completed: false },
        { id: 'mq5', title: 'Salat Isya Berjamaah', time: '19.15 WIB', xp: 50, coins: 15, completed: false }
    ],
    bonusQuests: [
        { id: 'bq1', title: 'Salat Tahajud 2 Rakaat', time: 'Sepertiga Malam', xp: 100, coins: 35, completed: false },
        { id: 'bq2', title: 'Salat Dhuha 4 Rakaat', time: 'Pagi Hari', xp: 70, coins: 20, completed: false },
        { id: 'bq3', title: "Tilawah Al-Qur'an 1 Juz / Halaman", time: 'Bebas', xp: 80, coins: 25, completed: false },
        { id: 'bq4', title: 'Sedekah Subuh / Berbuat Baik', time: 'Pagi Hari', xp: 65, coins: 20, completed: false }
    ],

    unlockedBuildings: ['sajadah'],

    totalZikr: 0,
    zikrCount: 0,
    zikrTarget: 33,
    zikrPhrase: 'Subhanallah',

    bossHp: 500,
    bossMaxHp: 500,
    journalNotes: ''
};

const SHOP_ITEMS = [
    { id: 'sajadah', name: 'Area Sajadah Utama', desc: 'Alas suci tempat bersujud khusyu.', cost: 0, img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=400&q=80' },
    { id: 'wudhu', name: 'Air Mancur Wudhu Jernih', desc: 'Pengalir kesucian sebelum menghadap Ilahi.', cost: 50, img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=400&q=80' },
    { id: 'taman', name: 'Taman Bunga Surga', desc: 'Pepohonan rindang peneduh halaman masjid.', cost: 100, img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80' },
    { id: 'menara', name: 'Menara Masjid Tinggi', desc: 'Tempat mengumandangkan azan ke angkasa.', cost: 200, img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80' },
    { id: 'kubah', name: 'Kubah Emas Megah', desc: 'Keagungan simbol keindahan Islam.', cost: 350, img: 'https://images.unsplash.com/photo-1590076215667-873d96c89137?auto=format&fit=crop&w=400&q=80' },
    { id: 'perpustakaan', name: 'Perpustakaan Kitab', desc: 'Gudang ilmu syariat dan hikmah ulama.', cost: 500, img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80' },
    { id: 'lampu', name: 'Lampu Kaligrafi Malam', desc: 'Seni pencahayaan bernuansa keindahan spiritual.', cost: 750, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
    { id: 'gerbang', name: 'Gerbang Utama Andalusia', desc: 'Simbol kejayaan peradaban keilmuan Islam.', cost: 1000, img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80' }
];

const SAGA_GATES = [
    { id: 'gate_e', rank: 'E-RANK GATE', name: 'Gate Lembah Fajr', desc: 'Zona awal penaklukan rasa malas tidur di waktu Subuh.', img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80', minLevel: 1 },
    { id: 'gate_d', rank: 'D-RANK GATE', name: 'Gate Oasis Tilawah', desc: "Membasahi lisan dengan zikir harian dan Al-Qur'an.", img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80', minLevel: 3 },
    { id: 'gate_c', rank: 'C-RANK GATE', name: 'Gate Keheningan Tahajud', desc: 'Menembus sepertiga malam terakhir menghadap Sang Pencipta.', img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80', minLevel: 5 },
    { id: 'gate_b', rank: 'B-RANK GATE', name: 'Gate Benteng Dermawan', desc: 'Ujian kepedulian sosial, sedekah subuh, dan zakat.', img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80', minLevel: 8 },
    { id: 'gate_s', rank: 'S-RANK GATE', name: 'Gate Monark Istiqamah', desc: 'Puncak kedisiplinan spiritual tanpa goyah dalam kondisi apa pun.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80', minLevel: 12 }
];

const INVENTORY_ITEMS = [
    { id: 'mushaf', slot: 'weapon', name: "Mushaf Al-Qur'an Emas", bonusStat: 'taqwa', bonusValue: 5, desc: 'Bonus +5 Taqwa & Damage Tilawah.', icon: 'fa-book-quran', color: 'text-emerald-400' },
    { id: 'tasbih_kayu', slot: 'tasbih', name: 'Tasbih Kayu Cendana', bonusStat: 'khusyu', bonusValue: 5, desc: 'Bonus +5 Khusyu & +10% Mana Regen.', icon: 'fa-hands-praying', color: 'text-amber-400' },
    { id: 'sajadah_sutra', slot: 'sajadah', name: 'Sajadah Sutra Medina', bonusStat: 'istiqamah', bonusValue: 5, desc: 'Bonus +5 Istiqamah & Perisai Khusyu.', icon: 'fa-rug', color: 'text-purple-400' },
    { id: 'siwak', slot: 'weapon', name: 'Siwak Sunnah Utama', bonusStat: 'ikhlas', bonusValue: 4, desc: 'Bonus +4 Ikhlas & Pencerah Hati.', icon: 'fa-tooth', color: 'text-sky-400' }
];

const GUILD_LEADERBOARD = [
    { rank: 1, name: 'Monark Fajr Utama', level: 18, streak: '24 Hari', badge: 'S-RANK' },
    { rank: 2, name: 'Ksatria Tahajud', level: 15, streak: '19 Hari', badge: 'A-RANK' },
    { rank: 3, name: 'Pejuang Subuh', level: 12, streak: '14 Hari', badge: 'A-RANK' },
    { rank: 4, name: 'Penuntut Ilmu', level: 9, streak: '10 Hari', badge: 'B-RANK' }
];

let playerState = JSON.parse(JSON.stringify(DEFAULT_PLAYER_STATE));

// --- 3. STORAGE & INDEXEDDB SYNC ENGINE ---
async function loadPlayerData() {
    try {
        const savedData = await gameDB.getAccount('active_monark');
        if (savedData) {
            playerState = { ...DEFAULT_PLAYER_STATE, ...savedData };
        } else {
            const localSaved = localStorage.getItem('riyadhoh_monark_state');
            if (localSaved) {
                playerState = { ...DEFAULT_PLAYER_STATE, ...JSON.parse(localSaved) };
            }
        }
    } catch (err) {
        console.warn('Gagal memuat IndexedDB, menggunakan localStorage:', err);
        const localSaved = localStorage.getItem('riyadhoh_monark_state');
        if (localSaved) {
            playerState = { ...DEFAULT_PLAYER_STATE, ...JSON.parse(localSaved) };
        }
    }

    if (!playerState.username || playerState.username === 'active_monark') {
        playerState.username = 'Pejuang Subuh';
    }

    renderAll();
}

async function savePlayerData() {
    checkLevelUp();
    localStorage.setItem('riyadhoh_monark_state', JSON.stringify(playerState));
    try {
        await gameDB.saveAccount(playerState);
    } catch (err) {
        console.warn('Gagal menyimpan ke IndexedDB:', err);
    }
    renderAll();
}

function checkLevelUp() {
    while (playerState.xp >= playerState.xpToNextLevel) {
        playerState.xp -= playerState.xpToNextLevel;
        playerState.level += 1;
        playerState.xpToNextLevel = Math.floor(playerState.xpToNextLevel * 1.3);
        playerState.coins += 100;
        playerState.gems += 2;
        playerState.statPoints += 3;
        playerState.maxMp += 20;
        playerState.mp = playerState.maxMp;

        if (playerState.level >= 12) { playerState.rank = 'S-RANK'; playerState.title = 'Monark Istiqamah Sejati'; }
        else if (playerState.level >= 8) { playerState.rank = 'A-RANK'; playerState.title = 'Pelindung Subuh Utama'; }
        else if (playerState.level >= 5) { playerState.rank = 'B-RANK'; playerState.title = 'Ksatria Tahajud'; }
        else if (playerState.level >= 3) { playerState.rank = 'D-RANK'; playerState.title = 'Penuntut Ilmu Rajin'; }

        audioFx.playLevelUp();
        if (typeof confetti === 'function') {
            confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
        }
        showGameToast('SISTEM: LEVEL UP!', `Masyallah! Naik ke Level ${playerState.level} (${playerState.rank}). Mendapatkan +3 Poin Status!`, 'gold');
    }
}

function allocateStatPoint(statName) {
    if (playerState.statPoints > 0 && playerState.stats[statName] !== undefined) {
        playerState.statPoints -= 1;
        playerState.stats[statName] += 1;
        audioFx.playTap();
        showGameToast('SISTEM STATS', `Atribut ${statName.toUpperCase()} bertambah +1!`, 'emerald');
        savePlayerData();
    } else {
        showGameToast('SISTEM STATS', 'Poin AP belum cukup. Selesaikan Misi untuk Level Up!', 'rose');
    }
}

function triggerAwakeningPrompt() {
    if (playerState.level < 5) {
        showGameToast('AWAKENING SYSTEM', 'Butuh minimal Level 5 untuk melakukan Class Awakening!', 'rose');
        return;
    }

    const classes = ['Shadow Monarch', 'Fajr Guardian', 'Qur\'an Sage'];
    const chosen = prompt('PILIH CLASS AWAKENING:\n1. Shadow Monarch (+Bonus Multiplier Bayangan)\n2. Fajr Guardian (+Bonus Stats Taqwa)\n3. Qur\'an Sage (+Bonus Khusyu & Mana)');

    if (chosen === '1') playerState.playerClass = 'Shadow Monarch';
    else if (chosen === '2') playerState.playerClass = 'Fajr Guardian';
    else if (chosen === '3') playerState.playerClass = 'Qur\'an Sage';

    savePlayerData();
    showGameToast('AWAKENING BERHASIL!', `Selamat! Kamu sekarang menjadi [${playerState.playerClass}]!`, 'gold');
}

// --- 4. NAVIGATION & TAB ROUTING ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));

    const targetSection = document.getElementById(`content-${tabName}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    document.querySelectorAll('.dnav-btn').forEach(btn => btn.classList.remove('active'));
    const dBtn = document.getElementById(`dtab-${tabName}`);
    if (dBtn) dBtn.classList.add('active');

    document.querySelectorAll('.mnav-btn').forEach(btn => btn.classList.remove('active'));
    const mBtn = document.getElementById(`mnav-${tabName}`);
    if (mBtn) mBtn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 5. QUEST ENGINE ---
function toggleQuest(type, questId, event) {
    const list = type === 'main' ? playerState.mainQuests : playerState.bonusQuests;
    const q = list.find(item => item.id === questId);
    if (!q) return;

    q.completed = !q.completed;
    if (q.completed) {
        audioFx.playReward();
        playerState.xp += q.xp;
        playerState.coins += q.coins;
        if (typeof confetti === 'function') confetti({ particleCount: 35, spread: 50 });
        showGameToast('MISI SELESAI', `[${q.title}] +${q.xp} XP & +${q.coins} Koin!`, 'emerald');
    } else {
        playerState.xp = Math.max(0, playerState.xp - q.xp);
        playerState.coins = Math.max(0, playerState.coins - q.coins);
    }
    savePlayerData();
}

function saveCustomQuest(e) {
    e.preventDefault();
    const title = document.getElementById('cqTitle').value.trim();
    const xp = parseInt(document.getElementById('cqXp').value) || 50;
    const coins = parseInt(document.getElementById('cqCoins').value) || 15;

    if (title) {
        playerState.bonusQuests.push({
            id: 'cq_' + Date.now(),
            title: title,
            time: 'Kustom Sunnah',
            xp: xp,
            coins: coins,
            completed: false
        });
        hideModal('customQuestModal');
        document.getElementById('cqTitle').value = '';
        showGameToast('SISTEM MISI', 'Misi Sunnah Kustom baru berhasil ditambahkan!', 'amber');
        savePlayerData();
    }
}

// --- 6. EQUIPMENT & LOADOUT SYSTEM ---
function equipItem(itemId) {
    const item = INVENTORY_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (!playerState.equippedGear) playerState.equippedGear = { weapon: null, tasbih: null, sajadah: null };

    const currentEquipped = playerState.equippedGear[item.slot];
    if (currentEquipped === itemId) {
        playerState.equippedGear[item.slot] = null;
        playerState.stats[item.bonusStat] -= item.bonusValue;
        showGameToast('EQUIPMENT', `${item.name} telah dilepas.`, 'amber');
    } else {
        if (currentEquipped) {
            const oldItem = INVENTORY_ITEMS.find(i => i.id === currentEquipped);
            if (oldItem) playerState.stats[oldItem.bonusStat] -= oldItem.bonusValue;
        }
        playerState.equippedGear[item.slot] = itemId;
        playerState.stats[item.bonusStat] += item.bonusValue;
        audioFx.playReward();
        showGameToast('EQUIPMENT', `${item.name} berhasil dipakai! Bonus +${item.bonusValue} ${item.bonusStat.toUpperCase()}.`, 'emerald');
    }
    savePlayerData();
}

// --- 7. PASSIVE SHADOW AUTO-PATROL YIELD ---
function toggleShadowPatrol(shadowId) {
    if (!playerState.shadows) return;
    const shadow = playerState.shadows.find(s => s.id === shadowId || s.name === shadowId);
    if (!shadow) return;

    shadow.onPatrol = !shadow.onPatrol;
    audioFx.playTap();
    if (shadow.onPatrol) {
        showGameToast('PASUKAN BAYANGAN', `[${shadow.name}] dikirim untuk Auto-Patrol Subuh!`, 'sky');
    } else {
        showGameToast('PASUKAN BAYANGAN', `[${shadow.name}] kembali dari Patroli.`, 'emerald');
    }
    savePlayerData();
}

function startPassiveShadowTimer() {
    setInterval(() => {
        if (playerState.shadows && playerState.shadows.length > 0) {
            const activePatrols = playerState.shadows.filter(s => s.onPatrol).length;
            if (activePatrols > 0) {
                const yieldCoins = activePatrols * 2;
                const yieldXp = activePatrols * 3;
                playerState.coins += yieldCoins;
                playerState.xp += yieldXp;
                savePlayerData();
            }
        }
    }, 15000);
}

// --- 8. TOWN & BUILDING SHOP ---
function buyBuilding(buildingId) {
    const item = SHOP_ITEMS.find(s => s.id === buildingId);
    if (!item) return;

    if (playerState.coins < item.cost) {
        showGameToast('TRANSAKSI GAGAL', 'Koin Hasanah milikmu belum mencukupi!', 'rose');
        return;
    }

    playerState.coins -= item.cost;
    playerState.unlockedBuildings.push(buildingId);
    audioFx.playReward();
    showGameToast('BANGUNAN MASJID', `${item.name} berhasil dibeli & dibangun!`, 'amber');
    savePlayerData();
}

// --- 9. TASBIH RPG ---
function tapTasbih() {
    audioFx.playTap();
    playerState.zikrCount += 1;
    playerState.totalZikr += 1;
    playerState.mp = Math.min(playerState.maxMp, playerState.mp + 5);

    const rewardBtn = document.getElementById('claimZikrRewardBtn');
    if (rewardBtn && playerState.zikrCount >= playerState.zikrTarget) {
        rewardBtn.disabled = false;
    }
    savePlayerData();
}

function resetTasbih() {
    playerState.zikrCount = 0;
    const rewardBtn = document.getElementById('claimZikrRewardBtn');
    if (rewardBtn) rewardBtn.disabled = true;
    savePlayerData();
}

function claimZikrBonus() {
    if (playerState.zikrCount >= playerState.zikrTarget) {
        audioFx.playReward();
        playerState.xp += 40;
        playerState.coins += 20;
        showGameToast('REWARD ZIKIR', 'Target zikir tercapai! +40 XP & +20 Koin!', 'emerald');
        resetTasbih();
    }
}

function changeZikrPhrase() {
    const select = document.getElementById('tasbihPhraseSelect');
    if (!select) return;
    playerState.zikrPhrase = select.value;

    const phraseMap = {
        'Subhanallah': 'سُبْحَانَ اللَّهِ',
        'Alhamdulillah': 'الْحَمْدُ لِلَّهِ',
        'Allahu Akbar': 'اللَّهُ أَكْبَرُ',
        'Astaghfirullah': 'أَسْتَغْفِرُ اللَّهَ',
        'Shalawat': 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ'
    };
    const display = document.getElementById('arabicTextDisplay');
    if (display) {
        display.innerText = phraseMap[playerState.zikrPhrase] || 'سُبْحَانَ اللَّهِ';
    }
}

// --- 10. BOSS BATTLE BRIDGE ---
function executeBossAttack(attackType) {
    if (typeof bossSystem !== 'undefined') {
        playerState = bossSystem.executeAttack(attackType, playerState);
        savePlayerData();
    }
}

// --- 11. PROFILE & AUTHENTICATION HANDLERS ---
function claimDailyCheckin() {
    if (!playerState.dailyClaimed) {
        playerState.dailyClaimed = true;
        playerState.coins += 75;
        playerState.gems += 2;
        audioFx.playReward();
        if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 70 });
        showGameToast('DAILY REWARD', 'Masyallah! Login Harian (+75 Koin & +2 Permata) berhasil diklaim!', 'gold');
        savePlayerData();
    } else {
        showGameToast('DAILY REWARD', 'Anda sudah mengklaim hadiah harian untuk hari ini.', 'amber');
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const u = document.getElementById('authUsername').value.trim();
    const p = document.getElementById('authPassword').value.trim();

    if (u && p) {
        playerState.username = u;
        playerState.password = p;
        await savePlayerData();
        hideModal('authModal');
        showGameToast('SISTEM AKUN', `Selamat datang kembali, Monark ${u}! Data akun disinkronkan.`, 'sky');
    }
}

let tempAvatarSrc = '';
function selectPresetAvatar(src) {
    tempAvatarSrc = src;
    document.getElementById('customAvatarUrlInput').value = src;
}

function saveCustomAvatar() {
    const inputUrl = document.getElementById('customAvatarUrlInput').value.trim();
    const finalUrl = inputUrl || tempAvatarSrc;

    if (finalUrl) {
        playerState.avatar = finalUrl;
        savePlayerData();
        hideModal('changeAvatarModal');
        showGameToast('PROFIL UPDATE', 'Foto profil custom berhasil diperbarui!', 'emerald');
    }
}

function saveJournalNotes() {
    const notesEl = document.getElementById('journalNotesInput');
    if (notesEl) {
        playerState.journalNotes = notesEl.value;
        savePlayerData();
        showGameToast('JURNAL HIJRAH', 'Catatan spiritual milikmu berhasil disimpan!', 'emerald');
    }
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function startLiveClock() {
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID');
        const clockEl = document.getElementById('hudLiveClock');
        if (clockEl) clockEl.innerText = timeStr;

        const nextSubuh = new Date();
        const subH = window.todaySubuhHour || 4;
        const subM = window.todaySubuhMinute || 30;

        nextSubuh.setHours(subH, subM, 0, 0);
        if (now >= nextSubuh) {
            nextSubuh.setDate(nextSubuh.getDate() + 1);
        }

        const diffMs = nextSubuh - now;
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

        const cdEl = document.getElementById('subuhCountdownText');
        if (cdEl) {
            cdEl.innerText = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// --- AMBIENT CANVAS PARTICLES ENGINE ---
function initAmbientParticles() {
    const canvas = document.getElementById('bgParticleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.onresize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    const particles = Array.from({ length: 35 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#10b981' : '#38bdf8'
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.y -= p.speedY;
            if (p.y < 0) p.y = height;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 12. RENDER ALL UI COMPONENTS ---
function renderAll() {
    const hudAvatar = document.getElementById('hudAvatarImg');
    if (hudAvatar) hudAvatar.src = playerState.avatar;

    const hudLvl = document.getElementById('hudLevelBadge');
    if (hudLvl) hudLvl.innerText = `Lv.${playerState.level}`;

    const hudName = document.getElementById('hudPlayerName');
    if (hudName) hudName.innerText = playerState.username;

    const hudRank = document.getElementById('hudRankTitle');
    if (hudRank) hudRank.innerText = playerState.rank;

    const hudTitle = document.getElementById('hudTitleText');
    if (hudTitle) hudTitle.innerText = playerState.title;

    const pClass = document.getElementById('profileCardClass');
    if (pClass) pClass.innerText = playerState.playerClass || 'Subuh Initiate';

    const hudMpText = document.getElementById('hudMpText');
    if (hudMpText) hudMpText.innerText = `${playerState.mp}/${playerState.maxMp}`;

    const hudMpBar = document.getElementById('hudMpBar');
    if (hudMpBar) {
        const mpPct = Math.min(100, (playerState.mp / playerState.maxMp) * 100);
        hudMpBar.style.width = `${mpPct}%`;
    }

    const hudXpText = document.getElementById('hudXpText');
    if (hudXpText) hudXpText.innerText = `${playerState.xp}/${playerState.xpToNextLevel}`;

    const hudXpBar = document.getElementById('hudXpBar');
    if (hudXpBar) {
        const pct = Math.min(100, (playerState.xp / playerState.xpToNextLevel) * 100);
        hudXpBar.style.width = `${pct}%`;
    }

    const hudCoins = document.getElementById('hudCoins');
    if (hudCoins) hudCoins.innerText = playerState.coins;

    const hudGems = document.getElementById('hudGems');
    if (hudGems) hudGems.innerText = playerState.gems;

    const hudStreak = document.getElementById('hudStreak');
    if (hudStreak) hudStreak.innerText = `${playerState.streak}H`;

    const dashWelcome = document.getElementById('dashWelcomeName');
    if (dashWelcome) dashWelcome.innerText = playerState.username;

    const totalQuests = playerState.mainQuests.length + playerState.bonusQuests.length;
    const completedQuests = playerState.mainQuests.filter(q => q.completed).length + playerState.bonusQuests.filter(q => q.completed).length;

    const dashQuestCount = document.getElementById('dashQuestCount');
    if (dashQuestCount) dashQuestCount.innerText = `${completedQuests}/${totalQuests}`;

    const dashQuestBar = document.getElementById('dashQuestBar');
    if (dashQuestBar) {
        const qPct = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
        dashQuestBar.style.width = `${qPct}%`;
    }

    const dashZikr = document.getElementById('dashZikrCount');
    if (dashZikr) dashZikr.innerText = `${playerState.totalZikr} Ketukan`;

    const dashGate = document.getElementById('dashGateRank');
    if (dashGate) dashGate.innerText = `${playerState.rank} Gate`;

    renderQuests();
    renderSagaGates();
    renderShadows();
    renderShop();
    renderInventory();
    renderGuildLeaderboard();
    renderProfileCard();

    const tasbihCountText = document.getElementById('tasbihCountText');
    if (tasbihCountText) tasbihCountText.innerText = playerState.zikrCount;

    const notesEl = document.getElementById('journalNotesInput');
    if (notesEl && playerState.journalNotes) notesEl.value = playerState.journalNotes;

    const bossHpBar = document.getElementById('bossHpBar');
    if (bossHpBar) {
        const hpPct = (playerState.bossHp / playerState.bossMaxHp) * 100;
        bossHpBar.style.width = `${hpPct}%`;
    }
    const bossHpText = document.getElementById('bossHpText');
    if (bossHpText) bossHpText.innerText = `${playerState.bossHp} / ${playerState.bossMaxHp} HP`;
}

function renderQuests() {
    const mc = document.getElementById('mainQuestsContainer');
    const bc = document.getElementById('bonusQuestsContainer');
    if (!mc || !bc) return;

    mc.innerHTML = '';
    bc.innerHTML = '';

    playerState.mainQuests.forEach(q => {
        mc.innerHTML += `
            <div class="bg-sl-card p-3 rounded-2xl flex items-center justify-between border ${q.completed ? 'bg-emerald-950/30 border-emerald-500/50' : 'border-sl-border'}">
                <div class="flex items-center gap-3">
                    <button onclick="toggleQuest('main', '${q.id}', event)" class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${q.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'}">
                        ${q.completed ? '<i class="fa-solid fa-check text-xs font-black"></i>' : ''}
                    </button>
                    <div>
                        <h4 class="font-bold text-xs ${q.completed ? 'line-through text-slate-400' : 'text-slate-100'}">${q.title}</h4>
                        <span class="text-[10px] text-slate-400"><i class="fa-regular fa-clock mr-1 text-emerald-400"></i>${q.time}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-black">
                    <span class="text-emerald-400">+${q.xp} XP</span>
                    <span class="text-amber-400">+${q.coins} Koin</span>
                </div>
            </div>
        `;
    });

    playerState.bonusQuests.forEach(q => {
        bc.innerHTML += `
            <div class="bg-sl-card p-3 rounded-2xl flex items-center justify-between border ${q.completed ? 'bg-amber-950/30 border-amber-500/50' : 'border-sl-border'}">
                <div class="flex items-center gap-3">
                    <button onclick="toggleQuest('bonus', '${q.id}', event)" class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${q.completed ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-600'}">
                        ${q.completed ? '<i class="fa-solid fa-check text-xs font-black"></i>' : ''}
                    </button>
                    <div>
                        <h4 class="font-bold text-xs ${q.completed ? 'line-through text-slate-400' : 'text-slate-100'}">${q.title}</h4>
                        <span class="text-[10px] text-slate-400"><i class="fa-regular fa-clock mr-1 text-amber-400"></i>${q.time}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-black">
                    <span class="text-emerald-400">+${q.xp} XP</span>
                    <span class="text-amber-400">+${q.coins} Koin</span>
                </div>
            </div>
        `;
    });

    const mqProg = document.getElementById('mainQuestProgress');
    if (mqProg) mqProg.innerText = `${playerState.mainQuests.filter(q => q.completed).length}/${playerState.mainQuests.length}`;

    const bqProg = document.getElementById('bonusQuestProgress');
    if (bqProg) bqProg.innerText = `${playerState.bonusQuests.filter(q => q.completed).length}/${playerState.bonusQuests.length}`;
}

function renderSagaGates() {
    const container = document.getElementById('sagaGateContainer');
    if (!container) return;

    container.innerHTML = '';
    SAGA_GATES.forEach(gate => {
        const isUnlocked = playerState.level >= gate.minLevel;
        container.innerHTML += `
            <div class="bg-sl-card p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4 border ${isUnlocked ? 'border-purple-500/50' : 'border-sl-border opacity-60'}">
                <img src="${gate.img}" alt="${gate.name}" class="w-full md:w-44 h-28 object-cover rounded-2xl shrink-0">
                <div class="space-y-1 flex-1">
                    <span class="text-[9px] font-black ${isUnlocked ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-slate-900 text-slate-500'} px-2.5 py-0.5 rounded-full">
                        ${gate.rank} - ${isUnlocked ? 'Gate Terbuka' : `Terkunci (Butuh Lv.${gate.minLevel})`}
                    </span>
                    <h3 class="font-black text-sm md:text-base text-white">${gate.name}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">${gate.desc}</p>
                </div>
                <button onclick="switchTab('quests')" ${!isUnlocked ? 'disabled' : ''} class="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-black text-xs rounded-xl shrink-0">
                    Masuki Gate
                </button>
            </div>
        `;
    });
}

function renderShadows() {
    const container = document.getElementById('shadowArmyContainer');
    if (!container) return;

    const countBadge = document.getElementById('shadowCountBadge');
    if (countBadge) countBadge.innerText = playerState.shadows ? playerState.shadows.length : 0;

    container.innerHTML = '';

    if (!playerState.shadows || playerState.shadows.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-sl-card p-8 rounded-3xl border border-sl-border text-center space-y-2">
                <i class="fa-solid fa-ghost text-4xl text-slate-600"></i>
                <h4 class="font-black text-sm text-slate-300">Belum Ada Pasukan Bayangan</h4>
                <p class="text-xs text-slate-500">Kalahkan Boss di Arena Pertarungan untuk mengekstrak monster menjadi Pasukan Bayangan!</p>
            </div>
        `;
        return;
    }

    playerState.shadows.forEach(s => {
        const keyId = s.id || s.name;
        container.innerHTML += `
            <div class="bg-sl-card rounded-2xl overflow-hidden border ${s.onPatrol ? 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.25)]' : 'border-sky-500/40'} p-4 space-y-3">
                <div class="flex items-center gap-3">
                    <img src="${s.img}" class="w-14 h-14 rounded-xl object-cover border border-sky-400">
                    <div>
                        <span class="text-[9px] font-black bg-sky-950 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded-full">${s.rank}</span>
                        <h4 class="font-black text-sm text-white mt-1">${s.name}</h4>
                        <p class="text-[10px] text-emerald-400 font-bold">${s.buff}</p>
                    </div>
                </div>
                <button onclick="toggleShadowPatrol('${keyId}')" class="w-full py-2 ${s.onPatrol ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-sky-300 border border-sky-500/40'} rounded-xl text-xs font-bold transition">
                    ${s.onPatrol ? '<i class="fa-solid fa-person-walking mr-1"></i> Sedang Patroli (+2 Koin/15s)' : '<i class="fa-solid fa-shield mr-1"></i> Terapkan Auto-Patrol'}
                </button>
            </div>
        `;
    });
}

function renderShop() {
    const container = document.getElementById('shopContainer');
    if (!container) return;

    container.innerHTML = '';
    SHOP_ITEMS.forEach(item => {
        const isUnlocked = playerState.unlockedBuildings.includes(item.id);
        const canAfford = playerState.coins >= item.cost;

        container.innerHTML += `
            <div class="bg-sl-card rounded-2xl overflow-hidden flex flex-col justify-between border ${isUnlocked ? 'border-emerald-500/50' : 'border-sl-border'}">
                <div class="h-32 relative overflow-hidden">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-sl-card via-transparent to-transparent"></div>
                    <span class="absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900/80 text-slate-400'}">
                        ${isUnlocked ? 'Dimiliki' : 'Toko'}
                    </span>
                </div>
                <div class="p-3.5 space-y-2">
                    <div>
                        <h4 class="font-bold text-xs text-white">${item.name}</h4>
                        <p class="text-[10px] text-slate-400 mt-0.5">${item.desc}</p>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-slate-800">
                        <span class="text-xs font-black text-amber-400"><i class="fa-solid fa-coins mr-1"></i>${item.cost}</span>
                        ${!isUnlocked ? `
                            <button onclick="buyBuilding('${item.id}')" ${!canAfford ? 'disabled' : ''} class="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-lg transition">
                                Beli
                            </button>
                        ` : `
                            <span class="text-[10px] font-bold text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>Aktif</span>
                        `}
                    </div>
                </div>
            </div>
        `;
    });

    const mLevel = document.getElementById('mosqueGloryLevel');
    if (mLevel) mLevel.innerText = `Level ${playerState.unlockedBuildings.length}`;
}

function renderInventory() {
    const container = document.getElementById('inventoryContainer');
    if (!container) return;

    container.innerHTML = '';
    if (!playerState.equippedGear) playerState.equippedGear = { weapon: null, tasbih: null, sajadah: null };

    INVENTORY_ITEMS.forEach(item => {
        const isEquipped = playerState.equippedGear[item.slot] === item.id;
        container.innerHTML += `
            <div class="bg-sl-card p-4 rounded-2xl border ${isEquipped ? 'border-emerald-500 item-slot-glow bg-emerald-950/20' : 'border-sl-border'} flex flex-col justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl ${item.color} border border-slate-800 shrink-0">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-extrabold text-xs text-white">${item.name}</h4>
                        <p class="text-[10px] text-slate-400 mt-0.5">${item.desc}</p>
                    </div>
                </div>
                <button onclick="equipItem('${item.id}')" class="w-full py-1.5 ${isEquipped ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-300 border border-slate-700'} rounded-xl text-xs font-bold transition">
                    ${isEquipped ? '<i class="fa-solid fa-circle-check mr-1"></i> Dipakai' : 'Gunakan / Equip'}
                </button>
            </div>
        `;
    });
}

function renderGuildLeaderboard() {
    const container = document.getElementById('guildLeaderboardList');
    if (!container) return;

    container.innerHTML = '';
    GUILD_LEADERBOARD.forEach(player => {
        container.innerHTML += `
            <div class="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center">#${player.rank}</span>
                    <div>
                        <h4 class="font-bold text-xs text-white">${player.name}</h4>
                        <span class="text-[10px] text-slate-400">Streak: <strong class="text-orange-400">${player.streak}</strong></span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[9px] font-black bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">${player.badge}</span>
                    <div class="text-[10px] text-emerald-400 font-bold mt-0.5">Lv.${player.level}</div>
                </div>
            </div>
        `;
    });
}

function renderProfileCard() {
    const pAvatar = document.getElementById('profileCardAvatar');
    if (pAvatar) pAvatar.src = playerState.avatar;

    const pName = document.getElementById('profileCardName');
    if (pName) pName.innerText = playerState.username;

    const pRank = document.getElementById('profileCardRank');
    if (pRank) pRank.innerText = `${playerState.rank} MONARK`;

    const pLvl = document.getElementById('profileCardLevel');
    if (pLvl) pLvl.innerText = `Level ${playerState.level}`;

    const statPts = document.getElementById('statPointsBadge');
    if (statPts) statPts.innerText = playerState.statPoints || 0;

    const statTaqwa = document.getElementById('statTaqwa');
    if (statTaqwa) statTaqwa.innerText = playerState.stats.taqwa;

    const statKhusyu = document.getElementById('statKhusyu');
    if (statKhusyu) statKhusyu.innerText = playerState.stats.khusyu;

    const statIstiqamah = document.getElementById('statIstiqamah');
    if (statIstiqamah) statIstiqamah.innerText = playerState.stats.istiqamah;

    const statIkhlas = document.getElementById('statIkhlas');
    if (statIkhlas) statIkhlas.innerText = playerState.stats.ikhlas;
}

// --- 13. LIFECYCLE INIT ---
window.onload = async function() {
    startLiveClock();
    updatePrayerTimesFromGPS();
    initAmbientParticles();
    await loadPlayerData();
    startPassiveShadowTimer();
};

// ==========================================
// INTEGRASI WAKTU SHOLAT GPS DENGAN KOORDINAT LOKASI
// ==========================================
window.todaySubuhHour = 4;
window.todaySubuhMinute = 30;

function updatePrayerTimesFromGPS() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                try {
                    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=20`);
                    const data = await response.json();
                    if (data && data.data && data.data.timings) {
                        const t = data.data.timings;
                        
                        const subuhParts = t.Fajr.split(':');
                        window.todaySubuhHour = parseInt(subuhParts[0], 10);
                        window.todaySubuhMinute = parseInt(subuhParts[1], 10);

                        if (playerState && playerState.mainQuests) {
                            const timeMap = {
                                'mq1': `${t.Fajr}`,
                                'mq2': `${t.Dhuhr}`,
                                'mq3': `${t.Asr}`,
                                'mq4': `${t.Maghrib}`,
                                'mq5': `${t.Isha}`
                            };
                            playerState.mainQuests.forEach(q => {
                                if (timeMap[q.id]) {
                                    q.time = timeMap[q.id];
                                }
                            });
                            renderQuests();
                        }
                        if (typeof showGameToast === 'function') {
                            showGameToast('GPS DETEKSI', `Lokasi GPS aktif (${lat.toFixed(2)}, ${lng.toFixed(2)}). Waktu Sholat disesuaikan!`, 'emerald');
                        }
                    }
                } catch (err) {
                    console.warn('Gagal memuat API Waktu Sholat:', err);
                }
            },
            (error) => {
                console.warn('Izin GPS tidak diberikan:', error.message);
            }
        );
    }
}
