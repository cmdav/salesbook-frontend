<template>
  <div class="h-full bg-cover">
    <apexchart
      class="pl-[10px] h-auto pr-[18px]"
      v-if="renderChart"
      type="area"
      :options="chartOptions"
      :series="chartSeries"
      :height="chatContainerHeight"
      ref="chart"
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
  data() {
    return {
      chatContainerHeight: null,
      renderChart: false,
      chartOptions: {
        grid: {
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
        chart: {
          id: "area-chart",
          toolbar: {
            show: false, // Hide the toolbar
          },
          width: "100%",
          // height: "60%",
        },
        xaxis: {
          categories: [],
          tickAmount: 8,
          labels: {
            style: {
              cssClass:
                "!font-primary font-bold !text-[#97A6A899] !text-[12px] opacity-40", // Add your custom font class name here
            },
          },
        },
        yaxis: {
          min: 1,
          max: 100,
          tickAmount: 7,
          labels: {
            formatter: function (value) {
              return value.toFixed(0) + "k"; // Replace 'Prefix' with your desired prefix
            },
            style: {
              cssClass:
                "!font-primary font-bold !text-[#97A6A899] !text-[12px] opacity-40", // Add your custom font class name here
            },
          },
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 1,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        monthNumber: dayjs().format("M"),
      },
      chartSeries: [
        {
          name: "Sales",
          data: [],
          color: "#0F973D",
        },
        { name: "Supplies", data: [], color: "#d5865b" },
      ],
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
  methods: {
    setChatContainerHeight() {
      if (window.innerWidth < 768) {
        this.chatContainerHeight = 550; // Set mobile height
      } else {
        this.chatContainerHeight = 500; // Set desktop height
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setChatContainerHeight);
  },
  mounted() {
    this.setChatContainerHeight();
    window.addEventListener("resize", this.setChatContainerHeight);

    const Incomedata = [
      95,
      92,
      98,
      85,
      100,
      93,
      50,
      90,
      62,
      99,
      53,
      2,
      28,
      95,
      90,
      62,
      99,
      53,
      2,
      28,
      95,
      95,
      92,
      98,
      85,
      62,
      99,
      53,
      2,
      28,
      28,
    ];
    const Widthdrawaldata = [
      62,
      99,
      53,
      2,
      28,
      95,
      95,
      92,
      98,
      85,
      100,
      93,
      50,
      95,
      92,
      98,
      85,
      100,
      93,
      50,
      90,
      62,
      99,
      53,
      2,
      28,
      95,
      95,
      92,
      98,
      100,
    ];
    const getFormattedDate = (day) => {
      const date = new Date(2023, 0, day); // Assuming the year is 2023
      const options = { day: "2-digit", month: "short" };
      return date.toLocaleDateString("en-US", options);
    };
    // Extract x-axis categories and y-axis values from chart data
    const values = Widthdrawaldata.map((item) => item);
    const Incomevalues = Incomedata.map((item) => item);
    const DateValues = Array.from({ length: 31 }, (_, index) =>
      getFormattedDate(index + 1)
    );

    // Update chart options and series
    this.chartOptions.xaxis.categories = DateValues;
    this.chartSeries[0].data = values;
    this.chartSeries[1].data = Incomevalues;
    this.renderChart = true;
    //Refresh the chart to reflect the updated data
    //this.$refs.chart.refresh();
  },
};
</script>
