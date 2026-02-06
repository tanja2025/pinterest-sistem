import { supabase } from "./supabase";

export async function initializeAppData() {
    // 1. Seed Boards
    const defaultBoards = [
        "Home Decor Ideas",
        "Modern Architecture",
        "Minimalist Living",
        "DIY & Crafts",
        "Gift Inspiration"
    ];

    for (const boardName of defaultBoards) {
        await supabase
            .from('boards')
            .upsert({ name: boardName }, { onConflict: 'name' });
    }

    // 2. Seed Default Settings
    const defaultSettings = [
        {
            key: 'generation_rules',
            value: {
                active: true,
                tone: "Professional/Premium",
                language: "English"
            }
        },
        {
            key: 'schedule_offsets',
            value: [0, 2, 5] // Days offset for pins
        }
    ];

    for (const setting of defaultSettings) {
        await supabase
            .from('app_settings')
            .upsert(setting, { onConflict: 'key' });
    }

    console.log("App initialization complete: Boards and Settings seeded.");
}
