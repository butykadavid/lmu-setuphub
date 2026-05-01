export type TelemetryCarClassKey = "default" | "gt3" | "gte" | "lmp3" | "lmp2" | "hypercar";

type colorIconBrandRow = {
	color: string;
	icon: string;
};

const colorIconBrandMap: Record<string, colorIconBrandRow> = {
	"aston-martin": { color: "#01655C", icon: "aston-martin" },
	"bmw": { color: "#0166B1", icon: "bmw" },
	"corvette": { color: "#f6d84a", icon: "corvette" },
	"ferrari": { color: "#e42528", icon: "ferrari" },
	"ford": { color: "#003478", icon: "ford" },
	"lamborghini": { color: "#d8a016", icon: "lamborghini" },
	"mclaren": { color: "#ff8000", icon: "mclaren" },
	"mercedes": { color: "#788084", icon: "mercedes" },
	"porsche": { color: "#EBD698", icon: "porsche" },
	"ligier": { color: "#0E6DA3", icon: "ligier" },
	"duqueine": { color: "#1CFF20", icon: "duqueine" },
	"ginetta": { color: "#666666", icon: "ginetta" },
	"oreca": { color: "#1A73E8", icon: "oreca" },
	"alpine": { color: "#006FBA", icon: "alpine" },
	"cadillac": { color: "#D1CA00", icon: "cadillac" },
	"peugeot": { color: "#A9F35E", icon: "peugeot" },
	"toyota": { color: "#EB0A1E", icon: "toyota" },
	"glickenhaus": { color: "#53BDE0", icon: "glickenhaus" },
	"isotta-fraschini": { color: "#ef4444", icon: "isotta-fraschini" },
	"vanwall": { color: "#93D501", icon: "vanwall" },
	"genesis": { color: "#FF4E01", icon: "genesis" },
	"lexus": { color: "#FF443B", icon: "lexus" },
};


export type TelemetryCarRosterEntry = {
	id: string;
	name: string;
	color: string;
	icon?: string;
	hints?: string[];
};

export const GT3_CARS: TelemetryCarRosterEntry[] = [
	{
		id: "aston-martin-vantage-amr-lmgt3-evo",
		name: "Aston Martin Vantage AMR LMGT3 Evo",
		color: colorIconBrandMap["aston-martin"].color,
		icon: colorIconBrandMap["aston-martin"].icon,
		hints: ["Heart of racing", "Racing spirit", "AMR", "Aston", "Martin", "Thor"]
	},
	{
		id: "bmw-m4-lmgt3",
		name: "BMW M4 LMGT3",
		color: colorIconBrandMap["bmw"].color,
		icon: colorIconBrandMap["bmw"].icon,
		hints: ["M", "WRT", "BMW", "Bimmer", "Beemer"]
	},
	{
		id: "corvette-z06-lmgt3r",
		name: "Corvette Z06 LMGT3.R",
		color: colorIconBrandMap["corvette"].color,
		icon: colorIconBrandMap["corvette"].icon,
		hints: ["TF", "Chevy", "Chevrolet", "Corvette", "Turkey"]
	},
	{
		id: "ferrari-296-lmgt3",
		name: "Ferrari 296 LMGT3",
		color: colorIconBrandMap["ferrari"].color,
		icon: colorIconBrandMap["ferrari"].icon,
		hints: ["Ferrari", "Vista", "AF Corse", "Corse"]
	},
	{
		id: "ford-mustang-lmgt3",
		name: "Ford Mustang LMGT3",
		color: colorIconBrandMap["ford"].color,
		icon: colorIconBrandMap["ford"].icon,
		hints: ["Ford", "Mustang", "Proton"]
	},
	{
		id: "lamborghini-huracan-lmgt3-evo2",
		name: "Lamborghini Huracan LMGT3 EVO2",
		color: colorIconBrandMap["lamborghini"].color,
		icon: colorIconBrandMap["lamborghini"].icon,
		hints: ["Lamborghini", "Iron Lynx 2024", "Iron Lynx 2023", "Iron Dames 2024", "Iron Dames 2023"]
	},
	{
		id: "mclaren-720s-lmgt3-evo",
		name: "McLaren 720S LMGT3 Evo",
		color: colorIconBrandMap["mclaren"].color,
		icon: colorIconBrandMap["mclaren"].icon,
		hints: ["McLaren", "Garage 59", "Papaya", "United Autosports"]
	},
	{
		id: "mercedes-amg-lmgt3-evo",
		name: "Mercedes-AMG LMGT3 Evo",
		color: colorIconBrandMap["mercedes"].color,
		icon: colorIconBrandMap["mercedes"].icon,
		hints: ["Mercedes", "AMG", "Merc", "Iron Lynx 2025", "Iron Lynx 2026"]
	},
	{
		id: "porsche-911-gt3-r",
		name: "Porsche 911 GT3 R",
		color: colorIconBrandMap["porsche"].color,
		icon: colorIconBrandMap["porsche"].icon,
		hints: ["Porsche", "Manthey", "Iron Dames 2025"]
	},
	{
		id: "lexus-rc-f-lmgt3",
		name: "Lexus RC F LMGT3",
		color: colorIconBrandMap["lexus"].color,
		icon: colorIconBrandMap["lexus"].icon,
		hints: ["Lexus", "Akkodis", "ASP"]
	},
];

