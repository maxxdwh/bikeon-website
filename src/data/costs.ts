export interface CostItem {
  item: string;
  cost: string;
  notes: string;
}

export interface CostSummary {
  items: CostItem[];
  totalLabel: string;
  totalCost: string;
  totalNote: string;
  asphaltTotal: string;
  annualMaintenance: string;
}

export const costSummary: CostSummary = {
  items: [
    {
      item: "50 bikes",
      cost: "$16,000",
      notes: "Number of bikes may vary",
    },
    {
      item: "100 helmets",
      cost: "$2,000",
      notes: "Mix of small, medium, large",
    },
    {
      item: "Riding track (limestone), 300m",
      cost: "$30,000",
      notes: "Length affects cost",
    },
    {
      item: "Pump track",
      cost: "$8,000",
      notes: "Highly recommended",
    },
    {
      item: "Skills track",
      cost: "$10,000",
      notes: "Highly recommended",
    },
    {
      item: "Bike storage",
      cost: "$14,000",
      notes: "Converted container, if needed",
    },
  ],
  totalLabel: "Average total",
  totalCost: "$80,000",
  totalNote: "Limestone-track basis",
  asphaltTotal: "$125,000",
  annualMaintenance: "$3,000",
};
