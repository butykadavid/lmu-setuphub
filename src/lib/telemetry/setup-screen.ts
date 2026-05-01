import type { NormalizedSetupItem } from "@/lib/telemetry/noramlize-setup";
import type { GroupedSetup } from "@/lib/telemetry/types";

export type SetupScreenTabId =
    | "basic"
    | "powertrain"
    | "wheel-brakes"
    | "suspension"
    | "dampers"
    | "chassis-aero";

export type SetupScreenCarProfile = "default" | "gt3" | "gte" | "lmp3" | "lmp2" | "hypercar";

export type SetupScreenSection = {
    id: string;
    label: string;
    items: NormalizedSetupItem[];
};

export type SetupScreenTab = {
    id: SetupScreenTabId;
    label: string;
    sections: SetupScreenSection[];
};

type SectionConfig = {
    id: string;
    tab: SetupScreenTabId;
    label: string;
    hiddenForProfiles?: SetupScreenCarProfile[];
    match: (item: NormalizedSetupItem) => boolean;
};

const TAB_LABELS: Record<SetupScreenTabId, string> = {
    "basic": "Basic",
    "powertrain": "Powertrain",
    "wheel-brakes": "Wheel & brakes",
    "suspension": "Suspension",
    "dampers": "Dampers",
    "chassis-aero": "Chassis & Aero",
};

const TAB_ORDER: SetupScreenTabId[] = [
    "basic",
    "powertrain",
    "wheel-brakes",
    "suspension",
    "dampers",
    "chassis-aero",
];

function includesAny(value: string, tokens: string[]) {
    return tokens.some((token) => value.includes(token));
}

function isMeaningfulSetupValue(value: string) {
    return (
        !!value &&
        value !== "Standard" &&
        value !== "Fixed" &&
        value !== "Non-adjustable"
    );
}

// Basic is a special tab for the most common and easily identifiable settings
// Data here is also found in other tabs
function isBasicTabItemKey(key: string) {
    const basicKeys = [
        // Tyres
        "WM_COMPOUND-W_FL",
        "WM_COMPOUND-W_FR",
        "WM_COMPOUND-W_RL",
        "WM_COMPOUND-W_RR",
        // Virtual energy
        "VM_VIRTUAL_ENERGY",
        // Electronics
        "VM_BRAKE_BALANCE",
        "VM_ANTILOCKBRAKESYSTEMMAP",
        "VM_TRACTIONCONTROLMAP",
        "VM_TRACTIONCONTROLPOWERCUTMAP",
        "VM_TRACTIONCONTROLSLIPANGLEMAP",
        // Aero
        "VM_REAR_WING"
    ];

    return basicKeys.includes(key.toUpperCase());
}

function isFrontKey(key: string) {
    return key.includes("FRONT") || key.includes("_FL") || key.includes("_FR");
}

function isRearKey(key: string) {
    return key.includes("REAR") || key.includes("_RL") || key.includes("_RR");
}

function isThirdSpringKey(key: string) {
    return key.includes("3RD") || key.includes("THIRD");
}

function isWheelKey(key: string) {
    console.log(key)
    return (
        includesAny(key, ["PRESSURE", "COMPOUND", "CAMBER", "BRAKEDISC", "TYRE"])
    );
}

function isBrakeKey(key: string) {
    return includesAny(key, ["BALANCE", "MIGRATION", "BRAKE_PRESSURE", "DUCTS", "VM_ANTILOCKBRAKESYSTEMMAP"]);
}

function isDamperKey(key: string) {
    return includesAny(key, ["BUMP", "REBOUND"]);
}

function isSuspensionKey(key: string) {
    return includesAny(key, [
        "SPRING",
        "PACKERS",
        "RIDEHEIGHT",
        "SPRINGRUBBER",
    ]);
}

function isChassisKey(key: string) {
    return includesAny(key, [
        "TOEIN",
        "CASTER",
        "TRACK",
        "WEIGHT",
        "CHASSIS_ADJUSTMENT",
        "WING",
        "ANTISWAY"
    ]);
}

