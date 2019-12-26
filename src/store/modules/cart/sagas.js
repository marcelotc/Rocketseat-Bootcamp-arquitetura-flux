import { call, select, put, all, takeLatest } from 'redux-saga/effects';
//call é tipo um api.get do axios
//put é tipo um dispatch

import api from '../../../services/api';
import { formatPrice } from '../../../util/format';

import { addToCartSuccess, updateAmount } from './actions';

function* addToCart({ id }) {
    const productExists = yield select(
        state => state.cart.find(p => p.id === id)
    );

    const stock = yield call(api.get, `/stock/${id}`);

    const stockAmount = stock.data.amount;
    const currenAmount = productExists ? productExists.amount : 0;

    const amount = currenAmount + 1;

    if(amount > stockAmount){
        console.tron.console.warn('Erro');
        return;
    }

    if (productExists) {
        const amount = productExists.amount + 1;

        yield put(updateAmount(id, amount))
    } else {
        const response = yield call(api.get, `/products/${id}`);

        const data = {
            ...response.data,
            amount: 1,
            priceFormatted: formatPrice(response.data.price)
        }

        yield put(addToCartSuccess(data));
    }


}

export default all([
    takeLatest('@cart/ADD_REQUEST', addToCart)
]);