import { Report, CountrySumReport, lastAverageReports, dataRange } from './types';
import compareAsc from 'date-fns/compareAsc'
import counties from '../utils/counties.json'

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

 interface lastAverageReports {
  last_week_avg: number
  last_month_avg: number
  oscilation: -1 | 0 | 1
  oscilationPercent?: number
  newConfirmedAvg: number
  newDeathsAvg: number
}

export function countiesVariation (reports: Report[], period = dataRange.LAST_WEEK) {

  const data = Object.entries(filterReportsByCounty(reports))
  const result = data.map((item: [string, Report[]], index) => ({
    state: item[0],
    data: item[1].slice(-period).reduce((acc, i):lastAverageReports[] => {
      const index = acc.indexOf(acc.find((obj) => obj.state === acc.state))
      if (index >= 0) {
        acc[index].newConfirmed += i.new_confirmed
        acc[index].newDeaths += i.new_deaths
      } else {
        acc.push({
          last_update: i.date,
          newConfirmed: i.new_confirmed,
          newDeaths: i.new_deaths,
        })
      }
      return acc
    }, [])
    
  }))

  console.log(...result)
  return result
}



const states = counties.map(({ initials }) => ({
  state: initials,
  data: [],
}))

