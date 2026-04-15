import type { HammamSectionData, HammamEntry } from "@/types";

export const hammamSections: HammamSectionData[] = [
  { name: "Hammam Hommes", status: "ouvert", visitors: 12, capacity: 25, temp: "45°C", revenue: 62000 },
  { name: "Hammam Femmes", status: "maintenance", visitors: 0, capacity: 20, temp: "—", revenue: 0 },
];

export const hammamEntries: HammamEntry[] = [
  { time: "08:30", name: "Client #1-12", section: "Hommes", type: "Entrée simple", amount: 500 },
  { time: "09:00", name: "Client #13-18", section: "Hommes", type: "Entrée + Gommage", amount: 1000 },
  { time: "10:15", name: "Client #19-22", section: "Hommes", type: "Forfait VIP", amount: 2000 },
];

export function getTotalHammamRevenue(): number {
  return hammamSections.reduce((s, h) => s + h.revenue, 0);
}

export function getTotalVisitorsToday(): number {
  return hammamEntries.reduce((sum, e) => {
    const match = e.name.match(/#(\d+)-(\d+)/);
    if (match) return sum + (parseInt(match[2]) - parseInt(match[1]) + 1);
    return sum + 1;
  }, 0);
}
