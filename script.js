"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-04T23:36:17.929Z",
    "2024-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcdaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

/// 1
/// formatMovementDate = function date
/// date is from the const date, which is a new date inside the acc.movementsdate
/// const calcdaysPassed = date1,date2, and the function is
/// date2 - date1, rounded to 24 hours, which is how many days (included with)
/// math.round and math.abs

//// 2
/// const daysPassed = this function called with new Date(), and date
/// date is called from below, which makes a new Date for each acc.movementdates[i]
/// if (days passed === 0) it returns today etc

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov}€</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/// looping over the movs.foreach, and in each iteration we are generating
/// the const html
/// the .Date is from the const newDate element above
//// they are then being generated from the acc.movementDates[i] part,
/// of which are storing in movement dates
/// the const day = etc are just holding the dates and years from the movementPart
/// we are actually storing it in the displayDate which holds the string
/// ane then applying them to the movements__date part of the html
/// so that html is showing for each iteration of the loop

/// in this, we are looping over the movs.forEach,
/// and then once we'v looped over the accounts array
/// we are using this to loop over the acc.movementsDates, and taking the

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€ `;

  const outgoings = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(outgoings);
  labelSumOut.textContent = `${Math.abs(outgoings)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  console.log(interest);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

/// filter
/// .filter is only storing values that are greater than 0 (positive values)
/// map
/// .map is then storing them in a new arrary, deposit is the first value of the return value from
/// the previous .filter.
////  it is taking each array item and multiplying by 1.2 and then dividing by 100
/// reduce
/// reduce is then running through the array, starting the accumaltor at 0, and then adding
/// acc (accumatlor) and int (each item of the array)

// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    console.log(acc.owner);
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  /// display movements
  displayMovements(acc);
  /// display balance
  calcDisplayBalance(acc);
  /// display summary
  calcDisplaySummary(acc);
};

/// event handler

let currentAccount;

/// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// day/month/yearX

