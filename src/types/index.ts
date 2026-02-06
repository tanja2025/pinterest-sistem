
export type AssetStatus = 'analyzing' | 'ready' | 'scheduled' | 'posted';

export interface Asset {
    id: string;
    created_at: string;
    image_url: string;
    analysis: {
        niche: string;
        keywords: string[];
        description: string;
        suggested_boards: string[];
    } | null;
    status: AssetStatus;
}

export type PinType = 'SEO' | 'Buyer Intent' | 'Curiosity';

export interface Pin {
    id: string;
    asset_id: string;
    type: PinType;
    title: string;
    description: string;
    destination_url: string;
    created_at: string;
}

export interface ScheduleEntry {
    id: string;
    pin_id: string;
    scheduled_at: string;
    is_posted: boolean;
}
