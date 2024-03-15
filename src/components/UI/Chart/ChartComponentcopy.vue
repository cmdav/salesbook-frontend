<template>
  <div class="h-full bg-cover">
    <apexchart
      class="pl-[10px] h-auto pr-[18px]"
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script>
import VueApexCharts from "vue3-apexcharts";
// import dayjs from "dayjs";
export default {
  components: {
    Apexchart: VueApexCharts,
  },
  props: { title: String },
  data() {
    return {
      series: [
        {
          name: `${this.title}`,
          data: [10, 41, 35, 62, 69, 91, 148],
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
        fill: {
          type: "gradient",
        },

        title: {
          text: `${this.title} Trends by Weekly`,
          align: "left",
        },
        grid: {
          row: {
            colors: ["#FDE8CD", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
        },
      },
    };
  },
  computed: {
    // getMonth() {
    //   return {
    //     number: dayjs().format("M"),
    //     month: dayjs().format("MMM"),
    //   };
    // },
  },
  methods: {
    // setChatContainerHeight() {
    //   if (window.innerWidth < 768) {
    //     this.chatContainerHeight = 550; // Set mobile height
    //   } else {
    //     this.chatContainerHeight = 300; // Set desktop height
    //   }
    // },
  },
  beforeUnmount() {
    // window.removeEventListener("resize", this.setChatContainerHeight);
  },
  mounted() {
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
