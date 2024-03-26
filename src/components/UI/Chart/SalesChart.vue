<template>
  <div class="h-full bg-cover">
    <apexchart
      class="pl-[10px] h-auto pr-[18px]"
      type="line"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script>
import VueApexCharts from 'vue3-apexcharts'
import dayjs from 'dayjs'
export default {
  components: {
    Apexchart: VueApexCharts
  },
  props: { title: String, chartData: Object },
  data() {
    return {
      series: [
        {
          name: `${this.title}`,
          data: [],
          color: '#7A4504'
        }
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        // fill: {
        //   type: "gradient",
        //   gradient: {
        //     shadeIntensity: 1,
        //     inverseColors: false,
        //     opacityFrom: 0.5,
        //     opacityTo: 0,
        //     stops: [0, 90, 100],
        //   },
        // },
        yaxis: {
          min: 1,
          max: 100,
          tickAmount: 7,
          labels: {
            formatter: function (value) {
              return value.toFixed(0) + 'k' // Replace 'Prefix' with your desired prefix
            },
            style: {
              cssClass: '!font-primary font-bold !text-[#97A6A899] !text-[12px] opacity-40' // Add your custom font class name here
            }
          }
        },
        title: {
          text: `${this.title} Trends by Weekly`,
          align: 'left'
        },
        grid: {
          // row: {
          //   colors: ["#FDE8CD", "transparent"], // takes an array which will be repeated on columns
          //   opacity: 0.5,
          // },
          show: true,
          borderColor: '#C35214',
          strokeDashArray: 2,
          position: 'back',
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          },
          row: {
            colors: undefined,
            opacity: 0.5
          },
          column: {
            colors: undefined,
            opacity: 0.5
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        xaxis: {
          categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
          tickAmount: 8,
          labels: {
            style: {
              cssClass: '!font-primary font-bold !text-[#97A6A899] !text-[12px] opacity-40' // Add your custom font class name here
            }
          }
        },
        monthNumber: dayjs().format('M')
      }
    }
  },
  computed: {
    getMonth() {
      return {
        number: dayjs().format('M'),
        month: dayjs().format('MMM')
      }
    }
  },
  methods: {},
  beforeUnmount() {},
  mounted() {
    // const chartDatas = this.chartData;
    const dataValues = this.chartData?.map((item) => item.daily_sales)

    console.log(dataValues, this.chartData)
    this.series[0].data = dataValues
  }
}
</script>