/// to add the zero at the beggining of day and month
/// make template literal, and use padstart, 2 is length of characters,
/// and 0 is what were adding

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    /// display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    /// Create current date and time
    const timeNow = new Date();
    const day = `${timeNow.getDate()}`.padStart(2, 0);
    const month = `${timeNow.getMonth() + 1}`.padStart(2, 0);
    const year = timeNow.getFullYear();
    const hour = `${timeNow.getHours()}`.padStart(2, 0);
    const minutes = `${timeNow.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    /// clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update Ui
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) == currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    /// delete accounts
    accounts.splice(index, 1);
    // /// Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

/// account.splice to delete the account
/// the index is the variable that we made that stores the findIndex account
/// if the acc.username === the currentAccount.username
/// the 1, because it is paired with index, removes the first value
/// which in this case, in the jonas account
/// opcacity is then set to 0
/// inputCloseusername.value gets set of an empty string after if the if statement
/// so that it is not pre typed in in the next log in

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    /// doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    /// add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    /// Update UI
    updateUI(currentAccount);
  }
});

/// on btnTransfer
/// if the if block is correct
/// adding transfer date - currentAccount.movementDates.push
/// pushes a new date that was made at that time, into this array
/// we also do this on the receiverAcc, the receiverACC, finds the user we are
/// sending too, and also pushes that same date on that account
/// so we push the same date on the currentUser, and the receiver User
/// we put it on loan date, but only need the currentAccount as we are not
/// sending to anyone directly

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    /// add movement
    currentAccount.movements.push(amount);

    /// Add Loan Date
    currentAccount.movementsDates.push(new Date().toISOString);

    // update Ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/// TOGGLING
/// let sorted, stores the false state. it's false as it not sorted
/// replaced 'true' with !sorted, as this is the opposite of the default state of false
/// so this will make it true, which runs the true statement in displayMovements
/// make it sort into ascending order
/// THE FLIP
/// sorted = !sorted
/// this changes to state everytime it is clicked, swapping it from false and true

/// sorting
/// added sort parameter and set the default to false
/// const movs =  ? = if sort is true
/// movements.slice(), this is needed or it would mutate the original movements object
/// slice makes a copy
/// .sort will sort in an ascending order
/// : = if sort is false, just display the normal movements
/// displayMovements displays the movements in the HTML
/// the true

/// the true or false
/// if true - make a copy of the movements using slice, sort by ascening
/// if flase, display the movements like they were

/// for the btn, when we click the button, displaymovements gets set to true
/// so this sorts it into ascending order

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
  }
});

/// Close account
/// add event listners to close button
/// if

//// TRANSFERING MONEY

/// 1 - making own function for UPDATEUI - this function displays the Movements on screen, displays the positive values,
/// this is then pasted into the end of the if statement, so this runs if the if statement runs
/// this function was also pasted into the first if statement on login. making it display these when the account user has logged in

/// 2
/// this will then the movements from each account. you can check this in the console. and type in accounts and look at the last
/// movements

/// 3
/// adding the empty string outside the if statement. this creates the empty string when the if statement finishes

/// getting the button transfer in javaacript and adding event listener

// /// event handler

// let currentAccount;

// btnLogin.addEventListener('click', function (e) {
//   e.preventDefault();

//   currentAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value
//   );
//   console.log(currentAccount);
//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     console.log('login');
//     /// diplay UI and welcome message
//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;

//     containerApp.style.opacity = 100;

//     /// clear input fields
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur(); /// this takes focus off the button
//     /// display movements
//     displayMovements(currentAccount.movements);
//     //// display balance
//     calcDisplayBalance(currentAccount);
//     //// display summary
//     calcDisplaySummary(currentAccount);
//   }
// });

// /// TRANSERS

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     acc => acc.username === inputTransferTo.value
//   );
//   console.log(amount, receiverAcc);

//   if (
//     amount > 0 &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     console.log('transfer valid');
//   }
// });

/// 1 - const amount = storing the number inside the inputtransferamount tab inside amount
/// 2 - const receiverAcc - finding the account.find (which is the array with all the accounts in)
///

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);

/// saving only the positive values
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);

console.log(depositsFor);

const withdrawal = movements.filter((mov) => mov < 0);

console.log(withdrawal);

console.log(movements);
/// accumalator --> snowball
const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

/// Maximum value

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);

const calcHumanAge = function (ages) {
  const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAge.filter((age) => age >= 18);
  console.log(humanAge);
  console.log(adults);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
};

const calcAverageHumanAge = (ages) =>
  ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avg1);

/// arrow function explanation -
/// 1 : calcAverageHumanAge = ages (this is the parameter) what it is called
/// 2 : age.map (making a new map)
/// 3 : ages => (the parameter) follow the equation
/// 4 : parameter >= 2, if this is true, do the following code
/// 5 : if this is false, do the next following thing
/// 6 : then adding a filter, that takes the parameter "age" and logs it if it is equal or greater than 18
/// 7 : reduce method. running through the acc, age, i, arr. adding the acc + age, and dividing this by
/// the array length, starting at 0

// const calcNewAge = function (agez) {
//   const humanAge = agez.map(agez => agez + 1);
//   console.log(humanAge);
//   const adultAge = humanAge.filter(agez => agez === 5);
//   console.log(adultAge);
// };

// calcNewAge([5, 6, 4, 2, 3]);

/// map
/// filter
/// reduce for average

/// map method

const calcNewAges = function (ages) {
  const newAge = ages.map((ages) => ages + 1);
  console.log(newAge);
  /// filter method
  const adults = newAge.filter((ages) => ages === 5);
  console.log(adults);

  /// REDUCE FOR AVERAGES
  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
  console.log(average);
};

const avg = calcNewAges([1, 4, 3, 2, 5, 7, 15, 999, 7, 3, 2, 4, 5]);

const euroToUSD = 1.1;

const totalDeposit = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * euroToUSD)

  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDeposit);

const firstWithdrawl = movements.find((mov) => mov < 0);
console.log(movements);
console.log(firstWithdrawl);

console.log(accounts);

const account = accounts.find((acc) => acc.owner === "Jessica Davis");
console.log(account);

/// when this returns something that is TRUE - it get's the whole object

/// find does not make a new array, but takes the first thing that it finds from that array and logs it
/// similar to filter, but filter returns all the elements, and find only takes the first one

// making a parameter ^^ and then inputting something in the input

// const array = [3, 5, 6, 7, 8, 3];

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

/// 1 - human age
/// making a function that passes ages array in it
/// making a const humanAge - we make this so we can make a map of the new ages
/// making an arrow function
/// the arrow function takes the age and if it is less than or equal to 2
/// returns 2 * age
/// : if the age is greater, it makes it 16 + age * 4
/// age is a new const (verify this)

/// 2 - adults
/// making const adults = humanAge.filter = age => age >= 18
/// this puts all the array items that are 18 and above in the adults variable

/// 3 - average
/// const average = adults.reduce, then logging the acc, age
/// then we're returning the acc + age. then making the start at 0
/// that will then return the sum, which is all them added together
/// / adults.length - divides that number by the length of the adults array
/// then return the average

/// Finding the maximum value
/// using reducde to set an accumulator (starts at movements[0], and a mov which is the indidual elements)
//// if the accumalator which starts at movements[0] is greater than current mov element
//// return accumalator
/// if its less, return the mov

/// doing the same with for of loop

/// accumalor needs a first accumaltor paramter
/// also needs a ,0 after to set the accumaltor at 0. you could set this to anything.
/// but setting it dafault at 0 makes sense

/// arrow function example for the withdrawl

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUSD;
// });

// console.log(movements);
// console.log(movementsUSD);

// const movementUSDfor = [];
// for (const mov of movements) movementUSDfor.push(mov * euroToUSD);
// console.log(movementUSDfor);

/// arrow function
// const movementsUSD = movements.map(mov => mov * euroToUSD);

// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescription);

/// arrow function
/// making a movements.map with the movements array
/// loggings the mov parameter, which is the movements numbers
/// logging the i, which is the current iteration

/// if mov (current movements array number) is bigger than 0, log deposited, if its less, log withdrew

// // console.log(movements);
// console.log(movementsUSD);

/// for of way
// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * euroToUSD);
// console.log(movementsUSD);

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4)); // defines end parameter
// console.log(arr.slice(-2)); // takes the last two elements of the array
// console.log(arr.slice(1, -2));
// console.log(arr.slice()); /// shallow copy
// console.log([...arr]); /// same as this ^^

// // splice

// arr.splice(-1); // this would remove the laat element of the arr array
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];

// /// reverses the whole array around - DOES change the original

// /// CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// /// merges two arrays together
// console.log([...arr, ...arr2]);
// /// ^^ same as this

// // // JOIN
// // console.log(letters.join(' - '));
// // /// makes it a string with a seperated that we specify

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));
// /// does the same thing

// /// getting the last arrays element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('jonas'.at(0));
// console.log('jonas'.at(-1));
// /// also works on strings

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /// for of
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// // /// for each

// movements.forEach(function (movement, i, array) {
//   if (movement > 0) {
//     console.log(`${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// });
// /// doing the same here ^^
// /// opposite from the for of. the first value needs to be the current element, and then the next
// /// is the counter (or index)

// /// map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, Map) {
//   console.log(`${key} ${value}`);
// });

// // set
// const currenciesUnique = new Set(['USD', 'GBP', 'USB', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value} ${_}`);
// });

// /// set only logs unique values, doubles don't get logged
// /// looping over this requires 3 parameters like the map version, the second paramater is a throw away varible
// /// usually set to _

// console.log(movements);

/// EQUALITY
console.log(movements.includes(-130));
/// will return  true or false

/// SOME CONDITION
console.log(movements.some((mov) => mov === -130));
/// the mov is each iteration and it goes over the array with this
/// so this is going over the array and seeing if any if equal to -130
/// only needs one to be true
/// will return true or false

const anyDepositss = movements.some((mov) => mov > 0);
console.log(anyDepositss);

/// EVERY
console.log(movements.every((mov) => mov > 0));
/// checks if EVERY iteration is greater than 0
/// if ALL of them arn't, will return 0

// seperate callback
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

/// FLAT
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());
/// puts all of them inside 1 array

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));
/// flat(2)
/// this gets nested elements
/// flat (1) would get the first set of nested elements
/// flat (2) would get the second level of nesting inside the array

