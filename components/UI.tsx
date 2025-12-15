import React from 'react';
import { ICONS } from '../constants';

export const ModalWrapper = ({ children, onClose, title, icon }: { children: React.ReactNode, onClose: () => void, title: string, icon: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200 border-4 border-gray-100 relative max-h-[85vh] overflow-y-auto no-scrollbar">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 bg-gray-50 p-2 rounded-full"><ICONS.X size={20}/></button>
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">{icon} {title}</h2>
            {children}
        </div>
    </div>
);

export const NavButton = ({ active, onClick, icon, label, count, prominent }: any) => {
    if (prominent) return (
        <button onClick={onClick} className="relative -top-10 z-50 flex flex-col items-center justify-center group shrink-0 mx-1">
            <div className={`w-20 h-20 rounded-full shadow-glow flex items-center justify-center border-[6px] border-gray-50 transition-transform duration-300 group-hover:scale-105 ${active ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white' : 'bg-white text-gray-300'}`}>
                {React.cloneElement(icon, { size: 32, strokeWidth: 3 })}
            </div>
        </button>
    )
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center py-1 transition-all relative w-full h-14 rounded-2xl ${active ? 'bg-white shadow-cute text-pink-500 -translate-y-1' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}>
            {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
            <span className="text-[9px] font-bold leading-tight mt-0.5">{label}</span>
            {count > 0 && <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce shadow-sm border border-white">{count}</span>}
        </button>
    );
};

export const ProgressBar = ({ current, max, color = "bg-pink-500", label }: any) => (
    <div className="w-full mb-4">
        {label && <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider ml-1"><span>{label}</span><span>{current} / {max}</span></div>}
        <div className="h-5 w-full bg-white rounded-full overflow-hidden border-2 border-gray-100 shadow-inner">
            <div className={`h-full ${color} transition-all duration-1000 ease-out flex items-center justify-end pr-2 rounded-full`} style={{ width: `${Math.min((current/max)*100, 100)}%` }}>{current>=max && <ICONS.Sparkles size={12} className="text-white animate-spin-slow" />}</div>
        </div>
    </div>
);

export const Paywall = ({ title, description, icon, onSubscribe }: any) => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative shadow-cute border-4 border-white">
            <div className="opacity-50 grayscale scale-110">{icon}</div>
            <div className="absolute -bottom-1 -right-1 bg-black text-white p-2.5 rounded-full border-4 border-white shadow-sm">
                <ICONS.Lock size={18} />
            </div>
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-[250px] mx-auto font-medium">{description}</p>
        <button onClick={onSubscribe} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <ICONS.Star fill="currentColor" strokeWidth={2} /> Upgrade to Unlock
        </button>
    </div>
);