export const GTE_CARS: TelemetryCarRosterEntry[] = [
	{
		id: "aston-martin-vantage-gte",
		name: "Aston Martin Vantage GTE",
		color: colorIconBrandMap["aston-martin"].color,
		icon: colorIconBrandMap["aston-martin"].icon,
		hints: ["AMR", "Aston", "Martin", "Heart of racing", "Racing spirit"]
	},
	{
		id: "corvette-c8r",
		name: "Corvette C8.R",
		color: colorIconBrandMap["corvette"].color,
		icon: colorIconBrandMap["corvette"].icon,
		hints: ["Corvette", "Chevy", "Chevrolet"]
	},
	{
		id: "ferrari-488-gte-evo",
		name: "Ferrari 488 GTE Evo",
		color: colorIconBrandMap["ferrari"].color,
		icon: colorIconBrandMap["ferrari"].icon,
		hints: ["Ferrari", "Vista", "AF Corse", "Corse"]
	},
	{
		id: "porsche-911-rsr-19",
		name: "Porsche 911 RSR-19",
		color: colorIconBrandMap["porsche"].color,
		icon: colorIconBrandMap["porsche"].icon,
		hints: ["Porsche", "Manthey"]
	},
];

export const LMP3_CARS: TelemetryCarRosterEntry[] = [
	{
		id: "ligier-js-p320",
		name: "Ligier JS P320",
		color: colorIconBrandMap["ligier"].color,
		icon: colorIconBrandMap["ligier"].icon,
		hints: ["Ligier"]
	},
	{
		id: "duqueine-d08",
		name: "Duqueine D08",
		color: colorIconBrandMap["duqueine"].color,
		icon: colorIconBrandMap["duqueine"].icon,
		hints: ["Duqueine"]
	},
	{
		id: "ginetta-g61-lt-p3",
		name: "Ginetta G61-LT-P3",
		color: colorIconBrandMap["ginetta"].color,
		icon: colorIconBrandMap["ginetta"].icon,
		hints: ["Ginetta"]
	},
];

export const LMP2_CARS: TelemetryCarRosterEntry[] = [
	{
		id: "oreca-07-gibson-2023",
		name: "ORECA 07 Gibson 2023",
		color: colorIconBrandMap["oreca"].color,
		icon: colorIconBrandMap["oreca"].icon,
		hints: ["ORECA"]
	},
	{
		id: "oreca-07-gibson-2024",
		name: "ORECA 07 Gibson 2024",
		color: colorIconBrandMap["oreca"].color,
		icon: colorIconBrandMap["oreca"].icon,
		hints: ["ORECA"]
	},
];