/// getting all the accounts movements in 1 array
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

/// 1
/// making a new map (so we dont change the original) of the accounts array
/// account.map - we now have the account as a map
/// the acc is what we have account array named as (we could call it anything)
/// acc.movement, this is going into the movements of the acc (account)

/// 2
/// allMovements = accountMovements, which is the movements from the acc objects
/// we are then flatting this, putting all these values into one array
/// we don't need flat 1 as all of these values don't have arrays in arrays
///

/// 3
/// overallBlance = allMovements.reduce. this boils all elements down into one number
/// acc is the accumulator of all the values, its the snowball
/// the mov is the current iternation the loop is on
/// the 0 is what the accumulator starts on

/// adding all the methods together

/// flat
const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

/// flatMap
const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

/// same thing but better for performance, only goes 1 level deep
/// flatting means to take them all out the arrays and put them together
/// so this would make a new map of all the arrays, and take them out their arrays

/// Strings
const owners = ["jonas", "Zach", "Adam", "Martha"];
console.log(owners.sort());
console.log(owners);

//// Numbers
console.log(movements);

/// return < 0, -  A,B
/// return > 0, - B,A

/// Ascending
// movements.sort((a, b) => a - b);

// console.log(movements);
// const x = new Array(7);

// /// Descending
// movements.sort((a, b) => b - a);
// console.log(movements);

