import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, setDoc, getDoc, limit } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { CastleView, MyListView, DateNightView, JokesView } from './components/Views';
import { ModalWrapper, NavButton, Paywall } from './components/UI';
import { ICONS, THEME_COLORS, DEFAULT_CHORES_PER_COUPON, STRIPE_PRICE_ID, DEFAULT_COUPONS, JOKE_RATINGS } from './constants';
import { Profile, Settings, Tab, SubscriptionStatus } from './types';

// --- UTILS ---
export const calculateKingdomStats = (timeframe: string, completed: any[], bills: any[], goals: any[], activities: any[], events: any[], jokes: any[], notes: any[], ious: any[]) => {
    const now = new Date();
    const start = new Date(now);
    if (timeframe === 'weekly') {
        const day = start.getDay(), diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
    } else if (timeframe === 'monthly') {
        start.setDate(1);
    } else {
        start.setMonth(0, 1);
    }
    start.setHours(0,0,0,0);

    const s: any = { Ducky: { chores: 0, money: 0, planning: 0, shopping: 0, jokes: 0, notes: 0 }, Pips: { chores: 0, money: 0, planning: 0, shopping: 0, jokes: 0, notes: 0 } };
    const isAfterStart = (ts: any) => ts && new Date(ts.seconds * 1000) >= start;
    const isDeed = (c: any) => { if (c.type === 'whim') return false; if (c.goalId) { const g = goals.find(goal => goal.id === c.goalId); if (g && g.type === 'personal') return false; } return true; };

    completed.forEach(c => { 
        if (c.completedBy && s[c.completedBy] && isAfterStart(c.completedAt) && isDeed(c)) s[c.completedBy].chores++; 
    });
    // Simplified stats for prompt length
    return s;
};

