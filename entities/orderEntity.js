import 'firebase/app'
const constants = require('../constants')


class OrderEntity {
    constructor(key, title, details, customers, productsOrdered, createdAt, modifiedAt, isDeleted) {
        this.id = key
        this.title = title
        this.details = details
        this.customers = customers
        this.productsOrdered = productsOrdered
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
        this.isDeleted = isDeleted
    }

    static fromData(title, details) {
        const date = new Date()
        return new OrderEntity
            (null, title, details,[], [], date, date, false)
    }

    static fromSnapshot(snapshot) { //firebase.firestore.DocumentSnapshot
        if (snapshot === null || snapshot === undefined) return
        return new OrderEntity
            (
                snapshot.id,
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_TITLE),
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_DETAILS),
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_CUSTOMERS),
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_PRODUCTS_ORDERED),
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_CREATED_AT),
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_MODIFIED_AT),
                snapshot.get(constants.COLLECTION_ORDERS_FIELD_IS_DELETED),
            )
    }

    static fromJson(json) {
        return new OrderEntity(
            json[constants.COLLECTION_ORDERS_FIELD_ID],
            json[constants.COLLECTION_ORDERS_FIELD_TITLE],
            json[constants.COLLECTION_ORDERS_FIELD_DETAILS],
            json[constants.COLLECTION_ORDERS_FIELD_CUSTOMERS] ? json[constants.COLLECTION_ORDERS_FIELD_CUSTOMERS] : [],
            json[constants.COLLECTION_ORDERS_FIELD_PRODUCTS_ORDERED] ? json[constants.COLLECTION_ORDERS_FIELD_PRODUCTS_ORDERED] : [],
            json[constants.COLLECTION_ORDERS_FIELD_CREATED_AT],
            json[constants.COLLECTION_ORDERS_FIELD_MODIFIED_AT],
            json[constants.COLLECTION_ORDERS_FIELD_IS_DELETED],
        )
    }

    toMap() {
        return {
            [constants.COLLECTION_ORDERS_FIELD_ID]: this.id,
            [constants.COLLECTION_ORDERS_FIELD_TITLE]: this.title,
            [constants.COLLECTION_ORDERS_FIELD_DETAILS]: this.details,
            [constants.COLLECTION_ORDERS_FIELD_CUSTOMERS]: this.customers,
            [constants.COLLECTION_ORDERS_FIELD_PRODUCTS_ORDERED]: this.productsOrdered,
            [constants.COLLECTION_ORDERS_FIELD_CREATED_AT]: this.createdAt,
            [constants.COLLECTION_ORDERS_FIELD_MODIFIED_AT]: this.modifiedAt,
            [constants.COLLECTION_ORDERS_FIELD_IS_DELETED]: this.isDeleted,
        }
    }
}

export default OrderEntity