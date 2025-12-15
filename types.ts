export interface Profile {
    name: string;
    icon: string;
    theme: string;
    pronouns: 'he' | 'she' | 'they';
}

export interface Settings {
    name?: string;
    kingdomFlag?: string;
    duckyFlag?: string;
    pipsFlag?: string;
    rewards?: {
        choresPerCoupon?: number;
        choresPerDateNight?: number;
        pools?: Record<string, string[]>;
    };
    income?: {
        ducky: number;
        pips: number;
    };
}

export interface Chore {
    id: string;
    title: string;
    frequency: string;
    assignedTo: string | null;
    status: 'pending' | 'completed';
    isPrettyPlease?: boolean;
    type?: 'whim' | 'habit' | 'chore';
    goalId?: string;
    dueDate?: string;
    createdAt?: any;
    completedAt?: any;
    completedBy?: string;
    votes?: Record<string, string>;
    redeemedForCoupon?: boolean;
    redeemedForDate?: boolean;
}

export interface Goal {
    id: string;
    title: string;
    type: 'personal' | 'shared';
    owner?: string;
    completed?: boolean;
    financialTarget?: number;
    savedAmount?: number;
    timeframe?: string;
    tasks?: { id: number; text: string; completed: boolean }[];
    habits?: { id: number; text: string; frequency: string }[];
    contributions?: { who: string; amount: number; date: string }[];
}

export interface Bill {
    id: string;
    title: string;
    amount: number;
    frequency: string;
    date: string;
    totalPaid?: number;
    payments?: { who: string; amount: number; date: string }[];
}

export interface IOU {
    id: string;
    from: string;
    to: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved';
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'personal' | 'shared';
    owner: string;
    acks?: Record<string, boolean>;
}

export interface ShoppingItem {
    id: string;
    text: string;
    priority: 'normal' | 'high' | 'treat';
    completed: boolean;
    owner: string;
}

export interface DateNight {
    id: string;
    status: 'budgeting' | 'parameters' | 'activity' | 'twist' | 'planned' | 'review' | 'completed';
    createdAt: string;
    stageData: Record<string, any>;
    finalDetails?: Record<string, any>;
    review?: string;
    photo?: string;
    activity?: string;
    place?: string;
    food?: string;
    date?: string;
    vibe?: string; // Derived from history usually
}

export interface Activity {
    id: string;
    who: string;
    description: string;
    items?: string[];
    createdAt?: any;
}

export interface Announcement {
    id: string;
    message: string;
    from: string;
    active: boolean;
    createdAt?: any;
}

export interface Joke {
    id: string;
    text: string;
    who: string;
    rating: 'funny' | 'hilarious';
    createdAt?: any;
}

export interface Note {
    id: string;
    title: string;
    content?: string;
    blocks?: {id: string, text: string, author: string}[];
    createdBy: string;
    createdAt?: any;
}

export interface Coupon {
    id: string;
    title: string;
    owner: string;
    isUsed: boolean;
}

export interface SubscriptionStatus {
    status: 'active' | 'inactive' | 'trialing' | 'error';
    debug?: string;
    checkoutCreated?: boolean;
}

export type Tab = 'castle' | 'list' | 'assign' | 'dates' | 'budget' | 'shop' | 'goals' | 'rewards' | 'calendar' | 'jokes' | 'notes';