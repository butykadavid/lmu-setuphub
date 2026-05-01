export type TelemetryCarClassKey = "default" | "gt3" | "gte" | "lmp3" | "lmp2" | "hypercar";

export type TelemetryCarRosterEntry = {
	id: string;
	name: string;
	color: string;
	icon?: string;
};

export const GT3_CARS: TelemetryCarRosterEntry[] = [
	{ id: "aston-martin-vantage-amr-gt3-evo", name: "Aston Martin Vantage AMR GT3 Evo", color: "#8bc34a", icon: "aston-martin" },
	{ id: "bmw-m4-gt3", name: "BMW M4 GT3", color: "#3f7cff", icon: "bmw" },
	{ id: "corvette-z06-gt3r", name: "Corvette Z06 GT3.R", color: "#f6d84a", icon: "corvette" },
	{ id: "ferrari-296-gt3", name: "Ferrari 296 GT3", color: "#e43131", icon: "ferrari" },
	{ id: "ford-mustang-gt3", name: "Ford Mustang GT3", color: "#3a67ff", icon: "ford" },
	{ id: "lamborghini-huracan-gt3-evo2", name: "Lamborghini Huracan GT3 EVO2", color: "#8ac926", icon: "lamborghini" },
	{ id: "mclaren-720s-gt3-evo", name: "McLaren 720S GT3 Evo", color: "#ff7a00", icon: "mclaren" },
	{ id: "mercedes-amg-gt3-evo", name: "Mercedes-AMG GT3 Evo", color: "#24d1c3", icon: "mercedes" },
	{ id: "porsche-911-gt3-r", name: "Porsche 911 GT3 R", color: "#ff4d8d", icon: "porsche" },
];

export const GTE_CARS: TelemetryCarRosterEntry[] = [
	{ id: "aston-martin-vantage-gte", name: "Aston Martin Vantage GTE", color: "#7cb342", icon: "aston-martin" },
	{ id: "corvette-c8r", name: "Corvette C8.R", color: "#f4cf3d", icon: "corvette" },
	{ id: "ferrari-488-gte-evo", name: "Ferrari 488 GTE Evo", color: "#e12626", icon: "ferrari" },
	{ id: "porsche-911-rsr-19", name: "Porsche 911 RSR-19", color: "#ff5c93", icon: "porsche" },
];

export const LMP3_CARS: TelemetryCarRosterEntry[] = [
	{ id: "ligier-js-p320", name: "Ligier JS P320", color: "#2e90ff", icon: "ligier" },
	{ id: "duqueine-d08", name: "Duqueine D08", color: "#ff7a00", icon: "duqueine" },
	{ id: "ginetta-g61-lt-p3", name: "Ginetta G61-LT-P3", color: "#f44336", icon: "ginetta" },
];

export const LMP2_CARS: TelemetryCarRosterEntry[] = [
	{ id: "oreca-07-gibson", name: "ORECA 07 Gibson", color: "#00acc1", icon: "oreca" },
];

export const HYPERCAR_CARS: TelemetryCarRosterEntry[] = [
	{ id: "alpine-a424", name: "Alpine A424", color: "#1d6cff", icon: "alpine" },
	{ id: "bmw-m-hybrid-v8", name: "BMW M Hybrid V8", color: "#3f7cff", icon: "bmw" },
	{ id: "cadillac-v-seriesr", name: "Cadillac V-Series.R", color: "#d62828", icon: "cadillac" },
	{ id: "ferrari-499p", name: "Ferrari 499P", color: "#dd2727", icon: "ferrari" },
	{ id: "peugeot-9x8", name: "Peugeot 9X8", color: "#94d82d", icon: "peugeot" },
	{ id: "porsche-963", name: "Porsche 963", color: "#ff4d8d", icon: "porsche" },
	{ id: "toyota-gr010-hybrid", name: "Toyota GR010 HYBRID", color: "#ef4444", icon: "toyota" },
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

export function findMatchingCarId(carName: string, cars: TelemetryCarRosterEntry[]): string {
	const normalizedName = carName.trim().toLowerCase();

	const exact = cars.find((car) => car.name.toLowerCase() === normalizedName);
	if (exact) return exact.id;

	const contains = cars.find((car) =>
		car.name.toLowerCase().includes(normalizedName) || normalizedName.includes(car.name.toLowerCase())
	);

	return contains?.id ?? "";
}
