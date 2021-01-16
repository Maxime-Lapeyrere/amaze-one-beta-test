var express = require('express');
var router = express.Router();

var Products = [
  {
    name: "Apple watch",
    price: 300,
    image: "/images/apple-watch.png",
    quantity : 1
  }, {
    name: "Porte document",
    price: 76,
    image: "/images/porte-doc.png",
    quantity : 1
  }, {
    name: "DJI mavic air",
    price: 989,
    image: "/images/dji-mavic-air.png",
    quantity : 1
  }, {
    name: "Oculus",
    price: 342,
    image: "/images/oculus.png",
    quantity : 1
  }, {
    name: "Bose QC35",
    price: 155,
    image: "/images/bose-qc35.png",
    quantity : 1
  }, {
    name: "Xiaomi-m365",
    price: 674,
    image: "/images/xiaomi-m365.png",
    quantity : 1
  }, {
    name: "BRIG Eagle 380",
    price: 15500,
    image: "/images/BRIG-Eagle-380.png",
    quantity : 1
  }, {
    name: "Linda Razer",
    price: 897,
    image: "/images/linda.png",
    quantity : 1
  }, {
    name: "Fort 500",
    price: 67,
    image: "/images/fort-500.png",
    quantity : 1
  }, {
    name: "OnePlus 6",
    price: 540,
    image: "/images/one-plus6.png",
    quantity : 1
  }
]

router.get('/', function(req, res, next) {
  if(req.session.panier == undefined){
    req.session.panier = []
    }
    var basketQuantity=0
  for(i=0; i<req.session.panier.length; i++){
    basketQuantity += req.session.panier[i].quantity 
  }
  res.render('index', {Products, panier : req.session.panier, basketQuantity});
});

router.get('/buy', function(req, res, next) {
  var total = 0
  var alreadyExists = false
  
  console.log('TEST---',req.query)
  console.log(req.session.panier)
  if(req.session.panier == undefined){
    req.session.panier = []
    }
for(i=0;i<req.session.panier.length;i++){
  if(req.session.panier[i].name==req.query.name){
    req.session.panier[i].quantity++
    alreadyExists = true
  } 
}

if(alreadyExists == false){
  req.session.panier.push({
    price : req.query.price,
    name : req.query.name,
    image : req.query.image,
    quantity : 1 
  })
}
var total = 0
  for(i=0; i<req.session.panier.length; i++){
    total += req.session.panier[i].price * req.session.panier[i].quantity
  }
var basketQuantity=0
  for(i=0; i<req.session.panier.length; i++){
    basketQuantity += req.session.panier[i].quantity 
  }
console.log('TESTF---',req.session.panier)
  res.render('basket', {Products, panier : req.session.panier, total,basketQuantity});
});

router.get('/deletedBike', function(req, res, next) {
  
  req.session.panier.splice(req.query.position,1)
  total= parseInt(total);
  var basketQuantity=0;
  for(i=0; i<req.session.panier.length; i++){
    basketQuantity += parseInt(req.session.panier[i].quantity) 
  }
  var total = 0
  for(i=0; i<req.session.panier.length; i++){
    total += parseInt(req.session.panier[i].price) * parseInt(req.session.panier[i].quantity)
  };
  console.log('ON VEUT---',total)
  // console.log('ON VEUT1---',parseInt(req.session.panier[i].price))
  // console.log('ON VEUT2---',parseInt(req.session.panier[i].quantity))
    res.render('basket', {panier : req.session.panier,total, basketQuantity});
  }
);

var nvlquantit=0
router.post('/newPrice', function(req, res, next) {
console.log('test',req.body)  
nvlquantit = req.body.quantity
  req.session.panier[req.body.index].quantity = nvlquantit
  var total = 0
  for(i=0; i<req.session.panier.length; i++){
    total += req.session.panier[i].price * req.session.panier[i].quantity
  }
  var basketQuantity=0;
  for(i=0; i<req.session.panier.length; i++){
    basketQuantity += parseInt(req.session.panier[i].quantity) 
  }
  console
  console.log(req.body.index)
  console.log('finder',req.body.quantity)


    res.render('basket', {panier : req.session.panier, total, basketQuantity});
  }
);

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51IACigCKA7eVzOgNAdO4Kz87IXax8btt3JpJ9hrBhjsz57wtnPM4XOT6DPZgth9ZmqeAnS7BrNEkqQl5mVyYYm2S00lL0QfEOs');

// if(stripeItems == undefined){
  //   stripeItems = []}
  router.post('/create-checkout-session', async (req, res) => {
    
    
    var stripeItems = [];
  
  for(var i=0;i<req.session.panier.length;i++){
   
    stripeItems.push({

      price_data: {
        currency: 'eur',
        product_data: {
          name: req.session.panier[i].name,
          images : [req.session.panier[i].src]
        },

        unit_amount: parseInt(req.session.panier[i].price)*100,
      },

      quantity: parseInt(req.session.panier[i].quantity),
    });
  }
  
  const session = await stripe.checkout.sessions.create({
    
    payment_method_types: ['card'],

    line_items: stripeItems,

    mode: 'payment',

    success_url: 'https://fierce-ravine-70664.herokuapp.com/success',

    cancel_url: 'https://fierce-ravine-70664.herokuapp.com/',

  });
console.log(session)

  res.json({ id: session.id });
});

router.get('/success', function(req, res, next) {
  
  res.render('success');
  
}
);

module.exports = router;
