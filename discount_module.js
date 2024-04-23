class campaign {
    constructor(campaign, category, parameter) {
        this.campaign = campaign;
        this.category = category;
        this.parameter = parameter;
    }
}

class shoppingcart {

    constructor() {
        this.items = [];
        this.price = 0;
    }

    additem(item) {
        this.items.push(item);
    }


}

function Discount(campaign, cart) {
    let totalPrice = 0;
    if (cart.price == 0) {
        totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
    }
    else {
        totalPrice = cart.price
    }

    switch (campaign.campaign) {
        case 'Fixed amount':
            console.log(campaign.campaign)
            totalPrice -= campaign.parameter.Amount;
            break;
        case 'Percentage discount':
            console.log(campaign.campaign)
            totalPrice -= totalPrice * (campaign.parameter.Percentage / 100);
            break;
        case 'Percentage discount by item category':
            console.log(campaign.campaign)

            const categoryTotalPrice = cart.items
                .filter(item => item.category === campaign.parameter.Category)
                .reduce((acc, item) => acc + item.price, 0);
            totalPrice -= categoryTotalPrice * (campaign.parameter.Amount / 100);
            break;
        case 'Discount by points':
            console.log(campaign.campaign)

            const discountAmount = Math.min(totalPrice * 0.2, campaign.parameter.Customer_points);
            totalPrice -= discountAmount;
            break;
        case 'Special campaigns':
            console.log(campaign.campaign)

            const discountAmountForSeasonal = Math.floor(totalPrice / campaign.parameter.X) * campaign.parameter.Y;
            totalPrice -= discountAmountForSeasonal;
            break;
    }
    //prevent totalPrice to be negative after discount
    return Math.max(totalPrice, 0);
}

function calculateFinalPrice(cart, campaigns) {
    const usedCategories = new Set();
    let Discountprice = 0;

    // Separate campaigns by category
    const couponCampaigns = campaigns.filter(campaign => campaign.category === 'coupon');
    const onTopCampaigns = campaigns.filter(campaign => campaign.category === 'on_top');
    const seasonalCampaigns = campaigns.filter(campaign => campaign.category === 'seasonal');

    // use coupon campaigns first
    for (const campaign of couponCampaigns) {
        if (!usedCategories.has(campaign.category)) {
            usedCategories.add(campaign.category);
            // console.log(usedCategories)
            Discountprice = Discount(campaign, cart);
            cart.price = Discountprice
            // console.log( Discountprice)
        }
    }

    // use on top campaigns next
    for (const campaign of onTopCampaigns) {
        if (!usedCategories.has(campaign.category)) {
            usedCategories.add(campaign.category);
            // console.log(usedCategories)
            Discountprice = Discount(campaign, cart);
            cart.price = Discountprice
            // console.log( Discountprice)
        }
    }

    // use seasonal campaigns last
    for (const campaign of seasonalCampaigns) {
        if (!usedCategories.has(campaign.category)) {
            usedCategories.add(campaign.category);
            // console.log(usedCategories)
            Discountprice = Discount(campaign, cart);
            cart.price = Discountprice
            // console.log( Discountprice)
        }
    }

    return Discountprice;
}


// mock up shopping cart 
const yourshoppingcart = new shoppingcart();
yourshoppingcart.additem({ name: 'T-Shirt', price: 350, category: 'Clothing' })
yourshoppingcart.additem({ name: 'Hoodie', price: 700, category: 'Clothing' })
yourshoppingcart.additem({ name: 'Watch', price: 850, category: 'Accessories' })
yourshoppingcart.additem({ name: 'Bag', price: 250, category: 'Accessories' })

//mock up campaigns input 
const campaigns = [
    new campaign('Percentage discount by item category', 'on_top', { Category: 'Clothing', Amount: 15 }),
    new campaign('Fixed amount', 'coupon', { Amount: 50 }),
    new campaign('Percentage discount', 'coupon', { Percentage: 10 }),
    new campaign('Discount by points', 'on_top', { Customer_points: 45 }),
    new campaign('Special campaigns', 'seasonal', { X: 300, Y: 40 })
];

// for (const campaign of campaigns) {
//     console.log(campaign.campaign)
// }

const finalPrice = calculateFinalPrice(yourshoppingcart, campaigns);
console.log(`Final Price: ${finalPrice} THB`);