<template>
  <div class="review">
    <h1 class="title">Review Expenses</h1>
    <div class="content">
        <div class="table">
            <div class="tableHeaders">
                <h2 class="headerDateText" @click="unhidePicker">Date</h2>
                <h2 class="headerCategoryText">Category</h2>
                <h2 class="headerAmountText">Amount</h2>
                <h2 class="headerVendorText">Vendor</h2>
                <h2 class="buttons"></h2>
            </div>
            <h2 class="noShow" v-if="noItems">No expenses to show</h2>
            <RecycleScroller
            class="scroller"
            :items="expenses"
            :item-size="50"
            key-field="expenseID"
            >
            <template v-slot="{ item }">
                <!-- TODO: Add edit functionality, show description somehow -->
                <div class="expense" @click="popupDescription(item)">
                    <div class="expenseText, dateText">
                        {{ item.dateString }}
                    </div>

                    <div class="expenseText">
                        {{ item.categoryName }}
                    </div>

                    <div class="expenseText, amountText">
                        ${{ item.amount }}
                    </div>

                    <div class="expenseText, vendorText">
                        {{ item.vendorName }}
                    </div>

                    <div class="buttons">
                        <img src="/icons/delete.svg" class="icon" @click="deleteExpense(item)">
                        <img src="/icons/edit.svg" class="icon" @click="editExpense(item)">
                    </div>
                </div>

                
            </template>
            </RecycleScroller>
        </div>
    </div>
    <div class="budget">
        <h2 class="budgetTitle">Budget</h2>
        <div class="budgetHeaders">
            <h2>Category</h2>
            <h2>Amount</h2>
        </div>
        <h2 class="noShowBudgets" v-if="noBudgets">No budgets to show</h2>
            <RecycleScroller
            class="scroller"
            :items="budgets"
            :item-size="40"
            key-field="categoryID"
            >
            <template v-slot="{ item }">
                <div class = "budgetItem">
                    <div class="budgetText">
                        {{ item.name }}
                    </div>
                    <div class="budgetText">
                        ${{ item.amount }}
                    </div>
                </div>
            </template>
            </RecycleScroller>
    </div>
    <div class="pos" id="pos">
        <div class="overlay" id="overlay"></div>
        <div class="pickerDiv" id="pickerDiv">
                <month-picker :no-default="true" :clearable="true" @change="dateChanged" @clear="dateCleared" class="picker" id="picker"></month-picker>
                <img src="/icons/x.svg" class="pickerButton" id="pickerButton" @click="hidePicker">
        </div>
        <div class="popupDescription" id="popupDescription">
            <img src="/icons/x.svg" class="descButton" id="descButton" @click="hideDescription">
            <h2 style="text-decoration:underline">Description</h2>
            <div class="expenseText, descriptionText">
                {{ descText }}
            </div>    
        </div>
    </div>
  </div>
</template>

<script>
import axios from "../main";
import { MonthPicker } from 'vue-month-picker'

