export async function getTallinnPopulationByYear() {
  const data = await fetchTallinnPopulation()
  const populationByYear = toYearPopulationMap(data)
  return populationByYear
}

async function fetchTallinnPopulation() {
  const url =
    "https://andmed.stat.ee/api/v1/en/stat/RV0240";

  // Tallinn total: Sex = "Males and females" (1), Age = "Total" (000), Place = "..Tallinn" (37)
  // Years: pick what you want (or extend)
  const body = {
    query: [
      { code: "Sugu", selection: { filter: "item", values: ["1"] } },
      { code: "Vanus", selection: { filter: "item", values: ["000"] } },
      { code: "Elukoht", selection: { filter: "item", values: ["784"] } },
      {
        code: "Aasta",
        selection: {
          filter: "all",
          values: ["*"],
        },
      },
    ],
    response: { format: "json-stat2" },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data
}

function toYearPopulationMap(json: any) {
  const yearIndex = json.dimension.Aasta.category.index;
  const values = json.value;

  // PX-Web sometimes gives index as object, sometimes array
  if (Array.isArray(yearIndex)) {
    // index is already ordered
    return yearIndex.reduce((acc, year, i) => {
      acc[year] = values[i];
      return acc;
    }, {});
  }

  // index is an object: { "2015": 0, "2016": 1, ... }
  return Object.entries(yearIndex)
    .sort((a: any, b: any) => a[1] - b[1]) // ensure correct order
    .reduce((acc: any, [year, idx]: [year: any, idx: any]) => {
      acc[year] = values[idx];
      return acc;
    }, {});
}