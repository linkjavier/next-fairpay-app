const codes = require('../../../../constants')
const admin = require('firebase-admin')
const name = '/v1/generics'

//PATCH
const hydrateEntityV1= (json, functionIsKey, entity) => {

    if(!json || Object.keys(json).length === 0){
        const error = new Error("Missing Json")
        error.code = codes.HTTP_ANSWER_CODES_400_BAD_REQUEST
        throw(error)
    }

    let answer 

    for (var k in json) {
        answer = functionIsKey(k)
        if(!answer){
            const error = new Error("Field doesn't exist")
            error.code = codes.HTTP_ANSWER_CODES_400_BAD_REQUEST
            throw(error)
        }
        else{
            entity[k] = (json[k])
        }
    }

    return entity
};

const setStatusErrorV1= (errorCode, res) => {
    switch (errorCode) {
        case codes.HTTP_ANSWER_CODES_400_BAD_REQUEST:
        case codes.HTTP_ANSWER_CODES_404_NOT_FOUND:
            res.status(errorCode)
            break;
        default:
            res.status(codes.HTTP_ANSWER_CODES_500_INTERNAL_SERVER_ERROR)
            break;
    }
    
};

const obligatoryFieldCheckerV1= (json, fieldName) => {
    if(json[fieldName] === undefined || json[fieldName] === null){
        const error = new Error(`Missing ${fieldName} obligatory field`)
        error.code = codes.HTTP_ANSWER_CODES_400_BAD_REQUEST
        throw(error)
    }
}

const arrayCheckerV1= (json, fieldName) => {
    if(!(Array.isArray(json[fieldName]))) {
        const error = new Error(`${fieldName} must be an array`)
        error.code = codes.HTTP_ANSWER_CODES_400_BAD_REQUEST
        throw(error)
    }
}

const adjustJSON = (json) => {
    let newJSON = {}
    for(element in json) {
        if(Array.isArray(json[element])){
            newJSON[element] = admin.firestore.FieldValue.arrayUnion(...json[element])
        }
        else{
            newJSON[element] = json[element]
        }
    }

    return newJSON
}

// Expose Express API as a single Cloud Function:
module.exports.hydrateEntityV1 = hydrateEntityV1
module.exports.setStatusErrorV1 = setStatusErrorV1
module.exports.arrayCheckerV1 = arrayCheckerV1
module.exports.obligatoryFieldCheckerV1 = obligatoryFieldCheckerV1
module.exports.adjustJSON = adjustJSON
module.exports.name = name