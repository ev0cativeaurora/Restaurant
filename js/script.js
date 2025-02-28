/**
 * FusionEats - JavaScript personnalisé
 * Ce fichier contient les scripts personnalisés pour le site FusionEats
 */

// Attendre que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Animation de la barre de navigation lors du défilement
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled', 'shadow-sm');
            } else {
                navbar.classList.remove('navbar-scrolled', 'shadow-sm');
            }
        });
    }
    
    // Initialisation des tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Gestion des formulaires
    initForms();
    
    // Animation des décorations alimentaires
    animateFoodDecorations();
    
    // Initialiser le panier
    initCart();
});

/**
 * Initialisation des formulaires
 */
function initForms() {
    // Formulaire de réservation
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validation simple du formulaire
            let isValid = true;
            const requiredFields = reservationForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // Affichage du message de confirmation
                showConfirmationModal('Réservation envoyée', 'Merci ! Votre demande de réservation a été envoyée avec succès. Nous vous contacterons rapidement pour la confirmer.');
                reservationForm.reset();
            }
        });
    }
    
    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validation simple du formulaire
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // Affichage du message de confirmation
                showConfirmationModal('Message envoyé', 'Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
                contactForm.reset();
            }
        });
    }
}

/**
 * Afficher une modal de confirmation
 * @param {string} title Le titre de la modal
 * @param {string} message Le message à afficher
 */
function showConfirmationModal(title, message) {
    // Vérifier si la modal existe déjà
    let confirmationModal = document.getElementById('confirmationModal');
    
    // Si elle n'existe pas, la créer
    if (!confirmationModal) {
        const modalHTML = `
            <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmationModalLabel">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${message}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fermer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter la modal au DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        confirmationModal = document.getElementById('confirmationModal');
    } else {
        // Mettre à jour le contenu de la modal existante
        document.getElementById('confirmationModalLabel').textContent = title;
        confirmationModal.querySelector('.modal-body').innerHTML = message;
    }
    
    // Afficher la modal
    const modal = new bootstrap.Modal(confirmationModal);
    modal.show();
}

/**
 * Animation des décorations alimentaires
 */
function animateFoodDecorations() {
    const decorations = document.querySelectorAll('.food-decoration');
    
    decorations.forEach(decoration => {
        // Position aléatoire de départ
        const randomX = Math.random() * 5 - 2.5; // -2.5 à 2.5
        const randomY = Math.random() * 5 - 2.5; // -2.5 à 2.5
        const randomRotation = Math.random() * 10 - 5; // -5 à 5
        
        // Appliquer la transformation initiale
        decoration.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
        
        // Ajouter un délai aléatoire pour le démarrage de l'animation
        decoration.style.animationDelay = `${Math.random() * 2}s`;
    });
}

/**
 * Initialisation du panier
 */
function initCart() {
    // Récupérer les boutons "Ajouter au panier"
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Récupérer les informations du produit
            const productContainer = this.closest('.food-card') || this.closest('.product-info');
            if (!productContainer) return;
            
            const productName = productContainer.querySelector('.card-title, h1').textContent;
            const productPrice = productContainer.querySelector('.price').textContent;
            
            // Ajouter le produit au panier (localStorage)
            addProductToCart(productName, productPrice);
            
            // Afficher une notification
            showToast(`${productName} ajouté au panier`);
            
            // Mettre à jour le compteur du panier
            updateCartCount();
        });
    });
    
    // Initialiser le compteur du panier au chargement
    updateCartCount();
}

/**
 * Ajouter un produit au panier
 * @param {string} name Nom du produit
 * @param {string} price Prix du produit
 */
function addProductToCart(name, price) {
    // Récupérer le panier actuel du localStorage
    let cart = JSON.parse(localStorage.getItem('fusionEatsCart')) || [];
    
    // Nettoyer le prix pour obtenir uniquement le nombre
    const priceValue = parseFloat(price.replace('€', '').replace(',', '.').trim());
    
    // Vérifier si le produit est déjà dans le panier
    const existingProductIndex = cart.findIndex(item => item.name === name);
    
    if (existingProductIndex !== -1) {
        // Incrémenter la quantité si le produit existe déjà
        cart[existingProductIndex].quantity += 1;
    } else {
        // Ajouter le produit au panier
        cart.push({
            name: name,
            price: priceValue,
            quantity: 1
        });
    }
    
    // Sauvegarder le panier mis à jour
    localStorage.setItem('fusionEatsCart', JSON.stringify(cart));
}

/**
 * Mettre à jour le compteur du panier
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('fusionEatsCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Mettre à jour tous les compteurs du panier dans le navbar
    const cartCounters = document.querySelectorAll('.navbar .badge');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
    });
}

/**
 * Afficher un toast de notification
 * @param {string} message Le message à afficher
 */
function showToast(message) {
    // Vérifier si le conteneur de toasts existe
    let toastContainer = document.querySelector('.toast-container');
    
    // Si le conteneur n'existe pas, le créer
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Créer le toast
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">FusionEats</strong>
                <small>À l'instant</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Ajouter le toast au conteneur
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialiser et afficher le toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Supprimer le toast du DOM après sa disparition
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}