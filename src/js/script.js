// Константы
const CONSTANTS = {
    MAX_ITEMS: 11,
    ITEMS_FOR_PAYMENT: 3,
    PAYMENT_URL: 'https://lavka.yandex.ru/',
    SELECTORS: {
        PRODUCT: '.product',
        BASKET: '.basket',
        BASKET_CONTAINER: '.banner__basket',
        BANNER: '.banner',
        PAY_BUTTON: '.pay-button',
    },
}

// Класс управления корзиной
class ShoppingBasket {
    constructor() {
        this.products = document.querySelectorAll(CONSTANTS.SELECTORS.PRODUCT)
        this.basket = document.querySelector(CONSTANTS.SELECTORS.BASKET)
        this.basketContainer = document.querySelector(
            CONSTANTS.SELECTORS.BASKET_CONTAINER
        )
        this.productsInBasket = 0
        this.draggedProduct = null
        this.touchOffset = { x: 0, y: 0 }

        this.init()
    }

    init() {
        this.basketItemsContainer = document.createElement('div')
        this.basketItemsContainer.className = 'basket-items'
        this.basketContainer.appendChild(this.basketItemsContainer)
        this.initEvents()
    }

    initEvents() {
        this.products.forEach((product) => {
            product.addEventListener(
                'dragstart',
                this.handleDragStart.bind(this)
            )
            product.addEventListener('dragend', this.handleDragEnd.bind(this))
            product.addEventListener(
                'touchstart',
                this.handleTouchStart.bind(this),
                { passive: false }
            )
            product.addEventListener(
                'touchmove',
                this.handleTouchMove.bind(this),
                { passive: false }
            )
            product.addEventListener('touchend', this.handleTouchEnd.bind(this))
            product.addEventListener('keydown', this.handleKeyDown.bind(this))
        })

        this.basketContainer.addEventListener('dragover', (e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
        })

        this.basketContainer.addEventListener('drop', (e) => {
            e.preventDefault()
            const product = document.querySelector(
                `[data-product="${e.dataTransfer.getData('text/plain')}"]`
            )
            product && this.addToBasket(product)
        })
    }

    addToBasket(product) {
        if (this.productsInBasket >= CONSTANTS.MAX_ITEMS) return

        const basketItem = document.createElement('div')
        basketItem.className = 'basket-item'
        const img = product.querySelector('.product__image').cloneNode(true)
        img.className = 'basket-item__image'
        basketItem.appendChild(img)

        this.basketItemsContainer.appendChild(basketItem)
        product.style.visibility = 'hidden'
        this.productsInBasket++

        if (this.productsInBasket >= CONSTANTS.ITEMS_FOR_PAYMENT) {
            requestAnimationFrame(() => this.showPayButton())
        }

        this.basket.setAttribute(
            'aria-label',
            `Корзина, ${this.productsInBasket} товаров`
        )
    }

    showPayButton() {
        if (document.querySelector(CONSTANTS.SELECTORS.PAY_BUTTON)) return

        const payButton = document.createElement('a')
        payButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
            </svg>
            Оплатить корзину
        `
        Object.assign(payButton, {
            href: CONSTANTS.PAYMENT_URL,
            className: 'pay-button',
            role: 'button',
            'aria-label': 'Перейти к оплате корзины',
        })

        document
            .querySelector(CONSTANTS.SELECTORS.BANNER)
            .appendChild(payButton)
    }

    handleDragStart(e) {
        e.target.classList.add('product_state_dragging')
        e.dataTransfer.setData('text/plain', e.target.dataset.product)
        e.dataTransfer.effectAllowed = 'move'
    }

    handleDragEnd(e) {
        e.target.classList.remove('product_state_dragging')
    }

    handleTouchStart(e) {
        e.preventDefault()
        this.draggedProduct = e.target
        const touch = e.touches[0]
        const rect = e.target.getBoundingClientRect()

        this.touchOffset = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        }

        this.draggedProduct.classList.add('product_state_dragging')
        requestAnimationFrame(() => {
            Object.assign(this.draggedProduct.style, {
                position: 'fixed',
                zIndex: '1000',
                left: `${touch.clientX - this.touchOffset.x}px`,
                top: `${touch.clientY - this.touchOffset.y}px`,
            })
        })
    }

    handleTouchMove(e) {
        if (!this.draggedProduct) return
        e.preventDefault()

        const touch = e.touches[0]
        requestAnimationFrame(() => {
            Object.assign(this.draggedProduct.style, {
                left: `${touch.clientX - this.touchOffset.x}px`,
                top: `${touch.clientY - this.touchOffset.y}px`,
            })
        })
    }

    handleTouchEnd(e) {
        if (!this.draggedProduct) return

        const touch = e.changedTouches[0]
        const basketRect = this.basket.getBoundingClientRect()

        if (this.isOverBasket(touch, basketRect)) {
            this.addToBasket(this.draggedProduct)
        }

        Object.assign(this.draggedProduct.style, {
            position: '',
            left: '',
            top: '',
            zIndex: '',
        })
        this.draggedProduct.classList.remove('product_state_dragging')
        this.draggedProduct = null
    }

    isOverBasket(touch, basketRect) {
        return (
            touch.clientX >= basketRect.left &&
            touch.clientX <= basketRect.right &&
            touch.clientY >= basketRect.top &&
            touch.clientY <= basketRect.bottom
        )
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.addToBasket(e.target)
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => new ShoppingBasket())
