import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './CardPage.css';
import { useCards } from '../context/CardContext';

// Card type definition
const cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'];

// Card3D component
const Card3D = ({ card, isActive, onEdit, onDelete }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setRotation({ x: 0, y: 0 });
      setIsFlipped(false);
    }
  }, [isActive]);

  const handleMouseMove = (e) => {
    if (!isActive || isFlipped) return;

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
    if (isActive) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d-wrapper ${isActive ? 'active' : ''} ${isFlipped ? 'flipped' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: isFlipped
          ? 'rotateY(180deg)'
          : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
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
            <p className="card-details">{card.details}</p>
            <div className="card-actions">
              <button
                className="card-action-btn edit"
                onClick={(e) => handleActionClick(e, onEdit)}
              >
                <Edit size={20} />
                <span>Edit</span>
              </button>
              <button
                className="card-action-btn delete"
                onClick={(e) => handleActionClick(e, onDelete)}
              >
                <Trash2 size={20} />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div className="card-security-code">
            <span>CVV</span>
            <span className="code">{card.cvv}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// CardCarousel component
const CardCarousel = ({ cards, onEditCard, onDeleteCard }) => {
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
                isActive={index === activeIndex}
                onEdit={() => onEditCard(card)}
                onDelete={() => onDeleteCard(card.id)}
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

// CardForm component
const CardForm = ({ card, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
    type: 'VISA',
    details: '',
    headerColor: '#00ffc3',
  });

  const colorOptions = [
    '#00ffc3', // Neon cyan
    '#00d1ff', // Neon blue
    '#ff00e6', // Neon pink
    '#ff5500', // Neon orange
    '#9d00ff', // Neon purple
    '#ffff00', // Neon yellow
  ];

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        number: card.number,
        holderName: card.holderName,
        expiry: card.expiry,
        cvv: card.cvv,
        type: card.type,
        details: card.details,
        headerColor: card.headerColor || '#00ffc3',
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, headerColor: color }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.number || !formData.holderName || !formData.expiry || !formData.cvv) {
      alert('Please fill out all required fields');
      return;
    }

    // Validate card number (should be 16 digits)
    const cleanCardNumber = formData.number.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      alert('Card number must be 16 digits');
      return;
    }

    // Validate expiry date (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      alert('Please enter a valid expiry date (MM/YY)');
      return;
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      alert('CVV must be 3 or 4 digits');
      return;
    }

    // Format card number with spaces
    const formattedCardNumber = cleanCardNumber.match(/.{1,4}/g).join(' ');

    // Save card with formatted data
    onSave({
      ...formData,
      number: formattedCardNumber,
    });
  };

  const formatCardNumber = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, number: formattedValue }));
  };

  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiry(e.target.value);
    setFormData((prev) => ({ ...prev, expiry: formattedValue }));
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>{card ? 'Edit Card' : 'Add New Card'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="card-form" onClick={(e) => e.stopPropagation()}>
          <div className="form-group">
            <label htmlFor="title">Card Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., My Debit Card"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="number">Card Number</label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="holderName">Card Holder</label>
              <input
                type="text"
                id="holderName"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                placeholder="JOHN DOE"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiry">Expiry Date</label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                value={formData.expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Card Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {cardTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={e => {
                  // Only allow numbers and max 3 digits
                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                  setFormData(prev => ({ ...prev, cvv: numericValue }));
                }}
                placeholder="123"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="details">Card Details</label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Add any additional details about this card"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Card Color</label>
            <div className="color-options">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.headerColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="save-btn" onClick={handleSubmit}>
              Save Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main CardPage component
const CardPage = () => {
  const { cards, addCard, editCard, deleteCard } = useCards();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const handleAddCard = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleDeleteCard = (cardId) => {
    deleteCard(cardId);
  };

  const handleSaveCard = (cardData) => {
    if (editingCard) {
      editCard({ ...cardData, id: editingCard.id });
    } else {
      addCard(cardData);
    }
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="card-manager-container">
      <div className="page-header">
        <h1 className="cyber-title">Card Manager</h1>
        <button className="cyber-button add-card-btn" onClick={handleAddCard}>
          <PlusCircle className="button-icon" />
          <span>Add Card</span>
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h2>No Cards Found</h2>
            <p>Create your first card to get started</p>
          </div>
        </div>
      ) : (
        <CardCarousel
          cards={cards}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {isFormOpen && (
        <CardForm
          card={editingCard}
          onSave={handleSaveCard}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default CardPage;