export const HYPERCAR_CARS: TelemetryCarRosterEntry[] = [
	{
		id: "alpine-a424",
		name: "Alpine A424",
		color: colorIconBrandMap["alpine"].color,
		icon: colorIconBrandMap["alpine"].icon,
		hints: ["Alpine"]
	},
	{
		id: "aston-martin-valkyrie-amr-lmh",
		name: "Aston Martin Valkyrie AMR LMH",
		color: colorIconBrandMap["aston-martin"].color,
		icon: colorIconBrandMap["aston-martin"].icon,
		hints: ["AMR", "Aston", "Heart of racing", "Racing spirit", "Thor"]
	},
	{
		id: "bmw-m-hybrid-v8",
		name: "BMW M Hybrid V8",
		color: colorIconBrandMap["bmw"].color,
		icon: colorIconBrandMap["bmw"].icon,
		hints: ["BMW", "WRT", "M"]
	},
	{
		id: "cadillac-v-seriesr",
		name: "Cadillac V-Series.R",
		color: colorIconBrandMap["cadillac"].color,
		icon: colorIconBrandMap["cadillac"].icon,
		hints: ["Cadillac", "Herz"]
	},
	{
		id: "ferrari-499p",
		name: "Ferrari 499P",
		color: colorIconBrandMap["ferrari"].color,
		icon: colorIconBrandMap["ferrari"].icon,
		hints: ["Ferrari", "Vista", "Corse", "AF"]
	},
	{
		id: "peugeot-9x8",
		name: "Peugeot 9X8 (Wingless)",
		color: colorIconBrandMap["peugeot"].color,
		icon: colorIconBrandMap["peugeot"].icon,
		hints: ["Peugeot", "TotalEnergies", "Total Energies"]
	},
	{
		id: "peugeot-9x8-2024",
		name: "Peugeot 9X8 2024",
		color: colorIconBrandMap["peugeot"].color,
		icon: colorIconBrandMap["peugeot"].icon,
		hints: ["Peugeot", "TotalEnergies", "Total Energies"]
	},
	{
		id: "porsche-963",
		name: "Porsche 963",
		color: colorIconBrandMap["porsche"].color,
		icon: colorIconBrandMap["porsche"].icon,
		hints: ["Porsche", "Penske"]
	},
	{
		id: "toyota-gr010-hybrid",
		name: "Toyota GR010 HYBRID",
		color: colorIconBrandMap["toyota"].color,
		icon: colorIconBrandMap["toyota"].icon,
		hints: ["Toyota", "Gazoo", "GR"]
	},
	{
		id: "glickenhaus-scg-007",
		name: "Glickenhaus SCG 007",
		color: colorIconBrandMap["glickenhaus"].color,
		icon: colorIconBrandMap["glickenhaus"].icon,
		hints: ["Glickenhaus", "Scuderia", "SCG", "Cameron"]
	},
	{
		id: "isotta-fraschini-tipo-6",
		name: "Isotta Fraschini Tipo 6",
		color: colorIconBrandMap["isotta-fraschini"].color,
		icon: colorIconBrandMap["isotta-fraschini"].icon,
		hints: ["Isotta Fraschini", "Isotta", "Fraschini"]
	},
	{
		id: "lamborghini-sc63",
		name: "Lamborghini SC63",
		color: colorIconBrandMap["lamborghini"].color,
		icon: colorIconBrandMap["lamborghini"].icon,
		hints: ["Lamborghini", "SC63", "Iron Lynx 2024", "Iron Lynx 2023"]
	},
	{
		id: "vanwall-vandervell-680",
		name: "Vanwall Vandervell 680",
		color: colorIconBrandMap["vanwall"].color,
		icon: colorIconBrandMap["vanwall"].icon,
		hints: ["Vanwall", "Vandervell"]
	},
	{
		id: "genesis-gmr-001",
		name: "Genesis GMR-001",
		color: colorIconBrandMap["genesis"].color,
		icon: colorIconBrandMap["genesis"].icon,
		hints: ["Genesis", "GMR", "Hyundai", "Magma"]
	},
];

export const TELEMETRY_CARS_BY_CLASS: Record<TelemetryCarClassKey, TelemetryCarRosterEntry[]> = {
	default: [],
	gt3: GT3_CARS,
	gte: GTE_CARS,
	lmp3: LMP3_CARS,
	lmp2: LMP2_CARS,
	hypercar: HYPERCAR_CARS,
};

export function detectTelemetryCarClass(carClass: string): TelemetryCarClassKey {
	const normalized = carClass.trim().toLowerCase();

	if (normalized.includes("gt3")) return "gt3";
	if (normalized.includes("gte")) return "gte";
	if (normalized.includes("lmp3")) return "lmp3";
	if (normalized.includes("lmp2")) return "lmp2";
	if (normalized.includes("hypercar")) return "hypercar";

	return "default";
}

export function getCarsForClass(carClass: string): TelemetryCarRosterEntry[] {
	return TELEMETRY_CARS_BY_CLASS[detectTelemetryCarClass(carClass)];
}

function normalizeCarText(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function toWords(value: string): string[] {
	if (!value) {
		return [];
	}

	return normalizeCarText(value).split(" ").filter(Boolean);
}

function includesAllWords(sourceWords: Set<string>, targetWords: string[]): boolean {
	if (targetWords.length === 0) {
		return false;
	}

	return targetWords.every((word) => sourceWords.has(word));
}

export function findMatchingCarId(carName: string, cars: TelemetryCarRosterEntry[]): string {
	const normalizedName = normalizeCarText(carName);
	const inputWords = new Set(toWords(carName));

	if (!normalizedName || cars.length === 0) {
		return "";
	}

	const exact = cars.find((car) => normalizeCarText(car.name) === normalizedName);
	if (exact) return exact.id;

	let bestMatch: TelemetryCarRosterEntry | null = null;
	let bestScore = 0;

	for (const car of cars) {
		let score = 0;
		const carNameWords = toWords(car.name);

		if (includesAllWords(inputWords, carNameWords)) {
			score += 80 + carNameWords.length;
		}

		for (const hint of car.hints ?? []) {
			const hintWords = toWords(hint);
			if (hintWords.length === 0) continue;

			if (normalizedName === normalizeCarText(hint)) {
				score += 120;
				continue;
			}

			if (includesAllWords(inputWords, hintWords)) {
				score += 40 + hintWords.length;
			}
		}

		if (score > bestScore) {
			bestScore = score;
			bestMatch = car;
		}
	}

	return bestMatch?.id ?? "";
}
