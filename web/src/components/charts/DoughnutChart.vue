<script>
import { Doughnut, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;
export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),

  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