export default {
  name: "Review",
  components: {
      MonthPicker
  },

  data: () => ({
    expenses: [],
    descText: "",
    budgets: [],
    date: {
				from: null,
				to: null,
				month: null,
				year: null
			}
  }),
  computed: {
      noItems: function () {
          return !this.expenses.length;
      },
      noBudgets: function () {
          return !this.budgets.length;
      }
  },
  methods: {
    dateChanged(date) {
      this.updateDate(date);
      this.updateExpensesByDate();
    },
    dateCleared() {
      this.date = null;
      this.updateExpenses();
    },
    updateExpenses() {
      axios.post("/expenses/read_all_names").then((response) => {
        var result = response.data.result;
        var newExpenses = [];
        result.forEach((expense) => {
            var date = new Date(parseInt(expense.Day));
            var dateString = new Date(date).toDateString();
            dateString = dateString.substr(dateString.indexOf(" ") + 1);
            var description = expense.Description;
            if (description.length === 0) {
                description = "No description given.";
            }
          newExpenses.push({
            expenseID: expense.expenseID,
            date: date,
            dateString: dateString,
            amount: parseFloat(expense.Amount).toFixed(2),
            description: description,
            vendorName: expense.vendorName,
            categoryName: expense.categoryName
          });
        });
        this.expenses = newExpenses;
        this.expenses = this.expenses.reverse();
      });
    },
    updateExpensesByDate() {
      var monthToGet = this.getMonthFromString(this.date.month);
      monthToGet = monthToGet.toString()
      if (monthToGet.length === 1) {
          monthToGet = "0" + monthToGet;
      }
      axios.post("/expenses/read_all_names_by_date", {
          month: monthToGet,
          year: this.date.year,
      }).then((response) => {
        var result = response.data.result;
        var newExpenses = [];
        result.forEach((expense) => {
            var date = new Date(parseInt(expense.Day));
            var dateString = new Date(date).toDateString();
            dateString = dateString.substr(dateString.indexOf(" ") + 1);
            var description = expense.Description;
            if (description.length === 0) {
                description = "No description given.";
            }
          newExpenses.push({
            expenseID: expense.expenseID,
            date: date,
            dateString: dateString,
            amount: parseFloat(expense.Amount).toFixed(2),
            description: description,
            vendorName: expense.vendorName,
            categoryName: expense.categoryName
          });
        });
        this.expenses = newExpenses;
        this.expenses = this.expenses.reverse();
      });
    },
    editExpense() {
        event.stopPropagation();
        // TODO
    },
    deleteExpense(expense) {
        event.stopPropagation();
      if (confirm("Are you sure you want to delete that expense?")) {
        axios.post('/expenses/delete', {
          expenseID: parseInt(expense.expenseID)
        }).then(() => {
          alert("Expense deleted");
          if (this.date.month === null) {
            this.updateExpenses();
          }
          else {
            this.updateExpensesByDate();
          }
        }).catch(() => {
          alert("Error deleting expense");
        });
      }
      
    },
    updateDate(date) {
        this.date = date;
    },
    getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    },
    sortByID(a,b) {
        return parseInt(a.expenseID, 10) - parseInt(b.expenseID, 10);
    },
    updateBudgets() {
      axios.get("/budget/read_all").then((response) => {
        var result = response.data.result;
        var newBudgets = [];
        result.forEach((budget) => {
          newBudgets.push({
            categoryID: budget.categoryID,
            name: budget.Name,
            amount: parseFloat(budget.Amount).toFixed(2)
          });
        });
        this.budgets = newBudgets;
        this.budgets = this.budgets.reverse();
      });
    },
    unhidePicker() {
        var pickerDiv = document.getElementById("pickerDiv");
        var pos = document.getElementById("pos");
        var overlay = document.getElementById("overlay");

        pos.style.display = "block";
        pickerDiv.style.display = "block";
        overlay.style.display = "block";
    },
    hidePicker() {
        var pickerDiv = document.getElementById("pickerDiv");
        var pos = document.getElementById("pos");
        var overlay = document.getElementById("overlay");

        pos.style.display = "none";
        pickerDiv.style.display = "none";
        overlay.style.display = "none";
    },
    popupDescription(expense) {
        var popupDescription = document.getElementById("popupDescription"); 
        var pos = document.getElementById("pos");
        var overlay = document.getElementById("overlay");

        pos.style.display = "block";
        overlay.style.display = "block";
        popupDescription.style.display = "block";

        this.descText = expense.description;
    },
    hideDescription() {
        var popupDescription = document.getElementById("popupDescription"); 
        var pos = document.getElementById("pos");
        var overlay = document.getElementById("overlay");

        pos.style.display = "none";
        overlay.style.display = "none";
        popupDescription.style.display = "none";
    }
  },
  beforeMount() {
    this.updateExpenses();
    this.updateBudgets();
  }
};
</script>

<style scoped>


.title {
    margin: 0px;
    margin-bottom: 1%;
    padding: 0px;
    display: flex;
    width: 98.95%;
    margin-left: 1.05%;
    margin-top: 1.15%;
    font-size: calc(16px + 1.4vw);
}

