import React, {useState} from 'react';
import './ProductList.css';
import {ProductItem} from "./ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Серьги', price: 650-1, decription: 'Серьги серебрянные медведи рыбки bubble tea бабл ти мороженое грибы ', img: 'https://ir.ozone.ru/s3/multimedia-b/c1000/6713553359.jpg'},
    {id: '2', title: 'Наклейки', price: 240-1 , decription: 'Наклейки на телефон детские депрессия 2020 3d наклейки черные серые белые', img: 'https://mirishop.ru/wa-data/public/shop/products/40/65/356540/images/26689404/26689404.440@2x.jpg'},
    {id: '3', title: 'Карты', price: 560-1, decription: 'Карты с Стрей кидс бтс bts', img: 'https://main-cdn.sbermegamarket.ru/big2/hlr-system/-19/346/818/051/911/20/600011989508b1.jpeg'},
    {id: '4', title: 'Подвески', price: 300-1, decription: 'Подвески детские космос 2018 2019', img: 'https://magicmag.net/image/cache/catalog/items-items/9999-2386(9999-2387,9999-2388,9999-2389,9999-2390,9999-2391,9999-2392,9999-2393,9999-2394,9999-2395)/kulon-galaxy-1398x1398.jpg'},
    {id: '5', title: 'Заколки', price: 456+1, decription: 'Заколки звездочки фигурные детские kids stars', img: 'https://basket-02.wbbasket.ru/vol279/part27970/27970715/images/big/1.webp'},
    {id: '6', title: 'Значки', price: 348+1, decription: 'Значки коты cats 3d', img: 'https://basket-09.wbbasket.ru/vol1258/part125885/125885644/images/big/1.webp'},
    {id: '7', title: 'Свечи', price: 669+1, decription: 'Свечи ароматические желтый бежевый розовый свечи', img: 'https://candlesbox.com/wp-content/uploads/11.jpg'},
    {id: '8', title: 'Очки', price: 388+1, decription: 'очки со звездами star glass черные детские ', img: 'https://img.joomcdn.net/de73b85f9e436d4df5c8e74def71a66d42e5ea1b_original.jpeg'},
    {id: '9', title: 'Клач', price: 7469, decription: 'клач белый со стразами white клач маленький', img: 'https://lh3.googleusercontent.com/DCbDeXhZHzJ56Hbq4T_tcNupGai8MQhlX5_Oq7K37cj8pPOGDRfuyvQNIfgwm5vfYQqwHyslWAkJ_J95LH1tUsf8_OhAf3QgSP5FFQ8jZ-2V0R-lKhxV49vuFwduIDuTOTkEFYT_jmBSx4fgDH_InWY'},
    {id: '10', title: 'Бумажные ногти', price: 99, decription: 'ногти бумажные цветные белый красный желтый зеленый синий nails', img: 'https://i.pinimg.com/736x/36/39/27/363927e754398d0f81bca8055e0419e1.jpg'}
]


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

export const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId, onClose} = useTelegram();

    const onSendData = useCallback(() => {
        
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
            tg.onClose()
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};
 