// /// makes 7 empty arrays
// console.log(x.map(() => 5));
// /// also 7 empty arrays

// /// FILL
// x.fill(1, 3, 5);
// console.log(x);
// /// filling with 1, starting at 3, and ending at 5

// const arrs = [1, 2, 3, 4, 5, 6, 7, 8];

// arrs.fill(23, 4, 6);
// console.log(arrs);
// /// fill inside an array

// // Array.from
const x = new Array(7);
/// 7 empty arrays ^

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

/// makes a 7 new empty array called x
/// y is array.from
/// spans the length of 7, and inputs 1

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

/// _ is a throw away variable
/// i + 1

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );
  console.log(movementsUI);
});

/// used array.from to create an array from the result of the the querySelectorAll
/// this gave us a node list, which is the values we saw in the previous photos
/// we then added another arguement, this converter each element to a number
/// and then replaced the € with a blank space

/// Array Methods Practise

/// 1 : adding all the bank account movements together

const bankDepositsSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositsSum);

/// filter is filtering just the positive values
/// reduce adds them all together

/// 2 :

// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov >= 1000).length;
// console.log(numDeposits1000);

const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur > 1000 ? count + 1 : count), 0);

console.log(numDeposits1000);

/// reduce
/// flatmap so we dont mutate the original array
/// reduce count (is the snowball)
/// cur, is the values
/// if a cur value is > 1000, then log count + 1
/// the count is each iteration, and the plus 1 is because it is zero based
/// : if it's not 1000, return count, which is just 0

// prefix ++ operator

let a = 10;
console.log(++a);
console.log(a);

/// 3 :

const { depositz, withdrawalz } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.depositz += cur) : (sums.withdrawalz = +cur);
      sums[cur > 0 ? "depositz" : "withdrawalz"] += cur;
      return sums;
    },
    { depositz: 0, withdrawalz: 0 }
  );

console.log(depositz, withdrawalz);

/// 4 :
/// this is a nice title => This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalzise = (str) => str[0].toUpperCase() + str.slice(1);

  const excepections = [
    "a",
    "an",
    "and",
    "the",
    "but",
    "or",
    "on",
    "in",
    "with",
  ];

  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) => (excepections.includes(word) ? word : capitalzise(word)))
    .join(" ");
  return capitalzise(titleCase);
};

console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title but not too long"));
console.log(convertTitleCase("and here is another title with an EXAMPLE"));

/// adding 'and' into the exceptions
/// this then made it so if the first word was 'and', it was NOT capalised
/// to fix this, we refactored the methods and made a const capitalize

/// we then added this to the ternary
/// and called it on the return

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

/// 1

dogs.forEach((dog) => (dog.recWeight = Math.trunc(dog.weight * 0.75 * 28)));
console.log(dogs);

