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
}