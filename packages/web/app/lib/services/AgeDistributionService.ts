type AgeDistributionData = {
  Children: number,
  Teens: number,
  Adults: number,
  Seniors: number
}

export async function getAgeDistributionData() {
  const meta = await fetch(
    'https://andmed.stat.ee/api/v1/en/stat/RV0282U'
  ).then(r => r.json())

  const years = meta.variables.find((v: any) => v.code === 'Aasta').values
  const lastYear = years[years.length - 1]
  const body = {
    "query": [
      {
        "code": "Sugu",
        "selection": {
          "filter": "item",
          "values": [
            "1"
          ]
        }
      },
      {
        "code": "Aasta",
        "selection": {
          "filter": "item",
          "values": [
            "2025"
          ]
        }
      },
      {
        "code": "Elukoht",
        "selection": {
          "filter": "item",
          "values": [
            "784"
          ]
        }
      },
      {
        "code": "Vanuserühm",
        "selection": {
          "filter": "item",
          "values": [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23"
          ]
        }
      }
    ],
    "response": {
      "format": "json-stat2"
    }
  }
  const res = await fetch(`https://andmed.stat.ee/api/v1/en/stat/RV0282U`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()

  return parseAgeDistribution(data)
}

function parseAgeDistribution(statResponse: any): AgeDistributionData {
  const values: number[] = statResponse.value

  // index helper (value array is 0-based, labels are 1-based)
  const v = (labelIndex: number) => values[labelIndex - 1] ?? 0

  const Children =
    v(2) +  // 0–4
    v(3) +  // 5–9
    v(4)    // 10–14

  const Teens =
    v(5)    // 15–19

  const Adults =
    v(6) + v(7) + v(8) + v(9) + v(10) + // 20–44
    v(11) + v(12) + v(13) + v(14)       // 45–64

  const Seniors =
    v(15) + v(16) + v(17) + v(18) +
    v(19) + v(20) + v(21) + v(22)       // 65+

  return {
    Children,
    Teens,
    Adults,
    Seniors,
  }
}
