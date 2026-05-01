export type RawSetupItem = {
    available?: boolean;
    caption?: string;
    key?: string;
    stringValue?: string;
    value?: number;
    lastSavedStringValue?: string;
    minValue?: number;
    maxValue?: number;
    isFreeSetting?: boolean;
};

export type RawSetup = Record<string, RawSetupItem | unknown>;

export type NormalizedSetupItem = {
    key: string;
    label: string;
    value: string;
    rawValue?: number;
    category: SetupCategory;
    available: boolean;
    changedFromDefault: boolean;
};

export type SetupCategory =
    | "electronics"
    | "brakes"
    | "aero"
    | "suspension"
    | "wheels"
    | "drivetrain"
    | "engine"
    | "strategy"
    | "misc";

const SETUP_LABELS: Record<string, string> = {
    VM_ANTILOCKBRAKESYSTEMMAP: "ABS Map",
    VM_BRAKE_BALANCE: "Brake Balance",
    VM_BRAKE_DUCTS: "Front Brake Ducts",
    VM_BRAKE_DUCTS_REAR: "Rear Brake Ducts",
    VM_BRAKE_MIGRATION: "Brake Migration",
    VM_BRAKE_PRESSURE: "Max Pedal Force",

    VM_DIFF_PRELOAD: "Differential Preload",

    VM_ENGINE_MIXTURE: "Engine Mixture",
    VM_OIL_RADIATOR: "Oil Radiator",
    VM_WATER_RADIATOR: "Water Radiator",

    VM_FRONT_ANTISWAY: "Front Anti-Roll Bar",
    VM_REAR_ANTISWAY: "Rear Anti-Roll Bar",

    VM_FRONT_TIRE_COMPOUND: "Front Tyre Compound",
    VM_REAR_TIRE_COMPOUND: "Rear Tyre Compound",

    VM_FRONT_TOEIN: "Front Toe",
    VM_REAR_TOEIN: "Rear Toe",

    VM_FRONT_WING: "Front Wing",
    VM_REAR_WING: "Rear Wing",

    VM_FUEL_CAPACITY: "Fuel Capacity",
    VM_FUEL_LEVEL: "Fuel Level",
    VM_NUM_PITSTOPS: "Number of Pit Stops",

    VM_STEER_LOCK: "Steering Lock",

    VM_TRACTIONCONTROLMAP: "TC Map",
    VM_TRACTIONCONTROLPOWERCUTMAP: "TC Power Cut",
    VM_TRACTIONCONTROLSLIPANGLEMAP: "TC Slip Angle",
    VM_VIRTUAL_ENERGY: "Virtual Energy",

    WM_PRESSURE_W_FL: "Front Left Tyre Pressure",
};

function getLabel(key: string, item: RawSetupItem): string {
    if (item.caption?.trim()) return item.caption.trim();
    if (SETUP_LABELS[key]) return SETUP_LABELS[key];

    return key
        .replace(/^VM_/, "")
        .replace(/^WM_/, "")
        .replace(/-W_/g, "_")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategory(key: string): SetupCategory {
    if (
        key.includes("ABS") ||
        key.includes("TRACTION") ||
        key.includes("TC") ||
        key.includes("REGEN") ||
        key.includes("VIRTUAL_ENERGY")
    ) {
        return "electronics";
    }

    if (
        key.includes("BRAKE") ||
        key.includes("BRAKEDISC") ||
        key.includes("BRAKEPAD")
    ) {
        return "brakes";
    }

    if (
        key.includes("WING") ||
        key.includes("FLAP") ||
        key.includes("FENDER") ||
        key.includes("DIVE")
    ) {
        return "aero";
    }

    if (
        key.includes("SPRING") ||
        key.includes("BUMP") ||
        key.includes("REBOUND") ||
        key.includes("PACKERS") ||
        key.includes("RIDEHEIGHT") ||
        key.includes("CAMBER") ||
        key.includes("TOEIN") ||
        key.includes("ANTISWAY")
    ) {
        return "suspension";
    }

    if (
        key.includes("COMPOUND") ||
        key.includes("PRESSURE") ||
        key.includes("WHEEL") ||
        key.startsWith("WM_")
    ) {
        return "wheels";
    }

    if (
        key.includes("GEAR") ||
        key.includes("DIFF") ||
        key.includes("TORQUE")
    ) {
        return "drivetrain";
    }

    if (
        key.includes("ENGINE") ||
        key.includes("RADIATOR") ||
        key.includes("REV_LIMITER")
    ) {
        return "engine";
    }

    if (
        key.includes("FUEL") ||
        key.includes("PITSTOP")
    ) {
        return "strategy";
    }

    return "misc";
}

function isRawSetupItem(value: unknown): value is RawSetupItem {
    return (
        typeof value === "object" &&
        value !== null &&
        "stringValue" in value
    );
}

export function normalizeSetup(rawSetup: RawSetup): NormalizedSetupItem[] {
    return Object.entries(rawSetup)
        .filter(([key, item]) => {
            if (key === "gearGraph" || key === "symmetric") return false;
            if (!isRawSetupItem(item)) return false;
            if (item.available === false) return false;
            if (!item.stringValue || item.stringValue === "N/A") return false;

            return true;
        })
        .map(([key, item]) => {
            const setupItem = item as RawSetupItem;
            return {
                key,
                label: getLabel(key, setupItem),
                value: setupItem.stringValue ?? "—",
                rawValue: setupItem.value,
                category: getCategory(key),
                available: setupItem.available ?? true,
                changedFromDefault:
                    !!setupItem.lastSavedStringValue &&
                    setupItem.lastSavedStringValue !== setupItem.stringValue,
            };
        });
}

export function groupSetupByCategory(items: NormalizedSetupItem[]) {
    return items.reduce<Record<SetupCategory, NormalizedSetupItem[]>>(
        (acc, item) => {
            acc[item.category].push(item);
            return acc;
        },
        {
            electronics: [],
            brakes: [],
            aero: [],
            suspension: [],
            wheels: [],
            drivetrain: [],
            engine: [],
            strategy: [],
            misc: [],
        }
    );
}