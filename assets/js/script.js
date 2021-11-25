// CONSTANTS

// menu
const menu = document.querySelector('.header__menu-container')
const openMenuBtn = document.querySelector('.header__open-btn')
const closeMenuBtn = document.querySelector('.header__close-btn')

// cart
const cartContainer = document.querySelector('.header__cart')
const cartModalContainer = document.querySelector('.header__cart__modal')
const cartModal = document.querySelector('.header__cart__modal__content')
const cartItemsContainer = document.querySelector('.header__cart__items')
const openCartBtn = document.querySelector('.header__cart-icon')
const addCartBtn = document.querySelector('.product__info__add-btn')
const cart = []

// slider
const totalSlides = product.imgs.thumbnails.length-1
let currentSlideIndex = 0

// product lightBox
const lightBox = document.querySelector('.product__lightBox')
const openLightBoxBtn = document.querySelector('.product__gallery__slider')
const closeLightBoxBtn = document.querySelector('.product__lightBox__close-btn')

// qnt
const countContainer = document.querySelector('.product__info__qnt__count')
const decreaseBtn = document.querySelector('.product__info__qnt__btn.minus')
const increaseBtn = document.querySelector('.product__info__qnt__btn.plus')
let qnt = 1

// FUNCTIONS

// menu
const openMenu = () => {
    menu.classList.add('is-open')
    setTimeout( () => menu.classList.add('animate'), 1)
}
openMenuBtn.addEventListener('click', openMenu)

const closeMenu = () => {
    menu.classList.remove('animate')
    setTimeout( () => menu.classList.remove('is-open'), 300)
}
closeMenuBtn.addEventListener('click', closeMenu)

// cart
const openCart = () => {
    cartModalContainer.classList.add('is-open')
    setTimeout(() => cartModal.classList.add('animate'), 1)
}

const closeCart = () => {
    cartModal.classList.remove('animate')
    setTimeout( () => cartModalContainer.classList.remove('is-open'), 300)
}

const isCartOpen = () => cartModalContainer.classList.contains('is-open')

const toggleCart = () => isCartOpen() ? closeCart() : openCart()
openCartBtn.addEventListener('click', toggleCart)

const updateCartState = () => {
    isCartEmpty()
        ? cartContainer.classList.add('is-empty')
        : cartContainer.classList.remove('is-empty')
}

const updateCartCount = () => {
    const totalItemsInCart = cart.reduce( (acc, product) => acc += product.qnt, 0)
    const cartCount = document.querySelector('.header__cart__count')

    if (totalItemsInCart > 0) cartCount.innerText = totalItemsInCart
}

const updateCart = () => {
    updateCartCount()
    updateCartState()
    resetQnt()
}

const deleteItemFromCart = e => {
    const item = e.target.closest('.header__cart__item')
    cartItemsContainer.removeChild(item)

    cart.splice(product.id-1, 1)
    updateCart()
}

const updateCartItem = indexOfItem => {
    const item = document.querySelectorAll('.header__cart__item')[indexOfItem]
    item.querySelector('.header__cart__item__qnt p').innerText = cart[indexOfItem].qnt
    item.querySelector('.header__cart__item__price-total').innerText = `$${(cart[indexOfItem].product.price.now * cart[0].qnt).toFixed(2)}`
}

const renderCartItem = () => {
    const cartItem = document.createElement('div')
    
    cartItem.classList.add('header__cart__item')
    
    cartItem.innerHTML = `
        <div class="header__cart__item__thumbnail-img">
            <img src="${product.imgs.thumbnails[0]}" alt="Product thumbnail image" />
        </div>
        <div class="header__cart__item__info">
            <p class="header__cart__item__product-name">${product.name}</p>
            <div class="header__cart__item__price">
                <p class="header__cart__item__price-now">$${product.price.now}</p>
                <div class="header__cart__item__qnt">x <p>${qnt}</p></div>
                <strong class="header__cart__item__price-total">$${(product.price.now * qnt).toFixed(2)}</strong>
            </div>
        </div>
        <button class="header__cart__item__delete-btn">
            <img src="./assets/images/icon-delete.svg" alt="Delete icon" />
        </button>
    `

    const deleteBtn = cartItem.querySelector('.header__cart__item__delete-btn')
    deleteBtn.addEventListener('click', deleteItemFromCart)

    cartItemsContainer.appendChild(cartItem)
}

const isCartEmpty = () => cart.length <= 0

const isNewItem = () => cart.findIndex( p => p.product.id === product.id)

const addItemToCart = () => {
    if (qnt > 0) {
        if (isNewItem()) {
            cart.push({product:product, qnt: qnt})
            renderCartItem()
        } else {
            const indexOfItem = product.id-1
            cart[indexOfItem].qnt += qnt
            updateCartItem(indexOfItem)
        }
    }

    updateCart()
}
addCartBtn.addEventListener('click', addItemToCart)

// slider
const getCurrentSlideIndex = gallery => Number.parseInt(gallery.querySelector('.product__gallery__thumbnail-item.active').getAttribute('data-index'))