// --- AUTH COMPONENT ---
const AuthComponent = () => {
    const [isLogin, setIsLogin] = useState(true); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true); try { if (isLogin) { await signInWithEmailAndPassword(auth, email, password); } else { await createUserWithEmailAndPassword(auth, email, password); } } catch (err: any) { setError(err.message.replace('Firebase: ', '')); } finally { setLoading(false); } };
    return (
        <div className="fixed inset-0 z-[100] bg-pink-50 overflow-y-auto overscroll-y-auto">
            <div className="min-h-full flex flex-col items-center justify-center p-6 relative font-sans">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border-4 border-white relative z-10 animate-pop my-auto">
                    <div className="text-center mb-8"><div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg transform rotate-3 mb-4"><ICONS.Heart className="text-white" size={40} fill="currentColor" /></div><h1 className="text-3xl font-black text-gray-800 tracking-tight">{isLogin ? 'Welcome Back!' : 'Join the Kingdom'}</h1></div>{error && <div className="bg-red-50 border-2 border-red-100 text-red-500 p-3 rounded-xl mb-4 text-xs font-bold text-center">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4"><div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-700" required /></div><div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-700" required /></div><button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-black shadow-lg mt-4">{loading ? 'Processing...' : (isLogin ? 'Enter Kingdom' : 'Create Account')}</button></form><div className="mt-6 text-center"><button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-gray-400">{isLogin ? "New here? Create an account" : "Already have a castle? Sign in"}</button></div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>('castle');
    const [chores, setChores] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [dates, setDates] = useState<any[]>([]);
    const [bills, setBills] = useState<any[]>([]);
    const [ious, setIous] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [shop, setShop] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [jokes, setJokes] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [income, setIncome] = useState({ ducky: 0, pips: 0 });
    const [castle, setCastle] = useState({ name: 'Our Kingdom', kingdomFlag: '🏰', duckyFlag: '🐥', pipsFlag: '🐦' });
    const [profiles, setProfiles] = useState<any>({});
    const [settings, setSettings] = useState<Settings>({});
    const [modals, setModals] = useState<Record<string, boolean>>({});
    const [subscription, setSubscription] = useState<SubscriptionStatus>({ status: 'inactive' });
    
    const toggleModal = (m: string, v: boolean) => setModals(prev => ({...prev, [m]: v}));

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => { setUser(u); if(u) setProfile(localStorage.getItem('ducky_pips_profile')); });
    }, []);

    useEffect(() => {
        if (!user) return;
        const subs: any[] = [];
        const basePath = `kingdoms/${user.uid}`;

        // Basic Listeners
        const subCol = (n: string, s?: any) => { 
            const q = s ? query(collection(db, basePath, n), orderBy(s.f, s.o)) : collection(db, basePath, n); 
            subs.push(onSnapshot(q, (r) => { 
                const data = r.docs.map(d => ({ id: d.id, ...d.data() })); 
                if(n==='chores') setChores(data); 
                else if (n==='goals') setGoals(data); 
                else if(n==='coupons') setCoupons(data);
                else if(n==='bills') setBills(data);
                else if(n==='ious') setIous(data);
                else if(n==='events') setEvents(data);
                else if(n==='shopping') setShop(data);
                else if(n==='activities') setActivities(data);
                else if(n==='announcements') setAnnouncements(data);
                else if(n==='datenights') setDates(data);
                else if(n==='jokes') setJokes(data);
                else if(n==='notes') setNotes(data);
            })); 
        };

        subCol('chores', {f:'createdAt',o:'asc'});
        subCol('jokes', {f:'createdAt',o:'desc'});
        subCol('datenights', {f:'createdAt',o:'desc'});
        
        // Settings Listeners
        subs.push(onSnapshot(doc(db, basePath, 'settings', 'castle'), (s) => { if(s.exists()) setCastle(s.data() as any); }));
        subs.push(onSnapshot(doc(db, basePath, 'settings', 'profiles'), (s) => { if(s.exists()) setProfiles(s.data()); }));
        subs.push(onSnapshot(doc(db, basePath, 'settings', 'rewards'), (s) => { if(s.exists()) setSettings(prev => ({...prev, rewards: s.data()})); }));

        // Subscription Check
        user.getIdTokenResult(true).then((token:any) => {
             const role = token.claims.stripeRole;
             setSubscription({ status: role ? 'active' : 'inactive' });
        });

        return () => subs.forEach(u => u());
    }, [user]);

    const act = async (type: string, col: string, id: string | null, data: any = {}) => {
        const path = ['kingdoms', user.uid, col];
        if (type === 'add') await addDoc(collection(db, ...path as any), { ...data, createdAt: serverTimestamp() });
        else if (type === 'update' && id) await updateDoc(doc(db, ...path as any, id), data);
        else if (type === 'delete' && id) await deleteDoc(doc(db, ...path as any, id));
        else if (type === 'set' && id) await setDoc(doc(db, ...path as any, id), data);
    };

    const handleSubscribe = async () => {
        if(!user) return;
        const returnUrl = window.location.origin + window.location.pathname;
        try {
            await setDoc(doc(db, 'customers', user.uid), { email: user.email }, { merge: true });
            const sessionRef = await addDoc(collection(db, 'customers', user.uid, 'checkout_sessions'), {
                price: STRIPE_PRICE_ID,
                success_url: returnUrl,
                cancel_url: returnUrl,
                allow_promotion_codes: true,
            });
            onSnapshot(sessionRef, (snap) => {
                const data = snap.data();
                if (data?.url) window.location.assign(data.url);
            });
        } catch(e) { console.error(e); }
    };

    if (!user) return <AuthComponent />;
    
    // Profile Selection Screen
    if (!profile) return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 text-center font-sans fade-in">
            <h1 className="text-5xl font-black text-pink-500 mb-10 drop-shadow-sm tracking-tight animate-bounce-slight">Who are you?</h1>
            <div className="flex gap-8">
                <button onClick={() => {setProfile('Ducky'); localStorage.setItem('ducky_pips_profile', 'Ducky');}} className="w-44 h-44 bg-themeYellow rounded-[3rem] shadow-cute border-4 border-white flex flex-col items-center justify-center hover:scale-105 transition-transform"><div className="text-7xl mb-2">{profiles.Ducky?.icon || '🐥'}</div><span className="text-2xl font-black text-themeYellowDark">{profiles.Ducky?.name || 'Ducky'}</span></button>
                <button onClick={() => {setProfile('Pips'); localStorage.setItem('ducky_pips_profile', 'Pips');}} className="w-44 h-44 bg-themeBlue rounded-[3rem] shadow-cute border-4 border-white flex flex-col items-center justify-center hover:scale-105 transition-transform"><div className="text-7xl mb-2">{profiles.Pips?.icon || '🐦'}</div><span className="text-2xl font-black text-themeBlueDark">{profiles.Pips?.name || 'Pips'}</span></button>
            </div>
            <button onClick={() => signOut(auth)} className="mt-12 text-gray-400 font-bold text-sm hover:text-red-400 flex items-center gap-2"><ICONS.LogOut size={16} /> Sign Out</button>
        </div>
    );

    const myTheme = profile && profiles[profile] ? THEME_COLORS.find(c => c.name === profiles[profile].theme) || THEME_COLORS[0] : THEME_COLORS[0];
    const isPro = subscription.status === 'active';
    const activeDate = dates.find(d => d.status !== 'completed');
    const myChores = chores.filter(c => c.assignedTo === profile && c.status !== 'completed');
    const completed = chores.filter(c => c.status === 'completed');
    const myCount = completed.filter(c => c.completedBy === profile && !c.redeemedForCoupon).length;
    
    return (
        <div className={`h-[100dvh] w-full flex flex-col font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative fade-in ${myTheme.bg} transition-colors duration-500`}>
             <header className="bg-white/80 backdrop-blur-md p-5 pt-safe-top pb-4 shadow-sm z-10 flex justify-between items-center select-none rounded-b-[2.5rem] sticky top-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => toggleModal('profile', true)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border-2 border-gray-100 active:scale-95 transition-transform relative">{profiles[profile]?.icon}</button>
                    <div><h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">{tab === 'castle' ? "Our Kingdom" : (tab.charAt(0).toUpperCase() + tab.slice(1))}</h1></div>
                </div>
                <div className="flex gap-2">
                    <button onClick={()=>toggleModal('subscription', true)} className={`p-2 rounded-full transition-colors border shadow-sm ${isPro ? 'bg-yellow-100 text-yellow-600 border-yellow-200' : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-yellow-500'}`}><ICONS.Star size={20} fill={isPro ? "currentColor" : "none"} /></button>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 pb-64 relative no-scrollbar overscroll-contain">
                 {tab === 'castle' && <CastleView chores={myChores} completed={completed} events={events} goals={goals} bills={bills} ious={ious} activities={activities} jokes={jokes} notes={notes} user={profile} settings={castle} profiles={profiles} announcements={announcements} onOpenSettings={() => toggleModal('castle', true)} onToggleChore={(c:any) => act('update', 'chores', c.id, {status: 'completed', completedAt: serverTimestamp(), completedBy: profile})} onOpenMeeting={() => toggleModal('meeting', true)} onOpenHistory={() => toggleModal('history', true)} />}
                 {tab === 'list' && <MyListView chores={myChores} onToggle={(c:any) => act('update', 'chores', c.id, {status: 'completed', completedAt: serverTimestamp(), completedBy: profile})} onDelete={(id:string) => act('delete', 'chores', id)} user={profile} progress={myCount} threshold={DEFAULT_CHORES_PER_COUPON} onOpenRecurring={() => toggleModal('recurring', true)} />}
                 {tab === 'dates' && <DateNightView activeDate={activeDate} history={dates.filter(d => d.status === 'completed')} progress={completed.filter(c => !c.redeemedForDate).length} onLog={(d:any) => act('add', 'datenights', null, d)} onUpdateDate={(id:string, d:any) => act('update', 'datenights', id, d)} onCompleteDate={(id:string, d:any) => act('update', 'datenights', id, d)} resetProgress={(c:number) => completed.filter(x=>!x.redeemedForDate).sort((a,b)=>(a.completedAt?.seconds||0)-(b.createdAt?.seconds||0)).slice(0,c).forEach(x => act('update', 'chores', x.id, { redeemedForDate: true }))} threshold={20} user={profile} completed={completed} bills={bills} goals={goals} activities={activities} events={events} jokes={jokes} notes={notes} ious={ious} profiles={profiles} settings={settings} />}
                 {tab === 'jokes' && (!isPro ? <Paywall title="Unlock Jokes" description="Track the funniest moments." icon={<ICONS.Smile size={48} className="text-yellow-400"/>} onSubscribe={() => toggleModal('subscription', true)} /> : <JokesView jokes={jokes} onAdd={(d:any) => act('add', 'jokes', null, d)} onDelete={(id:string) => act('delete', 'jokes', id)} user={profile} />)}
            </main>

            <div className="fixed bottom-0 left-0 right-0 w-full px-4 pb-6 pt-12 z-40 flex justify-between items-end pointer-events-none safe-area-pb">
                <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-1.5 grid grid-cols-2 gap-1 shadow-xl border-4 border-white pointer-events-auto w-[42%]">
                    <NavButton active={tab === 'jokes'} onClick={() => setTab('jokes')} icon={<ICONS.Smile />} label="Jokes" />
                    <NavButton active={tab === 'dates'} onClick={() => setTab('dates')} icon={<ICONS.Heart />} label="Dates" />
                    <NavButton active={tab === 'list'} onClick={() => setTab('list')} icon={<ICONS.CheckCircle />} label="Chores" />
                    <NavButton active={tab === 'assign'} onClick={() => setTab('assign')} icon={<ICONS.Repeat />} label="Assign" />
                </div>
                <div className="pointer-events-auto -mb-6 mx-1 z-50 transform -translate-y-6 flex-1 flex justify-center"><NavButton active={tab === 'castle'} onClick={() => setTab('castle')} icon={<ICONS.Crown />} label="Kingdom" prominent={true} /></div>
                <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-1.5 grid grid-cols-2 gap-1 shadow-xl border-4 border-white pointer-events-auto w-[42%]">
                    <NavButton active={tab === 'budget'} onClick={() => setTab('budget')} icon={<ICONS.PiggyBank />} label="Budget" />
                    <NavButton active={tab === 'notes'} onClick={() => setTab('notes')} icon={<ICONS.StickyNote />} label="Notes" />
                    <NavButton active={tab === 'shop'} onClick={() => setTab('shop')} icon={<ICONS.ShoppingCart />} label="Shop" />
                    <NavButton active={tab === 'goals'} onClick={() => setTab('goals')} icon={<ICONS.Target />} label="Goals" />
                </div>
            </div>

            {modals.subscription && (
                <ModalWrapper onClose={() => toggleModal('subscription', false)} title="Kingdom Pro" icon={<ICONS.Star className="text-yellow-400" size={28}/>}>
                    <div className="space-y-6 text-center">
                        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-3xl border-2 border-yellow-200">
                            <h3 className="text-xl font-black text-yellow-800 mb-2">Unlock the Full Kingdom</h3>
                            <p className="text-sm text-yellow-700 font-medium leading-relaxed">Upgrade your castle to access premium tools.</p>
                        </div>
                        {!isPro ? (
                            <button onClick={handleSubscribe} className="w-full bg-black text-white py-4 rounded-2xl font-black shadow-lg">Subscribe for $14.99/mo</button>
                        ) : (
                            <div className="bg-green-100 text-green-700 py-3 rounded-xl font-bold border border-green-200">You are a Pro Member! 🌟</div>
                        )}
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
}