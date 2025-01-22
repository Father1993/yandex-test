document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product')
    const basket = document.querySelector('.basket')
    const basketContainer = document.querySelector('.banner__basket')
    let productsInBasket = 0

    // Создаем контейнер для товаров в корзине
    const basketItemsContainer = document.createElement('div')
    basketItemsContainer.className = 'basket-items'
    basketContainer.appendChild(basketItemsContainer)

    function addToBasket(product) {
        // Создаем элемент в корзине
        const basketItem = document.createElement('div')
        basketItem.className = 'basket-item'

        // Клонируем изображение и добавляем правильный класс
        const img = product.querySelector('.product__image').cloneNode(true)
        img.className = 'basket-item__image'
        basketItem.appendChild(img)

        // Добавляем в контейнер корзины
        basketItemsContainer.appendChild(basketItem)
    }

    products.forEach((product) => {
        product.addEventListener('dragstart', (e) => {
            product.classList.add('product_state_dragging')
            e.dataTransfer.setData('text/plain', product.dataset.product)
        })

        product.addEventListener('dragend', () => {
            product.classList.remove('product_state_dragging')
        })
    })

    basketContainer.addEventListener('dragover', (e) => {
        e.preventDefault()
    })

    basketContainer.addEventListener('drop', (e) => {
        e.preventDefault()
        const productId = e.dataTransfer.getData('text/plain')
        const product = document.querySelector(`[data-product="${productId}"]`)

        if (product && productsInBasket < 11) {
            addToBasket(product)
            product.style.visibility = 'hidden'
            productsInBasket++

            if (productsInBasket >= 3) {
                showPayButton()
            }
        }
    })

    function showPayButton() {
        if (!document.querySelector('.pay-button')) {
            const payButton = document.createElement('a')
            payButton.href = 'https://lavka.yandex.ru/'
            payButton.className = 'pay-button'
            payButton.textContent = 'Оплатить корзину'
            payButton.style.position = 'absolute'
            payButton.style.bottom = '20px'
            payButton.style.left = '50%'
            payButton.style.transform = 'translateX(-50%)'
            payButton.style.padding = '10px 20px'
            payButton.style.backgroundColor = '#ff3b30'
            payButton.style.color = '#fff'
            payButton.style.textDecoration = 'none'
            payButton.style.borderRadius = '5px'

            document.querySelector('.banner').appendChild(payButton)
        }
    }
})
