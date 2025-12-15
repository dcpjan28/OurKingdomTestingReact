import React from 'react';
import { 
    Heart, Trash2, Plus, Calendar, Repeat, CheckCircle, User, Sparkles, 
    Utensils, Camera, Gift, ArrowLeft, ArrowRight, RefreshCw, LogOut, 
    Star, AlertTriangle, MessageCircle, X, WifiOff, Coins, PiggyBank,
    TrendingUp, DollarSign, HandCoins, Target, CheckSquare, PlusCircle,
    CalendarDays, Clock, Users, ChevronLeft, ChevronRight, AlertCircle,
    Crown, Flag, Settings, BookOpen, Sun, Moon, Coffee, ShoppingCart, ShoppingBag,
    Edit3, MessageSquareHeart, Database, Link as LinkIcon, History, CreditCard, Receipt,
    ChevronDown, ChevronUp, Activity, Cookie, AlertOctagon, ThumbsUp, ThumbsDown, Bell,
    Megaphone, CircleHelp, Pencil, Smile, StickyNote, Shield, Scroll, Store, Send, Lock, ExternalLink, Mail, Palette, RefreshCcw, Copy, Loader
} from 'lucide-react';

export const ICONS = {
    Heart, Trash2, Plus, Calendar, Repeat, CheckCircle, User, Sparkles, 
    Utensils, Camera, Gift, ArrowLeft, ArrowRight, RefreshCw, LogOut, 
    Star, AlertTriangle, MessageCircle, X, WifiOff, Coins, PiggyBank,
    TrendingUp, DollarSign, HandCoins, Target, CheckSquare, PlusCircle,
    CalendarDays, Clock, Users, ChevronLeft, ChevronRight, AlertCircle,
    Crown, Flag, Settings, BookOpen, Sun, Moon, Coffee, ShoppingCart, ShoppingBag,
    Edit3, MessageSquareHeart, Database, LinkIcon, History, CreditCard, Receipt,
    ChevronDown, ChevronUp, Activity, Cookie, AlertOctagon, ThumbsUp, ThumbsDown, Bell,
    Megaphone, CircleHelp, Pencil, Smile, StickyNote, Shield, Scroll, Store, Send, Lock, ExternalLink, Mail, Palette, RefreshCcw, Copy, Loader
};

export const APP_ID = 'ducky-pips-v1';
export const STRIPE_PRICE_ID = "price_1SdLa3CzBDWfuIm1bCaXZkgJ"; 
export const DEFAULT_CHORES_PER_COUPON = 5; 
export const DEFAULT_CHORES_PER_DATENIGHT = 20;
export const DEFAULT_COUPONS = ["15 min Back Massage", "Homemade Dinner Choice", "Dish Duty Pass", "Movie Selection", "Breakfast in Bed", "Foot Massage", "Veto Power", "Ice Cream Run", "Bubble Bath Setup", "30 min Gaming Time"];
export const GOAL_TIMEFRAMES = ["This Week", "This Month", "1 Year", "5 Years", "10 Years", "20 Years"];
export const DATE_FOODS = ["Sushi", "Pizza", "Tacos", "Thai", "Burgers", "Fondue", "Pasta", "Picnic"];
export const DOMINANCE_WEIGHTS = { MONEY_TO_POINT_RATIO: 25, CHORE_POINT: 1, EQUALITY_THRESHOLD: 4 };

export const JOKE_RATINGS: Record<string, {label: string, emoji: string, weight: number}> = { 
    funny: { label: 'Funny', emoji: '😆', weight: 1 }, 
    hilarious: { label: 'Hilarious', emoji: '🤣', weight: 3 } 
};

export const ROYAL_TITLES: any = {
    finance: { he: "Lord Treasurer", she: "Lady Treasurer", they: "High Treasurer" },
    chores: { he: "Grand Steward", she: "High Stewardess", they: "High Steward" },
    planning: { he: "Grand Vizier", she: "Grand Vizier", they: "Grand Vizier" },
    shopping: { he: "Royal Merchant", she: "Royal Merchant", they: "Royal Merchant" },
    jester: { he: "Court Jester", she: "Court Jester", they: "Court Jester" },
    scribe: { he: "Royal Scribe", she: "Royal Scribe", they: "Royal Scribe" },
    ruler: { he: "King", she: "Queen", they: "Monarch" }
};

export const THEME_COLORS = [
    { name: 'Yellow', bg: 'bg-themeYellow', text: 'text-themeYellowDark', border: 'border-themeYellow' },
    { name: 'Blue', bg: 'bg-themeBlue', text: 'text-themeBlueDark', border: 'border-themeBlue' },
    { name: 'Pink', bg: 'bg-themePink', text: 'text-themePinkDark', border: 'border-themePink' },
    { name: 'Green', bg: 'bg-themeGreen', text: 'text-themeGreenDark', border: 'border-themeGreen' },
    { name: 'Purple', bg: 'bg-themePurple', text: 'text-themePurpleDark', border: 'border-themePurple' },
    { name: 'Orange', bg: 'bg-themeOrange', text: 'text-themeOrangeDark', border: 'border-themeOrange' },
];

export const PROFILE_ICONS = ['🐥','🐦','🐸','🐷','🦄','🐼','🦊','🦁','🐧','🐝', '🐱', '🐶', '🐨', '🐯', '🐙'];
