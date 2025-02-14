document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    // Precios de los servicios (debes actualizar con tus precios reales)
    const servicePrices = {
        'car-design': 1500,
        'car-wash': 300,
        'car-paint': 800,
        'car-repair': 1200
    };

    // Cargar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <i class="bi bi-check-circle-fill text-purple"></i>
                    <div>
                        <h5>${item.services.map(service => 
                            service.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')
                        ).join(', ')}</h5>
                        <small>Referral: ${item.referral.charAt(0).toUpperCase() + item.referral.slice(1)}</small>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <span class="text-purple">$${servicePrices[item.services[0]]}</span>
                    <i class="bi bi-trash remove-item" data-index="${index}"></i>
                </div>
            `;
            
            total += servicePrices[item.services[0]];
            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceElement.textContent = total;
    };

    // Eliminar item del carrito
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Checkout functionality coming soon!');
    });

    // Renderizar inicial
    renderCart();
});