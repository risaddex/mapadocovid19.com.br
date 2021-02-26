import compareAsc from 'date-fns/compareAsc'
import counties from '../utils/counties.json'
import {
  CountrySumReport,
  dataRange,
  Report,
  lastAverageReports,
} from './types'
import { customToFixed, growPercent } from './utils'

export function totalSumByDay(reports: Report[]): CountrySumReport[] {
  return reports
    .reduce<CountrySumReport[]>((acc, item): CountrySumReport[] => {
      const index = acc.indexOf(acc.find((i) => i.date === item.date))
      if (index >= 0) {
        acc[index].deaths += item.last_available_deaths
        acc[index].confirmed += item.last_available_confirmed
        acc[index].confirmedPer100k +=
          item.last_available_confirmed_per_100k_inhabitants
        acc[index].newConfirmed += item.new_confirmed
        acc[index].newDeaths += item.new_deaths
      } else {
        acc.push({
          date: item.date,
          deaths: item.last_available_deaths,
          confirmed: item.last_available_confirmed,
          confirmedPer100k: item.last_available_confirmed_per_100k_inhabitants,
          newConfirmed: item.new_confirmed,
          newDeaths: item.new_deaths,
        })
      }
      return acc
    }, [])
    .sort((first, second) =>
      compareAsc(new Date(first.date), new Date(second.date))
    )
}

export function filterReportsByCounty(reports: Report[]) {
  const result = reports.reduce((acc, report) => {
    if (typeof acc[report.state] === 'object') {
      acc[report.state].push(report)
    } else {
      acc[report.state] = [report]
    }
    return acc
  }, {})

  return result
}

export function getStatsByCounty(reports: Report[], period: dataRange) {
  return reports
    .sort((first, second) =>
      compareAsc(new Date(first.date), new Date(second.date))
    )
    .slice(-period)
    .reduce((acc, i): lastAverageReports[] => {
      const index = acc.indexOf(acc.find((obj) => obj.state === acc.state))
      if (index >= 0) {
        acc[index].newConfirmed += i.new_confirmed
        acc[index].newDeaths += i.new_deaths
      } else {
        acc.push({
          last_update: i.date,
          newConfirmed: i.new_confirmed,
          newDeaths: i.new_deaths,
          lastDeaths: i.new_deaths,
          lastConfirmed: i.new_confirmed,
        })
      }
      return acc
    }, [])
}

export function countiesVariation(
  reports: Report[],
  period = dataRange.LAST_WEEK
):lastAverageReports {
  const data = Object.entries(filterReportsByCounty(reports))
  const counties_data = data.map((item: [string, Report[]]) => ({
    state: item[0],
    data: getStatsByCounty(item[1], period),
  }))
  const result = counties_data.map((item) => ({
    state: item.state,
    data: item.data.map(
      ({ newDeaths, newConfirmed, lastDeaths, lastConfirmed }) => ({
        deaths_avg: customToFixed(newDeaths / period),
        new_confirmed_avg: customToFixed(newConfirmed / period),
        last_deaths: lastDeaths,
        last_confirmed: lastConfirmed,
        oscilation: function () {
          const dif = lastDeaths / customToFixed(newDeaths / period)
          if (dif > 0.85 && dif < 1.15) {
            return 0
          } else if (dif > 1.15) {
            return 1
          } else return -1
        }(),
      })
    ),
  }))

  console.log(result[1])
  // TODO understand return types better XD
  return result
}
