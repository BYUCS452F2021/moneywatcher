<script>
import { Bar } from 'vue-chartjs'
import axios from "../main";

export default {
  extends: Bar,
  data: () => ({
    apidata: {
      categories: [],
    },
    chartdata: {
      labels: [],
      datasets: [
        {
          backgroundColor: '#223BC9',
          data: [40, 15, 30]
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: '% of Budget Spent'
            },
            ticks: {
              min: 0,
              max: 100,
              beginAtZero: true,
              
            }
          }
        ]
      }
    }
  }),

  mounted () {
    axios.get('/budget/read_all').then((budgetResponse) => {
      var result = budgetResponse.data.result;
      this.apidata.categories = [];
      result.forEach((category) => {
        this.apidata.categories.push({name: category.Name, totalAmount: category.Amount, currentAmount: 0});
      });
      axios.post('/expenses/read_all_names_by_date', {
        month: 10,
        year: 2021
      }).then((expensesResponse) => {
          expensesResponse.data.result.forEach((expense) => {
            this.apidata.categories.forEach((category) => {
              if (category.name === expense.categoryName) {
                category.currentAmount += expense.Amount;
              }
            })
          })

          this.chartdata.labels = this.apidata.categories.map((category) => category.name);
          this.chartdata.datasets[0].data = [];
          this.apidata.categories.forEach((category) => {
            this.chartdata.datasets[0].data.push(100 * category.currentAmount / category.totalAmount);
          })
          this.renderChart(this.chartdata, this.options)
      });
    });
  }
}
</script>