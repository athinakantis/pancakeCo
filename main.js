"use strict";

//Initial values for cart and Custom pancake
let totalPancakeCount = 0;
const orderList = [];
const cart = [];
let [basePrice, toppingsPrice, deliveryCost] = [5, 0, 0];
let customPancake = { pancakeBase: 'Classic', toppings: [], extras: [] };
let currentTimeout;


//Current 'Specials'
const specials = [{ pancake: 'Cherry Bomb', cost: 12 }, { pancake: 'Pumpkin Spice Cinnamon Roll', cost: 11, special: true }, { pancake: 'Banana Swirl', cost: 10, special: true }];





class Pancake {
    constructor(count, pancake, special, cost, name = 'Custom') {
        this.count = +count;
        this.name = name;
        this.pancake = {
            pancakeBase: pancake.pancakeBase,
            toppings: pancake.toppings,
            extras: pancake.extras
        };
        this.special = special;
        this.cost = +cost;
    }

    getTotalCost() {
        return this.cost * this.count;
    }

    addPancake() {
        return this.count++;
    }

    removePancake() {
        return this.count--;
    }

    isSpecial() {
        return this.special;
    }
}


/* 
PANCAKE CUSTOMIZATION
Functions, variables and event listeners */
const pancakeType = document.querySelector('#type');
const pancakeTypeOptions = document.querySelectorAll('#type option');
const toppings = document.querySelectorAll('input[name="topping"]');
const extras = document.querySelectorAll("input[name='extra']");
const reply = document.querySelector('#reply');
const cartCounter = document.querySelector('#cartCount');



pancakeType.addEventListener('change', () => {
    basePrice = +pancakeType.value;
    const pancakeId = Array.from(pancakeTypeOptions).find((a) => +a.value === basePrice);
    customPancake.pancakeBase = pancakeId.id;
    return updatePrice();
})


toppings.forEach((el) => {
    el.addEventListener('change', () => {
        el.checked ? addTopping(el, 'toppings') : removeTopping(el, 'toppings');
    });
});

extras.forEach((el) => {
    el.addEventListener('change', () => {
        el.checked ? addTopping(el, 'extras') : removeTopping(el, 'extras');
    });
});

function addTopping(topping, category) {
    customPancake[category].push(topping.id);
    toppingsPrice += +topping.value;
    updatePrice();
}

function removeTopping(topping, category) {
    customPancake[category].filter((a) => a !== topping.id);
    toppingsPrice -= +topping.value;
    updatePrice();
}

const deliveryChoice = document.querySelector('#delivery')
deliveryChoice.addEventListener('change', () => {
    deliveryChoice.checked ? deliveryCost = 5 : deliveryCost = 0;
    summaryTotalCost();
})


// Update the price banner whenever a change is made in the customization.
const displayPrice = document.querySelectorAll('#totalPrice');
function updatePrice() {
    for (let element of displayPrice) {
        element.textContent = `$${basePrice + toppingsPrice}`;
        element.classList.add('bounce');
        setTimeout(() => element.classList.remove('bounce'), 400);
    }
}


// If an error occurs, a message is displayed to the user.
function showMessage(msg) {
    reply.textContent = msg;
    if (currentTimeout) { clearTimeout(currentTimeout); }
    currentTimeout = setTimeout(() => reply.textContent = '', 4000);
}



/* Site Navigation functionality & Event Listeners */
const [specialsBtn, customBtn, viewCartBtn] = document.querySelectorAll('#specials, #custom, #viewCart');
const [specialsPage, customPage, summary] = document.querySelectorAll('.specials, .customize, .summary');
const [homeBtn, redirectAboutBtn] = document.querySelectorAll('#homeBtn, #redirectAboutBtn');
const [home, order, confirmation, about] = document.querySelectorAll('.home, .order, .confirmation, .about');
const redirectOrderBtns = document.querySelectorAll('.redirectOrderBtn');



// Keep track of current active sections
let activeBtn = specialsBtn;
let currentPage = home;
let currentOrderPage = specialsPage;

function toggleOrderPage(section, btn) {
    activeBtn.classList.toggle('active');
    currentOrderPage.classList.toggle('active');

    section.classList.toggle('active');
    btn.classList.toggle('active');

    activeBtn = section;
    currentOrderPage = btn;
}


specialsBtn.addEventListener('click', () => toggleOrderPage(specialsPage, specialsBtn));
customBtn.addEventListener('click', () => toggleOrderPage(customPage, customBtn));
viewCartBtn.addEventListener('click', () => {
    viewCart();
    toggleOrderPage(summary, viewCartBtn);
});


homeBtn.addEventListener('click', () => togglePage(home));
redirectOrderBtns.forEach((button) => button.addEventListener('click', () => togglePage(order)));
redirectAboutBtn.addEventListener('click', () => togglePage(about));


function togglePage(el) {
    currentPage.classList.toggle('active');
    el.classList.toggle('active');
    currentPage = el;
}


function viewCart() {
    summaryTotalCost();
    displayOrder();
}






/*
ADDING PANCAKES: Specials & Customs
Functions, variables and event listeners  */
const addCustomBtn = document.querySelector('#addCustom');
const addSpecialsBtn = document.querySelectorAll('.addSpecial');
addCustomBtn.addEventListener('click', () => addToCart(customPancake));
addSpecialsBtn.forEach((button, index) => {
    button.addEventListener('click', () => addToCart(specials[index], true));
})


