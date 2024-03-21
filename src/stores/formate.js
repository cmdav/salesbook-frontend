import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import currencySymbol from 'currency-symbol'

export const useConfig = defineStore('formate', () => {

  const handleConfigDate = (date, formate) => {
    return dayjs(date).format(formate)
  }
  const abbr = (num, digits) => {
    let si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ]
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    let i
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
  }
  const formatCurrency = (value) => {
    return currencySymbol.symbol(value)
  }

  return {
    handleConfigDate,
    formatCurrency,
    abbr
  }
})