/// this is taking the dogs object, and looping through it
/// (dog) is each array in the dogs object
/// making a new item called dog,recWeight which is = to dog.weight ** 0.75 * 28
/// Math.Trunc to give us a whole value

/// 2
const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recWeight ? "Too much food" : "Too Little"
  }`
);

/// dogs.find, this looks for the object
/// dog is each of the array items, it's like ur in the dogs array starting point
/// dog.owners.includes('Sarah')
/// this will get the dogs object that includes 'Sarah'
/// console logging if it's eating too much or too little using Ternary

/// 3
const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recWeight)
  .map((dog) => dog.owners)
  .flat();

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recWeight)
  .map((dog) => dog.owners)
  .flat();

console.log(ownersEatTooLittle);

/// dogs.filter. this logs the 2 objects of dogs that eat more than the recWeight
/// .map puts the owners in seperate arrays
/// .flat puts them all into 1 array

/// 4
console.log(
  ` ${ownersEatTooMuch.join(
    " and "
  )}'s Dogs eat too much!, and ${ownersEatTooLittle.join(
    " and "
  )}'s Dogs eat too little!`
);

/// 5
console.log(dogs.some((dog) => dog.curFood === dog.recWeight));

/// 6
const checkEatingOkay = (dog) =>
  dog.curFood > dog.recWeight * 0.9 && dog.curFood < dog.recWeight * 1.1;

console.log(dogs.some(checkEatingOkay));

/// 7 -
console.log(dogs.filter(checkEatingOkay));

/// 8 - ascending order
const dogsSorted = dogs.slice().sort((a, b) => a.curFood - b.curFood);
console.log(dogsSorted);

const dogz = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

/// DIFFERENT TEST

/// 1
dogz.forEach((dog) => (dog.Foodies = dog.weight + 100));
console.log(dogz);

// 2

const dogzSarah = dogz.find((dog) => dog.owners.includes("Sarah"));
console.log(
  `Sarahs dog is eating ${
    dogz.Foodies > dogz.weight ? "Too Much Food" : "Too Little Food"
  }`
);

// 3 -- RETEST THIS ONE

const ownser = dogz
  .filter((dog) => dog.curFood > dog.weight)
  .map((dog) => dog.owners)
  .flat();

console.log(ownser);

/// 2 ?

console.log(23 === 23.0);

/// BASE 10 - 0 TO 9, 1/10 = 0.1, 3/10 = 3.33333333
/// BINARY BASE 2 - 0 TO 1,

console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
/// will result in 0.33333333333334, so result is false
/// cant do science or finance based logic in javascript too well

// Converting Strings to Numbers
console.log(Number("23"));
console.log(+"23");
/// plus does the same as adding Number

// Parsing
console.log(Number.parseInt("30px"));
console.log(Number.parseInt("px30"));
console.log(Number.parseInt("4fdfdggddg", 4));
/// this converters a string to a number and ignores the symbols
/// must start with a number

// Parse Float
console.log(Number.parseInt("2.5rem"));
console.log(Number.parseFloat("2.5rem"));
/// Parse Float gets decimals, PraseInt does NOT

/// isNAN
console.log(Number.isNaN(20));
console.log(Number.isNaN("20"));
console.log(Number.isNaN(+"20x"));
console.log(23 / 0);
/// is the value NOT a number
/// is 20 a number - true, is 20 NOT a number - false

/// isFinite checks if it is a number, not a string
/// better than isNAN
console.log(Number.isFinite(20));
console.log(Number.isFinite("20"));
console.log(Number.isFinite(+"20"));
console.log(Number.isFinite(23 / 0));

/// isInterger - interger is a WHOLE NUMBER
console.log(Number.isInteger(23 / 0));
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.333333));

/// SQRT - Square Root
console.log(Math.sqrt(25));
/// Cubic Root
console.log(8 ** (1 / 3));
/// Gets the Maximum Number
console.log(Math.max(5, 18, 23, 11, 2));
/// Gets the Minimum Number
console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat("10px") ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

//// TO ALWAYS GET A NUMBER BETWEEN A RANGE

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max = min) + 1) + min;

