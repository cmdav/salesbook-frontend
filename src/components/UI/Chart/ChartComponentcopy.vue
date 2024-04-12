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
              cssClass: "!font-primary font-bold !text-[#97A6A899] !text-[12px] ", // Add your custom font class name here
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
              show: false,
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
          categories: null,
          tickAmount: 8,
          labels: {
            style: {
              cssClass: "!font-primary font-bold !text-[#97A6A899] !text-[12px]", // Add your custom font class name here
            },
          },
        },
      },
    };
  },
  computed: {
    getMonth() {
      return {
        number: dayjs().format("M"),
        month: dayjs().format("MMM"),
      };
    },
  },
  methods: {},
  beforeUnmount() {},
  mounted() {
    const Data = this.chartData;

    // const dataValues = Data?.map((item) => item.daily_profit);

    const dateValues = Data?.map((item) => {
      const date = new Date(item.day);
      const options = { day: "2-digit", month: "short", weekday: "short" };
      const dayOfWeek = new Intl.DateTimeFormat("en-US", options).format(date);
      return `${dayOfWeek}`;
    });
    console.log(this.chartData);

    this.series[0].data = Data?.map((item) => item.daily_profit);

    this.chartOptions.xaxis.categories = dateValues;
    // this.setChatContainerHeight();
    // window.addEventListener("resize", this.setChatContainerHeight);
    // const Incomedata = [25, 32, 98, 85, 10, 93, 50];
    // // const Widthdrawaldata = [62, 99, 53, 2, 28, 95, 100];
    // const getFormattedDate = (day) => {
    //   const date = new Date(2023, 0, day); // Assuming the year is 2023
    //   const options = { day: "2-digit", month: "short" };
    //   return date.toLocaleDateString("en-US", options);
    // };
    // // Extract x-axis categories and y-axis values from chart data
    // // const values = Widthdrawaldata.map((item) => item);
    // const Incomevalues = Incomedata.map((item) => item);
    // const DateValues = Array.from({ length: 31 }, (_, index) =>
    //   getFormattedDate(index + 1)
    // );
    // // Update chart options and series
    // this.chartOptions.xaxis.categories = DateValues;
    // // this.chartSeries[0].data = values;
    // this.chartSeries[1].data = Incomevalues;
    // this.renderChart = true;
    // //Refresh the chart to reflect the updated data
    // //this.$refs.chart.refresh();
  },
};
</script>