function isAeroKey(key: string) {
    return includesAny(key, ["WING", "FLAP", "DIFFUSER", "FENDER", "DIVE"]);
}

function isEngineKey(key: string) {
    return includesAny(key, ["ENGINE", "RADIATOR", "REV_LIMITER", "MIXTURE"]);
}

function isFuelKey(key: string) {
    return includesAny(key, ["FUEL", "VIRTUAL_ENERGY"]);
}

function isDifferentialKey(key: string) {
    return includesAny(key, ["DIFF", "TORQUE"]);
}

function isGearingKey(key: string) {
    return includesAny(key, [/*"GEAR",*/ "RATIO_SET", "RATIOSET"]);
}

function isElectronicsKey(key: string) {
    return includesAny(key, ["TRACTIONCONTROL", "TC", "REGEN", "MOTOR"]);
}

function isVirtualEnergyKey(key: string) {
    return key.includes("VIRTUAL_ENERGY");
}

function detectCarProfile(carClass: string): SetupScreenCarProfile {
    const normalized = carClass.trim().toLowerCase();

    switch (normalized) {
        case "gt3":
            return "gt3";
        case "gte":
            return "gte";
        case "lmp3":
            return "lmp3";
        case "lmp2":
            return "lmp2";
        case "hypercar":
            return "hypercar";
        default:
            return "default";
    }
}

const SECTION_CONFIGS: SectionConfig[] = [
    {
        id: "tyre-management",
        tab: "basic",
        label: "Tyre management",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isWheelKey(key) && isBasicTabItemKey(key);
        },
    },
    {
        id: "virtual-energy",
        tab: "basic",
        label: "Virtual energy",
        hiddenForProfiles: ["gte", "lmp3", "lmp2"],
        match: (item) => {
            const key = item.key.toUpperCase();
            return isVirtualEnergyKey(key) && isBasicTabItemKey(key);
        },
    },
    {
        id: "electronics",
        tab: "basic",
        label: "Electronics",
        match: (item) => {
            const key = item.key.toUpperCase();
            return key.includes("BRAKE_BALANCE") || key.includes("ANTILOCKBRAKESYSTEMMAP") || (isElectronicsKey(key) && isBasicTabItemKey(key));
        },
    },
    {
        id: "aero",
        tab: "basic",
        label: "Aero",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isAeroKey(key) && isBasicTabItemKey(key);
        },
    },
    {
        id: "engine",
        tab: "powertrain",
        label: "Engine",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isEngineKey(key) || isFuelKey(key);
        },
    },
    {
        id: "electronics",
        tab: "powertrain",
        label: "Electronics",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isElectronicsKey(key);
        },
    },
    {
        id: "differential",
        tab: "powertrain",
        label: "Differential",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isDifferentialKey(key);
        },
    },
    {
        id: "gearing",
        tab: "powertrain",
        label: "Gearing",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isGearingKey(key);
        },
    },
    {
        id: "front-wheels",
        tab: "wheel-brakes",
        label: "Front wheels",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isWheelKey(key) && isFrontKey(key) && !isBrakeKey(key);
        },
    },
    {
        id: "rear-wheels",
        tab: "wheel-brakes",
        label: "Rear wheels",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isWheelKey(key) && isRearKey(key) && !isBrakeKey(key);
        },
    },
    {
        id: "brakes",
        tab: "wheel-brakes",
        label: "Brakes",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isBrakeKey(key);
        },
    },
    {
        id: "front-suspension",
        tab: "suspension",
        label: "Front suspension",
        match: (item) => {
            const key = item.key.toUpperCase();
            return (isSuspensionKey(key) || isThirdSpringKey(key)) && isFrontKey(key) && !isDamperKey(key);
        },
    },
    {
        id: "rear-suspension",
        tab: "suspension",
        label: "Rear suspension",
        match: (item) => {
            const key = item.key.toUpperCase();
            return (isSuspensionKey(key) || isThirdSpringKey(key)) && isRearKey(key) && !isDamperKey(key);
        },
    },
    {
        id: "front-dampers",
        tab: "dampers",
        label: "Front dampers",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isDamperKey(key) && isFrontKey(key);
        },
    },
    {
        id: "rear-dampers",
        tab: "dampers",
        label: "Rear dampers",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isDamperKey(key) && isRearKey(key);
        },
    },
    {
        id: "third-spring-dampers",
        tab: "dampers",
        label: "3rd spring",
        hiddenForProfiles: ["gt3"],
        match: (item) => {
            const key = item.key.toUpperCase();
            return isDamperKey(key) && isThirdSpringKey(key);
        },
    },
    {
        id: "front-chassis",
        tab: "chassis-aero",
        label: "Front chassis",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isChassisKey(key) && isFrontKey(key) && !key.includes("WEIGHT") && !key.includes("CHASSIS_ADJUSTMENT") || key.includes("STEER_LOCK");
        },
    },
    {
        id: "rear-chassis",
        tab: "chassis-aero",
        label: "Rear chassis",
        match: (item) => {
            const key = item.key.toUpperCase();
            return isChassisKey(key) && isRearKey(key) && !key.includes("WEIGHT") && !key.includes("CHASSIS_ADJUSTMENT");
        },
    },
    {
        id: "weight",
        tab: "chassis-aero",
        label: "Weight",
        hiddenForProfiles: ["gt3"],
        match: (item) => item.key.toUpperCase().includes("WEIGHT"),
    },
    {
        id: "advanced-chassis",
        tab: "chassis-aero",
        label: "Advanced chassis",
        hiddenForProfiles: ["gt3"],
        match: (item) => item.key.toUpperCase().includes("CHASSIS_ADJUSTMENT"),
    }
];

