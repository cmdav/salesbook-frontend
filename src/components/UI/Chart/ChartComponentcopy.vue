<template>
  <div class="h-full bg-cover">
    <apexchart
      class="pl-[10px] h-auto pr-[18px]"
      type="line"
      height="400"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script>
import VueApexCharts from "vue3-apexcharts";
import dayjs from "dayjs";

export default {
  components: {
    Apexchart: VueApexCharts,
  },
  props: { title: String, chartData: Object },
  data() {
    return {
      series: [
        {
          name: `${this.title}`,
          data: [],
          color: "#7A4504",
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
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
          min: 0,
          // tickAmount: 5,
          labels: {
            formatter: function (value) {
              let si = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "K" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "G" },
                { value: 1e12, symbol: "T" },
                { value: 1e15, symbol: "P" },
                { value: 1e18, symbol: "E" },
              ];
              let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
              let i;
              for (i = si.length - 1; i > 0; i--) {
                if (value >= si[i].value) {
                  break;
                }
              }
              return (value / si[i].value).toFixed(0).replace(rx, "$1") + si[i].symbol;
              // return value.toFixed(0) + "k"; // Replace 'Prefix' with your desired prefix
            },
            style: {
              cssClass: "!font-primary font-bold !text-[#97A6A899] !text-[16px] ", // Add your custom font class name here
            },
          },
        },
        title: {
          text: `${this.title} Trends by Weekly`,
          align: "left",
        },
        grid: {
          // row: {
          //   colors: ["#FDE8CD", "transparent"], // takes an array which will be repeated on columns
          //   opacity: 0.5,
          // },
          show: true,
          borderColor: "#C35214",
          strokeDashArray: 2,
          position: "back",
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
          row: {
            colors: undefined,
            opacity: 0.5,
          },
          column: {
            colors: undefined,
            opacity: 0.5,
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        xaxis: {
          categories: [],
          tickAmount: 8,
          labels: {
            style: {
              cssClass: "!font-primary font-bold !text-[#97A6A899] !text-[14px]", 
            },
          },
        },
      },
    };
  },

   watch: {
    chartData: {
      immediate: true,
      handler(newData) {
        if (Array.isArray(newData)) {
          const dataValues = newData.map((item) => parseInt(item.daily_profit));
          // const dateValues = newData.map((item) => {
          //   const date = new Date(item.day.split(" ")[0]);
          //   const options = { day: "2-digit", month: "short" };
          //   return new Intl.DateTimeFormat("en-US", options).format(date);
          // });
          const dateValues = newData.map((item) => {
            return dayjs(item.day.split(' ')[0]).format('MMM DD');  // Format date to "Jun 14"
          });
          this.series[0].data = dataValues;
          this.chartOptions.xaxis.categories = dateValues;
        } else {
          console.error("chartData is not defined or not an array.");
        }
      },
    },
  },
};
</script>
