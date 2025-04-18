import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res) {

    if(req.user == null) {
        return res.status(403).json({ message: "Please login first and try again" });
    }

    const orderInfo = req.body;

    if(orderInfo.name == null) {
        orderInfo.name = req.user.firstName + " " + req.user.lastName;
    }

    let orderId = "CBC00001";

    const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

    if(lastOrder.length > 0 && lastOrder[0].orderId) {
        const lastOrderId = lastOrder[0].orderId;  //"CBC00551"

        const lastOrderNumberString = lastOrderId.replace("CBC", "");  // "00551"
        const lastOrderNumber = parseInt(lastOrderNumberString);  // 551
        const newOrderNumber = lastOrderNumber + 1;  // 552
        const newOrderNumberString = String(newOrderNumber).padStart(5, "0");
        orderId = "CBC" + newOrderNumberString;  // "CBC00552"
    }

    try {

        let total = 0;
        let labelledTotal = 0;
        const products = [];

        for(let i = 0; i < orderInfo.products.length; i++) {

            const item = await Product.findOne({ productId: orderInfo.products[i].productId });

            if(item == null) {
                return res.status(404).json({ message: "Product with productId " + orderInfo.products[i].productId + " is not available" });
            }

            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.name,
                    altNames : item.altName,
                    description : item.description,
                    images : item.images,
                    labelledPrice : item.labelledPrice,
                    price : item.price,
                },
                quantity : orderInfo.products[i].quantity,
            }

            total += item.price * orderInfo.products[i].quantity;
            labelledTotal += item.labelledPrice * orderInfo.products[i].quantity;

        }

            const order = new Order({    
            orderId : orderId,
            email : req.user.email,
            name : orderInfo.name,
            address : orderInfo.address,
            total : 0,
            phone : orderInfo.phone,
            products : [],
            labelledTotal : labelledTotal,
            total : total
        });

        const createdOrder = await order.save();
        res.json({ message: "Order created successfully", order: createdOrder });
    } catch(err) {
        res.status(500).json({ message: "Failed to create order", error: err.message });
    }
}