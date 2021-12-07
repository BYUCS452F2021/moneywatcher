<script>
import { Bar } from 'vue-chartjs'
import axios from "../main";

const withinBudgetColor = '#223BC9';
const overBudgetColor = '#FF0000';

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
          backgroundColor: [],
          data: []
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
      axios.post('/expenses/read_all_names', {
        month: 11,
        year: 2021
      }).then((expensesResponse) => {
          expensesResponse.data.forEach((expense) => {
            this.apidata.categories.forEach((category) => {
              if (category.name === expense.budget[0].Name) {
                category.currentAmount += expense.amount;
              }
            })
          })

          this.chartdata.labels = this.apidata.categories.map((category) => category.name);
          this.chartdata.datasets[0].data = [];
          this.chartdata.datasets[0].backgroundColor = [];
          this.apidata.categories.forEach((category) => {
            var usedAmount = 100 * category.currentAmount / category.totalAmount;
            if (usedAmount <= 100) {
              this.chartdata.datasets[0].data.push(usedAmount);
              this.chartdata.datasets[0].backgroundColor.push(withinBudgetColor);
            }
            else {
              this.chartdata.datasets[0].data.push(usedAmount);
              this.chartdata.datasets[0].backgroundColor.push(overBudgetColor);
            }
            if (usedAmount > this.options.scales.yAxes[0].ticks.max) this.options.scales.yAxes[0].ticks.max = usedAmount;
          })
          this.renderChart(this.chartdata, this.options)
      });
    });
  }
}
</script>