const updateSlide = gallery => {
    const slider = gallery.querySelector('.product__gallery__slider-width')
    const currentSlide = gallery.querySelector('.product__gallery__thumbnail-item.active')
    const targetSlide = gallery.querySelectorAll('.product__gallery__thumbnail-item')[currentSlideIndex]
    
    currentSlide.classList.remove('active')
    targetSlide.classList.add('active')

    const sliderWidth = slider.clientWidth
    const newMargin = (sliderWidth / product.imgs.main.length) * getCurrentSlideIndex(gallery)
    
    slider.style.marginLeft = `-${newMargin}px`
}

const goPrev = gallery => {
    currentSlideIndex = getCurrentSlideIndex(gallery)          
    currentSlideIndex <= 0 
        ? currentSlideIndex = totalSlides
        : currentSlideIndex--
    
    updateSlide(gallery)
}

const goNext = gallery => {
    currentSlideIndex = getCurrentSlideIndex(gallery)       
    currentSlideIndex >= totalSlides
        ? currentSlideIndex = 0
        : currentSlideIndex++
    
    updateSlide(gallery)
}

// product lightBox
const openLightBox = () => {
    const lightBoxGallery = lightBox.querySelector('.product__gallery')
    const lightBoxSlider = lightBox.querySelector('.product__gallery__slider-width')

    lightBoxSlider.classList.add('no-transition')

    lightBox.classList.add('is-open')
    setTimeout( () => lightBox.classList.add('animate'), 1)

    currentSlideIndex = getCurrentSlideIndex(document.querySelector('.product__gallery-container .product__gallery'))
    updateSlide(lightBoxGallery) 
    
    setTimeout( () => lightBoxSlider.classList.remove('no-transition'), 305)

    closeCart()
}
openLightBoxBtn.addEventListener('click', openLightBox)

const closeLightBox = () => {
    lightBox.classList.remove('animate')
    setTimeout( () => lightBox.classList.remove('is-open'), 300)
}
closeLightBoxBtn.addEventListener('click', closeLightBox)

// qnt
resetQnt = () => {
    qnt = 1
    updateCount()
}

const updateCount = () => countContainer.innerText = qnt

const decreaseQnt = () => {
    if (qnt > 1) qnt--
    updateCount()
}
decreaseBtn.addEventListener('click', decreaseQnt)

const increaseQnt = () => {
    qnt++
    updateCount()
}
increaseBtn.addEventListener('click', increaseQnt)

// render
const renderProductInfo = () => {
    const productInfoContainer = document.querySelector('.product__info__content')
    
    productInfoContainer.querySelector('.product__info__company').innerHTML = product.company
    productInfoContainer.querySelector('.product__info__name').innerHTML = product.name
    productInfoContainer.querySelector('.product__info__desc').innerHTML = product.desc
    productInfoContainer.querySelector('.product__info__price-now').innerHTML = `$${product.price.now}`
    productInfoContainer.querySelector('.product__info__discount').innerHTML = `${product.price.discount}%`
    productInfoContainer.querySelector('.product__info__price-original').innerHTML = `$${product.price.original}`
}

const renderThumbnailImgs = gallery => {
    const thumbnailList = gallery.querySelector('.product__gallery__thumbnail-list')

    product.imgs.thumbnails.forEach( (imgSrc, index) => {
        const thumbnailItem = document.createElement('div')

        thumbnailItem .classList.add('product__gallery__thumbnail-item')
        if (index === 0) thumbnailItem .classList.add('active')
        thumbnailItem .setAttribute('data-index', index)
        
        const thumbnailImg = document.createElement('img')
        thumbnailImg.src = imgSrc
        thumbnailImg.alt = 'Product thumbnail image'

        thumbnailItem.addEventListener('click', () => {
            currentSlideIndex = thumbnailItem.getAttribute('data-index')
            updateSlide(gallery)
        })

        thumbnailItem.appendChild(thumbnailImg)

        thumbnailList.appendChild(thumbnailItem)
    })
}

const renderSlider = gallery => {
    const mainImgContainer = gallery.querySelector('.product__gallery__main-img')
    const slider = gallery.querySelector('.product__gallery__slider-width')
    const sliderWidth = Number.parseInt(window.getComputedStyle(mainImgContainer).getPropertyValue("width").replace('px', '')) * product.imgs.main.length

    slider.style.width = `${sliderWidth}px`
    
    product.imgs.main.forEach( (imgSrc, index) => {
        const slide = document.createElement('div')
        slide.classList.add('product__gallery__slide')
        slide.setAttribute('data-index', index)
       

        const slideImg = document.createElement('img')
        slideImg.src = imgSrc
        slideImg.alt = 'Product Large image'

        slide.appendChild(slideImg)

        slider.appendChild(slide)
    })

    const prevBtn = gallery.querySelector('.product__gallery__nav__btn.prev')
    const nextBtn = gallery.querySelector('.product__gallery__nav__btn.next')
    
    prevBtn.addEventListener('click', () => goPrev(gallery))
    nextBtn.addEventListener('click', () => goNext(gallery))
}

const renderGalleries = () => {
    const galleries = document.querySelectorAll('.product__gallery')
    
    galleries.forEach( gallery => {
        renderSlider(gallery)
        renderThumbnailImgs(gallery)
    })
}

// init
const init = () => { 
    renderGalleries()
    renderProductInfo()
}
init()
