import { setDoc,doc, writeBatch, collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
// import { firestore } from "../firebase";
import { getFirestore } from "firebase/firestore";
import app from "../firebase"


const OrdersList = () => {
    const [orders, setOrders] = useState([])

    useEffect(() =>{
        const firestore = getFirestore(app)


        // let ref = doc(collection(firestore, "orders"))
        // setDoc(ref, {
        //     title: "Mesa de Prueba NUEVA",
        //     detail: "Esta es una mesa de prueba con Clientes",
        //   });

        const collectionRef = collection(firestore, "orders")

        const q = query(collectionRef);

        const activeorders = onSnapshot(q, (querySnapshot) => {
            setOrders(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id
                 })))
        });

        return activeorders;
    }, [])

    return (
        <div>
            {orders.map(order => 
            <div key={order.id}>
                <div className="bg-white rounded mt-2 shadow-lg hover:outline-none border-b-4 border-gray-300 hover:border-blue-700 transition duration-500 transform hover:scale-103">
                <div className="flex h-6 bg-gray-400 rounded-tr rounded-tl  items-center">
                    <p className="text-s mx-1">Mesa: {order.title}</p>
                </div>
                <div className="flex mr-1 ml-1">
                    <div>
                        <div className="flex">
                            <div className=" ">Descripción:</div>
                            <div className=" bg-gray-400 ml-2">{order.detail}</div>
                        </div>
                        <div className="flex">
                            <div className=" ">ID:</div>
                            <div className="ml-2">{order.id}</div>
                        </div>
                        <div className="flex">
                            <div className=" ">Total de Productos:</div>
                            <div className=" bg-gray-400 ml-2"></div>
                        </div>
                    </div>
                </div>
            </div>
                
                
                
                
            </div>)}
        </div>
    )
}

export default OrdersList