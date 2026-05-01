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
    items: SetupScreenItem[];
};

export type SetupScreenItem = NormalizedSetupItem & {
    isDisabled: boolean;
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
    match: (item: SetupScreenItem) => boolean;
};

type SetupScreenCarClassKeyMaps = {
    hidden: string[];
    disabled: string[];
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

export const SECTION_ITEM_ORDER: Partial<Record<string, string[]>> = {
    "basic.tyre-management": [
        "*FL*",
        "*FR*",
        "*RL*",
        "*RR*"
    ],
    "basic.electronics": [
        "*BALANCE*",
        "*ANTILOCK*",
        "*TRACTION*"
    ],
    "powertrain.engine": [
        "*VIRTUAL*",
        "*FUEL*",
        "*REV*",
        "*MIXTURE*",
        "*WATER*",
        "*OIL*"
    ],
    "powertrain.electronics": [
        "*TRACTION*",
        "*REGEN*",
        "*MOTOR*",
    ],
    "powertrain.differential": [
        "*VM_DIFF_POWER*",
        "*VM_DIFF_COAST*",
        "*VM_DIFF*",
        "*POWER*",
        "*COAST*",
        "*PRELOAD*"
    ],
    "powertrain.gearing": [
        "*RATIO*"
    ],
    "wheel-brakes.front-wheels": [
        "*COMPOUND*",
        "*PRESSURE*",
        "*CAMBER*",
        "*BRAKE*"
    ],
    "wheel-brakes.rear-wheels": [
        "*COMPOUND*",
        "*PRESSURE*",
        "*CAMBER*",
        "*BRAKE*"
    ],
    "wheel-brakes.brakes": [
        "*BALANCE*",
        "*MIGRATION*",
        "*PRESSURE*",
        "*DUCTS*",
        "*ANTILOCK*",
    ],
    "suspension.front-suspension": [
        "*WM_SPRING-W_FL*",
        "*WM_SPRING-W_FR*",
        "*TENDERSPRINGTRAVEL-W_FL*",
        "*3RD_TENDERSPRINGTRAVEL*",
        "*TENDERSPRINGTRAVEL-W_FR*",
        "*PACKERS*",
        "*RIDEHEIGHT*",
        "*RUBBER*",
        "*TENDERSPRING-W_FL*",
        "*TENDERSPRING*"
    ],
    "suspension.rear-suspension": [
        "*WM_SPRING-W_RL*",
        "*WM_SPRING-W_RR*",
        "*TENDERSPRINGTRAVEL-W_RL*",
        "*3RD_TENDERSPRINGTRAVEL*",
        "*TENDERSPRINGTRAVEL-W_RR*",
        "*PACKERS*",
        "*RIDEHEIGHT*",
        "*RUBBER*",
        "*TENDERSPRING-W_RL*",
        "*TENDERSPRING*"
    ],
    "dampers.front-dampers": [
        "*SLOW*",
        "*FAST*"
    ],
    "dampers.rear-dampers": [
        "*SLOW*",
        "*FAST*"
    ],
    "chassis-aero.front-chassis": [
        "*CASTER*",
        "*TOE*",
        "*SWAY*",
        "*TRACK*",
        "*STEER*",
        "*WING*"
    ],
    "chassis-aero.rear-chassis": [
        "*TOE*",
        "*SWAY*",
        "*TRACK*",
        "*STEER*",
        "*WING*"
    ],
    "chassis-aero.weight": [
        "*VERTICAL*",
        "*LATERAL*",
        "*DIST*"
    ]
};

export const CARCLASS_ITEM_KEY_MAPS: Record<SetupScreenCarProfile, SetupScreenCarClassKeyMaps> = {
    default: {
        hidden: [],
        disabled: [],
    },
    gt3: {
        hidden: [
            "*FUEL_CAPACITY*",
            "*DIFF_PUMP*",
            "*TORQUE*",
            "*WEIGHT*",
            "VM_FRONT_3RD_TENDERSPRING",
            "*TENDERSPRING-*",
        ],
        disabled: [
            "*DIFF_POWER*",
            "*DIFF_COAST*",
            "*FRONT_DIFF_PRELOAD*",
            "*REV*",
            "*RATIO*",
            "*REGEN*",
            "*MOTOR*",
            "*DISC*",
            "*MIGRATION*",
            "*TENDERSPRINGTRAVEL*",
            "*FRONT_WING*",
            "*CASTER*",
            "*WHEEL_TRACK*"
        ],
    },
    gte: {
        hidden: [
            "*VIRTUAL_ENERGY*",
        ],
        disabled: [],
    },
    lmp3: {
        hidden: [],
        disabled: [],
    },
    lmp2: {
        hidden: [],
        disabled: [],
    },
    hypercar: {
        hidden: [],
        disabled: [],
    },
};

function includesAny(value: string, tokens: string[]) {
    return tokens.some((token) => value.includes(token));
}

function isMeaningfulSetupValue(value: string) {
    return true

    // return (
    //     !!value &&
    //     value !== "Standard" &&
    //     value !== "Fixed" &&
    //     value !== "Non-adjustable"
    // );
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
        "SPRINGRUBBER"
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

export function getSectionOrderRules(tab: SetupScreenTabId, sectionId: string): string[] {
    const tabSectionRules = SECTION_ITEM_ORDER[`${tab}.${sectionId}`];

    if (tabSectionRules && tabSectionRules.length > 0) {
        return tabSectionRules;
    }

    return SECTION_ITEM_ORDER[sectionId] ?? [];
}

function doesKeyMatchToken(itemKey: string, rawToken: string): boolean {
    const normalizedKey = itemKey.toUpperCase();
    const token = rawToken.trim().toUpperCase();

    if (!token) {
        return false;
    }

    if (token === "*") {
        return true;
    }

    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
        const containsToken = token.slice(1, -1);
        return !!containsToken && normalizedKey.includes(containsToken);
    }

    if (token.startsWith("*")) {
        const suffix = token.slice(1);
        return !!suffix && normalizedKey.endsWith(suffix);
    }

    if (token.endsWith("*")) {
        const prefix = token.slice(0, -1);
        return !!prefix && normalizedKey.startsWith(prefix);
    }

    return normalizedKey === token;
}

export function getItemOrderIndex(itemKey: string, rules: string[]): number {
    for (let i = 0; i < rules.length; i += 1) {
        const rawRule = rules[i]?.trim();
        if (!rawRule) continue;

        if (doesKeyMatchToken(itemKey, rawRule)) {
            return i;
        }
    }

    return Number.POSITIVE_INFINITY;
}

export function sortSectionItems(
    tab: SetupScreenTabId,
    sectionId: string,
    items: SetupScreenItem[]
): SetupScreenItem[] {
    const rules = getSectionOrderRules(tab, sectionId);

    return [...items].sort((a, b) => {
        const aIndex = getItemOrderIndex(a.key, rules);
        const bIndex = getItemOrderIndex(b.key, rules);
        const aMatched = Number.isFinite(aIndex);
        const bMatched = Number.isFinite(bIndex);

        if (aMatched !== bMatched) {
            return aMatched ? -1 : 1;
        }

        if (aMatched && bMatched && aIndex !== bIndex) {
            return aIndex - bIndex;
        }

        const byLabel = a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
        if (byLabel !== 0) {
            return byLabel;
        }

        return a.key.localeCompare(b.key, undefined, { sensitivity: "base" });
    });
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
            return ((isChassisKey(key) && isFrontKey(key)) || key.includes("CASTER") || key.includes("STEER")) && !key.includes("WEIGHT") && !key.includes("CHASSIS_ADJUSTMENT");
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
        match: (item) => item.key.toUpperCase().includes("WEIGHT"),
    },
    {
        id: "advanced-chassis",
        tab: "chassis-aero",
        label: "Advanced chassis",
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
    const defaultKeyMaps = CARCLASS_ITEM_KEY_MAPS.default;
    const profileKeyMaps = CARCLASS_ITEM_KEY_MAPS[profile];
    const hiddenTokens = [...defaultKeyMaps.hidden, ...profileKeyMaps.hidden];
    const disabledTokens = [...defaultKeyMaps.disabled, ...profileKeyMaps.disabled];

    const allItems = Object.values(setup)
        .flat()
        .filter((item) => isMeaningfulSetupValue(item.value))
        .filter((item) => !hiddenTokens.some((token) => doesKeyMatchToken(item.key, token)))
        .map<SetupScreenItem>((item) => ({
            ...item,
            isDisabled: disabledTokens.some((token) => doesKeyMatchToken(item.key, token)),
        }));
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

    // const remainingItems = allItems.filter((item) => !matchedKeys.has(item.key));

    // for (const item of remainingItems) {
    //     const tab = fallbackTabForItem(item);
    //     const fallbackSectionId = `${tab}-other`;
    //     const fallbackSectionLabel = "Additional settings";
    //     const existingSection = sectionsByTab[tab].find(
    //         (section) => section.id === fallbackSectionId
    //     );

    //     if (existingSection) {
    //         existingSection.items.push(item);
    //         continue;
    //     }

    //     sectionsByTab[tab].push({
    //         id: fallbackSectionId,
    //         label: fallbackSectionLabel,
    //         items: [item],
    //     });
    // }

    return TAB_ORDER.map((tab) => ({
        id: tab,
        label: TAB_LABELS[tab],
        sections: sectionsByTab[tab].map((section) => ({
            ...section,
            items: sortSectionItems(tab, section.id, section.items),
        })),
    })).filter((tab) => tab.sections.length > 0);
}