import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Checkout.css';
import { useCards } from '../context/CardContext';
import { useTracking } from '../context/TrackingContext';

// Stepper component
const Stepper = ({ currentStep }) => {
  const steps = ['Cart', 'Information', 'Payment', 'Confirm'];
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`step ${index + 1 <= currentStep ? 'active' : ''}`}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
};

// Card3D component
const Card3D = ({ card, isSelected, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (isFlipped) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (!isFlipped) {
      setRotation({ x: 0, y: 0 });
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(card)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isFlipped 
          ? 'rotateY(180deg)' 
          : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}
    >
      <div className="card-3d-front">
        <div className="card-3d-content">
          <div className="card-header" style={{ backgroundColor: card.headerColor || '#00ffc3' }}>
            <h3 className="card-title">{card.title}</h3>
          </div>
          <div className="card-number">{card.number}</div>
          <div className="card-holder-name">{card.holderName}</div>
          <div className="card-expires">
            <span>EXP</span>
            <span>{card.expiry}</span>
          </div>
          <div className="card-chip"></div>
          <div className="card-type">{card.type}</div>
        </div>
      </div>
      <div className="card-3d-back">
        <div className="card-3d-content">
          <div className="card-magnetic-strip"></div>
          <div className="card-back-content">
            <div className="card-security-code">
              <span>CVV</span>
              <span className="code">{card.cvv}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CardCarousel component
const CardCarousel = ({ cards, onSelectCard }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, cards.length]);

  const navigateNext = () => {
    if (cards.length > 1) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }
  };

  const navigatePrev = () => {
    if (cards.length > 1) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  const handleTouchStart = (e) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateNext();
      } else {
        navigatePrev();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {cards.map((card, index) => {
          const position = index - activeIndex;
          let adjustedPosition = position;
          if (position < -1) adjustedPosition = cards.length - 1 - activeIndex + index;
          if (position > 1) adjustedPosition = index - cards.length - activeIndex;

          return (
            <div
              key={card.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(${adjustedPosition * 100}%) scale(${
                  index === activeIndex ? 1 : 0.8
                })`,
                zIndex: index === activeIndex ? 10 : 5 - Math.abs(adjustedPosition),
                opacity: Math.abs(adjustedPosition) > 1 ? 0 : 1,
              }}
            >
              <Card3D
                card={card}
                isSelected={index === activeIndex}
                onSelect={onSelectCard}
              />
            </div>
          );
        })}
      </div>

      {cards.length > 1 && (
        <div className="carousel-controls">
          <button className="carousel-control prev" onClick={navigatePrev}>
            <ChevronLeft size={24} />
          </button>
          <div className="carousel-indicators">
            {cards.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
          <button className="carousel-control next" onClick={navigateNext}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

// Order Summary component
const OrderSummary = ({ items, total, onNext }) => {
  const shippingCost = total > 100 ? 0 : 10;
  const tax = total * 0.1;
  const grandTotal = total + shippingCost + tax;

  const handleNext = () => {
    if (!items || items.length === 0) {
      toast.error('Your cart is empty. Please add items to proceed.');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="order-summary"
    >
      <h2 className="section-title">Order Summary</h2>
      {!items || items.length === 0 ? (
        <p className="empty-cart">No items in cart.</p>
      ) : (
        <div className="order-items">
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Shipping:</span>
          <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="total-row grand-total">
          <span>Total:</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
      <div className="form-actions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="next-btn"
        >
          Next <FaArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Shipping Details component
const ShippingForm = ({ shippingData, setShippingData, onNext }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow numbers, +, and spaces
      const formattedValue = value.replace(/[^\d+\s]/g, '');
      setShippingData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setShippingData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    const { firstName, lastName, country, city, street, postalCode, phone, email } = shippingData;
    if (!firstName || !lastName || !country || !city || !street || !postalCode || !phone || !email) {
      toast.error('Please fill out all required fields');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="shipping-form"
    >
      <h2 className="section-title">Shipping Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={shippingData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={shippingData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={shippingData.country}
            onChange={handleChange}
            placeholder="Azerbaijan"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingData.city}
            onChange={handleChange}
            placeholder="Baku"
            required
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="street">Street Address</label>
          <input
            type="text"
            id="street"
            name="street"
            value={shippingData.street}
            onChange={handleChange}
            placeholder="123 Main St"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={shippingData.postalCode}
            onChange={handleChange}
            placeholder="AZ1000"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={shippingData.phone}
            onChange={handleChange}
            placeholder="+994123456789"
            pattern="^\+?\d{10,15}$"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={shippingData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>
      </div>
      <div className="form-actions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="next-btn"
        >
          Next <FaArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Payment Method component
const PaymentForm = ({ paymentData, setPaymentData, onNext, onBack }) => {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setPaymentData({
      cardNumber: card.number,
      expiry: card.expiry,
      cvv: card.cvv,
      cardHolder: card.holderName,
    });
  };

  const formatCardNumber = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'cvv') {
      // Only allow numbers and max 3 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 3);
      setPaymentData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'expiry') {
      // Format expiry date as MM/YY
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setPaymentData((prev) => ({ ...prev, [name]: value }));
    }
    setSelectedCard(null);
  };

  const handleNext = () => {
    if (paymentMethod === 'card') {
      const { cardNumber, expiry, cvv, cardHolder } = paymentData;
      if (!cardNumber || !expiry || !cvv || !cardHolder) {
        toast.error('Please fill out all card details');
        return;
      }
      // Remove spaces for validation
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (!/^(\d{4}\s?){4}$/.test(cardNumber) || cleanCardNumber.length !== 16) {
        toast.error('Please enter a valid 16-digit card number (with or without spaces)');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        toast.error('Please enter a valid CVV');
        return;
      }
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="payment-form"
    >
      <h2 className="section-title">Payment Method</h2>
      <div className="payment-methods">
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          Credit/Debit Card
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
          />
          PayPal
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="applepay"
            checked={paymentMethod === 'applepay'}
            onChange={() => setPaymentMethod('applepay')}
          />
          Apple Pay
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
          />
          Cash on Delivery
        </label>
      </div>
      {paymentMethod === 'card' && (
        <>
          {cards && cards.length > 0 ? (
            <div className="saved-cards">
              <h3>Saved Cards</h3>
              <CardCarousel cards={cards} onSelectCard={handleCardSelect} />
            </div>
          ) : (
            <div className="no-cards-message">
              <p>No saved cards found. Please add a card in the Card Manager first.</p>
            </div>
          )}
          <div className="card-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={paymentData.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  pattern="\d{2}/\d{2}"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={3}
                  pattern="\d{3}"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cardHolder">Card Holder</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={paymentData.cardHolder}
                onChange={handleChange}
                placeholder="JOHN DOE"
                required
              />
            </div>
          </div>
        </>
      )}
      <div className="form-actions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="back-btn"
        >
          <FaArrowLeft /> Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="next-btn"
        >
          Next <FaArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Confirmation component
const Confirmation = ({ orderId, onConfirm, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="confirmation"
    >
      <h2 className="section-title">Confirm Order</h2>
      <p>Please review your order details before confirming.</p>
      <div className="confirmation-details">
        <p>Order ID: {orderId}</p>
        <p>Review your shipping and payment details in previous steps.</p>
      </div>
      <div className="form-actions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="back-btn"
        >
          <FaArrowLeft /> Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="confirm-btn"
        >
          Place Order
        </motion.button>
      </div>
    </motion.div>
  );
};

// Order Confirmed component
const OrderConfirmed = ({ orderId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="order-confirmed"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <FaCheckCircle className="success-icon" />
      </motion.div>
      <h2 className="section-title">Thank You for Your Purchase!</h2>
      <p>Your order has been successfully placed.</p>
      <p>Order ID: {orderId}</p>
      <div className="confirmation-actions">
        <motion.a
          href="/tracking"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="track-btn"
        >
          Track Order
        </motion.a>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="shop-btn"
        >
          Continue Shopping
        </motion.a>
      </div>
    </motion.div>
  );
};

// Main Checkout component
const Checkout = () => {
  const { state, dispatch } = useCart();
  const { dispatch: trackingDispatch } = useTracking();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId] = useState(`ORD-${Date.now()}`);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    street: '',
    postalCode: '',
    phone: '',
    email: '',
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
  });

  console.log("Checkout Cart State:", state); // Debug log

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Create a single order with all items
      const order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        products: state.items.map(item => ({
          ...item,
          image: item.image || 'https://via.placeholder.com/300x200',
          title: item.title || 'Product',
          price: item.price || 0
        })),
        status: 'In Warehouse',
        timestamp: Date.now(),
        shippingInfo: shippingData,
        paymentInfo: paymentData,
        total: state.total
      };

      // Add single order with unique ID
      trackingDispatch({ type: 'ADD_ORDER', payload: [order] });
      
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      
      setIsProcessing(false);
      toast.success('Order placed successfully!');
      setStep(5);
    }, 2000);
  };

  if (step === 5) {
    return <OrderConfirmed orderId={orderId} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="checkout-container"
    >
      <h1 className="cyber-title">Checkout</h1>
      <Stepper currentStep={step} />
      <AnimatePresence mode="wait">
        {step === 1 && (
          <OrderSummary
            key="summary"
            items={state.items}
            total={state.total}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <ShippingForm
            key="shipping"
            shippingData={shippingData}
            setShippingData={setShippingData}
            onNext={handleNext}
          />
        )}
        {step === 3 && (
          <PaymentForm
            key="payment"
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <Confirmation
            key="confirmation"
            orderId={orderId}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="processing-overlay"
        >
          <div className="spinner" />
          <p>Processing...</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Checkout;