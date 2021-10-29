<script>
import { Bar } from 'vue-chartjs'
import axios from "../main";

// TODO: Figure out how the things below create the chart, make API calls to get the data, and display it

export default {
  extends: Bar,
  data: () => ({
    chartdata: {
      labels: [],
      datasets: [
        {
          label: 'Food',
          backgroundColor: '#f87979',
          data: [40, 0]
        },
        {
          label: 'Food',
          backgroundColor: '#f87979',
          data: [40, 0]
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),

  mounted () {
    axios.get('/budget/read_all').then((budgetResponse) => {
      var result = budgetResponse.data.result;
      this.chartdata.labels = [];
      result.forEach((category) => {
        this.chartdata.labels.push(category.Name);
      });
      axios.post('/expenses/read_all_names_by_date').then((expensesResponse) => {
          console.log(expensesResponse)
      });
      this.renderChart(this.chartdata, this.options)
    });
  }
}
</script>