.expense {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: calc(8px + 0.9vw);
  text-align: center;
  color: rgb(56, 56, 56);
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: #eee;
  cursor: pointer;
}

.expenseContent {
    padding: 0px;
    margin: 0px;
    display: none;
    overflow: hidden;
    background-color: #eee;
    position: absolute;
    top: 100%;
    width: 100%;
    height: 40px;
    text-align: left;
}

.descriptionText {
    display: inline;
    position: absolute;
    top: 17%;
    left: 0%;
    margin-left: 10px;
    font-size: calc(14px + 0.7vw);
}

.buttons {
    width:40%;
    display: inline-flex;
    justify-content: space-around;
    top: 0%;
    right: 0%;
}

.icon {
    display: inline-flex;
    float: right;
    width: calc(10px + 1vw);
    height: calc(10px + 1vw);
    padding: 0px;
    cursor: pointer;
}

.dateText {
    display:inline;
    width:100%;
    font-size: calc(7px + 0.8vw);
}

.scroller {
  height: 100%;
}

.content{
    display:inline;
}

.table {
    width: 60%;
    margin-top: 1%;
    margin-left: 10%;
}

.pickerDiv {
    position: absolute;
    display: none;
    -webkit-transform: translate(-50%, 120%);
    transform: translate(-50%, 120%);
    left: 50%;
    width: calc(190px + 18.5vw);
    height: 300px;
    background-color: rgb(236, 236, 236);
    justify-content: space;
}

.popupDescription {
    position: absolute;
    display: none;
    -webkit-transform: translate(-50%, 120%);
    transform: translate(-50%, 120%);
    left: 50%;
    width: calc(200px + 20vw);
    height: 300px;
    background-color: rgb(255, 255, 255);
}

.picker {
    display: flexbox;
    position: absolute;
    margin: auto;
    width: calc(150px + 15vw);
    top: 10%;
    left: 10%;
    z-index: 10;

}

.pickerButton {
    display: block;
    position: absolute;
    right: 0%;
    z-index: 20;
    cursor: pointer;
}

.descButton {
    display: block;
    position: absolute;
    right: 0%;
    z-index: 20;
    cursor: pointer;
}

.expenseText {
    display:inline;
    width:70%;
}

.vendorText {
    display:inline;
    width:100%;
}

.amountText {
    display:inline;
    width:60%;
}

.tableHeaders {
    display: flex;
    justify-content: space-around;
    font-size: calc(6px + 0.8vw);
}

.headerCategoryText {
    display: inline;
    width: 70%;
    text-decoration: underline;
}

.headerVendorText {
    display: inline;
    width: 100%;
    text-decoration: underline;
}

.headerAmountText {
    display: inline;
    width: 60%;
    text-decoration: underline;
}

.headerDateText {
    display: inline;
    width: 100%;
    text-decoration: underline;
    cursor: pointer;
}

.headerButtonSpace {
    width: 45%;
}

.buttonSpace {
    width: 45%;
}

.noShow {
    width:85%;
    color: #565656;
}

.budget {
    position: absolute;
    float:right;
    right: 5.5%;
    top: 90px;
    width: 22%;
    padding-bottom: 100px;
}

.budgetTitle {
    font-size: calc(16px + 1.4vw);
    margin: 0px;
}

.budgetHeaders {
    display:flex;
    justify-content: space-around;
    text-decoration: underline;
    font-size: calc(6px + 0.8vw);
}

.budgetItem {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: calc(10px + 0.8vw);
  text-align: center;
  color: rgb(56, 56, 56);
  width: 100%;
  display:flex;
  justify-content: space-around;
}

.budgetText {
    display:inline;
    width:100%;
}

.overlay {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000;
  display: block;
  z-index: 0;
  opacity: 0.25;
  display: none;
}

.pos {
    display: none;
    height: 99%;
    width: 100%;
    position: absolute;
    top: 0%;
    margin-left: -10px;
    padding: 0px;
}

@media (max-width: 750px) {
    .budget {
        display:none;
    }

    .table {
        width: 80%
    }
}

</style>
