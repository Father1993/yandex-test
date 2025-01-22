// document.addEventListener('DOMContentLoaded', () => {
//     const products = document.querySelectorAll('.product')
//     const basket = document.querySelector('.basket')
//     let productsInBasket = 0

//     products.forEach((product) => {
//         product.addEventListener('dragstart', (e) => {
//             product.classList.add('dragging')
//             e.dataTransfer.setData('text/plain', product.dataset.product)
//         })

//         product.addEventListener('dragend', () => {
//             product.classList.remove('dragging')
//         })
//     })

//     basket.addEventListener('dragover', (e) => {
//         e.preventDefault()
//     })

//     basket.addEventListener('drop', (e) => {
//         e.preventDefault()
//         const productId = e.dataTransfer.getData('text/plain')
//         const product = document.querySelector(`[data-product="${productId}"]`)

//         if (product) {
//             product.style.visibility = 'hidden'
//             productsInBasket++

//             if (productsInBasket >= 3) {
//                 showPayButton()
//             }
//         }
//     })

//     function showPayButton() {
//         const payButton = document.createElement('a')
//         payButton.href = 'https://lavka.yandex.ru/'
//         payButton.className = 'pay-button'
//         payButton.textContent = 'Оплатить корзину'
//         document.querySelector('.banner').appendChild(payButton)
//     }
// })
