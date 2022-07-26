import 'firebase/app'
import * as constants from '../../constants'
import OrderEntity, * as orderEntity from '../../entities/orderEntity'
import { firestore } from "../../firebase";
import { addDoc, writeBatch, collection, onSnapshot, orderBy, query, doc, setDoc, getDoc } from "@firebase/firestore";

export const COLLECTION_ORDERS = 'orders'
export const COLLECTION_ORDERS_FIELD_CREATED_AT = 'tableName'

class OrderRepository {

    async create(json) {
        if(!json){
            const error = new Error("Missing Json")
            error.code = constants.HTTP_ANSWER_CODES_400_BAD_REQUEST
            throw(error)
        }

        let id = json['id']
        const docRef = id === undefined ? doc(collection(firestore, "orders")) : doc(firestore, "orders", id)
        let entity = ''

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const error = new Error("Document already exist")
            error.code = constants.HTTP_ANSWER_CODES_400_BAD_REQUEST
            throw(error)
        }
        else {

            // Inyection of dates and False to IsDeleted
            const date = new Date()
            json[constants.COLLECTION_ORDERS_FIELD_CREATED_AT] = date
            json[constants.COLLECTION_ORDERS_FIELD_MODIFIED_AT] = date
            json[constants.COLLECTION_ORDERS_FIELD_IS_DELETED] = false

            // doc.data() will be undefined in this case
            console.log("No existe la Orden, es posible crearla");
            entity = OrderEntity.fromJson(json)

            if(entity.id === null || entity.id === undefined || entity.id === '')
            entity.id = docSnap.id


            await setDoc(docRef, json);
            const answer = OrderEntity.fromSnapshot(await getDoc(docRef))

            console.log(answer)
    
            return answer
        }

        
  
    }

    async getWithAdminId(OrderName) {
        if (!OrderName) return
        const querySnapshot = await firestore
            .collection(COLLECTION_ORDERS)
            .where(orderEntity.COLLECTION_ORDERS_FIELD_TABLE_NAME, '==', OrderName)
            .get()

        logStore.countEvent('UnitRepository:getWithAdminId', querySnapshot.size, `read adminId:${OrderName}`)

        return querySnapshot.docs.map(snapshotDocument => OrderName.fromSnapshot(snapshotDocument))
    }

    async getOrderWithKey(key) {
        if(key === undefined || key === null || key === '') return null
        const documentSnapshot = await firestore
            .collection(COLLECTION_ORDERS)
            .doc(key)
            .get()
        const answer = new OrderEntity(documentSnapshot);

        logStore.countEvent('UnitRepository:getOrderWithKey', 1, `read key:${key}`)

        return answer
    }

    async getAll(pageSize, lastQuerySnapshot) {
        if (!pageSize) return

        let query = firestore
            .collection(COLLECTION_ORDERS)
            .where(orderEntity.COLLECTION_ORDERS_FIELD_IS_DELETED, '==', false)
            .orderBy(orderEntity.COLLECTION_ORDERS_FIELD_TABLE_NAME)
            .limit(pageSize)
        
        if (lastQuerySnapshot) query = query.startAfter(lastQuerySnapshot)

        const querySnapshot = await query.get()

        logStore.countEvent('OrderRepository:getAll', querySnapshot.size, `read`)

        return { 
            entities: querySnapshot.docs.map(snapshotDocument => OrderEntity.fromSnapshot(snapshotDocument)),
            lastQuerySnapshot: querySnapshot.docs[querySnapshot.docs.length - 1]
        }
    }

    async getWithKey(key)
    {
        if(key === null) return null
        const querySnapshot = await firestore
            .collection(COLLECTION_ORDERS)
            .doc(key)
            .get()
        const answer = orderEntity.fromSnapshot(querySnapshot)

        logStore.countEvent('OrderRepository:getWithKey', 1, `read key:${key}`)
        
        return answer
    }

    async getByName(name, pageSize, lastQuerySnapshot) {
        if (!name) return
        if (typeof name !== typeof '') return
        if (!pageSize) return

        let query = firestore
            .collection(COLLECTION_ORDERS)
            .where(orderEntity.COLLECTION_UNIDADES_FIELD_IS_DELETED, '==', false)
            .where(orderEntity.COLLECTION_UNIDADES_FIELD_SEARCH_KEYWORDS, 'array-contains', name)
            .orderBy(orderEntity.COLLECTION_UNIDADES_FIELD_NAME)
            .limit(pageSize)

        if (lastQuerySnapshot) query = query.startAfter(lastQuerySnapshot)

        const querySnapshot = await query.get()

        logStore.countEvent('UnitRepository:getByName', querySnapshot.size, `read name:${name}`)

        return { 
            entities: querySnapshot.docs.map(snapshotDocument => orderEntity.fromSnapshot(snapshotDocument)),
            lastQuerySnapshot: querySnapshot.docs[querySnapshot.docs.length - 1]
        }
    }

    async setOrderName(key, value){
        if (key === undefined || key === null) return false
        if (value === undefined || value === null) return false

        const ref = firestore.collection(COLLECTION_ORDERS).doc(key)
        const doc = await ref.get()
        if (!doc) return
        const entity = orderEntity.fromSnapshot(doc)
        if (!entity) return
        entity.tableName = value
        entity.modifiedAt = new Date()
        
        await ref.set(entity.toMap(), { merge: false })

        return entity

    }

    async setUnitNit(key, value){
        if (key === undefined || key === null) return false
        if (value === undefined || value === null) return false


        const ref = firestore.collection(COLLECTION_ORDERS).doc(key)
        await ref.set({
            [orderEntity.COLLECTION_UNIDADES_FIELD_NIT] : value,
            [orderEntity.COLLECTION_UNIDADES_FIELD_MODIFIED_AT] : new Date()
        },{merge:true})

        logStore.countEvent('UnitRepository:setUnitNit', 1, `write key:${key} value:${value}`)

        return OrderEntity.fromSnapshot(await ref.get())
    }

    async setUnitAddress(unitId, value){
        if (unitId === undefined || unitId === null) return false
        if (value === undefined || value === null) return false


        const ref = firestore.collection(COLLECTION_ORDERS).doc(unitId)
        await ref.set({
            [orderEntity.COLLECTION_UNIDADES_FIELD_ADDRESS] : value,
            [orderEntity.COLLECTION_UNIDADES_FIELD_MODIFIED_AT] : new Date()
        },{merge:true})

        logStore.countEvent('UnitRepository:setUnitAddress', 1, `write unitId:${unitId} value:${value}`)

        return OrderEntity.fromSnapshot(await ref.get())
    }

    async setUnitRegistriesNameTag(unitId, value){
        if (unitId === undefined || unitId === null) return false
        if (value === undefined || value === null) return false


        const ref = firestore.collection(COLLECTION_ORDERS).doc(unitId)
        await ref.set({
            [orderEntity.COLLECTION_UNIDADES_FIELD_REGISTRIES_NAME_TAG] : value,
            [orderEntity.COLLECTION_UNIDADES_FIELD_MODIFIED_AT] : new Date()
        },{merge:true})

        logStore.countEvent('UnitRepository:setUnitRegistriesNameTag', 1, `write unitId:${unitId} value:${value}`)

        return OrderEntity.fromSnapshot(await ref.get())
    }

    async setUnitRegistriesGroupTag(unitId, value){
        if (unitId === undefined || unitId === null) return false
        if (value === undefined || value === null) return false


        const ref = firestore.collection(COLLECTION_ORDERS).doc(unitId)
        await ref.set({
            [orderEntity.COLLECTION_UNIDADES_FIELD_REGISTRIES_GROUP_TAG] : value,
            [orderEntity.COLLECTION_UNIDADES_FIELD_MODIFIED_AT] : new Date()
        },{merge:true})

        logStore.countEvent('UnitRepository:setUnitRegistriesGroupTag', 1, `write unitId:${unitId} value:${value}`)

        return OrderEntity.fromSnapshot(await ref.get())
    }

    async setUnitRegistriesSubgroupTag(unitId, value){
        if (unitId === undefined || unitId === null) return false
        if (value === undefined || value === null) return false


        const ref = firestore.collection(COLLECTION_ORDERS).doc(unitId)
        await ref.set({
            [orderEntity.COLLECTION_UNIDADES_FIELD_REGISTRIES_SUBGROUP_TAG] : value,
            [orderEntity.COLLECTION_UNIDADES_FIELD_MODIFIED_AT] : new Date()
        },{merge:true})

        logStore.countEvent('UnitRepository:setUnitRegistriesSubgroupTag', 1, `write unitId:${unitId} value:${value}`)

        return OrderEntity.fromSnapshot(await ref.get())
    }

    async deleteOrder(orderId) {
        if (orderId === undefined || orderId === null) return false

        const ref = firestore.collection(COLLECTION_ORDERS).doc(orderId)
        await ref.set({
            [orderEntity.COLLECTION_ORDERS_FIELD_IS_DELETED]: true
        }, { merge: true })

        return true
    }

    // adminId CAN be null
    async setAdminId(unitId, adminId){
        if (!unitId) return false
        if (adminId === undefined || adminId === '') return false

        const ref = firestore.collection(COLLECTION_ORDERS).doc(unitId)
        await ref.set({
            [orderEntity.COLLECTION_UNIDADES_FIELD_ADMIN_ID] : adminId,
            [orderEntity.COLLECTION_UNIDADES_FIELD_MODIFIED_AT] : new Date()
        },{merge:true})

        logStore.countEvent('UnitRepository:setAdminId', 1, `write unitId:${unitId} adminId:${adminId}`)

        return OrderEntity.fromSnapshot(await ref.get())
    }

}

const orderRepositoryInstance = new OrderRepository()
const orderRepository = orderRepositoryInstance

export default orderRepository