console.log(randomInt(10, 20));

/// min and max are undefined parameter for the time being
/// Math.Trunc,Math random is a random number between 0-1
/// random number TIMES the max - min
/// this means we get a number between 0, and max-min

/// Rounding Intergers
/// Rounds to the nearest decimel
console.log(Math.round(23.3));
/// Rounds UP to decimel
console.log(Math.ceil(23.3));
/// Rounds DOWN to decimel
console.log(Math.floor(23.3));

/// FLOOR VS TRUNC
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));
/// Floor works better with minuses and all around better

// Rounding decimels (floating point numhers)
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(4));
console.log(+(2.7).toFixed(4));

/// will round decimels
/// always returns a string
/// the (0) adds decimel places, so 0 adds 0 decimels
/// (4) would add 4 decimel places
/// + converts it to a number

/// number is a primitive, so it doesn't have methods
/// because of this, it does what is called Boxing, boxing makes it a number object
/// and then calls the method on that object, and then converts it back

/// The Remainder Operator
console.log(5 % 2); // = 1
console.log(5 / 2); // 5 + 2 + 2 + 1 (1 is the remainder)
console.log(8 % 3); // 2
console.log(8 / 3); // 8 = 2 * 3 + 2 (2 is the remainder)

/// The Remainder with even numbers
console.log(6 % 2); // = 0
/// this is because this divides into this, so they is no remainders

const isEvan = (n) => n % 2 === 0;
console.log(isEvan(8));
/// if n is divisable by 2, it equals zero, as there is no remainder
/// so if this number ==='s zero, it will log true

/// 1
// document.querySelectorAll('.movements__row');
// /// this would come back as a node list, so we need to put it into a real array

// /// 2
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     /// 0,2,4,6...
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     /// 0,3,6,9...
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

/// spread operator to put it into a new array
/// highlighting the movements__row
/// putting each of these rows in a for each
/// function (row) and then i
/// this code needs to be put inside an event handler because or it would just
/// exercute straight away and then be overrided

/// Numeric Separators
const diameter = 28746000000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee = 15_00;
const transferFee2 = 1_500;

const pi = 3.1415;

console.log(Number("23_0000"));

/// only use this in the code when working with numbers

/// BigInt
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

/// n makes it a BigInt
console.log(48958398240834902384098234908230498320948095890328490284n);
console.log(BigInt(48958398240834902384098234));

// operations
console.log(10000n + 100000n);
console.log(74892374897238975982735872398579n * 3678261786746n);

const huge = 32131231234214124124n;
const num = 23;
/// cannot mix BigInt and normal numbers
/// would have to make it a BigInt like below

const huge1 = 32131231234214124124n;
const num1 = 23;
console.log(huge * BigInt(num1));

/// exceptions
console.log(28n > 15);
console.log(20n === 20); // False bc one is big int vs normal number
console.log(20n == 20); // loose operator will make true

console.log(huge + " is REALLY big");

// Divisions
console.log(10n / 3n); /// 3n
console.log(11n / 3n); /// 4n
console.log(10 / 3);

// Create a date
const now = new Date();
console.log(now);

console.log(new Date("Thu Aug 01 2024 17:54:44"));
console.log(new Date("December 24, 2015"));

console.log(new Date("July 22,1996"));
// console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 23, 5));
/// month is Zero based

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates
const future = new Date(2037, 10, 19, 23, 5);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth()); /// zero based
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(Date.now()); /// current timeStamp

future.setFullYear(2040);
console.log(future);
/// changes year, also ones for month,date etc

const futures = new Date(2037, 10, 19, 23, 5);
console.log(+futures);

/// using Number OR + operator, converts the date into milliseconds

const calcdaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcdaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));

console.log(days1);

/// the / sum converts it into days as
/// 1000 converts millyseconds to seconds,
/// *60 converts it to minutes
/// *60 again converts it into hours
/// *24 converts it into days (24 hours in a day)

console.log(new Date(2038, 5, 19, 23, 30));
/// 2038 is year
/// 3 is month (0 based)
/// 19 is date
/// 23 is time
/// 30 is minutes