//Check if pancake is already in cart
function isInCart(pancake, special = false) {
    if (special) {
        return cart.findIndex((item) => item.name === pancake.pancake);
    }
    return cart.findIndex((item) => JSON.stringify(item.pancake) === JSON.stringify(pancake));
}


//If pancake is already in cart, add to it. Else, push new pancake.
function addToCart(pancake, special = false) {
    const cartNum = isInCart(pancake, special);
    let cost;

    special ? cost = pancake.cost : cost = basePrice + toppingsPrice;

    if (cartNum === -1) {
        cart.push(new Pancake(1, pancake, special, cost, pancake.pancake));
    } else if (cartNum !== -1) {
        cart[cartNum].addPancake();
    }


    totalPancakeCount++;
    displayOrder();
    updateCartCount();
    resetPancake();
}



/*
ORDER SUMMARY
Functions, variables and event listeners*/
const orderDisplay = document.querySelector('.orderDisplay');
function displayOrder() {
    orderDisplay.innerHTML = '';
    if (cart.length < 1) {
        orderDisplay.textContent = `Your cart is empty, try adding some delicious pancakes! :)`;
    } else {
        cart.forEach((item) => {
            let typeOfPancake;
            if (!item.isSpecial()) {
                let [base, toppings, extras] = [item.pancake.pancakeBase, item.pancake.toppings, item.pancake.extras];

                typeOfPancake = `${base} pancake, Toppings: ${toppings.length > 0 ? toppings.join(', ') : 'None'}, Extras: ${extras.length > 0 ? extras.join(', ') : 'None'}`
            } else {
                typeOfPancake = `${item.name}`
            }

            orderDisplay.innerHTML += `
            <div class='orderItem'>
            ${item.count}x ${typeOfPancake}
            <div>
            <button class='orderAdd'>+</button>
            <button class='orderRm'>-</button>
            </div>
            </div>
            `
        })
    }
    listenAddRemove();
    summaryTotalCost();
}


// Removing from cart. 
// Decrementing if more than 1 pancake, removing entirely if only one.
const [orderAddBtn, orderRmBtn] = document.querySelectorAll('.orderAdd, .orderRm');
function removeFromCart(index) {
    totalPancakeCount--;
    if (cart[index].count > 1) {
        cart[index].removePancake();
    } else {
        cart.splice(index, 1);
    }
    orderDisplay.innerHTML = '';
    updateCartCount();
    summaryTotalCost();
    displayOrder();
}


//Attaching event listeners to summary buttons, in case user wants to add or remove from their cart
function listenAddRemove() {
    const orderAddBtn = document.querySelectorAll('.orderAdd');
    const orderRemoveBtn = document.querySelectorAll('.orderRm');

    orderAddBtn.forEach((button, index) => {
        button.addEventListener('click', () => {
            cart[index].addPancake();
            displayOrder();
        })
    })

    orderRemoveBtn.forEach((button, index) => {
        button.addEventListener('click', () => removeFromCart(index));
    })
}


//Displaying the total cost of all items in the cart
const summaryCostDisplay = document.querySelector('#summaryTotalCost');
const deliverySpan = document.querySelector('#deliveryFee');
function summaryTotalCost() {
    let summaryCost = 0;
    cart.forEach((item) => summaryCost += item.getTotalCost());
    summaryCostDisplay.textContent = `$${summaryCost + deliveryCost}`;
    deliveryCost === 5 ? deliverySpan.textContent = `, including a $5 delivery fee` : deliverySpan.textContent = '';
}


//Placing the order if customer has entered a name and cart is not empty
const placeOrderBtn = document.querySelector('#placeOrder');
placeOrderBtn.addEventListener('click', placeOrder);

function placeOrder() {
    try {
        const name = document.querySelector('#orderName').value.trim();

        if (!name || name.length < 1) {
            throw new Error(`Order is missing a name`);
        }

        if (cart.length < 1) {
            throw new Error('Cannot checkout empty cart');
        }

        orderList.push(JSON.stringify(cart));
        togglePage(confirmation);
        resetCart();

    } catch (error) {
        showMessage(`Error: ` + error.message);
    }
}

//Updating cart 'preview' to display how many total pancakes the user has in cart
function updateCartCount() {
    cartCounter.textContent = totalPancakeCount;
    totalPancakeCount > 0 ? cartCounter.classList.add('active') : cartCounter.classList.remove('active');
}


// After a pancake is added to the cart, reset the form
function resetPancake() {
    [basePrice, toppingsPrice, deliveryCost] = [5, 0, 0];
    pancakeType.value = 5;
    document.querySelectorAll('input[name="topping"], input[name="extra"]').forEach((topping) => {
        topping.checked = false;
    })

    customPancake.pancakeBase = 'Classic';
    customPancake.toppings = [];
    customPancake.extras = [];
    updatePrice();
}

// After an order is placed, reset the cart
function resetCart() {
    deliverySpan.textContent = '';
    document.querySelector('#eatIn').checked = true;
    totalPancakeCount = 0;
    orderDisplay.innerHTML = '';
    updateCartCount();
    cart.length = 0;
    summaryTotalCost();
}