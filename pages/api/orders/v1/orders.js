// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const { error } = require('firebase-functions/lib/logger')

import { error } from '@firebase/logger';
import * as codes from '../../../../constants'
import orderRepository from '../../../repositories/ordersRepository'
// const OrderRepository = require('../../../repositories/ordersRepository').orderRepository
const name = '/v1/orders'

//POST  
const orderCreationV1 = async (req, res) => {
    console.log(`uuid[${req}] Executing /api${name}`)
    try {
        const json = req.body
        console.log(json)
        console.log(orderRepository)

        const entity = await orderRepository.create(json)

        if (!entity) throw(new Error(`/api${name}: ERROR obtaining entity`))


        res.status(codes.HTTP_ANSWER_CODES_200_OK)

        return res.json(entity.toMap())

    } catch (error) {
        // console.log(`uuid[${req.locals.transactionId}] error: ${error}`)
        // generics.setStatusErrorV1(error.code, res) 
        return res.send(`ERROR executing /api${name}: ${error.message}`)
    }
}


export default function handler(req, res) {
  if(req.method === 'POST') {
    orderCreationV1(req, res)
  }
  else
  res.status(200).json({ name: 'John Doen' })
}
