import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const OrdersList = () => {
    const [orders, setOrders] = useState([])

    useEffect(() =>{
        const collectionRef = collection(db, "orders")

        const q = query(collectionRef, orderBy("timestamp", "desc"));

        const activeorders = onSnapshot(q, (querySnapshot) => {
            setOrders(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id,
                timestamp: doc.data().timestamp?.toDate().getTime() })))
        });

        return activeorders;
    }, [])

    return (
        <div>
            {orders.map(order => <div key={order.id}>{order.title}</div>)}
        </div>
    )
}

export default OrdersList