function fallbackTabForItem(item: NormalizedSetupItem): SetupScreenTabId {
    const key = item.key.toUpperCase();

    if (isEngineKey(key) || isDifferentialKey(key) || isGearingKey(key) || isElectronicsKey(key)) {
        return "powertrain";
    }

    if (isWheelKey(key) || isBrakeKey(key)) {
        return "wheel-brakes";
    }

    if (isDamperKey(key)) {
        return "dampers";
    }

    if (isSuspensionKey(key)) {
        return "suspension";
    }

    if (isChassisKey(key) || isAeroKey(key)) {
        return "chassis-aero";
    }

    return "basic";
}

export function mapSetupToScreenTabs(
    setup: GroupedSetup,
    carClass: string
): SetupScreenTab[] {
    const profile = detectCarProfile(carClass);
    const allItems = Object.values(setup)
        .flat()
        .filter((item) => isMeaningfulSetupValue(item.value));
    const matchedKeys = new Set<string>();
    const sectionsByTab: Record<SetupScreenTabId, SetupScreenSection[]> = {
        "basic": [],
        "powertrain": [],
        "wheel-brakes": [],
        "suspension": [],
        "dampers": [],
        "chassis-aero": [],
    };

    for (const section of SECTION_CONFIGS) {
        if (section.hiddenForProfiles?.includes(profile)) {
            continue;
        }

        const items = allItems.filter((item) => section.match(item));

        if (items.length === 0) {
            continue;
        }

        items.forEach((item) => matchedKeys.add(item.key));
        sectionsByTab[section.tab].push({
            id: section.id,
            label: section.label,
            items,
        });
    }

    const remainingItems = allItems.filter((item) => !matchedKeys.has(item.key));

    for (const item of remainingItems) {
        const tab = fallbackTabForItem(item);
        const fallbackSectionId = `${tab}-other`;
        const fallbackSectionLabel = "Additional settings";
        const existingSection = sectionsByTab[tab].find(
            (section) => section.id === fallbackSectionId
        );

        if (existingSection) {
            existingSection.items.push(item);
            continue;
        }

        sectionsByTab[tab].push({
            id: fallbackSectionId,
            label: fallbackSectionLabel,
            items: [item],
        });
    }

    return TAB_ORDER.map((tab) => ({
        id: tab,
        label: TAB_LABELS[tab],
        sections: sectionsByTab[tab],
    })).filter((tab) => tab.sections.length > 0);
}