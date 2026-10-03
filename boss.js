// Engine Pertarungan Turn-Based Boss Battle dengan Modifier Stats & Equipment
class BossBattleSystem {
    executeAttack(type, state) {
        let baseDamage = 30;
        let manaCost = 10;
        let skillName = "Tebasan Zikir";

        const taqwaBonus = (state.stats && state.stats.taqwa) ? Math.floor(state.stats.taqwa * 1.5) : 0;
        const khusyuBonus = (state.stats && state.stats.khusyu) ? Math.floor(state.stats.khusyu * 1.2) : 0;

        if (type === "salat") {
            baseDamage = 100 + khusyuBonus;
            manaCost = 30;
            skillName = "Perisai Khusyu'";
        } else if (type === "tilawah") {
            baseDamage = 60 + taqwaBonus;
            manaCost = 20;
            skillName = "Panah Tilawah";
        } else {
            baseDamage = 30 + taqwaBonus;
        }

        if (state.mp < manaCost) {
            if (typeof showGameToast === 'function') {
                showGameToast('MANA HABIS', 'Mana (MP) kamu nggak cukup! Ketuk Zikir di Tasbih RPG untuk memulihkan Mana.', 'sky');
            }
            return state;
        }

        let isCrit = Math.random() > 0.6;
        let totalDamage = isCrit ? Math.floor(baseDamage * 1.6) : baseDamage;

        state.mp = Math.max(0, state.mp - manaCost);
        state.bossHp = Math.max(0, state.bossHp - totalDamage);

        this.spawnDamageText(totalDamage, isCrit);
        this.triggerScreenShake();

        const logEl = document.getElementById('combatLog');
        if (logEl) {
            logEl.innerHTML += `<br>> Monark memakai ${skillName}! ${isCrit ? 'CRITICAL STRIKE! ' : ''}Boss terkena -${totalDamage} HP.`;
            logEl.scrollTop = logEl.scrollHeight;
        }

        if (state.bossHp === 0) {
            state.coins += 250;
            state.gems += 5;
            state.xp += 150;
            state.bossMaxHp += 200;
            state.bossHp = state.bossMaxHp;

            if (!state.shadows) state.shadows = [];
            const shadowName = `Bayangan Walhan Stage ${state.shadows.length + 1}`;
            if (!state.shadows.some(s => s.name === shadowName)) {
                state.shadows.push({
                    id: 'sh_' + Date.now(),
                    name: shadowName,
                    rank: 'A-RANK SHADOW',
                    buff: '+20% Passive Koin & XP',
                    onPatrol: false,
                    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
                });
            }

            if (logEl) {
                logEl.innerHTML += `<br><span class="text-emerald-400 font-bold">> KEMENANGAN TELAK! Ekstraksi Bayangan Berhasil: [${shadowName}]!</span>`;
            }

            if (typeof showGameToast === 'function') {
                showGameToast('SISTEM: KEMENANGAN!', `Monster Malas Berhasil Ditundukkan! Ekstraksi Bayangan Berhasil (+250 Koin, +5 Permata, +150 XP).`, 'gold');
            }

            if (typeof confetti === 'function') {
                confetti({ particleCount: 100, spread: 100 });
            }
        }

        return state;
    }

    spawnDamageText(damage, isCrit) {
        const screen = document.getElementById('bossBattleCanvasScreen');
        if (!screen) return;

        const el = document.createElement('div');
        el.className = `floating-dmg-text ${isCrit ? 'text-amber-300 text-2xl font-black drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'text-rose-400 font-extrabold'}`;
        el.innerText = `${isCrit ? 'CRITICAL ' : ''}-${damage} HP`;
        el.style.left = `${35 + Math.random() * 30}%`;
        el.style.top = `35%`;

        screen.appendChild(el);
        setTimeout(() => el.remove(), 850);
    }

    triggerScreenShake() {
        const arena = document.getElementById('bossArenaBox');
        if (arena) {
            arena.classList.add('screen-shake');
            setTimeout(() => arena.classList.remove('screen-shake'), 220);
        }
    }
}

const bossSystem = new BossBattleSystem();